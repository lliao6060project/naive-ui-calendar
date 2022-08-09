<script setup lang='ts' name='Float-btn'>
const dialogPropes = defineProps({
  title: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'submit'): void
}>()
const { title } = toRefs(dialogPropes)

// 是否有權限
function check(method: string, emitName: string): void {
  // if (!checkApiAuthorization(method)) {
  //   return alerts($t('valConfirm.permissionError'), 'error')
  // }
  emit('submit')
}
</script>

<template>
<n-button
  style="width: 50px; height: 50px; position: fixed; bottom: 1rem;right: 2.5rem; z-index: 9999; border-radius: 30px; background-color: blue; color: white;"
  :title="title"
  :bordered="false"
  size="huge"
  role="dialog"
  aria-modal="true"
  @click='check("insert", "handleAdd")'
>
  <Icon name="material-symbols:add"></Icon>
  </n-button>

</template>

<style lang='scss' scoped>
</style>