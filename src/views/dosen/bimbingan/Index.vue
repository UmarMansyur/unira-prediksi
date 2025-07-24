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
} = usePagination(["bimbingan"], "/bimbingan?dosenWali=" + session?.user?.id);


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
        { key: 'name', label: 'Mahasiswa', sort: '' },
        { key: 'jenis_kelamin', label: 'Jenis Kelamin', sort: '' },
        { key: 'peminatan', label: 'Peminatan', sort: '' },
        { key: 'alamat', label: 'Alamat', sort: '' },
      //  nim
      //     thumbnail
      //     nama
      //     alamat
      //     kotaSekarang
      //     nomorKontak
      //     kelas
      //     peminatan {
      //       id
      //       nama
      //     }
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
                :src="item.thumbnail ? ('https://api.unira.ac.id/' + item.thumbnail) : '/images/avatar.png'"
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
          <span>{{
            item.jenisKelamin === 1 ? "Laki-laki" : "Perempuan"
          }}</span>
        </td>
        <td>{{ !item.peminatan?.nama ? "-" : item.peminatan?.nama }}</td>
        <td>{{ item.alamat }}</td>
      </tr>
    </DataTable>
  </Parent>
</template>

<style scoped lang="css"></style>
