<script setup lang="ts">
import SideMenuList from './SideMenuList.vue';

type View = 'home' | 'calendar';

const props = withDefaults(defineProps<{ activeView?: View }>(), {
  activeView: 'home',
});
const emit = defineEmits<{ (event: 'select-view', view: View): void }>();

const handleSelectView = (view: View) => {
  emit('select-view', view);
};
</script>

<template>
  <section class="side-menu">
    <header class="side-menu-header">
      <h1>IMPEKABLE</h1>
    </header>
    <SideMenuList
      :active-view="props.activeView"
      @select-view="handleSelectView"
    />
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/style/helpers.scss" as *;
.side-menu {
  @include display-flex;
  @include flex-direction(column);
  width: 260px;
  height: 100%;
  background-color: $color-primary;

  &-header {
    @include display-flex;
    @include align-items(center);
    @include justify-content(start);
    height: 70px;
    padding-left: 20px;
    background-color: rgba(0, 0, 0, 0.1);
    h1 {
      font-family: $SourceSansPro-bold;
      font-size: 15px;
      line-height: 21px;
      color: $color-white;
      letter-spacing: 3px;
    }
  }
}
</style>