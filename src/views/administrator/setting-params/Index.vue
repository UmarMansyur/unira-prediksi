<script setup lang="ts">
import BreadCrumb from "../../../components/BreadCrumb.vue";
import Home from "../../layouts/Home.vue";
</script>

<template>
  <Home>
    <BreadCrumb title="Setting Parameter" subtitle="Dashboard" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header border-bottom card-tabs d-flex flex-wrap align-items-center gap-2"
          >
            <div class="flex-grow-1">
              <h4 class="header-title">
                Setting Parameter
              </h4>
            </div>

            <div class="d-flex flex-wrap flex-lg-nowrap gap-2">
              <div class="flex-shrink-0 d-flex align-items-center gap-2">
                <div class="position-relative">
                  <input
                    type="text"
                    class="form-control ps-4"
                    placeholder="Search Here..."
                  />
                  <i
                    class="ti ti-search position-absolute top-50 translate-middle-y start-0 ms-2"
                  ></i>
                </div>
              </div>
              <a href="apps-invoice-create.html" class="btn btn-primary"
                ><i class="ti ti-plus me-1"></i>Import Dataset Mahasiswa</a
              >
            </div>
            <!-- end d-flex -->
          </div>

          <div class="table-responsive">
            <table class="table table-hover text-nowrap mb-0">
              <thead class="bg-light-subtle">
                <tr>
                  <th class="fs-12 text-uppercase text-muted text-center">No.</th>
                  <th class="fs-12 text-uppercase text-muted">Jumlah Estimator</th>
                  <!-- random forest -->
                  <th class="fs-12 text-uppercase text-muted">Max Depth</th>
                  <th class="fs-12 text-uppercase text-muted">Min Samples Split</th>
                  <th class="fs-12 text-uppercase text-muted">Min Samples Leaf</th>
                  <th
                    class="text-center fs-12 text-uppercase text-muted"
                    style="width: 120px"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <!-- end table-head -->

              <tbody>
                <tr>
                  <td class="text-center">1</td>
                  <td>100</td>
                  <td>10</td>
                  <td>2</td>
                  <td>1</td>
                  <td class="text-center">
                    <button type="button" class="btn btn-sm px-2 py-1 btn-primary mx-2"
                      ><i class="ti ti-pencil"></i></button
                    >
                    <button type="button" class="btn btn-sm px-2 py-1 btn-danger"
                      ><i class="ti ti-trash"></i></button
                    >
                  </td>
                </tr>
              </tbody>
              <!-- end table-body -->
            </table>
            <!-- end table -->
          </div>

          <div class="card-footer">
            <div class="d-flex justify-content-end">
              <ul class="pagination mb-0 justify-content-center">
                <li class="page-item disabled">
                  <a href="#" class="page-link"
                    ><i class="ti ti-chevrons-left"></i
                  ></a>
                </li>
                <li class="page-item">
                  <a href="#" class="page-link">1</a>
                </li>
                <li class="page-item active">
                  <a href="#" class="page-link">2</a>
                </li>
                <li class="page-item">
                  <a href="#" class="page-link">3</a>
                </li>
                <li class="page-item">
                  <a href="#" class="page-link"
                    ><i class="ti ti-chevrons-right"></i
                  ></a>
                </li>
              </ul>
              <!-- end pagination -->
            </div>
            <!-- end flex -->
          </div>
        </div>
        <!-- end card-->
      </div>
      <!-- end col -->
    </div>
  </Home>
</template>
