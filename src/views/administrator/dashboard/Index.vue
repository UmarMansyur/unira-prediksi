<script setup lang="ts">
import { ref, onMounted } from "vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import { sessionStore } from "../../../stores";
import Home from "../../layouts/Home.vue";
import useAPI from "../../../composables/api";

// Import ApexCharts
import VueApexCharts from "vue3-apexcharts";

const session = sessionStore();
const dashboardData = ref<any>(null);
const loading = ref<any>(true);
const error = ref<any>(null);
const { baseURL } = useAPI();

// Chart options and series
const chartOptions = ref<any>({});
const chartSeries = ref<any>({});

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    loading.value = true;

    const response = await fetch(`${baseURL}/dashboard`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }
    const result = await response.json();
    if (result.success) {
      dashboardData.value = result.data;
    } else {
      throw new Error("API returned error");
    }
  } catch (err: any) {
    error.value = err.message;
    console.error("Error fetching dashboard data:", err);
  } finally {
    loading.value = false;
  }
};

// Initialize charts after data is loaded
const initializeCharts = () => {
  if (!dashboardData.value) return;

  // Tren IPS Chart (Donut)
  chartSeries.value.trenIPS = dashboardData.value.distributions.trenIPS.map(
    (item: any) => item._count.tren_ips
  );
  chartOptions.value.trenIPS = {
    chart: {
      type: 'donut',
      height: 300
    },
    labels: dashboardData.value.distributions.trenIPS.map(
      (item: any) => item.tren_ips
    ),
    colors: ['#28a745', '#ffc107', '#dc3545'],
    dataLabels: {
      enabled: true,
      formatter: function (_val: number, opts: any) {
        return opts.w.globals.series[opts.seriesIndex];
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              }
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom'
    }
  };

  // Gender Distribution Chart (Pie)
  chartSeries.value.gender = dashboardData.value.distributions.gender.map(
    (item: any) => item._count.jenis_kelamin
  );
  chartOptions.value.gender = {
    chart: {
      type: 'pie',
      height: 300
    },
    labels: ['Laki-laki', 'Perempuan'],
    colors: ['#007bff', '#e83e8c'],
    dataLabels: {
      enabled: true,
      formatter: function (_val: number, opts: any) {
        return opts.w.globals.series[opts.seriesIndex];
      }
    },
    legend: {
      position: 'bottom'
    }
  };

  // Prodi Distribution Chart (Horizontal Bar)
  chartSeries.value.prodi = [{
    name: 'Jumlah Mahasiswa',
    data: dashboardData.value.distributions.prodi.map(
      (item: any) => item._count.prodi
    )
  }];
  chartOptions.value.prodi = {
    chart: {
      type: 'bar',
      height: 400
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'center'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val;
      },
      style: {
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: dashboardData.value.distributions.prodi.map(
        (item: any) => `Prodi ${item.prodi}`
      )
    },
    colors: ['#17a2b8']
  };

  // Performance Metrics Chart (Line)
  chartSeries.value.performance = [
    {
      name: 'Accuracy',
      data: dashboardData.value.performance.latestEvaluations.map(
        (item: any) => item.accuracy
      )
    },
    {
      name: 'Precision',
      data: dashboardData.value.performance.latestEvaluations.map(
        (item: any) => item.precision
      )
    },
    {
      name: 'Recall',
      data: dashboardData.value.performance.latestEvaluations.map(
        (item: any) => item.recall
      )
    },
    {
      name: 'F1 Score',
      data: dashboardData.value.performance.latestEvaluations.map(
        (item: any) => item.f1_score
      )
    }
  ];
  chartOptions.value.performance = {
    chart: {
      type: 'line',
      height: 400
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 2,
        padding: 4,
        opacity: 0.9
      }
    },
    xaxis: {
      categories: dashboardData.value.performance.latestEvaluations.map(
        (_: any, index: number) => `Eval ${index + 1}`
      )
    },
    yaxis: {
      min: 0,
      max: 100
    },
    colors: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
    legend: {
      position: 'bottom'
    }
  };

  // Data Latih Distribution Chart (Stacked Bar)
  const latihLabels = Object.keys(dashboardData.value.distributions.latih);
  chartSeries.value.dataLatih = [
    {
      name: 'NAIK',
      data: latihLabels.map(prodi => 
        dashboardData.value.distributions.latih[prodi]?.NAIK || 0
      )
    },
    {
      name: 'STABIL',
      data: latihLabels.map(prodi => 
        dashboardData.value.distributions.latih[prodi]?.STABIL || 0
      )
    },
    {
      name: 'TURUN',
      data: latihLabels.map(prodi => 
        dashboardData.value.distributions.latih[prodi]?.TURUN || 0
      )
    }
  ];
  chartOptions.value.dataLatih = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val > 0 ? val : '';
      },
      style: {
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: latihLabels.map(prodi => `Prodi ${prodi}`)
    },
    yaxis: {
      min: 0
    },
    colors: ['#28a745', '#ffc107', '#dc3545'],
    legend: {
      position: 'bottom'
    }
  };

  // Data Test Distribution Chart (Stacked Bar)
  const testLabels = Object.keys(dashboardData.value.distributions.test);
  chartSeries.value.dataTest = [
    {
      name: 'NAIK',
      data: testLabels.map(prodi => 
        dashboardData.value.distributions.test[prodi]?.NAIK || 0
      )
    },
    {
      name: 'STABIL',
      data: testLabels.map(prodi => 
        dashboardData.value.distributions.test[prodi]?.STABIL || 0
      )
    },
    {
      name: 'TURUN',
      data: testLabels.map(prodi => 
        dashboardData.value.distributions.test[prodi]?.TURUN || 0
      )
    }
  ];
  chartOptions.value.dataTest = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val > 0 ? val : '';
      },
      style: {
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: testLabels.map(prodi => `Prodi ${prodi}`)
    },
    yaxis: {
      min: 0
    },
    colors: ['#28a745', '#ffc107', '#dc3545'],
    legend: {
      position: 'bottom'
    }
  };
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
        <h1 class="fs-4 mb-0">
          {{
            session?.user?.role === "Administrator"
              ? "Administrator"
              : session.user?.id
          }}
        </h1>
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
      <button @click="fetchDashboardData" class="btn btn-outline-danger">
        Coba Lagi
      </button>
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
                  <h2 class="mb-0">
                    {{ dashboardData.overview.totalMahasiswa.toLocaleString() }}
                  </h2>
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
                  <h2 class="mb-0">
                    {{ dashboardData.overview.totalDataset }}
                  </h2>
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
                  <h2 class="mb-0">
                    {{ dashboardData.overview.totalPredictions }}
                  </h2>
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
                  <h3 class="text-primary">
                    {{ dashboardData.performance.avgAccuracy }}%
                  </h3>
                </div>
                <div class="col-md-3 text-center">
                  <h6>Akurasi Maksimal</h6>
                  <h3 class="text-success">
                    {{ dashboardData.performance.maxAccuracy }}%
                  </h3>
                </div>
                <div class="col-md-3 text-center">
                  <h6>Akurasi Minimal</h6>
                  <h3 class="text-warning">
                    {{ dashboardData.performance.minAccuracy }}%
                  </h3>
                </div>
                <div class="col-md-3 text-center">
                  <h6>Total Evaluasi</h6>
                  <h3 class="text-info">
                    {{ dashboardData.performance.latestEvaluations.length }}
                  </h3>
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
              <VueApexCharts
                v-if="chartSeries.trenIPS && chartOptions.trenIPS"
                type="donut"
                height="300"
                :options="chartOptions.trenIPS"
                :series="chartSeries.trenIPS"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Distribusi Gender</h5>
            </div>
            <div class="card-body">
              <VueApexCharts
                v-if="chartSeries.gender && chartOptions.gender"
                type="pie"
                height="300"
                :options="chartOptions.gender"
                :series="chartSeries.gender"
              />
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
              <VueApexCharts
                v-if="chartSeries.prodi && chartOptions.prodi"
                type="bar"
                height="400"
                :options="chartOptions.prodi"
                :series="chartSeries.prodi"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Data Distribution Charts -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Distribusi Data Latih</h5>
              <small class="text-muted"
                >Sebaran tren IPS per program studi pada data training</small
              >
            </div>
            <div class="card-body">
              <VueApexCharts
                v-if="chartSeries.dataLatih && chartOptions.dataLatih"
                type="bar"
                height="350"
                :options="chartOptions.dataLatih"
                :series="chartSeries.dataLatih"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Distribusi Data Test</h5>
              <small class="text-muted"
                >Sebaran tren IPS per program studi pada data testing</small
              >
            </div>
            <div class="card-body">
              <VueApexCharts
                v-if="chartSeries.dataTest && chartOptions.dataTest"
                type="bar"
                height="350"
                :options="chartOptions.dataTest"
                :series="chartSeries.dataTest"
              />
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
              <VueApexCharts
                v-if="chartSeries.performance && chartOptions.performance"
                type="line"
                height="400"
                :options="chartOptions.performance"
                :series="chartSeries.performance"
              />
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
                    <tr
                      v-for="ev in dashboardData.performance.latestEvaluations"
                      :key="ev.id"
                    >
                      <td>{{ ev.precision }}%</td>
                      <td>{{ ev.recall }}%</td>
                      <td>
                        <span
                          class="badge"
                          :class="{
                            'bg-success': ev.accuracy >= 60,
                            'bg-warning': ev.accuracy >= 50 && ev.accuracy < 60,
                            'bg-danger': ev.accuracy < 50,
                          }"
                        >
                          {{ ev.accuracy }}%
                        </span>
                      </td>
                      <td>{{ ev.f1_score }}%</td>
                      <td>{{ ev.estimator }}</td>
                      <td>{{ ev.prodi }}</td>
                      <td>
                        {{ new Date(ev.createdAt).toLocaleString("id-ID") }} WIB
                      </td>
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