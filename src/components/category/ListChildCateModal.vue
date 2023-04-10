<template>
  <a-modal
    v-model:visible="visible"
    :destroy-on-close="true"
    style="position: absolute; top: 20px; right: 10px; left: 10px; width: 95vw"
    title="Danh sách danh mục con"
    @ok="closeModal"
  >
    <a-page-header>
      <template #title>
        <div style="font-family: OpenSans-Semibold; font-size: 16px">
          Danh mục cha:
          <span style="font-family: OpenSans-Semibold; color: red">{{ parentNameCate }}</span>
        </div>
      </template>
      <template #extra>
        <a-button type="primary" @click="onShowModalCU('add')">Thêm mới</a-button>
      </template>

      <CUCategory ref="formRef" :parentCategoryId="payload.parentId" @onSubmitSuccess="onCreateSuccess" />
    </a-page-header>

    <div class="search-box">
      <a-row>
        <a-col :span="6">
          <a-input :value(v-model)="payload.search" placeholder="Nhập tên danh mục" @change="onInputSearchChange" />
        </a-col>
        <a-col :span="6">
          <a-select v-model:value="payload.status" allow-clear placeholder="Trạng thái hoạt động" style="width: 100%">
            <a-select-option :value="Constants.STATUS.ACTIVE">Đang hoạt động</a-select-option>
            <a-select-option :value="Constants.STATUS.INACTIVE">Ngưng hoạt động</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-range-picker :format="[`DD/MM/YYYY`, `DD/MM/YYYY`]" @change="onFilterTime" />
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
        size="small"
        @change="handlePaginationChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <StatusTag :status="record.status" />
          </template>

          <template v-if="column.key === 'numberCateChild'">
            <div style="font-family: OpenSans-Semibold; color: #2148c0; cursor: pointer">
              {{ record.numberCateChild }}
            </div>
          </template>

          <template v-if="column.key === 'imageUrl'">
            <a-image :src="record.imageUrl" alt="image-category" style="height: 80px" />
          </template>
        </template>

        <template #expandedRowRender="{ record }">
          <ListBtnAction
            :loadingActive="loadingStatus"
            :loadingDelete="loadingDelete"
            :record="record"
            @onChangeStatus="onChangeStatusCategory"
            @onDelete="onDeleteCategory(record.id)"
            @onEdit="onShowModalCU('update', record)"
          />
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Constants } from "@/commons";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import type { IBasePayload, IColumn, IDataEventPagination, IItemTableCategory } from "@/commons/interface";
import CUCategory from "@/components/category/CUCategory.vue";
import StatusTag from "@/components/base/StatusTag.vue";
import { debounce } from "lodash";
import dayjs from "dayjs";
import ListBtnAction from "@/components/base/ListBtnAction.vue";
import { useChangeStatus, useListChildCategory } from "@/services";
import { useDelete } from "@/services/UseDelete";
import Utils from "@/commons/Utils";
import useModal from "@/services/Modal";

export interface IPayload extends IBasePayload {
  startDate: string | undefined;
  endDate: string | undefined;
  parentId: number | undefined;
}

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Hình ảnh", dataIndex: "imageUrl", key: "imageUrl", fixed: true, width: 200 },
  { title: "Tên danh mục", dataIndex: "name", key: "name", width: 200, fixed: true },
  { title: "Trạng thái", dataIndex: "status", key: "status", width: 200 },
  { title: "Thứ tự hiển thị", dataIndex: "order", key: "order", width: 150 },
  { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", width: 200 },
];

export default defineComponent({
  components: { ListBtnAction, StatusTag, CUCategory },
  computed: {
    Utils() {
      return Utils;
    },
    Constants() {
      return Constants;
    },
  },
  emits: ["createChildCateSuccess"],
  setup(props, context) {
    const formRef = ref();
    const dataTable = ref<IItemTableCategory[]>([]);
    const payload = reactive<IPayload>({
      search: undefined,
      page: Constants.PAYLOAD.PAGE,
      status: undefined,
      endDate: undefined,
      startDate: undefined,
      parentId: undefined,
    });
    const parentNameCate = ref<string>();

    const { loading, total, getListCategory } = useListChildCategory();
    const { loadingDelete, deleteRecord } = useDelete();
    const { loadingStatus, changeStatus } = useChangeStatus();

    const { visible, showModal, closeModal } = useModal();

    const onShowModal = (_parentNameCate: string, parentId: number) => {
      parentNameCate.value = _parentNameCate;
      payload.parentId = parentId;
      showModal();
    };

    const onShowModalCU = (type: "add" | "update", data?: IItemTableCategory) => {
      formRef.value?.onOpenModal(type, data);
    };

    const loadTable = async () => {
      const result = await getListCategory(payload);

      if (result) {
        dataTable.value = result;
      }
    };

    const onFilterTime = (dates: [any, any]) => {
      if (dates) {
        payload.startDate = dayjs(dates[0]).toISOString();
        payload.endDate = dayjs(dates[1]).toISOString();
      } else {
        payload.startDate = undefined;
        payload.endDate = undefined;
      }
    };

    const onChangeStatusCategory = async (data: { id: number; status: 0 | 1 }) => {
      await changeStatus("/category/child-cate/", data.id, data.status);
      loadTable();
    };

    const onDeleteCategory = async (id: number) => {
      await deleteRecord(`/category/child-cate/${id}`, "Xóa danh mục thành công");
      loadTable();
    };

    const handlePaginationChange = (data: IDataEventPagination) => {
      payload.page = data.current;
    };

    const debouncedTextChange = debounce((e: any) => {
      payload.search = e.target.value;
    }, 500);

    const onInputSearchChange = (e: any) => {
      debouncedTextChange(e);
    };

    const onCreateSuccess = () => {
      loadTable();
      context.emit("createChildCateSuccess");
    };

    onMounted(() => {
      if (payload.parentId) {
        loadTable();
      }
    });

    watch(
      payload,
      () => {
        loadTable();
      },
      { deep: true }
    );

    return {
      columns,
      dataTable,
      formRef,
      loading,
      payload,
      total,
      loadingDelete,
      loadingStatus,
      visible,
      parentNameCate,
      onCreateSuccess,
      showModal,
      closeModal,
      loadTable,
      onShowModalCU,
      onFilterTime,
      onDeleteCategory,
      onChangeStatusCategory,
      handlePaginationChange,
      onInputSearchChange,
      onShowModal,
    };
  },
});
</script>
