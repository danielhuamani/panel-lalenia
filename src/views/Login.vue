<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card overflow-hidden">
          <div class="bg-danger">
            <div class="row">
              <div class="col-7">
                <div class="text-white p-4">
                  <h5 class="text-white">Bienvenido</h5>
                  <p>Inicia sesión para continuar.</p>
                </div>
              </div>
              <div class="col-5 align-self-end">
                <img
                  src="@/assets/images/profile-img.png"
                  alt
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <div>
              <router-link tag="a" to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <!-- <img src="@/assets/images/logo.jpeg" alt=""> -->
                    <Logo></Logo>
                  </span>
                </div>
              </router-link>
            </div>
            <b-alert
              v-model="isAuthError"
              variant="danger"
              class="mt-3"
              dismissible
              >{{ authError }}</b-alert
            >
            <b-form class="p-2" @submit.prevent="tryToLogIn">
              <b-form-group
                class="mb-3"
                id="input-group-1"
                label="Email"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="text"
                  :class="{ 'is-invalid': $v.email.$error }"
                ></b-form-input>
                <div
                  v-if="$v.email.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.email.required">Email es obligatorio.</span>
                  <span v-if="!$v.email.email">Ingrese un email</span>
                </div>
              </b-form-group>

              <b-form-group
                class="mb-3"
                id="input-group-2"
                label="Password"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="password"
                  type="password"
                  :class="{ 'is-invalid': $v.password.$error }"
                ></b-form-input>
                <div
                  v-if="!$v.password.required"
                  class="invalid-feedback"
                >
                  Password es obligatorio.
                </div>
              </b-form-group>
              <div class="mt-3 d-grid">
                <b-button type="submit" variant="dark" class="btn-block"
                  >Ingresar</b-button
                >
              </div>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Logo from "@/components/common/logo"
import Layout from "@/layouts/auth";
import { setUser, login } from "@/utils/auth"
import AuthService from "@/services/auth-service";
import appConfig from "@/app.config";
import { required, email } from "vuelidate/lib/validators";

/**
 * Login component
 */
export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    Logo
  },
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        AuthService.login({
          username: this.email, 
          password: this.password
        }).then(resp => {
          console.log(resp.data)
          login(resp.data.token)
          setUser(resp.data.user)
          this.$router.push({name: "dashboard"})
        }).catch(err => {
          if(err.response.data.non_field_errors) {
            this.authError = err.response.data.non_field_errors[0]
            this.isAuthError = true
          }
        })
      }
    },
  },
  mounted() {},
};
</script>