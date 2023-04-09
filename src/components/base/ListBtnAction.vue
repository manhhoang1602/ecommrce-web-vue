<template>
  <a-card :bordered="false" class="list-btn-action">
    <template #actions>
      <a-button
        v-if="record.status === Constants.STATUS.INACTIVE"
        :loading="loadingChangeStatus && idActive === record.id"
        class="btn-status-active"
        type="text"
        @click="onChangeStatus(Constants.STATUS.ACTIVE)"
      >
        <template #icon>
          <i class="fad fa-toggle-on"></i>
        </template>
        Hoạt động
      </a-button>
      <a-button
        v-if="record.status === Constants.STATUS.ACTIVE"
        :loading="loadingChangeStatus && idActive === record.id"
        class="btn-status-inactive"
        type="text"
        @click="onChangeStatus(Constants.STATUS.INACTIVE)"
      >
        <template #icon>
          <i class="fal fa-toggle-off"></i>
        </template>
        Ngưng hoạt động
      </a-button>

      <a-button
        v-if="loadingResetPassword !== undefined"
        :loading="loadingResetPassword && idActive === record.id"
        class="btn-reset-pass"
        type="text"
        @click="onResetPassword"
      >
        <template #icon>
          <i class="far fa-sync-alt"></i>
        </template>
        Reset mật khẩu
      </a-button>

      <a-button class="btn-edit" type="text" @click="onEdit">
        <template #icon>
          <i class="fal fa-edit"></i>
        </template>
        Chỉnh sửa
      </a-button>

      <a-popconfirm cancel-text="Hủy" ok-text="Xác nhận" title="Bạn có chắc muốn xóa?" @confirm="onDelete">
        <a-button :loading="loadingDelete && idActive === record.id" class="btn-delete" type="text">
          <template #icon>
            <i class="fal fa-trash-alt"></i>
          </template>
          Xóa
        </a-button>
      </a-popconfirm>
    </template>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Constants } from "@/commons";

export default defineComponent({
  computed: {
    Constants() {
      return Constants;
    },
  },
  props: ["record", "loadingChangeStatus", "loadingDelete", "idActive", "loadingResetPassword"],
  emits: ["changeStatusSuccess", "deleteSuccess", "onChangeStatus", "onEdit", "onDelete", "onResetPassword"],
  setup(props, context) {
    const onDelete = () => {
      context.emit("onDelete");
    };

    const onChangeStatus = (status: number) => {
      context.emit("onChangeStatus", { id: props.record.id, status: status });
    };

    const onEdit = () => {
      context.emit("onEdit");
    };

    const onResetPassword = () => {
      context.emit("onResetPassword");
    };

    return {
      props,
      onResetPassword,
      onDelete,
      onChangeStatus,
      onEdit,
    };
  },
});
</script>

<style lang="scss">
.list-btn-action {
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

  .ant-card-actions {
    border: 1px solid rgba(128, 128, 128, 0.2);
    border-radius: 3px;
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
}
</style>
