import type { Ref } from 'vue'
import type { Event, CustomEvent } from './useCalendar'
import useCalendar from "./useCalendar"
import useDateUtils from './useDateUtils'
import useTablePropsStore from '@/store/module/table-props'

export type RestructureEventItem = {
  date: number
  id: string,
  type: string,
  eventType: string,
  title: string,
  time: number,
  memo: string,
}

export interface RestructureEvent {
  date: string,
  event: RestructureEventItem[]
}

export interface ReturnUseCalendarEvents {
  showDetailDrawer: Ref<boolean>

  restructureData: (data: CustomEvent[]) => RestructureEvent[]

  handleUpdateEventList: (addNewEventArray: CustomEvent[], type: 'add' | 'edit') => Recordable[]
  handleUpdateCurrentDateEvent: (data: Recordable[], currentDate: string) => CustomEvent[]

  handleOpenEditModal: (eventTarget: unknown | Partial<RestructureEventItem>) => void 
  handleEventDelete: (data: unknown | RestructureEvent[]) => void
  resetDetailForm: (data: unknown | RestructureEvent[]) => void
}

const { format } = useDateUtils()

export default function useCalendarEvent(): ReturnUseCalendarEvents {
  const { 
    loading,

    handleCompareDate,
  } = useCalendar()

  const tablePropsStore = useTablePropsStore()
  const { updatePropsData, toggleEditDialogFormVisible } = tablePropsStore
  const { propsData } = storeToRefs(tablePropsStore)

  const showDetailDrawer = ref<boolean>(false)


  //handle api data
  function restructureData(data: CustomEvent[]) {
    const copidData: CustomEvent[] = JSON.parse(JSON.stringify(data))
    let returnResult: RestructureEvent[] = []

    const restructureEvents = copidData.map((item) => {
      return item.event.map((eventItem: Event) => {
        if(typeof(eventItem.time) === 'number') {
          const fomatTime = format(eventItem.time, 'time')
          return {
            ...eventItem,
            date: new Date(item.date).getTime(),
            time: new Date(`${item.date} ${fomatTime}`).getTime()
          }
        }
        return {
          ...eventItem,
          date: new Date(item.date).getTime(),
          time: new Date(`${item.date} ${eventItem.time}`).getTime()
        }
      })
    })

    copidData.forEach((item, i) => {
      let result = {}
      const event = restructureEvents[i]
      result = {
        ...item,
        event: event
      }
      returnResult.push(result as RestructureEvent)
    })
    
    returnResult.sort((a, b) => {
      return new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1
    })

    return returnResult
  }

  //handle event methods
  function handleUpdateEventList(addNewEventArray: CustomEvent[], type: 'add' | 'edit' = 'add') {
    let result: Recordable[] = []

    const reduceData = groupBy(addNewEventArray, 'date')
    Object.entries(reduceData).forEach(([key, value]) => {
      result.push({
        date: key as string,
        event: value as RestructureEventItem
      })
    })
    
    result = restructureData(result as CustomEvent[])

    loading.value = true
    showDetailDrawer.value = false
    nextTick(() => {
      window.$message.success(type == 'add' ? '新增成功' : '修改成功')
      type === 'add' 
      ? ''
      : toggleEditDialogFormVisible(false)
      loading.value = false
    });

    return result
  }

  function handleUpdateCurrentDateEvent(data: Recordable[], currentDate: string) {
    let result: CustomEvent[] = []
    data.forEach((item) => {
      const isCurrentDate = handleCompareDate(currentDate, item.date)
      if(isCurrentDate) {
        result = item.event.map((eventItem: Event) => {
          return {
            ...eventItem,
          }
        })
      }
    })

    return [...result]
  }

  //modal
  //edit & delete
  function handleOpenEditModal(eventTarget: unknown | Partial<RestructureEventItem>) {
    const copidData = JSON.parse(JSON.stringify(eventTarget))
    updatePropsData(copidData)
    toggleEditDialogFormVisible(true)
  }

  function handleEventDelete(data: unknown | RestructureEvent[]) {
    (data as RestructureEvent[]).map((item: RestructureEvent) => {
      if(handleCompareDate(item.date, propsData.value.date)) {
        const index = item.event.findIndex((v: RestructureEventItem) => propsData.value.id === v.id)
        item.event.splice(index, 1)
        return {
          ...item
        }
      }
    }) 

    loading.value = true
    showDetailDrawer.value = false
    nextTick(() => {
      updatePropsData(data)
      window.$message.success('刪除成功')
      toggleEditDialogFormVisible(false)
      loading.value = false
    });
  }

  function resetDetailForm(data: unknown | RestructureEvent[]) {
    const copidData = JSON.parse(JSON.stringify(data))
    const originData = copidData.map((item: RestructureEvent) => {
      if(handleCompareDate(item.date, propsData.value.date)) {
        return item.event.find((item: RestructureEventItem) => {
          return item.id === propsData.value.id
        })
      }
    })

    const matchedData = originData.filter(Boolean)
    
    loading.value = true
    nextTick(() => {
      updatePropsData(matchedData[0])
      loading.value = false
    });
  }


  function groupBy(objectArray: Recordable[], property: string) {
    return objectArray.reduce(function (acc, obj) {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(...obj.event);
      return acc;
    }, {});
  }  

  return {
    showDetailDrawer,

    restructureData,

    handleUpdateEventList,
    handleUpdateCurrentDateEvent,

    handleOpenEditModal,
    handleEventDelete,
    resetDetailForm,
  }
}