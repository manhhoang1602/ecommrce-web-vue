<template>
  <div class="box">
    <div class="form">
      <div class="wrapper-logo">
        <img alt="logo-login" src="../assets/img/logo%20.svg" />
      </div>

      <div class="wrapper-form">
        <a-form :model="formState" autocomplete="off" name="basic" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item name="phone">
            <a-input
              v-model:value="formState.phone"
              placeholder="PHONE"
              style="
                height: 47px;
                background-color: transparent;
                font-family: 'Montserrat', sans-serif !important;
                color: white;
                font-weight: 500;
                font-size: 16px;
              "
            >
            </a-input>
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
              v-model:value="formState.password"
              placeholder="PASSWORD"
              style="
                height: 47px;
                background-color: transparent;
                font-family: 'Montserrat', sans-serif !important;
                font-weight: 500;
                font-size: 18px;
                color: white;
              "
            />
          </a-form-item>

          <a-form-item>
            <a-button :loading="loading" html-type="submit">LOGIN</a-button>
          </a-form-item>
        </a-form>
        <div class="forgot-pass">Quên mật khẩu?</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { Baservices } from "@/commons";
import Notification from "@/components/notification/Notification";
import Utils from "@/commons/Utils";
import router from "@/router";

interface FormState {
  phone: string;
  password: string;
  remember: boolean;
}
export default defineComponent({
  computed: {},
  setup() {
    const formState = reactive<FormState>({
      phone: "",
      password: "",
      remember: true,
    });
    const loading = ref<boolean>(false);
    const onFinish = async (values: { phone: string; password: string }) => {
      try {
        loading.value = true;
        const { phone, password } = values;

        if (Utils.checkPhoneNumber(phone) === false) {
          Notification.Info(undefined, "Số điện thoại không hợp lệ.");
          return false;
        }

        if (password.length < 6) {
          Notification.Info(undefined, "Mật khẩu phải ít nhất 6 ký tự.");
          return false;
        }

        const response = await Baservices.postMethod("/auth/signin", values, false);

        if (response) {
          Notification.Success(undefined, "Đăng nhập thành công.");
          router.push("/home");
        }

        loading.value = false;
      } catch (e) {
        console.error(e);
        loading.value = false;
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

    return {
      formState,
      loading,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<style lang="scss">
.box {
  height: 100vh;
  width: 100vw;

  background: #2148c0 url("../assets/img/BG.svg") no-repeat;
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    width: 300px;
    height: 398px;
    font-family: "Montserrat", sans-serif !important;

    transform: translateY(-80px);

    .wrapper-logo {
      display: flex;
      justify-content: center;

      margin-bottom: 75px;
    }

    .wrapper-form {
      input::placeholder {
        color: white;
        font-family: "Montserrat", sans-serif !important;
        font-weight: lighter;
        font-size: 15px;
      }

      input {
        background-color: transparent;
      }

      .anticon {
        color: white;
      }

      input[placeholder="PASSWORD"] {
        color: white;
        font-size: 20px;
      }

      .ant-btn {
        width: 100%;
        height: 47px;

        margin-top: 21px;
        box-shadow: 0px 4px 4px rgb(0 0 0 / 30%);
        transition: all 0.3s;

        span {
          font-weight: 600;
          font-family: "Montserrat", sans-serif;
          color: #2148c0;
          font-size: 16px;
        }

        &:hover {
          background: #2148c0;
          outline: none;
          border: 1px solid white;

          span {
            color: white;
          }
        }
      }

      .forgot-pass {
        color: white;
        font-family: "Montserrat", sans-serif;
        text-align: right;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
</style>
