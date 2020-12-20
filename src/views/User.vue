<template>
  <div>
    <!-- https://bootstrap-vue.org/docs/components/collapse#collapse -->
    <user-accounts />
    <user-profile />
    <!-- <user-goals /> -->
  </div>
</template>

<script>
import UserProfile from '@/components/UserProfile.vue'
import UserAccounts from '@/components/UserAccounts.vue'
// import UserGoals from "@/components/UserGoals.vue";
export default {
  name: 'user',
  components: {
    UserProfile,
    UserAccounts,
    // UserGoals,
  },

  mounted() {
    this.$store.commit('updateBooleanStates', {
      prop: 'updateButtonVisible',
      state: false,
    })
    this.$store.commit('updateBooleanStates', {
      prop: 'datePickerVisible',
      state: false,
    })
  },
}
</script>

<style></style>
