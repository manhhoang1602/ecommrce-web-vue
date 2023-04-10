<template>
  <div class="voucher-page">
    <a-page-header title="Voucher">
      <template #extra>
        <a-button type="primary" @click="openCUModalVoucher('add')">Thêm mới</a-button>
      </template>
      <CUVoucher ref="popupRef" @onSubmitSuccess="loadDataTable" />
    </a-page-header>

    <div class="search-box">
      <a-row>
        <a-col :span="6">
          <InputSearch placeholder="Mã voucher" @onChange="(value) => (payload.search = value)" />
        </a-col>
        <a-col :span="6">
          <StatusSelect v-model="payload.status" placeholder="Trạng thái hoạt động" />
        </a-col>
        <a-col :span="8"></a-col>
        <a-col :span="4">
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
          <template v-if="column.key === 'code'">
            <span style="font-family: OpenSans-Semibold; color: #2148c0">{{ record.code }}</span>
          </template>
          <template v-if="column.key === 'total'">
            <span>{{ record.total === null ? "Không giới hạn" : Utils.formatNumber(record.total || 0) }}</span>
          </template>
          <template v-if="column.key === 'minPriceApply'">
            <span>{{ Utils.formatNumber(record.minPriceApply) }} đ</span>
          </template>
          <template v-if="column.key === 'maxValue'">
            <span style="color: #ff253a">{{ Utils.formatNumber(record.maxValue) }} đ</span>
          </template>
          <template v-if="column.key === 'value'">
            <span>{{ Utils.formatNumber(record.value) }} %</span>
          </template>
          <template v-if="column.key === 'createdAt'">
            <span>{{ moment(record.createdAt).format("DD/MM/YYYY") }}</span>
          </template>
        </template>

        <template #expandedRowRender="{ record }">
          <ListBtnAction
            :idActive="idRecordActive"
            :loadingActive="loadingStatus"
            :loadingDelete="loadingDelete"
            :record="record"
            @onChangeStatus="onChangeStatus(record.id, record.status ? 0 : 1)"
            @onDelete="onDeleteVoucher(record.id)"
            @onEdit="onUpdateVoucher(record)"
          />
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { Constants } from "@/commons";
import type { IBasePayload, IColumn, IDataEventPagination, IResVoucher } from "@/commons/interface";
import { useChangeStatus, useListVoucher } from "@/services";
import StatusTag from "@/components/base/StatusTag.vue";
import { useDelete } from "@/services/UseDelete";
import Utils from "@/commons/Utils";
import InputSearch from "@/components/base/InputSearch.vue";
import StatusSelect from "@/components/base/StatusSelect.vue";
import CUVoucher from "@/components/voucher/CUVoucher.vue";
import moment from "moment";
import ListBtnAction from "@/components/base/ListBtnAction.vue";

interface IPayload extends IBasePayload {
  role?: number;
}

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Mã voucher", dataIndex: "code", key: "code", fixed: true, width: 120 },
  { title: "Mô tả", dataIndex: "description", key: "description", fixed: true },
  { title: "Số lượng voucher", dataIndex: "total", key: "total", width: 120 },
  { title: "Điều kiện áp dụng", dataIndex: "minPriceApply", key: "minPriceApply", width: 120 },
  { title: "Giá trị tối đa", dataIndex: "maxValue", key: "maxValue", width: 120 },
  { title: "Giá trị", dataIndex: "value", width: 150, key: "value" },
  { title: "Trạng thái", dataIndex: "status", width: 180, key: "status" },
  { title: "Ngày tạo", dataIndex: "createdAt", width: 180, key: "createdAt" },
];

export default defineComponent({
  computed: {
    moment() {
      return moment;
    },
    Utils() {
      return Utils;
    },
  },
  components: { ListBtnAction, CUVoucher, StatusSelect, InputSearch, StatusTag },
  setup() {
    const popupRef = ref<{
      onOpenModal: (type: "add" | "update", data?: IResVoucher) => any;
    }>();
    const dataTable = ref<IResVoucher[]>([]);
    const payload = reactive<IPayload>({
      page: Constants.PAYLOAD.PAGE,
      limit: Constants.PAYLOAD.LIMIT,
      search: undefined,
      status: undefined,
    });

    const { loadingStatus, changeStatus } = useChangeStatus();
    const { loadingDelete, deleteRecord } = useDelete();
    const { loading, total, getListVoucher } = useListVoucher();
    const idRecordActive = ref<number>();
    const openCUModalVoucher = (type: "add" | "update", data?: IResVoucher) => {
      popupRef.value?.onOpenModal(type, data);
    };

    const loadDataTable = async () => {
      const listVoucher = await getListVoucher(payload, payload.page);
      if (listVoucher) {
        dataTable.value = listVoucher.data;
      }
    };

    const onChangeStatus = async (id: number, status: 0 | 1) => {
      idRecordActive.value = id;
      await changeStatus("/voucher/", id, status);
      await loadDataTable();
    };

    const onDeleteVoucher = async (id: number) => {
      idRecordActive.value = id;
      await deleteRecord(`/voucher/${id}`, "Xóa voucher thành công");
      await loadDataTable();
    };

    const onUpdateVoucher = (data: IResVoucher) => {
      openCUModalVoucher("update", data);
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
      payload,
      loadingStatus,
      loadingDelete,
      loading,
      total,
      idRecordActive,
      openCUModalVoucher,
      onDeleteVoucher,
      onUpdateVoucher,
      onChangeStatus,
      loadDataTable,
      onPaginationChange,
    };
  },
});
</script>

<style lang="scss"></style>
