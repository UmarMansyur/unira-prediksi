<script setup lang="ts">
import Parent from "../../../layouts/Home.vue";
import BreadCrumb from "../../../../components/BreadCrumb.vue";
import usePagination from "../../../../composables/pagination";
import DataTable from "../../../../components/DataTable.vue";
import useAPI from "../../../../composables/api";
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";
import Modal from "../Modal.vue";
import DeleteButton from "../../../../components/DeleteButton.vue";

const {
  data,
  meta,
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
} = usePagination(["predict"], "/predict?type=TEST2");

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
const targetLabel = ref("NAIK"); // atau STABIL/TURUN, bisa dibuat dropdown

const getStatus = (item: any) => {
  const actual = item.tren_ips;
  const pred = item.tren_ips_pred;
  const target = targetLabel.value;

  if (actual === target && pred === target) return "TP";
  if (actual !== target && pred === target) return "FP";
  if (actual === target && pred !== target) return "FN";
  if (actual !== target && pred !== target) return "TN";
  return "-";
};

// Computed properties for performance metrics
const performanceMetrics = computed(() => {
  return meta.value || {
    TP: 0,
    TN: 0,
    FP: 0,
    FN: 0,
    precision: 0,
    recall: 0,
    f1_score: 0,
    accuracy: 0
  };
});

</script>

<template>
  <Parent>
    <BreadCrumb title="Data Test" subtitle="Administrator" />
    <Modal/>
    
    <!-- Performance Metrics Cards -->
    <div class="row row-cols-xxl-4 row-cols-md-2 row-cols-1 mb-4">
      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="True Positive">True Positive (TP)</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-success rounded-circle fs-22">
                  <i class="bx bx-check-circle"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.TP }}</h3>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-success me-2">Correct Positive Predictions</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="True Negative">True Negative (TN)</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                  <i class="bx bx-shield"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.TN }}</h3>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-primary me-2">Correct Negative Predictions</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="False Positive">False Positive (FP)</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-danger rounded-circle fs-22">
                  <i class="bx bx-error-circle"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.FP }}</h3>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-danger me-2">Incorrect Positive Predictions</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="False Negative">False Negative (FN)</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-warning rounded-circle fs-22">
                  <i class="bx bx-minus-circle"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.FN }}</h3>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-warning me-2">Missed Positive Cases</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics Cards Row 2 -->
    <div class="row row-cols-xxl-4 row-cols-md-2 row-cols-1 mb-4">
      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="Precision">Precision</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-info rounded-circle fs-22">
                  <i class="bx bx-check"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.precision }}%</h3>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-info me-2">Positive Prediction Accuracy</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="Recall">Recall (Sensitivity)</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-secondary rounded-circle fs-22">
                  <i class="bx bx-search"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.recall }}%</h3>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-secondary me-2">True Positive Detection Rate</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="F1 Score">F1 Score</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-dark rounded-circle fs-22">
                  <i class="bx bx-calculator"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.f1_score }}%</h3>
              <i class="bi bi-bar-chart ms-auto display-1 position-absolute opacity-25 text-muted"></i>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-dark me-2">Harmonic Mean of Precision & Recall</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card overflow-hidden">
          <div class="card-body">
            <h5 class="text-muted fs-13 text-uppercase" title="Accuracy">Overall Accuracy</h5>
            <div class="d-flex align-items-center gap-2 my-2 py-1">
              <div class="user-img fs-42 flex-shrink-0">
                <span class="avatar-title text-bg-success rounded-circle fs-22">
                  <i class="bx bx-award"></i>
                </span>
              </div>
              <h3 class="mb-0 fw-bold">{{ performanceMetrics.accuracy }}%</h3>
            </div>
            <p class="mb-0 text-muted">
              <span class="text-success me-2">Total Correct Predictions</span>
            </p>
          </div>
        </div>
      </div>
    </div>

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
        { key: 'aksi', label: 'Aksi', sort: '' },
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
        <td>{{ item.jenis_kelamin === '1' ? 'L' : 'P' }}</td>
        <td>{{ item.ips1 }}</td>
        <td>{{ item.ips2 }}</td>
        <td>{{ item.ips3 }}</td>
        <td>{{ item.ips4 }}</td>
        <td>{{ item.sks1 }}</td>
        <td>{{ item.sks2 }}</td>
        <td>{{ item.sks3 }}</td>
        <td>{{ item.sks4 }}</td>
        <td>{{ item.tren_ips ? item.tren_ips : 'Data Baru' }}</td>
        <td>{{ item.tren_ips_pred }}</td>
        <!-- banding kan untuk dapat TN, TP, FN, FP -->
        <td>
          <span
            :class="{
              'badge bg-success': getStatus(item) === 'TP',
              'badge bg-danger': getStatus(item) === 'FP',
              'badge bg-primary': getStatus(item) === 'TN',
              'badge bg-warning text-dark': getStatus(item) === 'FN',
            }"
            v-if="item.tren_ips"
          >
            {{ getStatus(item) }}
          </span>
          <span v-else class="badge bg-secondary">-</span>
        </td>
        <td>
           <DeleteButton
            :endpoint="`/predict/${item.id}`"
            queryKey="predict"
          ></DeleteButton>
        </td>
      </tr>
      <template #button>
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
      <template #button2>
        <div class="row">
          <div class="col-md-12 mb-3 d-flex justify-content-between">
            <button type="button" class="btn btn-light" @click="$router.back()">
              <i class="bx bx-arrow-back"></i>
              Kembali
            </button>
            <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modal-prediksi">
              <i class="bi bi-arrow-clockwise"></i> Tambah Hasil Prediksi Manual
            </button>
          </div>
        </div>
      </template>
    </DataTable>
  </Parent>
</template>