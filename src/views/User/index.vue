<script setup lang="ts">
import { getUserInfo } from '@/services/user'
import type { UserInfo } from '@/types/user'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
const user = ref<UserInfo>() // 用户个人信息
onMounted(async () => {
  const res = await getUserInfo()
  user.value = res.data
})
// 快捷工具数据
const tools = [
  { label: '我的问诊', path: '/user/consult' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' }
]
const store = useUserStore()
const router = useRouter()
const logout = async () => {
  await Dialog.confirm({
    title: '温馨提示',
    message: '您确认要退出优医问诊吗？',
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
  store.delUserInfo()
  router.push('/login')
}
</script>

<template>
  <div class="user-page">
    <!-- 头部 -->
    <div class="user-page-head">
      <div class="top">
        <van-image width="70" height="70" fit="cover" round :src="user?.avatar">
        </van-image>
        <div class="name">
          <p>{{ user?.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row class="bottom">
        <van-col span="6">
          <span>{{ user?.collectionNumber }}</span>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <span>{{ user?.likeNumber }}</span>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <span>{{ user?.score }}</span>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <span>{{ user?.couponNumber }}</span>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <!-- 头部 -->

    <!-- 订单区域 -->
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order"
          >全部订单 <van-icon name="arrow"
        /></router-link>
      </div>
      <van-row>
        <van-col span="6">
          <van-badge :content="user?.orderInfo.paidNumber || ''">
            <cp-icon name="user-paid" />
          </van-badge>
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user?.orderInfo.shippedNumber || ''">
            <cp-icon name="user-shipped" />
          </van-badge>
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user?.orderInfo.receivedNumber || ''">
            <cp-icon name="user-received" />
          </van-badge>
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user?.orderInfo.finishedNumber || ''">
            <cp-icon name="user-finished" />
          </van-badge>
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <!-- 订单区域 -->

    <!-- 快捷工具模块 -->
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        :title="item.label"
        is-link
        :to="item.path"
        :border="false"
        v-for="(item, i) in tools"
        :key="i"
      >
        <template #icon><cp-icon :name="`user-tool-0${i + 1}`" /></template>
      </van-cell>
    </div>
    <!-- 快捷工具模块 -->

    <!-- 退出登录 -->
    <a href="javascript:;" class="logout" @click="logout">退出登录</a>
    <!-- 退出登录 -->
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  padding: 0px 0px 65px;
  background-color: var(--cp-bg);
  // 头部
  &-head {
    padding: 50px 0px 30px;
    background: linear-gradient(
      180deg,
      rgba(44, 181, 165, 0.46),
      rgba(44, 181, 165, 0)
    );

    .top {
      padding: 0 15px;
      display: flex;
      align-items: center;

      .name {
        margin-left: 10px;

        p {
          &:nth-child(1) {
            font-size: 18px;
          }

          &:nth-child(2) {
            padding-top: 10px;
            font-size: 16px;
            color: var(--cp-primary);
          }
        }
      }
    }

    .bottom {
      margin-top: 15px;

      ::v-deep() {
        .van-col {
          text-align: center;

          span {
            font-size: 18px;
          }

          p {
            padding-top: 4px;
            font-size: 12px;
            color: var(--cp-dark);
          }
        }
      }
    }
  }
  // 订单
  &-order {
    margin: 0 15px 15px;
    padding-bottom: 15px;
    border-radius: 8px;
    background-color: #fff;

    .head {
      padding: 0 15px;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      a {
        font-size: 14px;
        color: var(--cp-tip);
      }

      h3 {
        font-size: 16px;
      }
    }
    ::v-deep() {
      .van-col {
        text-align: center;
        .cp-icon {
          font-size: 28px;
        }
        p {
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }
  // 分组
  &-group {
    margin: 0 15px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    h3 {
      padding-left: 16px;
      line-height: 44px;
    }
    .van-cell {
      align-items: center;
    }
    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }
  //退出登录
  .logout {
    display: block;
    padding: 20px 0;
    height: 20px;
    width: 100px;
    margin: 0 auto;
    text-align: center;
    line-height: 20px;
    color: var(--cp-price);
  }
}
</style>
