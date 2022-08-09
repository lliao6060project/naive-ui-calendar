<script setup lang="ts" name="Icon">
  // @ts-ignore
import Iconify from '@purge-icons/generated'
import { VueElement } from 'vue'

  export interface IconProps {
    name: string
    size?: number | string
    spin?: boolean
    color?: string
  }
  const props = withDefaults(defineProps<IconProps>(), {
    size: 16,
    spin: false
  })

  const fontSize = computed(() => {
    return `${props.size}px`
  })

  const styles = computed(() => {
    return {
      fontSize: fontSize.value,
      color: props.color ? props.color : 'inherit'
    }
  })

  const iconClass = computed(() => {
    return {
      'pear-icon': true,
      'pear-icon-spin': props.spin
    }
  })

  const iconRefEl = ref<Nullable<any>>(null)

  watch(
    () => props.name,
    () => {
      update()
    },
    { flush: 'post' }
  )

  async function update() {
    const el = iconRefEl.value as Element
    if (el) {
      const svg = Iconify.renderSVG(props.name, {})
      if (svg) {
        el.textContent = ''
        el.appendChild(svg)
      } else {
        const span = document.createElement('span')
        span.className = 'iconify'
        span.dataset.icon = props.name
        el.textContent = ''
        el.appendChild(span)
      }
    }
  }

  onMounted(() => {
    update()
  })
</script>

<template>
  <i ref="iconRefEl" :class="iconClass" :style="styles" :data-icon="name"></i>
</template>

<style scoped lang="scss">
  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  span.iconify {
    //display: block;
    display: inline-flex;
    min-width: 1em;
    min-height: 1em;
    border-radius: 100%;
    transition: 0.3s var(--cubic-bezier-ease-in-out);
  }
</style>