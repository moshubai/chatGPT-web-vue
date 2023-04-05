<script setup lang='ts'>
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import { useUsingContext } from '../../hooks/useUsingContext'
import { useExportImage } from '../../hooks/useExportImage'
import { HoverButton, SvgIcon } from '@/components/common'
import { useAppStore } from '@/store'
const appStore = useAppStore()
const theme = computed(() => appStore.theme)
const { usingContext, toggleUsingContext } = useUsingContext()
const { handleExportFn } = useExportImage()
function handleExport() {
  handleExportFn()
}
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <template v-if="theme !== 'dark'">
      <NButton @click="appStore.setTheme('dark')">
        深色
      </NButton>
    </template>
    <template v-else>
      <NButton @click="appStore.setTheme('light')">
        浅色
      </NButton>
    </template>
    <HoverButton @click="toggleUsingContext">
      <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
        <SvgIcon icon="ri:chat-history-line" />
      </span>
    </HoverButton>
    <HoverButton @click="handleExport">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:download-2-line" />
      </span>
    </HoverButton>
  </footer>
</template>
