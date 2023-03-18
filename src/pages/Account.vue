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
          <a-input v-model:value="payload.search" placeholder="Tên hoặc số điện thoại" />
        </a-col>
        <a-col :span="6">
          <a-select v-model:value="payload.status" allow-clear placeholder="Trạng thái hoạt động" style="width: 100%">
            <a-select-option :value="Constants.STATUS.ACTIVE">Đang hoạt động</a-select-option>
            <a-select-option :value="Constants.STATUS.INACTIVE">Ngưng hoạt động</a-select-option>
          </a-select>
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
          <a-card :bordered="false">
            <template #actions>
              <a-button
                v-if="record.status === Constants.STATUS.INACTIVE"
                :loading="loadingStatus"
                class="btn-status-active"
                type="text"
                @click="onChangeStatus(record.id, Constants.STATUS.ACTIVE)"
              >
                <template #icon>
                  <i class="fad fa-toggle-on"></i>
                </template>
                Hoạt động
              </a-button>
              <a-button
                v-if="record.status === Constants.STATUS.ACTIVE"
                :loading="loadingStatus"
                class="btn-status-inactive"
                type="text"
                @click="onChangeStatus(record.id, Constants.STATUS.INACTIVE)"
              >
                <template #icon>
                  <i class="fal fa-toggle-off"></i>
                </template>
                Ngưng hoạt động
              </a-button>

              <a-button
                :loading="loadingResetPassword"
                class="btn-reset-pass"
                type="text"
                @click="onResetPassword(record.id, record.phone)"
              >
                <template #icon>
                  <i class="far fa-sync-alt"></i>
                </template>
                Reset mật khẩu
              </a-button>

              <a-button class="btn-edit" type="text" @click="onUpdateUser(record)">
                <template #icon>
                  <i class="fal fa-edit"></i>
                </template>
                Chỉnh sửa
              </a-button>

              <a-button :loading="loadingDelete" class="btn-delete" type="text" @click="onDeleteUser(record.id)">
                <template #icon>
                  <i class="fal fa-trash-alt"></i>
                </template>
                Xóa
              </a-button>
            </template>
          </a-card>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { Constants } from "@/commons";
import type { IAccount, IBasePayload, IColumn, IDataEventPagination } from "@/commons/Interfaces";
import CUModalUser from "@/components/user/CUModalUser.vue";
import { useChangeStatus, useListUser, useResetPassword } from "@/services";
import StatusTag from "@/components/StatusTag.vue";
import RoleTag from "@/components/RoleTag.vue";
import { debounce } from "lodash";
import { useDelete } from "@/services/UseDelete";
import Utils from "@/commons/Utils";

interface IPayload extends IBasePayload {
  role?: number;
}

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Họ tên", dataIndex: "name", key: "name", fixed: true },
  { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Loại tài khoản", dataIndex: "role", width: 200, key: "role" },
  { title: "Trạng thái", dataIndex: "status", width: 200, key: "status" },
];

export default defineComponent({
  computed: {
    Utils() {
      return Utils;
    },
  },
  components: { RoleTag, StatusTag, CUModalUser },
  setup() {
    const popupRef = ref<{
      onOpenModal: (type: "add" | "update", data?: IAccount) => any;
    }>();
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
      const result = await changeStatus("/users/", id, status);

      if (result) {
        loadDataTable();
      }
    };

    const onResetPassword = (id: number, password: string) => {
      resetPassword(id, password);
    };

    const onDeleteUser = async (id: number) => {
      const result = await deleteRecord(`/users/${id}`, "Xóa tài khoản thành công");

      if (result) {
        loadDataTable();
      }
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

      const debouncedLoadDataTable = debounce(() => {
        loadDataTable();
      }, 500);

      watch(
        () => payload.search,
        async () => {
          debouncedLoadDataTable();
        }
      );

      watch(
        () => [payload.page, payload.role, payload.status],
        async () => {
          loadDataTable();
        }
      );
    });

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

<style lang="scss">
.account-page {
  .ant-btn-text {
    span {
      font-family: OpenSans-Semibold !important;
    }
  }

  .btn-status-active {
    span {
      color: #1890ffff;
    }

    i {
      font-size: 18px;
      color: #1890ffff;

      transform: translateY(2px);
      margin-right: 4px;
    }
  }

  .btn-status-inactive {
    span {
      color: gray;
    }

    i {
      font-size: 18px;
      color: gray;

      transform: translateY(2px);
      margin-right: 4px;
    }
  }

  .btn-edit {
    span {
      color: orange;
    }

    i {
      color: orange;
      margin-right: 4px;
    }
  }

  .btn-delete {
    span {
      color: red;
    }

    i {
      color: red;
      margin-right: 4px;
    }
  }

  .btn-reset-pass {
    span {
      color: gray;
    }

    i {
      color: gray;
      margin-right: 4px;
    }
  }

  .ant-card-actions {
    border: 1px solid rgba(128, 128, 128, 0.2);
    border-radius: 3px;
  }
}
</style>
