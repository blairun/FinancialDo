<template>
  <div class="pt-5">
    <b-card
      class="mx-sm-auto mx-4 mb-4"
      align-h="center"
      title="Sign in"
      style="max-width: 500px"
    >
      <b-form-input
        type="email"
        label="Email"
        placeholder="Email"
        class="mb-3"
        id="feedback-user"
        v-model="email"
        v-on:keyup="checkLoginEnter"
      ></b-form-input>
      <b-input-group class="mb-3">
        <b-form-input
          :type="loginPassVis"
          label="Password"
          placeholder="Password"
          v-model="password"
          v-on:keyup="checkLoginEnter"
        ></b-form-input>
        <b-input-group-append>
          <b-button size="sm" type="password" @click="loginVisbility"
            ><b-icon :icon="loginEyeconVis" aria-label="show / hide"></b-icon
          ></b-button>
        </b-input-group-append>
      </b-input-group>
      <span>
        <b-button class="mb-3" @click="login" style="width: 100px">
          Login
        </b-button>
        <b-card-text class="text-danger">
          {{ loginError }}
        </b-card-text>
        <div class="text-secondary">
          Use these credentials to view the app with prepopulated data.<br />
          Email: test@123.com <br />Password: 12345678
        </div>
      </span>
    </b-card>

    <b-card
      class="mx-sm-auto mx-4 mb-4"
      align-h="center"
      style="max-width: 500px"
      title="Sign up"
    >
      <b-form name="tab-tracker-form" autocomplete="off">
        <b-form-input
          class="mb-3"
          placeholder="Username"
          v-model="newUsername"
          v-on:keyup="checkRegisterEnter"
        ></b-form-input>
        <b-form-input
          type="email"
          label="Email"
          placeholder="Email"
          class="mb-3"
          id="feedback-user"
          v-model="newEmail"
          v-on:keyup="checkRegisterEnter"
        ></b-form-input>
        <b-input-group class="mb-3">
          <b-form-input
            :type="registerPassVis"
            label="Password"
            placeholder="Password"
            v-model="newPassword"
            v-on:keyup="checkRegisterEnter"
          ></b-form-input>
          <b-input-group-append>
            <!-- variant="outline-secondary" -->
            <b-button size="sm" type="password" @click="registerVisbility"
              ><b-icon
                :icon="registerEyeconVis"
                aria-label="show / hide"
              ></b-icon
            ></b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
      <b-button class="mb-3" @click="register" style="width: 100px">
        Register
      </b-button>

      <p class="text-danger" v-html="registrationError" />

      <div class="text-secondary">
        Register to start fresh and see how the app works as a new user.<br />Connect
        to sample data from real financial institutions.<br />Data in this
        sandbox environment may occasionally be purged.
      </div>
    </b-card>
    <template></template>
    <!-- IDEA add oauth sign in for google/github/others -->
  </div>
</template>

<script>
// secure server and client with authentication
import AuthenticationService from '@/services/AuthenticationService'
// experiment passing data from child to parent component
// import LoginFields from "@/components/LoginFields.vue";

export default {
  // components: {
  //   LoginFields,
  // },
  data() {
    return {
      email: '',
      password: '',
      newUsername: '',
      newEmail: '',
      newPassword: '',
      loginError: null,
      loginAlert: '',
      registrationError: null,
      loginPassVis: 'password',
      loginEyeconVis: 'eye-slash-fill',
      registerPassVis: 'password',
      registerEyeconVis: 'eye-slash-fill',
    }
  },
  methods: {
    async login() {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password,
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({
          name: 'home',
        })
        this.loginError = null
      } catch (error) {
        this.loginError = error.response.data.error
        this.loginAlert = 'danger'
      }
    },
    async register() {
      try {
        const response = await AuthenticationService.register({
          username: this.newUsername,
          email: this.newEmail,
          password: this.newPassword,
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({
          name: 'user',
        })
        this.registrationError = null
      } catch (error) {
        this.registrationError = error.response.data.error
      }
    },
    loginVisbility() {
      this.loginPassVis = this.loginPassVis === 'password' ? 'text' : 'password'
      this.loginEyeconVis =
        this.loginEyeconVis === 'eye-fill' ? 'eye-slash-fill' : 'eye-fill'
    },
    registerVisbility() {
      this.registerPassVis =
        this.registerPassVis === 'password' ? 'text' : 'password'
      this.registerEyeconVis =
        this.registerEyeconVis === 'eye-fill' ? 'eye-slash-fill' : 'eye-fill'
    },
    checkLoginEnter(e) {
      if (e.keyCode === 13) {
        this.login()
      }
    },
    checkRegisterEnter(e) {
      if (e.keyCode === 13) {
        this.register()
      }
    },
  },
}
</script>
