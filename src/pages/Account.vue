<template>
  <div class="account-page">
    <a-page-header title="Tài khoản">
      <template #extra>
        <a-button type="primary" @click="onAddUser">Thêm mới</a-button>
      </template>

      <CUModalUser ref="popupRef" @onSubmitSuccess="loadDataTable" />
    </a-page-header>

    <div class="search-box">
      <a-row>
        <a-col :span="6">
          <InputSearch placeholder="Tên hoặc số điện thoại" @onChange="(value) => (payload.search = value)" />
        </a-col>
        <a-col :span="6">
          <StatusSelect v-model="payload.status" placeholder="Trạng thái hoạt động" />
        </a-col>
        <a-col :span="6">
          <a-select v-model:value="payload.role" allow-clear placeholder="Loại tài khoản" style="width: 100%">
            <a-select-option :value="Constants.ROLE.EMPLOYEE">Nhân viên</a-select-option>
            <a-select-option :value="Constants.ROLE.ADMIN">Quản trị</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <div class="total-row">Kết quả lọc {{ total }}</div>
        </a-col>
      </a-row>
    </div>

    <div class="table-box">
      <a-table
        :columns="columns"
        :data-source="dataTable"
        :loading="loading"
        :pagination="Utils.getConfigPagination(payload.page, total)"
        :scroll="{ x: 700 }"
        bordered
        @change="onPaginationChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <StatusTag :status="record.status" />
          </template>

          <template v-if="column.key === 'role'">
            <RoleTag :role="record.role" />
          </template>
        </template>

        <template #expandedRowRender="{ record }">
          <ListBtnAction
            :idActive="idRecordActive"
            :loadingChangeStatus="loadingStatus"
            :loadingDelete="loadingDelete"
            :loadingResetPassword="loadingResetPassword"
            :record="record"
            @onChangeStatus="
              onChangeStatus(record.id, record.status ? Constants.STATUS.INACTIVE : Constants.STATUS.ACTIVE)
            "
            @onDelete="onDeleteUser(record.id)"
            @onEdit="onUpdateUser(record)"
            @onResetPassword="onResetPassword(record.id, record.phone)"
          />
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { Constants } from "@/commons";
import type { IAccount, IBasePayload, IColumn, IDataEventPagination } from "@/commons/interface";
import CUModalUser from "@/components/user/CUModalUser.vue";
import { useChangeStatus, useListUser, useResetPassword } from "@/services";
import StatusTag from "@/components/base/StatusTag.vue";
import RoleTag from "@/components/base/RoleTag.vue";
import { useDelete } from "@/services/UseDelete";
import Utils from "@/commons/Utils";
import InputSearch from "@/components/base/InputSearch.vue";
import StatusSelect from "@/components/base/StatusSelect.vue";
import ListBtnAction from "@/components/base/ListBtnAction.vue";

interface IPayload extends IBasePayload {
  role?: number;
}

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Họ tên", dataIndex: "name", key: "name", fixed: true, width: 200 },
  { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 150, fixed: true },
  { title: "Email", dataIndex: "email", key: "email", width: 250 },
  { title: "Loại tài khoản", dataIndex: "role", width: 200, key: "role" },
  { title: "Trạng thái", dataIndex: "status", width: 200, key: "status" },
];

export default defineComponent({
  computed: {
    Utils() {
      return Utils;
    },
  },
  components: { ListBtnAction, StatusSelect, InputSearch, RoleTag, StatusTag, CUModalUser },
  setup() {
    const popupRef = ref<{ onOpenModal: (type: "add" | "update", data?: IAccount) => any }>();
    const dataTable = ref<IAccount[]>([]);
    const payload = reactive<IPayload>({
      page: Constants.PAYLOAD.PAGE,
      limit: Constants.PAYLOAD.LIMIT,
      search: undefined,
      status: undefined,
      role: undefined,
    });

    const { loading, total, getListUser } = useListUser();
    const { loadingStatus, changeStatus } = useChangeStatus();
    const { loadingResetPassword, resetPassword } = useResetPassword();
    const { loadingDelete, deleteRecord } = useDelete();
    const idRecordActive = ref<number>();

    const openCUModalUser = (type: "add" | "update", data?: IAccount) => {
      popupRef.value?.onOpenModal(type, data);
    };

    const loadDataTable = async () => {
      const listUser = await getListUser(payload, payload.page);
      if (listUser) {
        dataTable.value = listUser.data;
      }
    };

    const onChangeStatus = async (id: number, status: 0 | 1) => {
      idRecordActive.value = id;
      await changeStatus("/users/", id, status);
      await loadDataTable();
    };

    const onResetPassword = (id: number, password: string) => {
      idRecordActive.value = id;
      resetPassword(id, password);
    };

    const onDeleteUser = async (id: number) => {
      idRecordActive.value = id;
      await deleteRecord(`/users/${id}`, "Xóa tài khoản thành công");
      await loadDataTable();
    };

    const onUpdateUser = (data: IAccount) => {
      openCUModalUser("update", data);
    };

    const onAddUser = () => {
      openCUModalUser("add");
    };

    const onPaginationChange = (data: IDataEventPagination) => {
      payload.page = data.current;
    };

    onMounted(() => {
      loadDataTable();
    });

    watch(
      () => payload,
      async () => {
        loadDataTable();
      },
      { deep: true }
    );

    return {
      Constants,
      dataTable,
      columns,
      popupRef,
      loading,
      total,
      payload,
      loadingStatus,
      loadingResetPassword,
      loadingDelete,
      idRecordActive,
      onAddUser,
      onUpdateUser,
      onDeleteUser,
      onResetPassword,
      onChangeStatus,
      openCUModalUser,
      loadDataTable,
      onPaginationChange,
    };
  },
});
</script>

<style lang="scss"></style>
