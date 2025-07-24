<template>
  <Modal
    modal_id="update-password"
    modal-class="modal-md"
    title="Ubah Password"
  >
    <div class="modal-body">
      <form class="row">
        <div class="mb-3">
          <label for="new-username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="new-username"
            name="new-username"
            placeholder="Masukkan username"
            v-model="username"
            autocomplete="new-username"
            disabled
          />
        </div>
        <div class="mb-3">
          <label for="new-password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="new-password"
            name="new-password"
            placeholder="Masukkan password"
            v-model="password"
            autocomplete="new-password"
          />
          <small class="text-muted">*Minimal 4 karakter</small>
        </div>
        <div class="mb-3">
          <label for="confirmation_password" class="form-label"
            >Konfirmasi Password</label
          >
          <input
            type="password"
            class="form-control"
            id="confirmation_password"
            placeholder="Masukkan Konfirmasi Password"
            v-model="confirmation_password"
          />
        </div>
      </form>
    </div>
    <div class="modal-footer d-flex justify-content-between">
      <button
        type="button"
        class="btn btn-white text-dark"
        data-bs-dismiss="modal"
        aria-label="Close"
        id="modal-close"
      >
        <i class="ti ti-x me-1"></i> Tutup
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="!meta.valid"
        @click="trySave"
      >
        <i class="ti ti-device-floppy me-1"></i> Simpan
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import Modal from "../../../components/Modal.vue";
import * as yup from "yup";
import useAPI from "../../../composables/api";
import { useQueryClient } from "@tanstack/vue-query";
import { watch } from "vue";
import { toast } from "vue3-toastify";

const props = defineProps({
  id: {
    type: String,
    required: true,
    default: "",
  },
  username: {
    type: String,
    required: true,
    default: "",
  },
});

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(4),
  confirmation_password: yup
    .string()
    .required("Konfirmasi Password tidak boleh kosong")
    .oneOf([yup.ref("password"), ""], "Password tidak sama"),
});

const { meta } = useForm({
  validationSchema: schema,
  initialValues: {
    username: props.username,
    password: "",
    confirmation_password: "",
  },
});

const { value: username } = useField<string>("username");
const { value: password } = useField<string>("password");
const { value: confirmation_password } = useField<string>(
  "confirmation_password"
);

const { patchResource } = useAPI();

const queryClient = useQueryClient();

const trySave = async () => {
  if (password.value !== confirmation_password.value) {
    toast.error("Password tidak sama");
    return;
  }

  const response = await patchResource("/user/" + props.id, {
    password: password.value,
    confirm_password: confirmation_password.value,
  }, true);

  queryClient.invalidateQueries({
    queryKey: ["user"],
  });

  if (response?.data) {
    toast.success("Berhasil mengubah akun pengguna");
  }
  document.getElementById("modal-close")?.click();
};

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      username.value = props.username;
      password.value = "";
      confirmation_password.value = "";
    } else {
      username.value = "";
      password.value = "";
      confirmation_password.value = "";
    }
  }
);
</script>
