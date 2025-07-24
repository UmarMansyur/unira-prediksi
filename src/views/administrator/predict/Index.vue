<script setup lang="ts">
import Parent from "../../layouts/Home.vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import usePagination from "../../../composables/pagination";
import DataTable from "../../../components/DataTable.vue";
import useAPI from "../../../composables/api";
import { ref } from "vue";
import { toast } from "vue3-toastify";
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
} = usePagination(["predict"], "/predict");

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

const selectedProdi = ref<string>("");
const setProdi = (prodiId: string) => {
  selectedProdi.value = prodiId;
  setFilter("prodi=" + prodiId);
};

loadProdi();
</script>

<template>
  <Parent>
    <BreadCrumb title="Data Test" subtitle="Administrator" />
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
        { key: 'mahasiswa', label: 'Mahasiswa', sort: 'nim' },
        { key: 'usia', label: 'Usia', sort: 'usia' },
        { key: 'jenis_kelamin', label: 'Jenis Kelamin', sort: 'jenis_kelamin' },
        { key: 'ips1', label: 'IPS 1', sort: 'ips1' },
        { key: 'ips2', label: 'IPS 2', sort: 'ips2' },
        { key: 'ips3', label: 'IPS 3', sort: 'ips3' },
        { key: 'ips4', label: 'IPS 4', sort: 'ips4' },
        { key: 'sks1', label: 'SKS 1', sort: 'sks1' },
        { key: 'sks2', label: 'SKS 2', sort: 'sks2' },
        { key: 'sks3', label: 'SKS 3', sort: 'sks3' },
        { key: 'sks4', label: 'SKS 4', sort: 'sks4' },
        { key: 'tren_ips', label: 'Tren IPS', sort: 'tren_ips' },
        { key: 'tren_ips', label: 'Tren IPS Prediksi', sort: 'tren_ips_pred' },
        { key: 'status', label: 'Status', sort: 'status' },
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
              <span>{{ item.nim }}</span>
            </div>
          </div>
        </td>
        <td>{{ item.usia }}</td>
        <td>{{ item.jenis_kelamin }}</td>
        <td>{{ item.ips1 }}</td>
        <td>{{ item.ips2 }}</td>
        <td>{{ item.ips3 }}</td>
        <td>{{ item.ips4 }}</td>
        <td>{{ item.sks1 }}</td>
        <td>{{ item.sks2 }}</td>
        <td>{{ item.sks3 }}</td>
        <td>{{ item.sks4 }}</td>
        <td>{{ item.tren_ips }}</td>
        <td>{{ item.tren_ips_pred }}</td>
        <!-- banding kan untuk dapat TN, TP, FN, FP -->
        <td>
          <span
            :class="
              item.tren_ips_pred === item.tren_ips
                ? 'badge bg-success'
                : 'badge bg-danger'
            "
          >
            {{ item.tren_ips_pred === item.tren_ips ? "TP" : "FP" }}
          </span>
        </td>
      </tr>
      <template #button>
        <!-- select prodi -->
        <select
          class="form-select"
          v-model="selectedProdi"
          @change="setProdi(selectedProdi)"
        >
          <option value="">PILIH PROGRAM STUDI</option>
          <option v-for="item in prodi" :key="item.id" :value="item.id">
            {{ `${item.id} - (${item.nama})` }}
          </option>
        </select>
      </template>
    </DataTable>
  </Parent>
</template>

<style scoped lang="css"></style>
