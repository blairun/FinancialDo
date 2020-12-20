<template>
  <div class="transactions pt-4">
    <plaid-error v-if="showError" v-bind:error="error" />
    <transaction-table />
    <refreshed-timer />
    <back-to-top text="Back to top">
      <b-button pill variant="info"
        >Back to Top
        <b-icon icon="caret-up-fill" aria-label="Scroll to Top"></b-icon>
      </b-button>
    </back-to-top>
  </div>
</template>

<script>
import TransactionTable from '@/components/TransactionTable.vue'
import RefreshedTimer from '@/components/RefreshedTimer.vue'
import PlaidError from '@/components/PlaidError.vue'
import BackToTop from 'vue-backtotop'

export default {
  name: 'transactions',
  components: {
    TransactionTable,
    RefreshedTimer,
    PlaidError,
    BackToTop,
  },
  // data() {
  //   return {
  //   };
  // },
  mounted() {
    this.$store.commit('updateAppText', {
      prop: 'updateButtonText',
      text: 'Update Transactions',
    })
    this.$store.commit('updateBooleanStates', {
      prop: 'updateButtonVisible',
      state: true,
    })
    this.$store.commit('updateBooleanStates', {
      prop: 'datePickerVisible',
      state: false,
    })
  },
  computed: {
    error() {
      return this.$store.getters.appText.transactionError
    },
    showError() {
      if (this.error.length > 0) {
        console.log(this.error)
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style scoped></style>
