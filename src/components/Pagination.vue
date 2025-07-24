<template>
  <div
    class="card-footer border-top-0 d-flex justify-content-between align-items-center flex-wrap row-gap-3"
  >
    <div>
      <p>
        Menampilkan {{ startData }} sampai {{ endData }} dari
        {{ totalData }} data
      </p>
    </div>
    <div>
      <nav aria-label="Page navigation" class="pagination-style-1">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <a
              class="page-link text-dark"
              href="javascript:void(0);"
              aria-label="Previous"
              @click="handlePrevPage"
            >
              <i class="bx bx-chevron-left align-middle"></i>
            </a>
          </li>
          <li class="page-item">
            <input
              type="text"
              class="paginate-form text-center text-dark"
              placeholder="..."
              aria-label="Page number"
              :value="page"
              @input="handlePageInput($event)"
              @keydown.enter="handlePageSubmit"
              @blur="handlePageSubmit"
            />
          </li>
          <li class="page-item" :class="{ disabled: page === totalPage }">
            <a
              class="page-link text-dark"
              href="javascript:void(0);"
              aria-label="Next"
              @click="handleNextPage"
            >
              <i class="bx bx-chevron-right align-middle"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  totalPage: {
    type: Number,
    default: 1,
  },
  startData: {
    type: Number,
    default: 0,
  },
  endData: {
    type: Number,
    default: 0,
  },
  totalData: {
    type: Number,
    default: 0,
  },
  nextPage: {
    type: Function,
    required: true,
  },
  prevPage: {
    type: Function,
    required: true,
  },
  setPage: {
    type: Function,
    required: true,
  },
});

const currentInputPage = ref(props.page);

const handlePrevPage = () => {
  if (props.page > 1) {
    props.prevPage();
  }
};

const handleNextPage = () => {
  if (props.page < props.totalPage) {
    props.nextPage();
  }
};

const handlePageInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/[^0-9]/g, "");
  target.value = value;
  currentInputPage.value = value ? parseInt(value) : 1;
};

const handlePageSubmit = () => {
  let newPage = currentInputPage.value;

  // Validasi halaman
  if (!newPage || newPage < 1) {
    newPage = 1;
  } else if (newPage > props.totalPage) {
    newPage = props.totalPage;
  }

  if (props.setPage && newPage !== props.page) {
    props.setPage(newPage);
  }
};
</script>

<style scoped lang="css">
.paginate-form {
  width: 40px;
  height: 35.6px;
  border-radius: 0 !important;
  border-right: 0 !important;
  border-left: 0 !important;
  border-top: 1px solid #dee2e6 !important;
  border-bottom: 1px solid #dee2e6 !important;
}
.paginate-form::focus {
  box-shadow: none !important;
  border-color: #dee2e6 !important;
}

.paginate-form::active {
  box-shadow: none !important;
  border-color: #dee2e6 !important;
}


</style>
