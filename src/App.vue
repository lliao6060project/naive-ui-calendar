<script setup name="App">
import AppProvider from '@/components/global-component/index.vue'

</script>

<template>
  <AppProvider>
    <div id="app" v-cloak>
      <main class="container">
        <n-h1>日曆組件</n-h1>
        <n-card>
          <Calendar />
        </n-card>
      </main>
    </div>
  </AppProvider>

</template>

<style lang="scss">
</style>
