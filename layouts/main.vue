<script setup lang="ts">
</script>

<template>
  <main class="layout">
    <slot />
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/style/helpers/variables.scss" as *;
@use "@/assets/style/helpers/mixins.scss" as *;

.layout {
  min-height: 100vh;
  @include display-flex;
  @include flex-direction(column);
}
</style>
