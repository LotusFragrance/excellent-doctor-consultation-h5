import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 用户信息
    const userInfo = ref<User>()
    // 设置用户信息
    const setUserInfo = (u: User) => {
      userInfo.value = u
    }
    // 清空用户信息
    const delUserInfo = () => {
      userInfo.value = undefined
    }
    return { userInfo, setUserInfo, delUserInfo }
  },
  { persist: true }
)
