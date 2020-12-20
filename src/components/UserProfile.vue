<template>
  <!-- profile page allowing updates to username, email, password -->
  <div>
    <b-card
      class="mx-sm-auto mx-4 mb-4"
      align-h="center"
      style="max-width: 1000px"
      title="Update Profile"
    >
      <!-- disable submit button until validation is ok -->
      <b-form
        name="tab-tracker-form"
        autocomplete="off"
        @submit.stop.prevent="onSubmit"
      >
        <b-form-group
          id="input-group-0"
          label="Password:"
          label-for="oldPassword"
        >
          <b-form-input
            id="oldPassword"
            type="password"
            label="Old Password"
            placeholder="Current Password"
            v-model="$v.form.oldPassword.$model"
            :state="validateState('oldPassword')"
            aria-describedby="oldPassword-live-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="oldPassword-live-feedback"
            >Current password is required to update
            profile.</b-form-invalid-feedback
          >
        </b-form-group>
        <b-form-group
          id="input-group-1"
          class="mb-3"
          label="Username:"
          label-for="newUsername"
        >
          <!-- v-model="form.newUsername" -->
          <b-form-input
            id="newUsername"
            placeholder="Username"
            :state="validateState('newUsername')"
            v-model="$v.form.newUsername.$model"
            aria-describedby="newUsername-live-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="newUsername-live-feedback"
            >Username must be between 3 and 20 alphanumeric
            characters.</b-form-invalid-feedback
          >
          <!-- <div class="error" v-if="$v.newUsername.$invalid">
            Password is required.
          </div> -->
        </b-form-group>
        <b-form-group
          id="input-group-2"
          class="mb-3"
          label="Email address:"
          label-for="newEmail"
        >
          <!-- description="We'll never share your email with anyone else." -->
          <b-form-input
            id="newEmail"
            label="Email"
            placeholder="Email"
            v-model="$v.form.newEmail.$model"
            :state="validateState('newEmail')"
            aria-describedby="input-2-live-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="input-2-live-feedback"
            >Please provide a valid email address.</b-form-invalid-feedback
          >
        </b-form-group>
        <b-form-group label="New Password:" label-for="newPassword">
          <b-form-input
            type="password"
            label="New Password 1"
            placeholder="New Password"
            class="mt-3"
            v-model="$v.form.newPassword1.$model"
            :state="validateState('newPassword1')"
            aria-describedby="newPassword1-live-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="newPassword1-live-feedback"
            >Must be 8 to 30 alphanumeric characters and different than current
            password.</b-form-invalid-feedback
          >
          <b-form-input
            type="password"
            label="New Password 2"
            placeholder="Repeat New Password"
            class="mt-3"
            v-model="$v.form.newPassword2.$model"
            :state="validateState('newPassword2')"
            aria-describedby="newPassword2-live-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="newPassword2-live-feedback"
            >New passwords must match.</b-form-invalid-feedback
          >
        </b-form-group>
        <!-- @click="save" -->
        <div class="d-flex justify-content-end">
          <b-button type="submit" class="mt-3" style="width: 200px">
            Save Profile Changes
          </b-button>
        </div>
        <!-- TODO Add delete user button -->
        <div class="d-flex justify-content-end">
          <div class="text-success mt-2">{{ saveConfirmation }}</div>
          <div class="text-danger mt-2">{{ saveError }}</div>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
// secure server and client with authentication
import AuthenticationService from '@/services/AuthenticationService'
// import { required, minLength, sameAs } from "vuelidate/lib/validators";
import {
  required,
  requiredIf,
  minLength,
  maxLength,
  email,
  sameAs,
  alphaNum,
  not,
} from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      form: {
        newUsername: this.$store.getters.user.username,
        newEmail: this.$store.getters.user.email,
        oldPassword: null,
        newPassword1: null,
        newPassword2: null,
      },
      saveError: null,
      saveConfirmation: null,
    }
  },
  validations: {
    form: {
      oldPassword: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(30),
      },
      newUsername: {
        required,
        alphaNum,
        minLength: minLength(3),
        maxLength: maxLength(20),
      },
      newEmail: {
        required,
        email,
        minLength: minLength(3),
        maxLength: maxLength(30),
      },
      newPassword1: {
        isNotSameAsOldPassword: not(sameAs('oldPassword')),
        alphaNum,
        minLength: minLength(8),
        maxLength: maxLength(30),
      },
      newPassword2: {
        isNotSameAsOldPassword: not(sameAs('oldPassword')),
        requiredif: requiredIf('newPassword1'),
        sameAsNewPassword1: sameAs('newPassword1'),
      },
    },
  },
  methods: {
    async save() {
      try {
        this.saveConfirmation = null
        const response = await AuthenticationService.update({
          username: this.form.newUsername,
          email: this.form.newEmail,
          oldPassword: this.form.oldPassword,
          newPassword1: this.form.newPassword1,
          newPassword2: this.form.newPassword2,
          oldEmail: this.$store.getters.user.email,
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        ;(this.form.oldPassword = null),
          (this.form.newPassword1 = null),
          (this.form.newPassword2 = null),
          (this.saveError = null)
        this.saveConfirmation = 'Profile changes have been saved.'
        setTimeout(() => {
          this.saveConfirmation = null
        }, 5000)
      } catch (error) {
        this.saveConfirmation = null
        this.saveError = error.response.data.error
      }
    },
    validateState(fieldName) {
      // console.log(fieldName);
      const { $dirty, $error } = this.$v.form[fieldName]
      // console.log($error);
      return $dirty ? !$error : null
    },
    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        this.saveConfirmation = null
        this.saveError = 'Fix errors and then retry.'
        return
      }
      this.saveError = null
      this.save()
    },
  },
}
</script>

<style></style>
