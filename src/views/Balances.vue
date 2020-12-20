<template>
  <div class="balances pt-4">
    <plaid-error v-if="showError" v-bind:error="error" />
    <balance-table />
    <refreshed-timer />
  </div>
</template>

<script>
import BalanceTable from '@/components/BalanceTable.vue'
import RefreshedTimer from '@/components/RefreshedTimer.vue'
import PlaidError from '@/components/PlaidError.vue'

export default {
  name: 'balances',
  components: {
    BalanceTable,
    RefreshedTimer,
    PlaidError,
  },
  // data() {
  //   return {};
  // },
  mounted() {
    this.$store.commit('updateAppText', {
      prop: 'updateButtonText',
      text: 'Update Balances',
    })
    this.$store.commit('updateBooleanStates', {
      prop: 'updateButtonVisible',
      state: true,
    })
    this.$store.commit('updateBooleanStates', {
      prop: 'datePickerVisible',
      state: true,
    })
  },
  computed: {
    error() {
      return this.$store.getters.appText.balanceError
    },
    showError() {
      if (this.error.length > 0) {
        // console.log(this.error)
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style scoped></style>
