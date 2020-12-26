<template>
  <div class="px-4 pt-4">
    <no-data-warning v-if="items.length === 0" />
    <user-accounts v-if="items.length > 0" />
    <user-profile />
  </div>
</template>

<script>
import NoDataWarning from '@/components/NoDataWarning.vue'
import UserProfile from '@/components/UserProfile.vue'
import UserAccounts from '@/components/UserAccounts.vue'
export default {
  name: 'user',
  components: {
    NoDataWarning,
    UserProfile,
    UserAccounts,
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
    if (this.items.length === 0) {
      this.fetchItems()
    }
  },
  methods: {
    fetchItems() {
      // return the Promise from the action
      return this.$store.dispatch('getBalances')
    },
  },
  computed: {
    items() {
      return this.$store.getters.balances
    },
  },
}
</script>
