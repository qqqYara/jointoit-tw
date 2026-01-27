<script setup lang="ts">
import type { Component } from 'vue';
import CalendarIcon from '@/components/icon/Calendar.vue';
import HomeIcon from '@/components/icon/Home.vue';

type View = 'home' | 'calendar';
type NavigationItem = { view: View; label: string; icon: Component };

const props = withDefaults(defineProps<{ activeView?: View }>(), {
  activeView: 'home',
});
const emit = defineEmits<{ (event: 'select-view', view: View): void }>();

const menuItems: NavigationItem[] = [
  { view: 'home', label: 'Home', icon: HomeIcon },
  { view: 'calendar', label: 'Calendar', icon: CalendarIcon },
];

const selectView = (view: View) => {
  emit('select-view', view);
};
</script>

<template>
  <nav-list class="nav-list">
    <ul>
      <li v-for="item in menuItems" :key="item.view">
        <button
          type="button"
          class="nav-link"
          :class="{ active: props.activeView === item.view }"
          @click="selectView(item.view)"
        >
          <component :is="item.icon" />
          {{ item.label }}
        </button>
      </li>
    </ul>
  </nav-list>
</template>

<style scoped lang="scss">
@use "@/assets/style/helpers/variables.scss" as *;
@use "@/assets/style/helpers/mixins.scss" as *;
.nav-list {
  ul {
    li {
      margin: 3px 0;
      .nav-link {
        @include display-flex;
        @include align-items(center);
        @include justify-content(start);
        height: 40px;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        font-family: $SourceSansPro-regular;
        font-size: 15px;
        line-height: 21px;
        color: $color-white;
        border: none;
        border-left: 3px solid transparent;
        background: none;
        cursor: pointer;
        text-align: left;
        svg {
          margin-right: 12px;
          fill: $color-icons;
        }
        &.active {
          background-color: rgba(0, 0, 0, 0.1);
          border-left: 3px solid $color-active;
          svg {
            fill: $color-active;
          }
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>