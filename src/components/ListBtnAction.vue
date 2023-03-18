<template>
  <a-card :bordered="false" class="list-btn-action">
    <template #actions>
      <a-button
        v-if="record.status === Constants.STATUS.INACTIVE"
        :loading="loadingChangeStatus"
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
        :loading="loadingChangeStatus"
        class="btn-status-inactive"
        type="text"
        @click="onChangeStatus(Constants.STATUS.INACTIVE)"
      >
        <template #icon>
          <i class="fal fa-toggle-off"></i>
        </template>
        Ngưng hoạt động
      </a-button>

      <a-button class="btn-edit" type="text" @click="onEdit">
        <template #icon>
          <i class="fal fa-edit"></i>
        </template>
        Chỉnh sửa
      </a-button>

      <a-button :loading="loadingDelete" class="btn-delete" type="text" @click="onDelete">
        <template #icon>
          <i class="fal fa-trash-alt"></i>
        </template>
        Xóa
      </a-button>
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
  props: ["record", "loadingChangeStatus", "loadingDelete"],
  emits: ["changeStatusSuccess", "deleteSuccess", "onChangeStatus", "onEdit", "onDelete"],
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

    return {
      props,
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
}
</style>
