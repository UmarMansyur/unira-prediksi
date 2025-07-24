<template>
  <Modal
    modal_id="modal-dataset"
    :title="props.id ? 'Ubah Dataset' : 'Tambah Dataset'"
    modalClass="modal-lg"
  >
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12" v-if="nama">
          <div class="mb-3">
            <div class="justify-content-center d-flex">
              <img
                :src="thumbnail ? thumbnail : '/images/avatar.png'"
                class="avatar avatar-xl rounded-circle border"
                alt="Avatar"
                v-if="thumbnail"
              />
            </div>
            <h4 class="text-center">
              {{  nama ? nama : 'Tambah Dataset' }}
            </h4>
          </div>
        </div>
        <div class="col-md-12">
          <div class="mb-3">
            <label for="dataset" class="form-label">NIM: </label>
            <input
              type="text"
              class="form-control"
              id="dataset"
              placeholder="Bidang Ilmu"
              v-model="nim"
              @change="getMahasiswaByNIM()"
            />
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="nama" class="form-label">Nama</label>
          <input
            type="text"
            class="form-control"
            id="nama"
            placeholder="Nama Mahasiswa"
            v-model="nama"
            disabled
          />
        </div>
        <div class="col-md-6 mb-3">
          <label for="jenis_kelamin" class="form-label">Jenis Kelamin</label>
          <select
            class="form-select"
            id="jenis_kelamin"
            v-model="jenis_kelamin"
            disabled
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </div>
      <div class="row">
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="usia" class="form-label">Usia</label>
          <input
            type="number"
            class="form-control"
            id="usia"
            placeholder="Usia"
            v-model="usia"
            disabled
          />
        </div>
        <div class="col-md-6 mb-3">
          <label for="prodi" class="form-label">Program Studi</label>
          <input
            type="text"
            class="form-control"
            id="prodi"
            placeholder="Program Studi"
            v-model="prodi"
            disabled
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-3">
          <label class="form-label">IPS 1</label>
          <input
            type="number"
            step="0.01"
            class="form-control"
            v-model="ips1"
            max="4.00"
          />
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">IPS 2</label>
          <input
            type="number"
            step="0.01"
            class="form-control"
            v-model="ips2"
            max="4.00"
          />
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">IPS 3</label>
          <input
            type="number"
            step="0.01"
            class="form-control"
            v-model="ips3"
            max="4.00"
          />
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">IPS 4</label>
          <input
            type="number"
            step="0.01"
            class="form-control"
            v-model="ips4"
            max="4.00"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-3">
          <label class="form-label">SKS 1</label>
          <input type="number" class="form-control" v-model="sks1" min="0" max="24"/>
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">SKS 2</label>
          <input type="number" class="form-control" v-model="sks2" min="0" max="24"/>
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">SKS 3</label>
          <input type="number" class="form-control" v-model="sks3" min="0" max="24"/>
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">SKS 4</label>
          <input type="number" class="form-control" v-model="sks4" min="0" max="24"/>
        </div>
        <div class="col-md-12 mb-3">
          <label class="form-label">Tren IPS</label>
          <select
            class="form-select"
            v-model="tren_ips"
            required
          >
            <option value="">Pilih Tren IPS</option>
            <option value="NAIK">Naik</option>
            <option value="TURUN">Turun</option>
            <option value="STABIL">Stabil</option>
          </select>
        </div>
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
        @click="trySave"
        :disabled="!meta.valid"
        data-bs-dismiss="modal"
        aria-label="Close"
      >
        <i class="bx bx-send"></i> Simpan
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import Modal from "../../../components/Modal.vue";
import { ref, watch } from "vue";
import * as yup from "yup";
import useAPI from "../../../composables/api";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue3-toastify";

const props = defineProps({
  propsData: {
    type: Object,
    default: () => ({}),
  },
  id: {
    type: String,
    default: "",
  },
});

const schema = yup.object().shape({
  nim: yup.string().required("NIM harus diisi"),
  nama: yup.string().required("Nama harus diisi"),
  jenis_kelamin: yup.string().required("Jenis Kelamin harus diisi"),
  usia: yup
    .number()
    .required("Usia harus diisi")
    .min(0, "Usia tidak boleh negatif"),
  ips1: yup
    .number()
    .required("IPS 1 harus diisi")
    .min(0, "IPS 1 tidak boleh negatif"),
  ips2: yup
    .number()
    .required("IPS 2 harus diisi")
    .min(0, "IPS 2 tidak boleh negatif"),
  ips3: yup
    .number()
    .required("IPS 3 harus diisi")
    .min(0, "IPS 3 tidak boleh negatif"),
  ips4: yup
    .number()
    .required("IPS 4 harus diisi")
    .min(0, "IPS 4 tidak boleh negatif"),
  sks1: yup
    .number()
    .required("SKS 1 harus diisi")
    .min(0, "SKS 1 tidak boleh negatif"),
  sks2: yup
    .number()
    .required("SKS 2 harus diisi")
    .min(0, "SKS 2 tidak boleh negatif"),
  sks3: yup
    .number()
    .required("SKS 3 harus diisi")
    .min(0, "SKS 3 tidak boleh negatif"),
  sks4: yup
    .number()
    .required("SKS 4 harus diisi")
    .min(0, "SKS 4 tidak boleh negatif"),
  tren_ips: yup.string().required("Tren IPS harus diisi"),
  prodi: yup.string().required("Program Studi harus diisi"),
});

const { meta } = useForm({
  initialValues: {
    nim: "",
    nama: "",
    jenis_kelamin: "",
    usia: 0,
    ips1: 0,
    ips2: 0,
    ips3: 0,
    ips4: 0,
    sks1: 0,
    sks2: 0,
    sks3: 0,
    sks4: 0,
    tren_ips: "",
    prodi: "",
  },
  validationSchema: schema,
});

const { value: nim } = useField<string>("nim");
const { value: nama } = useField<string>("nama");
const { value: jenis_kelamin } = useField<string>("jenis_kelamin");
const { value: usia } = useField<number>("usia");
const { value: ips1 } = useField<number>("ips1");
const { value: ips2 } = useField<number>("ips2");
const { value: ips3 } = useField<number>("ips3");
const { value: ips4 } = useField<number>("ips4");
const { value: sks1 } = useField<number>("sks1");
const { value: sks2 } = useField<number>("sks2");
const { value: sks3 } = useField<number>("sks3");
const { value: sks4 } = useField<number>("sks4");
const { value: tren_ips } = useField<string>("tren_ips");
const { value: prodi } = useField<string>("prodi");

const { postResource, putResource } = useAPI();
const prodiId = ref<number | null>(null);

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: apiResource,
  onSuccess: async (data) => {
    if (data?.data) {
      toast.success("Data mahasiswa berhasil disimpan");
      clear();
      await queryClient.invalidateQueries({ queryKey: ["dataset"] });
    }
  },
});

async function validate() {
  if(ips1.value < 0 || ips1.value > 4) {
    toast.error("IPS 1 harus antara 0 dan 4");
    return false;
  }
  if(ips2.value < 0 || ips2.value > 4) {
    toast.error("IPS 2 harus antara 0 dan 4");
    return false;
  }
  if(ips3.value < 0 || ips3.value > 4) {
    toast.error("IPS 3 harus antara 0 dan 4");
    return false;
  }
  if(ips4.value < 0 || ips4.value > 4) {
    toast.error("IPS 4 harus antara 0 dan 4");
    return false;
  }
  if(sks1.value < 0 || sks1.value > 24) {
    toast.error("SKS 1 harus antara 0 dan 24");
    return false;
  }
  if(sks2.value < 0 || sks2.value > 24) {
    toast.error("SKS 2 harus antara 0 dan 24");
    return false;
  }
  if(sks3.value < 0 || sks3.value > 24) {
    toast.error("SKS 3 harus antara 0 dan 24");
    return false;
  }
  if(sks4.value < 0 || sks4.value > 24) {
    toast.error("SKS 4 harus antara 0 dan 24");
    return false;
  }
  return true;
}

async function apiResource() {
  await validate();
  const payload = {
    nim: nim.value,
    nama: nama.value,
    jenis_kelamin: jenis_kelamin.value,
    usia: usia.value,
    ips1: ips1.value,
    ips2: ips2.value,
    ips3: ips3.value,
    ips4: ips4.value,
    sks1: sks1.value,
    sks2: sks2.value,
    sks3: sks3.value,
    sks4: sks4.value,
    tren_ips: tren_ips.value,
    prodi: props.propsData.prodi || "",
  };

  let response: any = null;
  if (props.id) {
    response = await putResource(`/dataset/${props.id}`, payload, true);
  } else {
    response = await postResource("/dataset", payload, true);
  }
  return response;
}

const clear = () => {
  nim.value = "";
  nama.value = "";
  jenis_kelamin.value = "";
  usia.value = 0;
  ips1.value = 0;
  ips2.value = 0;
  ips3.value = 0;
  ips4.value = 0;
  sks1.value = 0;
  sks2.value = 0;
  sks3.value = 0;
  sks4.value = 0;
  tren_ips.value = "";
};

const emit = defineEmits(["refresh-value"]);
const trySave = async () => {
  await mutation.mutateAsync();
  emit("refresh-value");
};

const thumbnail = ref<string | null>(null);

watch(
  () => props.id,
  async (newId) => {
    if (newId != "") {
      const data = props.propsData;
      nim.value = data.NIM || "";
      await getMahasiswaByNIM();
      nama.value = data.nama || "";
      jenis_kelamin.value = data.jenis_kelamin == 1 ? "L" : "P";
      usia.value = data.usia || 0;
      ips1.value = data.ips1 || 0;
      ips2.value = data.ips2 || 0;
      ips3.value = data.ips3 || 0;
      ips4.value = data.ips4 || 0;
      sks1.value = data.sks1 || 0;
      sks2.value = data.sks2 || 0;
      sks3.value = data.sks3 || 0;
      sks4.value = data.sks4 || 0;
      tren_ips.value = data.tren_ips || "";

    } else {
      clear();
    }
  }
);

const getMahasiswaByNIM = async () => {
  if (nim.value.trim() === "") {
    toast.error("NIM tidak boleh kosong");
    return;
  }
  try {
    const response = await fetch("https://api.unira.ac.id/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetMahasiswaByNIM($nim: String!) {
            mahasiswa2(search: $nim) {
              mahasiswa {
                nim
                nama
                tglLahir
                jenisKelamin
                thumbnail
                prodi {
                  id
                  nama  
                }
              }
            }
          }
        `,
        variables: { nim: nim.value },
      }),
    });
    const data = await response.json();
    if (data?.data?.mahasiswa2?.mahasiswa?.length > 0) {
      const mahasiswa = data.data.mahasiswa2.mahasiswa[0];
      nim.value = mahasiswa.nim || "";
      nama.value = mahasiswa.nama || "";
      jenis_kelamin.value = mahasiswa.jenisKelamin || "";
      // usia tanggal lahir dikurangi nim 4 karakter pertama
      const birthDate = new Date(mahasiswa.tglLahir);
      const year = parseInt(nim.value.substring(0, 4), 10);
      usia.value = year - birthDate.getFullYear();
      prodi.value = mahasiswa.prodi?.nama || "";
      prodiId.value = mahasiswa.prodi?.id || null;
      thumbnail.value = 'https://api.unira.ac.id/' + mahasiswa.thumbnail;
    }
  } catch (error) {
    console.error("Error fetching mahasiswa data:", error);
    toast.error("Gagal mengambil data mahasiswa");
  }
};
</script>
