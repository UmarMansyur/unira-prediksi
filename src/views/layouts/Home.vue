<script setup lang="ts">
import Header from "../layouts/Header.vue";
import Sidebar from "../layouts/Sidebar.vue";
import TopBar from "../layouts/TopBar.vue";
</script>

<template>
  <div class="wrapper">
    <!-- Sidenav Menu Start -->
    <div class="sidenav-menu">
      <TopBar />
      <Sidebar />
    </div>
    <!-- Sidenav Menu End -->

    <!-- Topbar Start -->
    <Header />
    <!-- Topbar End -->

    <!-- Search Modal -->
    <div
      class="modal fade"
      id="searchModal"
      tabindex="-1"
      aria-labelledby="searchModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-transparent">
          <form>
            <div class="card mb-1">
              <div
                class="px-3 py-2 d-flex flex-row align-items-center"
                id="top-search"
              >
                <i class="ti ti-search fs-22"></i>
                <input
                  type="search"
                  class="form-control border-0"
                  id="search-modal-input"
                  placeholder="Search for actions, people,"
                />
                <button
                  type="submit"
                  class="btn p-0"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  [esc]
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->
    <div class="page-content">
      <slot></slot>
      <!-- container -->
      <!-- Footer Start -->
      <footer class="footer">
        <div class="page-container">
          <div class="row">
            <div class="col-md-6 text-center text-md-start">
              © 2025 - Khana Zulfana Imam
            </div>
          </div>
        </div>
      </footer>
      <!-- end Footer -->
    </div>
    <!-- ============================================================== -->
    <!-- End Page content -->
    <!-- ============================================================== -->
  </div>
</template>
