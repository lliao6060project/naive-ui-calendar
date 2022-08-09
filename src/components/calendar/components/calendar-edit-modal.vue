<script setup lang='ts' name='CalendarEditModal'>
import type { RestructureEventItem } from '../composables/useCalendarEvents'
import useCalendar from '../composables/useCalendar';
import useCalendarForm from '../composables/useCalendarForm'

interface CalendarAddModalProps {
  date: number,
  formData: RestructureEventItem
}

const props = withDefaults(defineProps<CalendarAddModalProps>(), {
})

const emit = defineEmits<{
  (e: 'onSubmit'): void
}>()

const {   
  importantOptions,
  eventTypeOptions,

} = useCalendar()

const {
  editFormRef,
  addForm,
  editFormRules,
  updateCurrentDate,
} = useCalendarForm()

const textareaSize = {
  minRows: 3,
  maxRows: 5
}

const formData = computed(() => {
  return props.formData
})

function handleValidate (e: MouseEvent) {
  e.preventDefault()
  editFormRef.value?.validate((errors) => {
    if (!errors) {
      emit('onSubmit')
    } else {
      window.$message.error('驗證失敗')
    }
  })
}

onMounted(() => {
  const onDay = props.date
  updateCurrentDate(onDay)
  addForm.value.time = onDay
})


defineExpose({
  handleValidate,
})

</script>

<template>
<n-form 
  ref="editFormRef" 
  :model="formData" 
  :rules="editFormRules" 
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
        v-model:value="formData.title" 
        placeholder="title" 
        clearable="clearable"
      ></n-input>
    </n-form-item-gi>
    <n-form-item-gi 
      label="重要度" 
      path="type"
    >
      <n-select 
        v-model:value="formData.type" 
        filterable="filterable" 
        :options="importantOptions"
      ></n-select>
    </n-form-item-gi>
    <n-form-item-gi 
      label="時間" 
      path="time"
    >
      <n-date-picker 
        v-model:value="formData.time" 
        type="datetime" 
        clearable="clearable"
      ></n-date-picker>
    </n-form-item-gi>
    <n-form-item-gi 
      label="事件類型" 
      path="eventType"
    >
      <n-select 
        v-model:value="formData.eventType" 
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
        v-model:value="formData.memo" 
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

<style lang='scss' scoped>
:deep(.n-date-picker) {
  width: 100%;
}
</style>