<script setup lang='ts' name='CalendarAddModal'>
import useCalendar from '../composables/useCalendar';
import useCalendarForm from '../composables/useCalendarForm'
import useTablePropsStore from '@/store/module/table-props'

interface CalendarAddModalProps {
  date: string
}

const props = withDefaults(defineProps<CalendarAddModalProps>(), {
})

const emit = defineEmits<{
  (e: 'NewEvent', data: Recordable): void
}>()

const {
  importantOptions,
  eventTypeOptions
} = useCalendar()

const tablePropsStore = useTablePropsStore()
const { toggleAddDialogFormVisible } = tablePropsStore

const {
  addFormRef,
  addForm,
  addFormRules,
  updateCurrentDate,
} = useCalendarForm()

const textareaSize = {
  minRows: 3,
  maxRows: 5
}

function handleValidate (e: MouseEvent) {
  e.preventDefault()
  addFormRef.value?.validate((errors) => {
    if (!errors) {
      beforeAddSubmit()
    } else {
      console.log(errors)
      window.$message.error('驗證失敗')
    }
  })
}

function beforeAddSubmit() {
  const newEvent = {
    id: `test-e-${Math.floor(Math.random()*25)}`,
    ...addForm.value
  }
  emit('NewEvent', newEvent)
  toggleAddDialogFormVisible(false)
}

onMounted(() => {
  const onDay = new Date(props.date).getTime()
  updateCurrentDate(onDay)
  addForm.value.time = onDay
})


defineExpose({
  handleValidate
})

</script>

<template>
<n-form
  ref="addFormRef"
  :model="addForm"
  :rules="addFormRules"
  label-placement="top"
>
  <n-grid
    x-gap="12"
    :cols="2"
  >
    <n-form-item-gi
      label="title"
      path="title"
    >
      <n-input
        v-model:value="addForm.title"
        placeholder="title"
        clearable="clearable"
      ></n-input>
    </n-form-item-gi>
    <n-form-item-gi
      label="重要度"
      path="type"
    >
      <n-select
        v-model:value="addForm.type"
        filterable="filterable"
        :options="importantOptions"
      ></n-select>
    </n-form-item-gi>
    <n-form-item-gi
      label="時間"
      path="time"
    >
      <n-date-picker
        v-model:value="addForm.time"
        type="datetime"
        clearable="clearable"
      ></n-date-picker>
    </n-form-item-gi>
    <n-form-item-gi
      label="事件類型"
      path="eventType"
    >
      <n-select
        v-model:value="addForm.eventType"
        filterable="filterable"
        :options="eventTypeOptions"
      ></n-select>
    </n-form-item-gi>
  </n-grid>
  <n-grid
    x-gap="12"
    :cols="1"
  >
    <n-form-item-gi
      label="備註"
      path="memo"
    >
      <n-input
        type="textarea"
        v-model:value="addForm.memo"
        placeholder="memo"
        clearable="clearable"
        maxlength="20"
        show-count="show-count"
        :autosize="textareaSize"
      ></n-input>
    </n-form-item-gi>
  </n-grid>
</n-form>
</template>

<style lang='scss'>
:deep(.n-date-picker) {
  width: 100%;
}
</style>