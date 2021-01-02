<template>
  <div class="px-4 pt-4">
    <no-data-warning v-if="items.length === 0" />
    <user-accounts v-if="items.length > 0" />
    <user-settings />
    <user-profile />
  </div>
</template>

<script>
import NoDataWarning from '@/components/NoDataWarning.vue'
import UserAccounts from '@/components/UserAccounts.vue'
import UserSettings from '@/components/UserSettings.vue'
import UserProfile from '@/components/UserProfile.vue'
export default {
  name: 'user',
  components: {
    NoDataWarning,
    UserAccounts,
    UserSettings,
    UserProfile,
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
