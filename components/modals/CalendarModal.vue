<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue';
import type { EventApi, EventInput } from '@fullcalendar/core';
import { autoUpdate, Placement, computePosition, offset, shift, flip } from '@floating-ui/dom';

type ColorOption = {
  label: string;
  value: string;
};

const colorOptions: ColorOption[] = [
  { label: 'Blue', value: '#0B74DE' },
  { label: 'Red', value: '#E74361' },
  { label: 'Amber', value: '#F6A828' },
  { label: 'Green', value: '#4BB543' },
  { label: 'Purple', value: '#7F3DF2' },
];
const DEFAULT_COLOR = colorOptions[0]?.value ?? '#0B74DE';

type CalendarModalMode = 'new' | 'view' | 'edit';

export type CalendarModalOptions = {
  dateStr?: string;
  event?: EventApi;
  mode?: CalendarModalMode;
  referenceElement?: HTMLElement | null;
  placement?: Placement;
};

export type CalendarModalSavePayload = {
  event: EventInput;
  mode: 'new' | 'edit';
  editEventId: string | null;
};

export type CalendarModalDiscardPayload = {
  editEventId: string | null;
};

type FieldErrors = {
  title: string;
  date: string;
  time: string;
  notes: string;
};

const emit = defineEmits<{
  (event: 'save', payload: CalendarModalSavePayload): void;
  (event: 'discard', payload: CalendarModalDiscardPayload): void;
}>();

type CalendarModalForm = {
  title: string;
  date: string;
  time: string;
  notes: string;
  color: string;
};

const form = reactive<CalendarModalForm>({
  title: '',
  date: '',
  time: '',
  notes: '',
  color: DEFAULT_COLOR,
});

const errors = reactive<FieldErrors>({
  title: '',
  date: '',
  time: '',
  notes: '',
});

const showModal = ref(false);
const editEventId = ref<string | null>(null);
const modalMode = ref<CalendarModalMode>('new');
const floatingRef = ref<HTMLElement | null>(null);
const referenceElement = ref<HTMLElement | null>(null);
const floatingStyles = reactive({
  top: '0px',
  left: '0px',
});
const isPositioned = ref(false);
const placement = ref<Placement>('bottom-start');
let stopFloatingUpdates: (() => void) | null = null;
let visibilityObserver: IntersectionObserver | null = null;

const isViewMode = computed(() => modalMode.value === 'view');
const floatingStyle = computed(() => ({
  position: 'absolute',
  top: floatingStyles.top,
  left: floatingStyles.left,
  transform: 'none',
  zIndex: 2000,
  opacity: isPositioned.value ? 1 : 0,
  pointerEvents: isPositioned.value ? 'auto' : 'none',
}));

const resetForm = () => {
  form.title = '';
  form.date = '';
  form.time = '';
  form.notes = '';
  form.color = DEFAULT_COLOR;
  errors.title = '';
  errors.date = '';
  errors.time = '';
  errors.notes = '';
};

const resetFloatingState = () => {
  isPositioned.value = false;
  floatingStyles.top = '0px';
  floatingStyles.left = '0px';
};

const stopAutoPositionUpdates = () => {
  stopFloatingUpdates?.();
  stopFloatingUpdates = null;
};

const stopVisibilityObserver = () => {
  visibilityObserver?.disconnect();
  visibilityObserver = null;
};

const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
  let current: HTMLElement | null = element;

  while (current) {
    const style = getComputedStyle(current);
    if (/(auto|scroll|overlay)/.test(`${style.overflow} ${style.overflowY} ${style.overflowX}`)) {
      return current;
    }
    current = current.parentElement;
  }

  return (document.scrollingElement as HTMLElement | null) ?? null;
};

const startVisibilityObserver = () => {
  stopVisibilityObserver();
  const reference = referenceElement.value;
  if (!reference) {
    return;
  }

  const root = findScrollableParent(reference);
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      if (!entry.isIntersecting) {
        closeModal();
      }
    },
    {
      root,
      threshold: 0.01,
    },
  );

  visibilityObserver.observe(reference);
};

const closeModal = () => {
  showModal.value = false;
  editEventId.value = null;
  modalMode.value = 'new';
  referenceElement.value = null;
  stopVisibilityObserver();
  stopAutoPositionUpdates();
  resetFloatingState();
  resetForm();
};

const validateForm = (): boolean => {
  let isValid = true;

  if (!form.title.trim()) {
    errors.title = 'Event name is required.';
    isValid = false;
  } else {
    errors.title = '';
  }

  if (!form.date) {
    errors.date = 'Event date is required.';
    isValid = false;
  } else {
    errors.date = '';
  }

  if (!form.time) {
    errors.time = 'Event time is required.';
    isValid = false;
  } else {
    errors.time = '';
  }

  if (!form.notes.trim()) {
    errors.notes = 'Notes are required.';
    isValid = false;
  } else {
    errors.notes = '';
  }

  if (form.date && form.time) {
    const selected = new Date(`${form.date}T${form.time}`);
    const now = new Date();
    now.setSeconds(0, 0);
    now.setMilliseconds(0);
    if (selected < now) {
      errors.date = 'Event date/time must be today or later.';
      errors.time = 'Event date/time must be today or later.';
      isValid = false;
    }
  }

  return isValid;
};

const prepareFormFromEvent = (event: EventApi) => {
  form.title = event.title ?? '';
  const start = event.start;
  if (start) {
    const [datePart = ''] = start.toISOString().split('T');
    form.date = datePart;
    form.time = start.toTimeString().substring(0, 5);
  }
  form.notes = String(event.extendedProps.notes ?? '');
  const eventColor =
    event.backgroundColor ??
    event.borderColor ??
    String(event.extendedProps.color ?? DEFAULT_COLOR);
  form.color = eventColor;
};

const updateFloatingPosition = async () => {
  const reference = referenceElement.value;
  const floating = floatingRef.value;
  if (!reference || !floating) {
    isPositioned.value = false;
    return;
  }

  try {
    const { x, y } = await computePosition(reference, floating, {
      placement: placement.value,
      middleware: [
        offset(12),
        shift({ padding: 8 }),
        flip({ padding: 8 }),
      ],
    });
    floatingStyles.left = `${x}px`;
    floatingStyles.top = `${y}px`;
    isPositioned.value = true;
  } catch {
    isPositioned.value = false;
  }
};

const startAutoPositionUpdates = () => {
  stopAutoPositionUpdates();
  if (referenceElement.value && floatingRef.value) {
    stopFloatingUpdates = autoUpdate(referenceElement.value, floatingRef.value, updateFloatingPosition);
  }
};

const openModal = async (options?: CalendarModalOptions) => {
  stopAutoPositionUpdates();
  resetFloatingState();
  resetForm();
  editEventId.value = null;
  referenceElement.value = options?.referenceElement ?? null;
  placement.value = options?.placement ?? 'bottom-start';
  if (options?.dateStr) {
    form.date = options.dateStr;
  }
  if (options?.event) {
    editEventId.value = options.event.id ?? null;
    prepareFormFromEvent(options.event);
  }
  modalMode.value = options?.mode ?? (options?.event ? 'view' : 'new');
  showModal.value = true;
  await nextTick();
  await updateFloatingPosition();
  startAutoPositionUpdates();
  if (options?.event) {
    startVisibilityObserver();
  } else {
    stopVisibilityObserver();
  }
};

const enterEditMode = () => {
  if (editEventId.value) {
    modalMode.value = 'edit';
  }
};

const saveChanges = () => {
  if (!validateForm()) {
    return;
  }

  const newEvent: EventInput = {
    title: form.title.trim(),
    start: `${form.date}T${form.time}`,
    extendedProps: {
      notes: form.notes.trim(),
    },
    color: form.color,
    backgroundColor: form.color,
    borderColor: form.color,
    id: editEventId.value ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };

  emit('save', {
    event: newEvent,
    mode: modalMode.value === 'edit' ? 'edit' : 'new',
    editEventId: editEventId.value,
  });

  closeModal();
};

const discardEvent = () => {
  if (!editEventId.value) {
    closeModal();
    return;
  }

  emit('discard', {
    editEventId: editEventId.value,
  });

  closeModal();
};

onBeforeUnmount(() => {
  stopAutoPositionUpdates();
  stopVisibilityObserver();
});

defineExpose({
  openModal,
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showModal"
      ref="floatingRef"
      class="calendar-modal"
      role="dialog"
      aria-modal="true"
      :style="floatingStyle"
    >
      <div class="calendar-modal__content">
        <button class="calendar-modal__close" type="button" aria-label="Close form" @click="closeModal">×</button>

        <form class="calendar-modal__form" @submit.prevent="saveChanges" novalidate>
          <div class="calendar-modal__form-item">
            <input class="calendar-modal__input" v-model="form.title" type="text" :disabled="isViewMode" placeholder="Event name"/>
            <p class="calendar-modal__error" v-if="errors.title">{{ errors.title }}</p>
          </div>

          <div class="calendar-modal__form-item">
            <input class="calendar-modal__input" v-model="form.date" type="date" :disabled="isViewMode" placeholder="Event date"/>
            <p class="calendar-modal__error" v-if="errors.date">{{ errors.date }}</p>
          </div>

          <div class="calendar-modal__form-item">
            <input class="calendar-modal__input" v-model="form.time" type="time" :disabled="isViewMode" placeholder="Event time"/>
            <p class="calendar-modal__error" v-if="errors.time">{{ errors.time }}</p>
          </div>

          <div class="calendar-modal__form-item">
            <textarea class="calendar-modal__textarea" v-model="form.notes" :disabled="isViewMode" placeholder="Notes" style="resize: none;"></textarea>
            <p class="calendar-modal__error" v-if="errors.notes">{{ errors.notes }}</p>
          </div>

          <div class="calendar-modal__form-item calendar-modal__form-item--color">
            <p class="calendar-modal__label">Event color</p>
            <div class="calendar-modal__color-palette">
              <button
                v-for="option in colorOptions"
                :key="option.value"
                type="button"
                class="calendar-modal__color-swatch"
                :class="{ 'is-selected': form.color === option.value }"
                :style="{ backgroundColor: option.value }"
                :disabled="isViewMode"
                :aria-label="`Select event color ${option.label}`"
                @click="form.color = option.value"
              >
                <span class="calendar-modal__color-indicator" v-if="form.color === option.value">✓</span>
              </button>
            </div>
          </div>

          <div class="calendar-modal__actions">
            <button class="cancel" v-if="modalMode === 'new'" type="button" @click="closeModal" aria-label="Cancel">Cancel</button>
            <button class="cancel" v-else type="button" @click="discardEvent" aria-label="Discard">Discard</button>
            <button v-if="modalMode === 'view'" type="button" @click="enterEditMode" aria-label="Edit">Edit</button>
            <button v-else type="submit" aria-label="Save">Save</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.calendar-modal {
  width: 200px;
  &__content {
    background-color: $color-white;
    border-radius: 10px;
    padding: 22px 27px 25px;
    position: relative;
    border: 1px solid $color-primary;
    @include box-shadow(0 3px 18px #00000029);
  }
  &__close {
    position: absolute;
    top: 6px;
    right: 6px;
    height: 20px;
    width: 20px;
    font-size: 20px;
    line-height: 20px;
    color: $color-icons;
    cursor: pointer;
  }
  &__form {
    @include display-flex;
    @include flex-direction(column);
  }
  &__form-item {
    @include display-flex;
    @include flex-direction(column);
    @include flex(1);
    margin-bottom: 20px;
    &--color {
      margin-bottom: 10px;
    }
  }
  &__label {
    font-family: $SourceSansPro-regular;
    font-size: 9px;
    line-height: 11px;
    color: $color-text;
    margin-bottom: 8px;
  }
  &__color-palette {
    @include display-flex;
    gap: 6px;
  }
  &__color-swatch {
    appearance: none;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    @include display-flex;
    @include align-items(center);
    @include justify-content(center);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    &.is-selected {
      box-shadow: 0 0 0 2px $color-primary;
      transform: scale(1.05);
    }
  }
  &__color-indicator {
    font-size: 12px;
    color: $color-white;
  }
  &__error {
    font-family: $SourceSansPro-regular;
    font-size: 9px;
    color: $color-red;
    padding-top: 8px;
  }
  &__input {
    height: 28px;
    border: 0;
    border-bottom: 1px solid $color-grey-form;
    font-family: $SourceSansPro-regular;
    font-size: 9px;
    line-height: 16px;
    color: $color-text;
    @include placeholder-content {
      color: $color-grey-form;
    }
  }
  &__textarea {
    height: 28px;
    border: 0;
    border-bottom: 1px solid $color-grey-form;
    font-family: $SourceSansPro-regular;
    font-size: 9px;
    line-height: 16px;
    color: $color-text;
    resize: none;
    @include placeholder-content {
      color: $color-grey-form;
    }
  }
  &__actions {
    @include display-flex;
    @include justify-content(space-between);
    @include align-items(center);
    margin-top: 20px;
    button {
      font-family: $SourceSansPro-regular;
      font-size: 12px;
      line-height: 20px;
      color: $color-text;
      cursor: pointer;
      &.cancel {
        color: $color-red;
      }
    }
  }
}
</style>