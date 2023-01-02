import router from '@/router'
import { useUserStore } from '@/stores'
import axios, { type Method } from 'axios'
import { Toast } from 'vant'

// 1. 新axios实例，基础配置
const baseURL = 'https://consult-api.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 2. 请求拦截器，携带token
instance.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.userInfo?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${store.userInfo?.token}`
    }
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

// 3. 响应拦截器，剥离无效数据，401拦截
instance.interceptors.response.use(
  (res) => {
    // 后台约定，响应成功，但是code不是10000，是业务逻辑失败
    if (res.data?.code !== 10000) {
      Toast(res.data.message || '网络错误')
      return Promise.reject(res.data)
    }
    // 业务逻辑成功，返回响应数据，作为axios成功的结果
    return res.data
  },
  (err) => {
    // 身份验证失败
    if (err.response.status === 401) {
      // 提示信息
      Toast('登录超时，请重新登录！')
      // 删除用户信息
      const store = useUserStore()
      store.delUserInfo()
      // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

// 4. 请求工具函数
type Data<T> = {
  code: number
  message: string
  data: T
}
const request = <T>(
  url: string,
  method: Method = 'get',
  submitData?: object
) => {
  // request<数据类型，数据类型>() 这样才指定了 res.data 的类型
  // 后台返回的数据结构相同，所以可以抽取相同的类型
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
export { baseURL, instance, request }
