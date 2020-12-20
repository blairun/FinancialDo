<template>
  <div>
    <b-form-input
      type="email"
      label="Email"
      placeholder="Email"
      class="mb-3"
      id="feedback-user"
      v-model="email"
      v-on:keyup="emitToParent"
    ></b-form-input>
    <b-form-input
      type="password"
      label="Password"
      placeholder="Password"
      class="mb-3"
      v-model="password"
      v-on:keyup="emitToParent"
    ></b-form-input>
  </div>
</template>

<script>
export default {
  // props: {
  //   password: String,
  //   email: String,
  // },
  data() {
    return {
      email: '',
      password: '',
    }
  },

  methods: {
    // Define the method that emits data to the parent as the first parameter to `$emit()`.
    // This is referenced in the <template> call in the parent. The second parameter is the payload.
    emitToParent() {
      this.$emit('childToParent', this.email, this.password)
    },
  },
}
</script>

<style scoped></style>
