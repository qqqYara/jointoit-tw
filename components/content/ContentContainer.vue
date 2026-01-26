<script setup lang="ts">
import DefaultHeader from '@/components/common/header/DefaultHeader.vue';
import ContentHome from '@/components/content/ContentHome.vue';
import ContentCalendar from '@/components/content/ContentCalendar.vue';

type View = 'home' | 'calendar';
const props = withDefaults(defineProps<{ currentView?: View }>(), {
  currentView: 'home',
});
</script>

<template>
  <div class="content-container">
    <DefaultHeader />
    <section class="content-wrapper">
      <ContentHome v-if="props.currentView === 'home'" />
      <ContentCalendar v-else />
    </section>
  </div>
</template>

<style scoped lang="scss">
.content {
  &-container {
    @include display-flex;
    @include flex-direction(column);
    @include flex(1);
    background-color: $color-grey-bg;
  }
  &-wrapper {
    @include display-flex;
    @include flex(1);
    padding: 35px 95px 100px 75px;
  }
}
</style>