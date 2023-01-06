<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import {
  loginByPassword,
  sendMobileCode,
  loginByMobile
} from '@/services/login'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { Toast, type FormInstance } from 'vant'
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const agree = ref(false) // 是否同意用户协议
const changeLoginWay = ref(true) // 控制登录的方式
const show = ref(false) // 控制密码是否显现
const form = ref<FormInstance>() // form表单组件实例
// 表单数据
const mobile = ref('13230000100')
const password = ref('abc12345')
const code = ref('')
const login = async () => {
  if (!agree.value) return Toast('请勾选我已同意')
  // 验证完毕，进行登录
  const res = changeLoginWay.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  store.setUserInfo(res.data)
  // 如果有回跳地址就进行回跳，没有跳转到个人中心
  router.replace((route.query.returnUrl as string) || '/user')
  Toast.success('登录成功')
}

// 发送验证码
const time = ref(0)
let timeId: number
const send = async () => {
  // 已知倒计时time的值大于0，此时不能发送验证码
  if (time.value > 0) return
  // 验证不通过报错，阻止程序继续执行
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'login')
  Toast.success('发送成功')
  time.value = 60
  // 倒计时
  clearInterval(timeId)
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
// 组件卸载关闭定时器
onUnmounted(() => {
  window.clearInterval(timeId)
})
</script>

<template>
  <div class="login-page">
    <!-- 头部组件 -->
    <cp-nav-bar right-text="注册"></cp-nav-bar>
    <!-- 头部组件 -->

    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ changeLoginWay ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="changeLoginWay = !changeLoginWay">
        <span> {{ changeLoginWay ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow" />
      </a>
    </div>
    <!-- 头部 -->

    <!-- 表单 -->
    <van-form class="login-form" autocomplete="off" @submit="login" ref="form">
      <van-field
        placeholder="请输入手机号"
        type="tel"
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
      />
      <van-field
        :type="show ? 'text' : 'password'"
        name="password"
        placeholder="请输入密码"
        v-if="changeLoginWay"
        v-model="password"
        @click-right-icon="show = !show"
        :rules="passwordRules"
      >
        <template #right-icon>
          <CpIcon :name="`login-eye-${show ? 'on' : 'off'}`" />
        </template>
      </van-field>
      <van-field
        type="text"
        name="code"
        placeholder="短信验证码"
        v-else
        v-model="code"
        :rules="codeRules"
      >
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button round block type="primary" native-type="submit"
          >登录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 表单 -->

    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
    <!-- 底部 -->
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 30px 30px 50px;

    h3 {
      font-size: 24px;
      font-weight: normal;
    }

    a {
      font-size: 15px;
    }
  }

  &-form {
    padding: 0 14px;

    .cp-cell {
      height: 52px;
      line-height: 24px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
    .btn-send {
      color: var(--cp-primary);
      &.active {
        color: rgba(22, 194, 163, 0.5);
      }
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
</style>
