<script setup lang="ts">
import BreadCrumb from "../../../components/BreadCrumb.vue";
import useAPI from "../../../composables/api";
import Home from "../../layouts/Home.vue";
import { onMounted, ref } from "vue";
import Modal2 from "./Modal2.vue";
import { hideLoader, showLoader } from "../../../helpers/event";

const { getResource } = useAPI();

const datas = ref<any[]>([]);
const loadData = async () => {
  showLoader();
  let url = `/decision-tree?limit=1&page=${page.value}`;
  if(selectedProdi.value) {
    url += `&prodi=${selectedProdi.value}`;
  }
  const response = await getResource(url, true);
  hideLoader();
  if (response?.data) {
    datas.value = response.data?.data;
    totalPage.value = response.data?.total_page;
  } else {
    console.error("Failed to load decision tree data");
  }
};

const prodi = ref<any[]>([]);
const selectedProdi = ref<number>(0);
const loadProdi = async () => {
  const response = await getResource("/prodi", true);
  if (response?.data) {
    prodi.value = response.data;
  } else {
    console.error("Failed to load prodi data");
  }
};
const page = ref(1);
const totalPage = ref(0);


const nextPage = () => {
  if (page.value < totalPage.value) {
    page.value++;
    loadData();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    loadData();
  }
};

onMounted(async () => {
  await Promise.all([loadProdi(), loadData()]);
});
</script>

<template>
  <Home>
    <BreadCrumb title="Pohon Keputusan" subtitle="Dashboard" />
    <Modal2 :prodis="prodi" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header border-bottom card-tabs d-flex flex-wrap align-items-center gap-2"
          >
            <div
              class="flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <h4 class="header-title">Pohon Keputusan</h4>
              <select class="form-select form-select-sm" style="width: 200px" v-model="selectedProdi" @change="loadData">
                <option value="0">Semua Prodi</option>
                <option v-for="p in prodi" :key="p.id" :value="p.id">
                  {{ `${p.id} - ${p.nama}` }}
                </option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div v-for="data in datas" :key="data.id" class="mb-4">
              <h1 class="fs-4">Pohon Keputusan : {{ data.estimator }} <br> Prodi: 
                <span style="text-transform: capitalize;">
                  {{ prodi.find(p => p.id == data.prodi)?.nama || 'Tidak Diketahui' }}
                </span>
              </h1>
              <img :src="data.image" class="decision-tree"></img>
            </div>
            <div v-if="datas.length === 0" class="text-center">
              <img src="/assets/images/math.svg" alt="No Data" class="img-fluid mb-3" style="max-width: 300px;">
              <p class="text-muted">Tidak ada data pohon keputusan yang tersedia.</p>
              <button class="btn btn-primary" @click="loadData" type="button" data-bs-toggle="modal" data-bs-target="#modal-training">
                <i class="ti ti-refresh"></i> Latih Model
              </button>

            </div>
            <div class="d-flex justify-content-between">
              <button
                class="btn btn-primary"
                :disabled="page === 1"
                @click="prevPage"
              >
                Sebelumnya
              </button>
              <button
                class="btn btn-primary"
                :disabled="page === totalPage"
                @click="nextPage"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<style scoped lang="css">
.decision-tree {
  max-width: 100%;
  height: auto;
}
</style>
