<script setup lang="ts">
import { ref } from 'vue';
import SideMenu from '@/components/menu/SideMenu.vue';
import ContentContainer from '@/components/content/ContentContainer.vue';

type View = 'home' | 'calendar';
const selectedView = ref<View>('home');
const handleViewChange = (view: View) => {
  selectedView.value = view;
};
</script>

<template>
  <NuxtLayout name="main">
    <div class="admin">
      <div class="sidebar">
        <SideMenu
          :active-view="selectedView"
          @select-view="handleViewChange"
        />
      </div>
      <ContentContainer :current-view="selectedView" />
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
@use "@/assets/style/helpers.scss" as *;
.admin {
  @include display-flex;
  @include flex-direction(row);
  @include flex(1);
}
</style>
