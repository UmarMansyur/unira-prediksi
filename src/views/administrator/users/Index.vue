<script setup lang="ts">
import Parent from "../../layouts/Home.vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import usePagination from "../../../composables/pagination";
import DeleteButton from "../../../components/DeleteButton.vue";
import { ref } from "vue";
import DataTable from "../../../components/DataTable.vue";
import Modal from "./Modal.vue";
import UpdatePassword from "./UpdatePassword.vue";
const user = ref<any>({});
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
} = usePagination(["user"], "/user");

const setDataset = (item: any) => {
  user.value = item;
};

const clearDataset = () => {
  user.value = {};
};

</script>

<template>
  <Parent>
    <Modal :props-data="user" @refresh-value="clearDataset" :id="user?.id?.toString()"/>
    <UpdatePassword :id="user?.id?.toString()" :username="user?.username" />
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
        // username, password, email, gender, dob, address
        { key: 'thumbnail', label: 'Foto', sort: 'thumbnail' },
        { key: 'name', label: 'Username', sort: 'nama' },
        { key: 'email', label: 'Email', sort: 'email' },
        { key: 'gender', label: 'Jenis Kelamin', sort: 'gender' },
        { key: 'dob', label: 'Tanggal Lahir', sort: 'dob' },
        { key: 'address', label: 'Alamat', sort: 'address' },
        { key: 'action', label: 'Aksi', sort: '', className: 'text-center' },
      ]"
      :is-loading="isLoading"
      :sort="sortBy"
      :set-sort="setSorting"
    >
      <tr v-for="(item, index) in data" :key="index">
        <td>
          <img :src="item.thumbnail" alt="Foto" class="img-thumbnail" style="width: 50px; height: 50px;">
        </td>
        <td>{{ item.username }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.gender === 'L' ? 'Laki-Laki' : 'Perempuan' }}</td>
        <td>{{ new Date(item.dob).toLocaleDateString() }}</td>
        <td>{{ item.address }}</td>
        <td class="text-center gap-2">
          <button
            type="button"
            class="btn btn-white p-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-user"
            @click="setDataset(item)"
          >
            <i class="ti ti-edit fs-16"></i>
          </button>
          <button
            type="button"
            class="btn btn-white p-2"
            data-bs-toggle="modal"
            data-bs-target="#update-password"
            @click="setDataset(item)"
          >
            <i class="ti ti-key fs-16"></i>
          </button>

          <DeleteButton
            :endpoint="`/user/${item.id}`"
            queryKey="user"
          ></DeleteButton>
        </td>
      </tr>
      <template #button>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-user">
            <i class="ti ti-plus me-2"></i> Tambah Pengguna
          </button>
        </div>
      </template>
    </DataTable>
  </Parent>
</template>

<style scoped lang="css"></style>
