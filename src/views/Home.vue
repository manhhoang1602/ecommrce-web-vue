<template>
  <a-layout>
    <Header />
    <a-layout>
      <a-layout-sider style="background: #fff" width="200">
        <div class="box-user-login">
          <div class="avatar"></div>
          <div class="info">
            <div class="name">{{ userInfo?.name }}</div>
            <div class="mail">{{ userInfo?.email }}</div>
          </div>
        </div>
        <Navbar />
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import { useUserInfo } from "@/services";
import Header from "@/components/Header.vue";

export default defineComponent({
  components: {
    Header,
    Navbar,
  },
  setup() {
    const { userInfo } = useUserInfo();

    return {
      userInfo,
    };
  },
});
</script>
<style lang="scss">
.ant-layout-content {
  margin: 15px !important;
  min-height: calc(100vh - 50px - 30px) !important;
}

.box-user-login {
  height: 150px;
  width: 100%;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .avatar {
    height: 64px;
    width: 64px;

    background-image: url("../assets/img/download.png");
    background-size: cover;
    border-radius: 50%;
  }
  .info {
    text-align: center;
    margin-top: 10px;

    .name {
      font-size: 13px;
      font-weight: bold;
    }
    .mail {
      font-size: 12px;
      color: gray;
    }
  }
}
</style>
