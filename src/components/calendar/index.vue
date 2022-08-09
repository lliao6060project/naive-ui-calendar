<script setup lang='ts' name='Calendar'>
  import type { FormRef } from '@/common/types'
  import type { Event, CustomEvent } from './composables/useCalendar' 
  import type { RestructureEventItem, RestructureEvent } from './composables/useCalendarEvents'
  import useCalendar from './composables/useCalendar'
  import useCalendarEvents from './composables/useCalendarEvents'
  import useDateUtils from './composables/useDateUtils'
  import useTablePropsStore from '@/store/module/table-props'
  import CalendarAddModal from './components/calendar-add-modal.vue';
  import CalendarEditModal from './components/calendar-edit-modal.vue'
  import dayjs from 'dayjs'

  const tablePropsStore = useTablePropsStore()

  const {
    eventTypeTextList,
    drawerTitle,

    loading,
    calendarModel,
    currentDate,
    currentDay,
    currentDateEvent,

    handleCompareDate,
    isDateDisabled,
    eventImportantText,
  } = useCalendar()

  const { 
    showDetailDrawer,
    
    restructureData,
    resetDetailForm, 
    handleUpdateEventList,
    handleEventDelete 
  } = useCalendarEvents()

  const { 
    format,
    isSameMonth 
  } = useDateUtils()


  const { toggleEditDialogFormVisible, updatePropsData, toggleAddDialogFormVisible } = tablePropsStore
  const {
    propsData,
    addDialogFormVisible,
    editDialogFormVisible,
  } = storeToRefs(tablePropsStore)

  let customEventArray = reactive<CustomEvent[]>([
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
  ])

  const data = ref<Recordable[]>([])
  const calendarAddModal = ref<FormRef | Nullable<any>>(null)
  const calendarEditModal = ref<FormRef | Nullable<any>>(null)
  const showCreateEventModal = computed(() => {
    return isSameMonth(currentDate.value, calendarModel.value)
  })


  function handleUpdateData() {
    data.value = restructureData(customEventArray)
  }

  function handleUpdateCalendarValue(date: string) {
    currentDate.value = date
    currentDay.value = dayjs(date).get('day')
    handleUpdateCurrentDateEvent()
    showDetailDrawer.value = true
  }

  //custom
  function handlePreviewCustomEvent(customEvent: unknown | RestructureEvent, index: number) {
    currentDate.value = (customEvent as RestructureEvent).date
    handleEditEvent((customEvent as RestructureEvent).event[index])
  }

  function handleUpdateCurrentDateEvent() {
    let result:CustomEvent[] = []
    data.value.forEach((item) => {
      const isCurrentDate = handleCompareDate(currentDate.value, item.date)
      if(isCurrentDate) {
        result = item.event.map((eventItem: Event) => {
          return {
            ...eventItem,
          }
        })
      }
    })

    currentDateEvent.value = [...result]
  }

  //modal
  function handleAddNewEvent(newEvent: unknown | Partial<RestructureEventItem>) {
    customEventArray.forEach((item, i) => {
      if(!(item['date'] === currentDate.value)) {
        customEventArray.push({
          date: currentDate.value,
          event: newEvent as Event[]
        })
      }
    })

    const filteredList = [...new Set(customEventArray.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
    customEventArray = filteredList
    data.value = handleUpdateEventList(filteredList, 'add')
  }

  function handleEditEvent(eventTarget: unknown | Partial<RestructureEventItem>) {
    const copidData = JSON.parse(JSON.stringify(eventTarget))
    updatePropsData(copidData)
    toggleEditDialogFormVisible(true)
  }

  function beforeEditSubmit() {
    let editFormData = propsData.value
    const copidData = JSON.parse(JSON.stringify(data.value))

    Object.entries(copidData).forEach(([key, value]) => {
      ((value as CustomEvent).event).map((event: Event) => {
        const index = (value as CustomEvent).event.findIndex((v: Event) => propsData.value.id === v.id)
        value.event[index] = editFormData
      })
    })

    customEventArray = [...copidData]
    data.value = handleUpdateEventList(customEventArray, 'edit')
  }

  onMounted(() => {  
    handleUpdateData()
  })



</script>

<template>
<n-calendar 
  class="h-100" 
  v-model:value="calendarModel" #="{ year, month, date }" 
  :is-date-disabled="isDateDisabled"
>
  <n-text 
    strong="strong" 
    @click="handleUpdateCalendarValue(`${year}-${month}-${date}`)"
    :depth="isDateDisabled(new Date(`${year}-${month}-${date}`).getTime()) ? 4 : 1"
  >{{ year }}-{{ month }}-{{ date }}
  </n-text>
  <div 
    v-for="(item, i) in data" 
    :key="`item.date-${i}`"
  >
    <template v-if="handleCompareDate(item.date, `${year}-${month}-${date}`)">
      <n-list>
        <n-thing 
          v-for="(eventItem, i) in item.event" 
          :key="`event.time-${i}`"
          @click="handlePreviewCustomEvent(item, i)"
        >
          <template v-if="isSameMonth(`${year}-${month}-${date}`, calendarModel)">
            <n-badge 
              dot="dot" 
              :type="eventItem.type"
            >
              <n-text>{{ eventItem.title }}</n-text>
            </n-badge>
          </template>
          <template v-else>
            <n-badge 
              dot="dot" 
              :type="eventItem.type"
            >
              <n-text style="color: gray; opacity: 0.7;">{{ eventItem.title }}</n-text>
            </n-badge>
          </template>
        </n-thing>
      </n-list>
    </template>
  </div>
</n-calendar>

<n-drawer 
  v-model:show="showDetailDrawer" 
  :width="650"
>
  <n-drawer-content 
    :title="drawerTitle" 
    closable="closable"
  >
    <template v-if="currentDateEvent.length > 0">
      <n-table 
        :bordered="false" 
        size="small" 
        striped="striped"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>重要度</th>
            <th>類型</th>
            <th>日期</th>
            <th>時間</th>
            <th>標題</th>
            <th>備註</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(eventItem, index) in currentDateEvent" 
            :key="`eventItem-${index}`"
          >
            <td>{{ index+1 }}</td>
            <td>
              <component :is="eventImportantText(eventItem?.type)"></component>
            </td>
            <td>{{ eventTypeTextList[eventItem?.eventType] }}</td>
            <td>{{ currentDate }}</td>
            <td>{{ format(eventItem?.time, 'time') }}</td>
            <td>{{ eventItem?.title }}</td>
            <td>{{ eventItem?.memo }}</td>
            <td>
              <n-button 
                strong="strong" 
                secondary="secondary" 
                round="round" 
                type="primary"
                @click="handleEditEvent(eventItem)"
              > 
                <template #icon>
                  <Icon 
                    name="material-symbols:edit-square-outline" 
                    size="20"
                  ></Icon>
                </template>
              </n-button>
            </td>
          </tr>
        </tbody>
      </n-table>

      <float-btn 
        v-if="showCreateEventModal" 
        @click="toggleAddDialogFormVisible(true)"
      ></float-btn>
    </template>

    <template v-else>
      <n-h3>當天沒排行程</n-h3>
      <float-btn 
        v-if="showCreateEventModal" 
        @click="toggleAddDialogFormVisible(true)"
      ></float-btn>
    </template>
  </n-drawer-content>
</n-drawer>

<dialogcom-view 
  v-model:show="addDialogFormVisible" 
  :title="`新增${currentDate}日程`"
>
  <template #form>
    <calendar-add-modal 
      ref="calendarAddModal" 
      :date="currentDate" 
      @new-event="handleAddNewEvent"
    ></calendar-add-modal>
  </template>
  <template #btn>
    <n-button 
        type="info" 
        @click="calendarAddModal?.handleValidate"
      >新增</n-button>
    <n-button @click="toggleAddDialogFormVisible(false)">取消</n-button>
  </template>
</dialogcom-view>

<dialogcom-view 
  :title="`${currentDate}日程修改`" 
  v-model:show="editDialogFormVisible"
>
  <template #form>
    <calendar-edit-modal 
      ref="calendarEditModal" 
      :date="propsData.date" 
      :formData="propsData"
      @on-submit="beforeEditSubmit"
    ></calendar-edit-modal>
  </template>

  <template #btn>
    <n-button 
      type="primary" 
      :loading="loading" 
      @click="calendarEditModal?.handleValidate"
    >確認</n-button>
    <n-button 
      type="error" 
      @click="resetDetailForm(data)"
    >重置</n-button>
    <n-button @click="handleEventDelete(data)">刪除</n-button>
  </template>
</dialogcom-view>
</template>

<style lang='scss' scoped>
:deep(.__date-picker-trigger) {
  width: 100%;
}
</style>