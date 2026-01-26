<script setup lang="ts">
</script>

<template>
  <main class="layout">
    <slot />
  </main>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  @include display-flex;
  @include flex-direction(column);
}
</style>
