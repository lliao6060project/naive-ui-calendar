<script setup lang='ts' name='DialogcomView'>
type ShowButton = {
  submit: boolean
  cancel: boolean
}

interface DialogcomProps {
  title: string
  device: string
  showDialog: boolean
  showBtn: ShowButton
  modalType: string
}

const props = withDefaults(defineProps<DialogcomProps>(), {
  showDialog: false,
  showBtn: () => {
    return {
      submit: true,
      cancel: true
    }
  }
})

const emit = defineEmits(['submit', 'cancel'])
const { title, device, showDialog, showBtn, modalType } = toRefs(props)

const segmented = {
  content: 'soft',
  footer: 'soft'
}

const defaultModalSize = {
  width: '50%',
  height: '80vh'
}

const deleteModalSize = {
  width: '25%',
  height: '55vh'
}


</script>

<template>
<n-modal
  class="custom-card"
  v-model:show="showDialog"
  preset="card"
  :style="modalType === 'delete' ? deleteModalSize : defaultModalSize"
  :title="title"
  size="huge"
  :bordered="false"
  :segmented="segmented"
  @after-leave="emit('cancel')"
  @mask-click="emit('cancel')"
>
  <n-scrollbar :max-height='device == "mobile" ? "70vh" : "55vh"'>
    <slot name="form"></slot>
  </n-scrollbar><template #footer>
    <n-space
      class="dialog-footer"
      justify="center"
    >
      <slot name="btn">
        <n-button
          v-if="showBtn.submit"
          type="primary"
          @click='emit("submit")'
          size="small"
        >確認</n-button>
        <n-button
          v-if="showBtn.cancel"
          @click='emit("cancel")'
          size="small"
        >取消</n-button>
      </slot>
    </n-space>
  </template>
</n-modal>
</template>

<style lang='scss'>
.custom-card {
  .n-card__content {
    height: 62vh;
    overflow: hidden;
  }
}
</style>