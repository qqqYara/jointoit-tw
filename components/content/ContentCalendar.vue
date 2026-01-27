<script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import type {
  CalendarOptions,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import CalendarModal, {
  type CalendarModalOptions,
  type CalendarModalSavePayload,
  type CalendarModalDiscardPayload,
} from '@/components/modals/CalendarModal.vue';

type CalendarModalInstance = InstanceType<typeof CalendarModal> & {
  openModal: (options?: CalendarModalOptions) => void;
};

const calendarModal = ref<CalendarModalInstance | null>(null);

const openModal = (options?: CalendarModalOptions) => {
  calendarModal.value?.openModal(options);
};

const findBestDateClickReference = (info: DateClickArg): HTMLElement | null => {
  const selectors = [
    '.fc-timegrid-slot',
    '.fc-timegrid-slot-minor',
    '.fc-timegrid-slot-major',
    '.fc-timegrid-slot-lane',
    '.fc-timegrid-col',
    '.fc-daygrid-day-frame',
    '.fc-day',
  ];

  const target = info.jsEvent.target as HTMLElement | null;

  for (const selector of selectors) {
    const found = target?.closest(selector);
    if (found) {
      return found as HTMLElement;
    }
  }

  return (
    info.dayEl ??
    (info.jsEvent.currentTarget as HTMLElement | null) ??
    (info.jsEvent.target as HTMLElement | null)
  );
};

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'today,prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  editable: true,
  dayMaxEvents: true,
  events: [],
  dateClick: (info: DateClickArg) => {
    const reference = findBestDateClickReference(info);

    openModal({ dateStr: info.dateStr, mode: 'new', referenceElement: reference });
  },
  eventClick: (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    openModal({ event: info.event, mode: 'view', referenceElement: info.el });
  },
});

const handleModalSave = ({ event, mode, editEventId }: CalendarModalSavePayload) => {
  const currentEvents = (calendarOptions.value.events ?? []) as EventInput[];
  const isEditMode = mode === 'edit' && Boolean(editEventId);
  const updatedEvents = isEditMode
    ? currentEvents.map((existingEvent) =>
        existingEvent.id === editEventId ? event : existingEvent,
      )
    : [...currentEvents, event];

  calendarOptions.value = {
    ...calendarOptions.value,
    events: updatedEvents,
  };
};

const handleModalDiscard = ({ editEventId }: CalendarModalDiscardPayload) => {
  if (!editEventId) {
    return;
  }

  const currentEvents = (calendarOptions.value.events ?? []) as EventInput[];
  calendarOptions.value = {
    ...calendarOptions.value,
    events: currentEvents.filter((existingEvent) => existingEvent.id !== editEventId),
  };
};
</script>

<template>
  <div class="calendar">
    <h1>Calendar</h1>
    <div class="calendar__container">
      <FullCalendar :options="calendarOptions" />
      <CalendarModal ref="calendarModal" @save="handleModalSave" @discard="handleModalDiscard" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/style/helpers/variables.scss" as *;
@use "@/assets/style/helpers/mixins.scss" as *;
.calendar {
  @include display-flex;
  @include flex-direction(column);
  @include flex(1);
  background-color: $color-grey-bg;
  &__container {
    background-color: $color-white;
    padding: 20px 20px 35px;
    @include box-shadow(0px 2px 6px rgba(0, 0, 0, 0.1));
  }
}

h1 {
  margin-bottom: 32px;
}
</style>
