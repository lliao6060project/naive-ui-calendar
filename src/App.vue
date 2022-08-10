<script setup name="App">
import AppProvider from '@/components/global-component/index.vue'
const calendarData = [
  {
    date: '2022-7-31',
    event: [
      {
        id: `past-a-${Math.floor(Math.random()*10)}`,
        type: 'error',
        eventType: '0',
        title: '10:30 會議1',
        time: '10:30',
        memo: '去了就知道開什麼會',
      },
      {
        id: `past-b-${Math.floor(Math.random()*15)}`,
        type: 'warning',
        eventType: '0',
        title: '13:30 會議2',
        time: '13:30',
        memo: '某某專案的會議',
      },
    ]
  },
  {
    date: '2022-8-4',
    event: [
      {
        id: `test-a-${Math.floor(Math.random()*10)}`,
        type: 'error',
        eventType: '0',
        title: '10:30 會議1',
        time: '10:30',
        memo: '去了就知道開什麼會',
      },
      {
        id: `test-b-${Math.floor(Math.random()*15)}`,
        type: 'warning',
        eventType: '0',
        title: '13:30 會議2',
        time: '13:30',
        memo: '某某專案的會議',
      },
      {
        id: `test-c-${Math.floor(Math.random()*20)}`,
        type: 'info',
        eventType: '1',
        title: '今天記得點餐',
        time: '16:30',
        memo: '明天點餐截止',
      },
    ]
  },
  {
    date: '2022-8-13',
    event: [
      {
        id: `test-d-${Math.floor(Math.random()*25)}`,
        type: 'error',
        eventType: '0',
        title: 'XX專案要上線',
        time: '9:30',
        memo: '重要重要重要',
      },
    ]
  },
]
</script>

<template>
  <AppProvider>
    <div id="app" v-cloak>
      <main class="container">
        <n-h1>日曆組件</n-h1>
        <n-card>
          <Calendar
            :calendarData="calendarData"
            :onDayNoEvent="'當天沒行程'"
          />
        </n-card>
      </main>
    </div>
  </AppProvider>

</template>

<style lang="scss">
</style>
