import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
// import { useAuthStore, useSettingStore } from '@/store'
import { useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  // const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  // console.log(settingStore)
  // 授权用
  // if (authStore.isChatGPTAPI) {
  data = {
    ...data,
    // systemMessage: settingStore.systemMessage,
    temperature: settingStore.temperature,
    top_p: settingStore.top_p,
    max_tokens: settingStore.max_tokens,
  }
  // }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
