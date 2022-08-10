import type { ComputedRef, Ref } from 'vue'
import type { JSXElement } from '@babel/types';
import type { SelectOption } from 'naive-ui'
import useDateUtils from './useDateUtils';
import dayjs from 'dayjs';
import { NTag } from 'naive-ui'

export type Event = {
  id: string,
  type: string,
  eventType: string,
  title: string,
  time: string,
  memo: string,
}

export interface CustomEvent {
  date: string,
  event: Event[]
}

const { isThisMonth, isSameDate } = useDateUtils()

export interface ReturnUseCalendar {
  eventTypeTextList: string[]
  drawerTitle: ComputedRef

  loading: Ref<boolean>
  calendarModel: Ref<number>
  currentDate: Ref<string>
  currentDay: Ref<number>
  currentDateEvent: Ref<Recordable[]>
  importantOptions: SelectOption[]
  eventTypeOptions: SelectOption[]

  handleCompareDate: (current: string, calendar: string) => boolean
  isDateDisabled: (timestamp: number) => boolean
  eventImportantText: (type: string) => JSXElement | unknown
}

export default function useCalendar(): ReturnUseCalendar {
  const dayList:string[] = ['一', '二', '三', '四', '五', '六', '日']
  const eventTypeTextList: string[] = ['會議', '其他']

  const loading = ref<boolean>(false)
  const calendarModel = ref<Nullable<any>>(dayjs().add(0, 'day'))
  const currentDate = ref<string>('')
  const currentDay = ref<number>(0)
  const currentDateEvent = ref<Recordable[]>([])
  const importantOptions = [
    {
      label: "高",
      value: 'error',
    },
    {
      label: "中",
      value: 'warning',
    },
    {
      label: "普",
      value: "info",
    },
  ]
  const eventTypeOptions = [
    {
      label: "會議",
      value: '0',
    },
    {
      label: "其他",
      value: '1',
    },
  ]

  const drawerTitle = computed(() => {
    return `${currentDate.value}(${dayList[currentDay.value-1] ?? dayList[6]}) 行程一覽`
  })

  function handleCompareDate(current: string, calendar: string) {
    let currentDate = new Date(current)
    let calendarDate = new Date(calendar)
    return isSameDate(currentDate, calendarDate)
  }

  function isDateDisabled (timestamp: number) {
    return !isThisMonth(timestamp)
  }

  function eventImportantText(type: string) {
    type TypeObj = {
      type: "info" | "default" | "error" | "primary" | "success" | "warning" | undefined
      text: string,
    }

    let returnTypeObj: TypeObj = {
      type: 'info',
      text: '',
    }

    const typeList:TypeObj[] = [
      {
        type: 'error',
        text: '高'
      },
      {
        type: 'warning',
        text: '中'
      },
      {
        type: 'info',
        text: '普'
      },
    ]

    const result = typeList.find((item) => {
      return item.type === type
    })

    returnTypeObj = result as TypeObj

    return(
      <NTag
        type={returnTypeObj?.type}
        size={'small'}
      >{ returnTypeObj?.text }</NTag>
    )
  }

  return {
    eventTypeTextList,
    drawerTitle,

    loading,
    calendarModel,
    currentDate,
    currentDay,
    currentDateEvent,
    importantOptions,
    eventTypeOptions,

    handleCompareDate,
    isDateDisabled,
    eventImportantText,
  }
}
