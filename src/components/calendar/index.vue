<script setup lang='ts' name='Calendar'>
  import type { FormRef } from '@/common/types'
  import type { Event, CustomEvent } from './composables/useCalendar'
  import type { RestructureEvent } from './composables/useCalendarEvents'
  import useCalendar from './composables/useCalendar'
  import useCalendarEvents from './composables/useCalendarEvents'
  import useDateUtils from './composables/useDateUtils'
  import useTablePropsStore from '@/store/module/table-props'
  import CalendarAddModal from './components/calendar-add-modal.vue';
  import CalendarEditModal from './components/calendar-edit-modal.vue'
  import dayjs from 'dayjs'

  const props = defineProps({
    calendarData: {
      type: Array as () => Array<CustomEvent>
    },
    onDayNoEvent: {
      type: String,
      default: '當天沒排行程',
    }
  })

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
    handleUpdateEventList,
    handleUpdateCurrentDateEvent,

    handleOpenEditModal,
    resetDetailForm,
  } = useCalendarEvents()

  const { format, isSameMonth } = useDateUtils()

  const {
    propsData,
    addDialogFormVisible,
    editDialogFormVisible,
  } = storeToRefs(tablePropsStore)

  //data
  const customEventData = ref<CustomEvent[]>([])
  const data = ref<Recordable[]>([])
  const calendarAddModal = ref<FormRef | Nullable<any>>(null)
  const calendarEditModal = ref<FormRef | Nullable<any>>(null)
  const showCreateEventModal = computed(() => {
    return isSameMonth(currentDate.value, calendarModel.value)
  })

  function handleUpdateCalendarValue(date: string) {
    currentDate.value = date
    currentDay.value = dayjs(date).get('day')
    currentDateEvent.value = handleUpdateCurrentDateEvent(data.value, currentDate.value)
    showDetailDrawer.value = true
  }

  //custom
  function handlePreviewCustomEvent(customEvent: unknown | RestructureEvent, index: number) {
    currentDate.value = (customEvent as RestructureEvent).date
    handleOpenEditModal((customEvent as RestructureEvent).event[index])
  }

  //modal
  function handleAddNewEvent(newEvent: unknown | Partial<Event>) {
    const index = customEventData.value.findIndex((v: CustomEvent) => currentDate.value === v.date)
    if(index !== -1) {
      customEventData.value[index].event.push(newEvent as Event)
    } else {
      customEventData.value.push(...new Set([{
        date: currentDate.value,
        event: [newEvent as Event]
      }]))
    }

    data.value = handleUpdateEventList(customEventData.value, 'add')
  }

  function handleEventDelete() {
    const result = (customEventData.value as CustomEvent[]).map((item: CustomEvent) => {
      if(handleCompareDate(item.date, propsData.value.date)) {
        const index = item.event.findIndex((v: Event) => propsData.value.id === v.id)
        item.event.splice(index, 1)
      }
      return {
        ...item
      }
    })

    loading.value = true
    nextTick(() => {
      customEventData.value = [...new Set(result)].sort((a, b) => {
      return new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1
    })
      data.value = handleUpdateEventList(customEventData.value, 'delete')
      loading.value = false
    });
  }


  function beforeEditSubmit() {
    const result = (customEventData.value as CustomEvent[]).map((item: CustomEvent) => {
      if(handleCompareDate(item.date, propsData.value.date)) {
        const index = item.event.findIndex((v: Event) => propsData.value.id === v.id)
        item.event[index] = propsData.value
      }
      return {
        ...item
      }
    })

    loading.value = true
    nextTick(() => {
      customEventData.value = result
      data.value = handleUpdateEventList(customEventData.value, 'edit')
      loading.value = false
    });
  }

  watch(props, (nV) => {
    if(nV.calendarData) {
      customEventData.value = nV.calendarData
      data.value = restructureData(customEventData.value)
    }
  }, {
    immediate: true
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
            <th></th>
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
                @click="handleOpenEditModal(eventItem)"
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
        @click="addDialogFormVisible = true"
      ></float-btn>
    </template>

    <template v-else>
      <n-h3>{{ props.onDayNoEvent }}</n-h3>
      <float-btn
        v-if="showCreateEventModal"
        @click="addDialogFormVisible = true"
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
    <n-button @click="addDialogFormVisible = false">取消</n-button>
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
    <n-button @click="handleEventDelete">刪除</n-button>
  </template>
</dialogcom-view>
</template>

<style lang='scss' scoped>
</style>