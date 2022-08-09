<script setup lang="ts" name="AppProvider">
  import {
    NDialogProvider,
    NMessageProvider,
    NLoadingBarProvider,
  } from 'naive-ui';
  import { Message } from './message';
  import { LoadingBar } from './loading-bar';
  import { Dialog } from './dialog';

</script>

<template>
<n-loading-bar-provider>
  <LoadingBar />
  <n-dialog-provider>
    <Dialog />
    <n-message-provider>
      <Message />
      <slot></slot>
    </n-message-provider>
  </n-dialog-provider>
</n-loading-bar-provider>
</template>