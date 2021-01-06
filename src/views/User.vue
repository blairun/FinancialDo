<template>
  <div class="px-4 pt-4 pb-5">
    <no-data-warning v-if="items.length === 0" />
    <user-accounts v-if="items.length > 0" />
    <user-settings />
    <user-profile class="mb-4" />
    <div
      class="fixed-footer pb-1"
      style="background:#28a745"
      v-if="$store.state.user.plaidEnv === 'sandbox'"
    >
      Using Plaid's sandbox environment. New account credentials » username:
      user_good | password: pass_good
    </div>
    <div
      class="fixed-footer pb-1"
      style="background:#dc3545"
      v-if="$store.state.user.plaidEnv === 'development'"
    >
      Development environment. Use real credentials for new accounts. Will
      deplete 1 of your 100 Plaid development Items.
    </div>
  </div>
</template>

<script>
import NoDataWarning from '@/components/sub/NoDataWarning.vue'
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

<style scoped>
/* fixed is absolute to a browser */
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  text-align: center;
}
</style>
