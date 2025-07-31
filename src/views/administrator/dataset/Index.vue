<script setup lang="ts">
import Parent from "../../layouts/Home.vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import usePagination from "../../../composables/pagination";
import DeleteButton from "../../../components/DeleteButton.vue";
import { onMounted, ref } from "vue";
import DataTable from "../../../components/DataTable.vue";
import useAPI from "../../../composables/api";
import { toast } from "vue3-toastify";
import Modal from "./Modal.vue";
import Modal2 from "./Modal2.vue";
import { QueryClient } from "@tanstack/vue-query";
const dataset = ref<any>({});
const {
  data,
  setSearch,
  search,
  setPage,
  page,
  totalPage,
  nextPage,
  prevPage,
  startData,
  endData,
  totalData,
  setLimit,
  limit,
  isLoading,
  setSorting,
  sortBy,
  setFilter,
} = usePagination(["dataset"], "/dataset");

const setDataset = (item: any) => {
  dataset.value = item;
};

const clearDataset = () => {
  dataset.value = {};
};

const { postResource } = useAPI();

const importDatasetClick = () => {
  const fileInput = document.getElementById("file-upload") as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
};

const queryClient = new QueryClient();

const importDataset = async (event: any) => {
  const file = event.target.files[0];
  if (file) {
    const response = await postResource(
      "/dataset/import",
      { file },
      true,
      true
    );
    if (response?.data) {
      clearDataset();
      // Optionally, you can refresh the data table or show a success message
      toast.success("Dataset imported successfully!");
    } else {
      toast.error("Failed to import dataset: " + response.message);
    }
  }
  queryClient.invalidateQueries({ queryKey: ["dataset"] });
};
const { getResource } = useAPI();
const prodi = ref<any[]>([]);
const loadProdi = async () => {
  const response = await getResource("/prodi");
  if (response?.data) {
    prodi.value = response.data;
  } else {
    toast.error("Failed to load prodi data: " + response.message);
  }
};

const changeProdi = (event: any) => {
  const prodiId = event.target.value;
  if (prodiId) {
    console.log("Selected Prodi ID:", prodiId);
    setFilter("prodi=" + prodiId);
  }
};

onMounted(() => {
  loadProdi();
});
</script>

<template>
  <Parent>
    <Modal
      :props-data="dataset"
      @refresh-value="clearDataset"
      :id="dataset?.id?.toString()"
    />
    <Modal2 :prodis="prodi" />
    <BreadCrumb title="Dashboard" subtitle="Administrator" />
    <DataTable
      :data="data"
      :setSearch="setSearch"
      :search="search"
      :setPage="setPage"
      :page="page"
      :totalPage="totalPage"
      :nextPage="nextPage"
      :prevPage="prevPage"
      :startData="startData"
      :endData="endData"
      :totalData="totalData"
      :setLimit="setLimit"
      :limit="limit"
      :columns="[
        { key: 'name', label: 'Mahasiswa', sort: 'nama' },
        { key: 'Jenis Kelamin', label: 'Jenis Kelamin', sort: 'jenis_kelamin' },
        { key: 'usia', label: 'Usia', sort: 'usia' },
        { key: 'ips1', label: 'IPS 1', sort: 'ips1' },
        { key: 'ips2', label: 'IPS 2', sort: 'ips2' },
        { key: 'ips3', label: 'IPS 3', sort: 'ips3' },
        { key: 'ips4', label: 'IPS 4', sort: 'ips4' },
        { key: 'ips5', label: 'IPS 5', sort: 'ips5' },
        { key: 'sks1', label: 'SKS 1', sort: 'sks1' },
        { key: 'sks2', label: 'SKS 2', sort: 'sks2' },
        { key: 'sks3', label: 'SKS 3', sort: 'sks3' },
        { key: 'sks4', label: 'SKS 4', sort: 'sks4' },
        { key: 'sks5', label: 'SKS 5', sort: 'sks5' },
        { key: 'tren_ips', label: 'Tren IPS', sort: 'tren_ips' },
        // aksi
        { key: 'action', label: 'Aksi', sort: '', className: 'text-center' },
      ]"
      :is-loading="isLoading"
      :sort="sortBy"
      :set-sort="setSorting"
    >
      <tr v-for="(item, index) in data" :key="index">
        <td>
          <div class="d-flex align-items-center gap-2">
            <div>
              <img
                :src="item.thumbnail ? item.thumbnail : '/images/avatar.png'"
                class="avatar avatar-md rounded-circle border"
                alt="Avatar"
              />
            </div>
            <div>
              <h5 class="mb-0">{{ item.nama }}</h5>
              <span>{{ item.NIM }}</span>
            </div>
          </div>
        </td>
        <td>
          <span>{{
            item.jenis_kelamin === 1 ? "Laki-laki" : "Perempuan"
          }}</span>
        </td>
        <td>
          <span>{{ item.usia ? item.usia + " Tahun" : "-" }}</span>
        </td>
        <td>{{ item.ips1 ? item.ips1 : "-" }}</td>
        <td>{{ item.ips2 ? item.ips2 : "-" }}</td>
        <td>{{ item.ips3 ? item.ips3 : "-" }}</td>
        <td>{{ item.ips4 ? item.ips4 : "-" }}</td>
        <td>{{ item.ips5 ? item.ips5 : "-" }}</td>
        <td>{{ item.sks1 ? item.sks1 : "-" }}</td>
        <td>{{ item.sks2 ? item.sks2 : "-" }}</td>
        <td>{{ item.sks3 ? item.sks3 : "-" }}</td>
        <td>{{ item.sks4 ? item.sks4 : "-" }}</td>
        <td>{{ item.sks5 ? item.sks5 : "-" }}</td>
        <td class="table-warning">
          <span>{{ item.tren_ips ? item.tren_ips : "-" }}</span>
        </td>
        <td class="text-center gap-2">
          <button
            type="button"coba
            class="btn btn-white p-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-dataset"
            @click="setDataset(item)"
          >
            <i class="ti ti-edit fs-16"></i>
          </button>
          <DeleteButton
            :endpoint="`/dataset/${item.id}`"
            queryKey="dataset"
          ></DeleteButton>
        </td>
      </tr>
      <template #button>
        <div class="d-flex justify-content-end gap-2">
          <div>
            <select class="form-select" @change="changeProdi">
              <option value="">PILIH PROGRAM STUDI</option>
              <option v-for="p in prodi" :key="p.id" :value="p.id">
                {{ `${p.id} - ${p.nama}` }}
              </option>
            </select>
          </div>
          <a
            href="/assets/akm_processed.csv"
            type="button"
            class="btn btn-success"
            target="_blank"
          >
            <i class="ti ti-download me-1"></i>
            Download Template
          </a>
          <button
            type="button"
            class="btn btn-primary"
            @click="importDatasetClick"
          >
            <i class="ti ti-file-import me-1"></i>
            Import Dataset
          </button>
          <button
            type="button"
            class="btn btn-info"
            data-bs-toggle="modal"
            data-bs-target="#modal-training"
          >
            <i class="ti ti-refresh me-1"></i>
            Training Model
          </button>
          <input
            type="file"
            id="file-upload"
            class="d-none"
            @change="importDataset"
          />
        </div>
      </template>
    </DataTable>
  </Parent>
</template>

<style scoped lang="css"></style>
