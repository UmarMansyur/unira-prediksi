<template>
  <Modal
    modal_id="modal-user"
    :title="props.id ? 'Ubah Pengguna' : 'Tambah Pengguna'"
    modalClass="modal-lg"
  >
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">
          <div class="mb-3">
            <label for="username" class="form-label">Username: </label>
            <input
              type="text"
              class="form-control"
              id="username"
              placeholder="Username"
              v-model="username"
            />
          </div>
        </div>
        <div class="col-md-6 mb-3" v-if="!props.id">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Password"
            v-model="password"
          />
        </div>
        <div class="mb-3" :class="props.id ? 'col-md-12' : 'col-md-6'">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="Email Address"
            v-model="email"
          />
        </div>
        <div class="col-md-6 mb-3">
          <label for="gender" class="form-label">Jenis Kelamin</label>
          <select class="form-select" id="gender" v-model="gender" placeholder="Pilih Jenis Kelamin">
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-Laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label for="dob" class="form-label">Date of Birth</label>
          <input type="date" class="form-control" id="dob" v-model="dob" />
        </div>
        <div class="col-md-12 mb-3">
          <label for="address" class="form-label">Address</label>
          <textarea
            class="form-control"
            id="address"
            rows="3"
            placeholder="Complete Address"
            v-model="address"
          ></textarea>
        </div>
        <div class="col-md-12 mb-3">
          <label for="thumbnail" class="form-label">Thumbnail</label>
          <input
            type="file"
            class="form-control"
            id="thumbnail"
            accept="image/*"
            @change="handleFileChange"
          />
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
  username: yup.string().required("Username harus diisi"),
  // password: required when props.id is empty
  password: yup.string().when("id", {
    is: (id: string) => !id,
    then: (schema: any) => schema.required("Password harus diisi"),
    otherwise: (schema: any) => schema.notRequired(),
  }),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email harus diisi"),
  gender: yup.string().required("Gender harus diisi"),
  dob: yup.string().required("Tanggal lahir harus diisi"),
  address: yup.string().required("Alamat harus diisi"),
});

const { meta } = useForm({
  initialValues: {
    username: "",
    password: "",
    email: "",
    gender: "",
    dob: "",
    address: "",
  },
  validationSchema: schema,
});

const { value: username } = useField<string>("username");
const { value: password } = useField<string>("password");
const { value: email } = useField<string>("email");
const { value: gender } = useField<string>("gender");
const { value: dob } = useField<string>("dob");
const { value: address } = useField<string>("address");

const thumbnail = ref<File | null>(null);

const { postResource, putResource } = useAPI();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: apiResource,
  onSuccess: async (data) => {
    if (data?.data) {
      toast.success("Data berhasil disimpan");
      clear();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  },
});

async function validate() {
  // Additional custom validations can be added here
  if (password.value && password.value.length < 6 && !props.id) {
    toast.error("Password harus minimal 6 karakter");
    return false;
  }

  if (email.value && !email.value.includes("@")) {
    toast.error("Format email tidak valid");
    return false;
  }

  return true;
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    thumbnail.value = target.files[0];
  }
};

async function apiResource() {
  const isValid = await validate();
  if (!isValid) return;

  const data: any = {
    username: username.value,
    password: password.value,
    email: email.value,
    gender: gender.value,
    dob: dob.value,
    address: address.value,
  }
  let formData = false;
  if(thumbnail.value ) {
    data.thumbnail = thumbnail.value;
    formData = true;
  } else {
    formData = false;
  }


  let response: any = null;
  if (props.id) {
    response = await putResource(`/user/${props.id}`, data, true, formData);
  } else {
    response = await postResource("/user", data, true, formData);
  }
  return response;
}

const clear = () => {
  username.value = "";
  password.value = "";
  email.value = "";
  gender.value = "";
  dob.value = "";
  address.value = "";
  thumbnail.value = null;
};

const emit = defineEmits(["refresh-value"]);
const trySave = async () => {
  await mutation.mutateAsync();
  emit("refresh-value");
};

watch(
  () => props.id,
  async (newId) => {
    if (newId != "") {
      const data = props.propsData;
      username.value = data.username || "";
      email.value = data.email || "";
      gender.value = data.gender || "";
      dob.value = data.dob || "";
      address.value = data.address || "";
      thumbnail.value = null;
    } else {
      clear();
    }
  }
);
</script>
