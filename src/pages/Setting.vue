<template>
  <div class="page-setting">
    <a-page-header title="Cài đặt"> </a-page-header>

    <div class="search-box">
      <a-row>
        <a-col span="12"> <FeeShipSetting /> </a-col>
      </a-row>
    </div>

    <div class="search-box">
      <a-row>
        <a-col span="8">
          <BannerItemComponent title="Cấu hình banner chính" total="5" />
        </a-col>
        <a-col span="8">
          <BannerItemComponent title="Cấu hình banner phụ 1" total="1" />
        </a-col>
        <a-col span="8">
          <BannerItemComponent title="Cấu hình banner phụ 2" total="1" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FeeShipSetting from "@/components/setting/FeeShipSetting.vue";
import BannerItemComponent from "@/components/setting/BannerItemComponent.vue";

export default defineComponent({
  components: { BannerItemComponent, FeeShipSetting },
});
</script>

<style></style>
