<script setup lang='ts'>
import { computed } from 'vue'
import { useUsingContext } from '../../hooks/useUsingContext'
import { useExportImage } from '../../hooks/useExportImage'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
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
  <footer class="flex items-center justify-between min-w-0 p-2 overflow-hidden border-t dark:border-neutral-800">
    <UserAvatar />

    <div class="flex items-center">
      <template v-if="theme !== 'dark'">
        <HoverButton @click="appStore.setTheme('dark')">
          <span class="text-xl dark:text-white">
            <SvgIcon icon="ri:moon-foggy-line" />
          </span>
        </HoverButton>
      </template>
      <template v-else>
        <HoverButton @click="appStore.setTheme('light')">
          <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
            <SvgIcon icon="ri:sun-foggy-line" />
          </span>
        </HoverButton>
      </template>
      <HoverButton @click="toggleUsingContext">
        <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
          <SvgIcon icon="ri:chat-history-line" />
        </span>
      </HoverButton>
      <HoverButton @click="handleExport">
        <span class="text-xl dark:text-white">
          <SvgIcon icon="ri:download-2-line" />
        </span>
      </HoverButton>
    </div>
  </footer>
</template>
