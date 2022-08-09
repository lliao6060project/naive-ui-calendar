<script setup lang='ts' name='Float-btn'>
interface FloatBtnProps {
  title: string
  show: boolean
}

const props = withDefaults(defineProps<FloatBtnProps>(), {
  show: true
})

const emit = defineEmits<{
  (e: 'submit'): void
}>()

function check(method: string, emitName: string): void {
  emit('submit')
}
</script>

<template>
<n-button
  :title="props.title"
  :bordered="false"
  strong 
  circle 
  color="#8a2be2"
  class="float-btn"
  @click='check("insert", "handleAdd")'
>
  <template #icon>
    <Icon name="material-symbols:add"></Icon>
  </template>
  </n-button>

</template>

<style lang='scss'>
.float-btn {
  width: 50px; 
  height: 50px; 
  position: fixed; 
  bottom: 1rem;
  right: 2.5rem; 
  border-radius: 30px;
  z-index: 9999; 
}
</style>