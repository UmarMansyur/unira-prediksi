<script setup lang="ts">
import Parent from "../../layouts/Home.vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import usePagination from "../../../composables/pagination";
import DataTable from "../../../components/DataTable.vue";
import { sessionStore } from "../../../stores";
const session = sessionStore();
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
} = usePagination(
  ["bimbingan"],
  "/bimbingan/predict?dosenWali=" + session?.user?.id
);
</script>

<template>
  <Parent>
    <BreadCrumb title="Data Bimbingan" subtitle="Dosen" />
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
        { key: 'mahasiswa', label: 'Mahasiswa', sort: '' },
        { key: 'usia', label: 'Usia', sort: '' },
        { key: 'jenis_kelamin', label: 'Jenis Kelamin', sort: '' },
        { key: 'ips1', label: 'IPS 1', sort: '' },
        { key: 'ips2', label: 'IPS 2', sort: '' },
        { key: 'ips3', label: 'IPS 3', sort: '' },
        { key: 'ips4', label: 'IPS 4', sort: '' },
        { key: 'sks1', label: 'SKS 1', sort: '' },
        { key: 'sks2', label: 'SKS 2', sort: '' },
        { key: 'sks3', label: 'SKS 3', sort: '' },
        { key: 'sks4', label: 'SKS 4', sort: '' },
        { key: 'tren_ips', label: 'Tren IPS', sort: '' },
        { key: 'tren_ips', label: 'Prediksi', sort: '' },
        { key: 'tren_ips', label: 'Status', sort: '' },
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
                :src="
                  item.thumbnail
                    ? 'https://api.unira.ac.id/' + item.thumbnail
                    : '/images/avatar.png'
                "
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
        <td>
          <span>{{ item.usia }}</span>
        </td>
        <td>
          <span>{{ item.jenisKelamin === 1 ? "Laki-laki" : "Perempuan" }}</span>
        </td>
        <td>{{ item.IPS1 }}</td>
        <td>{{ item.IPS2 }}</td>
        <td>{{ item.IPS3 }}</td>
        <td>{{ item.IPS4 }}</td>
        <td>{{ item.SKS1 }}</td>
        <td>{{ item.SKS2 }}</td>
        <td>{{ item.SKS3 }}</td>
        <td>{{ item.SKS4 }}</td>
        <td v-if="(Number(item.IPS5) !== 0)">{{ item.tren_ips_aktual }} ({{ item.IPS5 }})</td>
        <td v-else>{{ item.tren_ips_aktual }}</td>
        <td>{{ item.tren_ips }}</td>
        <td v-if="item.tren_ips !== 'Data IPS belum lengkap'">
          <span
            :class="{
              'text-success': item.predict === item.tren_ips_aktual,
              'text-danger': item.predict !== item.tren_ips_aktual,
            }"
          >
            {{ item.predict === item.tren_ips_aktual ? "TP" : "FP" }}
          </span>
        </td>
        <td v-else>
          <span class="text-dark">Belum Ada Prediksi</span>
        </td>
      </tr>
    </DataTable>
  </Parent>
</template>

<style scoped lang="css"></style>
