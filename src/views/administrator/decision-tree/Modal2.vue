<template>
  <Modal
    modal_id="modal-training"
    title="Latih Model"
    modalClass="modal-lg"
  >
    <div class="modal-body">
      <div class="mb-3">
        <label for="prodi_id" class="form-label">PILIH PROGRAM STUDI</label>
        <select
          id="prodi_id"
          v-model="prodi_id"
          class="form-select"
        >
          <option value="0">PILIH PROGRAM STUDI</option>
          <option v-for="p in props.prodis" :key="p.id" :value="p.id">
            {{ `${p.id} - ${p.nama}` }}
          </option>
        </select>
      </div>
    </div>
    <div class="modal-footer d-flex justify-content-between">
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        aria-label="Close"
      >
        <i class="bx bx-x"></i> <span>Tutup</span>
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="tryModel"
        data-bs-dismiss="modal"
        aria-label="Close"
      >
        <i class="bx bx-send"></i> Simpan
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue3-toastify";
import useAPI from "../../../composables/api";
import Modal from "../../../components/Modal.vue";

type Prodi = {
  id: string;
  nama: string;
};
const props = defineProps({
  prodis: {
    type: Array as () => Prodi[],
    default: () => [],
  },
});

const prodi_id = ref<number>(0);

const { postResource } = useAPI();

const tryModel = async () => {
  if (prodi_id.value === 0) {
    toast.error("PILIH PROGRAM STUDI terlebih dahulu");
    return;
  }
  const response = await postResource(
    "/train",
    {
      prodi: prodi_id.value,
    },
    true
  );
  if (response?.data) {
    toast.success("Model berhasil dilatih");
  }
};
</script>
