<template>
  <div
    class="auth-bg d-flex min-vh-100 justify-content-center align-items-center"
  >
    <div class="row g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
      <div class="col-xl-5 col-lg-5 col-md-6">
        <div class="card overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
          <a href="index.html" class="auth-brand mb-3">
            <div class="d-flex align-items-center justify-content-center">
              <img
                src="https://pmb.unira.ac.id/img/unira.png"
                alt="dark logo"
                height="100"
                class="logo-dark"
              />
              <div>
                <div class="ms-2 fs-3 text-dark text-start">
                  <span class="fw-bold mb-0">UNIVERSITAS MADURA</span>
                  <div class="my-0">
                    <div class="fs-5 fw-bold">Prediksi Tren IPS Mahasiswa</div>
                  </div>
                </div>
              </div>
            </div>
          </a>

          <p class="text-muted">
            Masukkan username dan password anda untuk masuk ke akun anda.
          </p>

          <form
            action="https://coderthemes.com/greeva/layouts/index.html"
            class="text-start mb-3"
          >
            <div class="mb-3">
              <label class="form-label" for="example-email">NIS/NIM</label>
              <input
                type="username"
                id="example-username"
                name="example-username"
                class="form-control"
                placeholder="NIS/NIM"
                v-model="username"
              />
            </div>

            <div class="mb-3">
              <label class="form-label" for="example-password">PASSWORD</label>
              <div class="input-group">
                <input
                  type="password"
                  id="example-password"
                  class="form-control"
                  placeholder="Enter your password"
                  v-model="password"
                />
                <button type="button" class="input-group-text" id="password-addon" @click="togglePasswordVisibility">
                  <i class="bx bx-show"></i>
                </button>
              </div>
            </div>

            <div class="d-flex justify-content-between mb-3">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkbox-signin"
                />
                <label class="form-check-label" for="checkbox-signin"
                  >Remember me</label
                >
              </div>
            </div>

            <div class="d-grid">
              <button class="btn btn-primary fw-semibold" type="button" @click="tryLogin" :disabled="!meta.valid">
                Login
              </button>
            </div>
          </form>


          <p class="mt-auto mb-0">
            {{ new Date().getFullYear() }} -
             Khana Zulfana Imam
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import useAPI from '../../composables/api';
import useToken from '../../composables/token';
import router from '../../router';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(4).required(),
});

const { meta } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    password: '',
  },
});

const { value: username } = useField<string>('username');
const { value: password } = useField<string>('password');

const { postResource } = useAPI();
const { setToken } = useToken();


const tryLogin = async () => {
  const response = await postResource('/auth/login', {
    username: username.value,
    password: password.value,
  });

  if(response?.data) {
    await setToken(response.data);
    // toast.success('Login berhasil!');
    router.push({ name: 'Dashboard' });
  }
}

const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById('example-password') as HTMLInputElement;
  const passwordIcon = document.querySelector('#password-addon i') as HTMLElement;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordIcon.classList.remove('bx-show');
    passwordIcon.classList.add('bx-hide');
  } else {
    passwordInput.type = 'password';
    passwordIcon.classList.remove('bx-hide');
    passwordIcon.classList.add('bx-show');
  }
};


</script>
