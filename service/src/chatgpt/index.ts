import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatGPTUnofficialProxyAPI, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI } from 'chatgpt'
import { sendResponse } from '../utils'
import { isNotEmptyString } from '../utils/is'
import type { ApiModel, ChatContext, ModelConfig } from '../types'

const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

dotenv.config()

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000

let apiModel: ApiModel
let model = 'gpt-3.5-turbo'

if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_ACCESS_TOKEN)
  throw new Error('Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable')

let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

(async () => {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api

  const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL
  const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL
  model = isNotEmptyString(OPENAI_API_MODEL) ? OPENAI_API_MODEL : 'gpt-3.5-turbo'

  const options: ChatGPTAPIOptions = {
    apiKey: process.env.OPENAI_API_KEY,
    completionParams: { model },
    debug: false,
  }

  // increase max token limit if use gpt-4
  if (model.toLowerCase().includes('gpt-4')) {
    // if use 32k model
    if (model.toLowerCase().includes('32k')) {
      options.maxModelTokens = 32768
      options.maxResponseTokens = 8192
    }
    else {
      options.maxModelTokens = 8192
      options.maxResponseTokens = 2048
    }
  }

  if (isNotEmptyString(OPENAI_API_BASE_URL))
    options.apiBaseUrl = `${OPENAI_API_BASE_URL}/v1`

  api = new ChatGPTAPI({ ...options })
  apiModel = 'ChatGPTAPI'

  // const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL
  // const model = (typeof OPENAI_API_MODEL === 'string' && OPENAI_API_MODEL.length > 0)
  //   ? OPENAI_API_MODEL
  //   : 'gpt-3.5-turbo'

  // const options: ChatGPTAPIOptions = {
  //   apiKey: process.env.OPENAI_API_KEY,
  //   completionParams: { model },
  //   debug: false,
  // }

  // if (process.env.OPENAI_API_BASE_URL && process.env.OPENAI_API_BASE_URL.trim().length > 0)
  //   options.apiBaseUrl = process.env.OPENAI_API_BASE_URL

  // if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
  //   const agent = new SocksProxyAgent({
  //     hostname: process.env.SOCKS_PROXY_HOST,
  //     port: process.env.SOCKS_PROXY_PORT,
  //   })
  //   options.fetch = (url, options) => {
  //     return fetch(url, { agent, ...options })
  //   }
  // }

  // api = new ChatGPTAPI({ ...options })
  // apiModel = 'ChatGPTAPI'
})()

async function chatReply(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
) {
  if (!message)
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext)
      options = { ...lastContext }

    const response = await api.sendMessage(message, { ...options })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

async function chatReplyProcess(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
  process?: (chat: ChatMessage) => void,
) {
  // if (!message)
  //   return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext) {
      if (apiModel === 'ChatGPTAPI')
        options = { parentMessageId: lastContext.parentMessageId }
      else
        options = { ...lastContext }
    }

    const response = await api.sendMessage(message, {
      ...options,
      onProgress: (partialResponse) => {
        process?.(partialResponse)
      },
    })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

async function chatConfig() {
  return sendResponse({
    type: 'Success',
    data: {
      apiModel,
      reverseProxy: process.env.API_REVERSE_PROXY,
      timeoutMs,
      socksProxy: (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`) : '-',
    } as ModelConfig,
  })
}

export type { ChatContext, ChatMessage }

export { chatReplyProcess, chatConfig, chatReply }
