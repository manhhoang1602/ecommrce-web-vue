<template>
  <a-layout-header class="box-header">
    <div class="header-left">Ecommerce Admin</div>

    <div class="header-right"></div>
  </a-layout-header>
</template>
<script></script>
<style lang="scss">
.ant-layout-header {
  background: #fff;
  padding: 0;
  height: 50px;
  width: 100vw;
  border-bottom: 1px solid rgba(119, 136, 153, 0.2);
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    width: 200px;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: OpenSans-Semibold;
    font-size: 16px;
    color: red;
  }
}
</style>
