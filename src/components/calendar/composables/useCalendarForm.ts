import type { Ref } from 'vue'
import type { FormModel, FormRef } from '@/common/types'
import type { FormRules, FormItemRule } from 'naive-ui'
import useDateUtils from './useDateUtils'

const { isSameDate, format } = useDateUtils()

export interface ReturnUseCalendarForm {
  editFormRef: Ref<FormRef>
  editFormRules: FormRules

  addFormRef: Ref<FormRef>
  addForm: Ref<FormModel>
  addFormRules: FormRules

  updateCurrentDate: (timestamp: number) => void
}

export default function useCalendarForm(): ReturnUseCalendarForm {
  const editFormRef = ref<FormRef>(null)
  const addFormRef = ref<FormRef>(null)
  const currentDateTimestamp = ref<number>(0)

  const addForm = ref<FormModel>({
    title: 'null',
    type: 'info',
    time: null,
    eventType: '0',
    memo: 'null',
  })
  const addFormRules: FormRules = {
    title: {
      required: true,
      trigger: ['blur', 'input'],
      message: '必填'
    },
    type: {
      required: true,
      trigger: ['blur', 'change'],
      message: '請選擇一項'
    },
    time: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      validator (rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('請選擇開始日期')
        } else if(!isSameDate(new Date(value), new Date(currentDateTimestamp.value))) {
          return new Error(`不可選擇大於或小於${format(`${new Date(currentDateTimestamp.value)}`, 'date')}的日期!`)
        }
        return true
      }
    },
    eventType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '請選擇一項'
    },
    memo: {
      required: true,
      trigger: ['blur', 'input'],
      message: '必填'
    },
  }

  const editFormRules: FormRules = {
    title: {
      required: true,
      trigger: ['blur', 'input'],
      message:'必填'
    },
    type: {
      required: true,
      trigger: ['blur', 'change'],
      message: '請選擇一項'
    },
    time: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      validator (rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('請選擇開始日期')
        } else if(!isSameDate(new Date(value), new Date(currentDateTimestamp.value))) {
          return new Error(`不可選擇大於或小於${format(`${new Date(currentDateTimestamp.value)}`, 'date')}的日期!`)
        }
        return true
      }
    },
    eventType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '請選擇一項'
    },
    memo: {
      required: true,
      trigger: ['blur', 'input'],
      message: '必填'
    },
  }

  function updateCurrentDate(timestamp: number) {
    currentDateTimestamp.value = timestamp
  }

  return {
    editFormRef,
    editFormRules,

    addFormRef,
    addForm,
    addFormRules,

    updateCurrentDate,
  }
}