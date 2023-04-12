<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const router = useRouter()
const authStore = useAuthStore()

const formValue = ref({
  useName: 'admin',
  password: 'admin',

})
const rules = {
  useName: {
    required: true,
    message: '请输入用户名',
    trigger: ['blur', 'input'],
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['blur', 'input'],
  },
}

function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      // const {useName,password} = formValue.value
      message.success('登录成功')
      router.push('/chat')
      nextTick(() => {
        authStore.setToken('Bearer 252d2b61-cd39-40a5-b773-9a0d427813e1')
        // console.log(formValue.value)
      })
    }
    else {
      // console.log(errors)
    }
  })
}
</script>

<template>
  <div class="login_warp">
    <h2>
      欢迎登录体验
    </h2>
    <NForm ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="auto" class="login_form">
      <NFormItem label="用户名" path="useName">
        <NInput v-model:value="formValue.useName" placeholder="请输入用户名" />
      </NFormItem>

      <NFormItem label="密码" path="password">
        <NInput v-model:value="formValue.password" placeholder="请输入密码" type="password" />
      </NFormItem>
      <div class="login_btn_warp">
        <NButton type="primary" class="login_btn" attr-type="button" @click="handleValidateClick">
          登录
        </NButton>
      </div>
    </NForm>
  </div>
</template>

<style scoped lang="less">
.login_warp {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;

  .login_form {
    width: 400px;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 1px2px6px0px#d9d2d2;
    border-radius: 5px;
    margin: 0auto;
  }

  .login_btn_warp {
    width: 100%;

    .login_btn {
      width: 100%;
    }
  }
}

@media screen and(max-width:500px) {
  .login_warp {
    .login_form {
      width: 90%;
    }

  }
}
</style>
