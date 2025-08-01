<script setup lang="ts">
declare const Chart: any;
import { ref, onMounted } from 'vue';
import BreadCrumb from "../../../components/BreadCrumb.vue";
import { sessionStore } from "../../../stores";
import Home from "../../layouts/Home.vue";
import useAPI from '../../../composables/api';

const session = sessionStore();
const dashboardData = ref<any>(null);
const loading = ref<any>(true);
const error = ref<any>(null);
const { baseURL } = useAPI();
// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    loading.value = true;

    const response = await fetch(`${baseURL}/dashboard`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    const result = await response.json();
    if (result.success) {
      dashboardData.value = result.data;
    } else {
      throw new Error('API returned error');
    }
  } catch (err: any) {
    error.value = err.message;
    console.error('Error fetching dashboard data:', err);
  } finally {
    loading.value = false;
  }
};

// Chart configurations
const createChartConfig = (type: string, data: any, options: any = {}) => {
  return {
    type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      ...options
    }
  };
};

// Initialize charts after data is loaded
let charts: any = {};

const initializeCharts = () => {
  if (!dashboardData.value) return;

  // Tren IPS Chart
  const trenIPSChart = createChartConfig('doughnut', {
    labels: dashboardData.value.distributions.trenIPS.map((item: any) => item.tren_ips),
    datasets: [{
      data: dashboardData.value.distributions.trenIPS.map((item: any) => item._count.tren_ips),
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  });

  // Gender Distribution Chart
  const genderChart = createChartConfig('pie', {
    labels: ['Laki-laki', 'Perempuan'],
    datasets: [{
      data: dashboardData.value.distributions.gender.map((item: any) => item._count.jenis_kelamin),
      backgroundColor: ['#007bff', '#e83e8c'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  });

  // Prodi Distribution Chart
  const prodiChart = createChartConfig('bar', {
    labels: dashboardData.value.distributions.prodi.map((item: any) => `Prodi ${item.prodi}`),
    datasets: [{
      label: 'Jumlah Mahasiswa',
      data: dashboardData.value.distributions.prodi.map((item: any) => item._count.prodi),
      backgroundColor: '#17a2b8',
      borderColor: '#138496',
      borderWidth: 1
    }]
  }, {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    }
  });

  // Performance Metrics Chart
  const performanceChart = createChartConfig('line', {
    labels: dashboardData.value.performance.latestEvaluations.map((_: any, index: number) => `Eval ${index + 1}`),
    datasets: [
      {
        label: 'Accuracy',
        data: dashboardData.value.performance.latestEvaluations.map((item: any) => item.accuracy),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true
      },
      {
        label: 'Precision',
        data: dashboardData.value.performance.latestEvaluations.map((item: any) => item.precision),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true
      },
      {
        label: 'Recall',
        data: dashboardData.value.performance.latestEvaluations.map((item: any) => item.recall),
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        fill: true
      },
      {
        label: 'F1 Score',
        data: dashboardData.value.performance.latestEvaluations.map((item: any) => item.f1_score),
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: true
      }
    ]
  }, {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  });

  // Store chart configs
  charts = {
    trenIPS: trenIPSChart,
    gender: genderChart,
    prodi: prodiChart,
    performance: performanceChart
  };

  // Initialize Chart.js charts
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      Object.keys(charts).forEach(chartKey => {
        const canvas = document.getElementById(`${chartKey}Chart`);
        if (canvas) {
          new Chart(canvas, charts[chartKey]);
        }
      });
    } 
  }, 100);
};

onMounted(() => {
  fetchDashboardData().then(() => {
    if (dashboardData.value) {
      initializeCharts();
    }
  });
});
</script>

<template>
  <Home>
    <BreadCrumb title="Dashboard" subtitle="Administrator" />
    
    <!-- User Info Card -->
    <div class="card mb-4">
      <div class="card-body">
        <span class="badge bg-primary mb-0 rounded-pill">AKTIF</span>
        <h1 class="fs-4 mb-0">{{ session?.user?.role === 'Administrator' ? 'Administrator' : session.user?.id }}</h1>
        <p class="fw-bold fs-3 mb-0">{{ session?.user?.username }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Memuat data dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Error!</h4>
      <p>{{ error }}</p>
      <button @click="fetchDashboardData" class="btn btn-outline-danger">Coba Lagi</button>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardData">
      <!-- Overview Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Total Mahasiswa</h6>
                  <h2 class="mb-0">{{ dashboardData.overview.totalMahasiswa.toLocaleString() }}</h2>
                </div>
                <i class="fas fa-users fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Total Dataset</h6>
                  <h2 class="mb-0">{{ dashboardData.overview.totalDataset }}</h2>
                </div>
                <i class="fas fa-database fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Total Prediksi</h6>
                  <h2 class="mb-0">{{ dashboardData.overview.totalPredictions }}</h2>
                </div>
                <i class="fas fa-chart-line fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Total Users</h6>
                  <h2 class="mb-0">{{ dashboardData.overview.totalUsers }}</h2>
                </div>
                <i class="fas fa-user-cog fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Performa Model</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 text-center">
                  <h6>Rata-rata Akurasi</h6>
                  <h3 class="text-primary">{{ dashboardData.performance.avgAccuracy }}%</h3>
                </div>
                <div class="col-md-3 text-center">
                  <h6>Akurasi Maksimal</h6>
                  <h3 class="text-success">{{ dashboardData.performance.maxAccuracy }}%</h3>
                </div>
                <div class="col-md-3 text-center">
                  <h6>Akurasi Minimal</h6>
                  <h3 class="text-warning">{{ dashboardData.performance.minAccuracy }}%</h3>
                </div>
                <div class="col-md-3 text-center">
                  <h6>Total Evaluasi</h6>
                  <h3 class="text-info">{{ dashboardData.performance.latestEvaluations.length }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Distribusi Tren IPS</h5>
            </div>
            <div class="card-body">
              <div style="height: 300px;">
                <canvas id="trenIPSChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Distribusi Gender</h5>
            </div>
            <div class="card-body">
              <div style="height: 300px;">
                <canvas id="genderChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Distribusi Program Studi</h5>
            </div>
            <div class="card-body">
              <div style="height: 400px;">
                <canvas id="prodiChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Chart -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Metrik Performa Model</h5>
            </div>
            <div class="card-body">
              <div style="height: 400px;">
                <canvas id="performanceChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Evaluations Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Evaluasi Terbaru</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Precision</th>
                      <th>Recall</th>
                      <th>Accuracy</th>
                      <th>F1 Score</th>
                      <th>Estimator</th>
                      <th>Prodi</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ev in dashboardData.performance.latestEvaluations" :key="ev.id">
                      <td>{{ ev.precision }}%</td>
                      <td>{{ ev.recall }}%</td>
                      <td>
                        <span class="badge" :class="{
                          'bg-success': ev.accuracy >= 60,
                          'bg-warning': ev.accuracy >= 50 && ev.accuracy < 60,
                          'bg-danger': ev.accuracy < 50
                        }">
                          {{ ev.accuracy }}%
                        </span>
                      </td>
                      <td>{{ ev.f1_score }}%</td>
                      <td>{{ ev.estimator }}</td>
                      <td>{{ ev.prodi }}</td>
                      <td>{{ new Date(ev.createdAt).toLocaleString('id-ID') }} WIB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<style scoped>


.opacity-75 {
  opacity: 0.75;
}


</style>