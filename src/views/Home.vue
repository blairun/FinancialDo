<template>
  <div class="home pt-4">
    <refreshed-timer />
    <delay :wait="4000">
      <b-card v-if="items.length === 0" class="mx-3 mb-4 mt-2" align-h="center">
        No account data yet 🤔<br /><br />
        📊 Click the 'Add New Account' button to link your first account and
        view charts about your data 📊
        <plaid-button class="mt-4" />
      </b-card>
    </delay>
    <!-- <span v-if="items.length > 0"> -->
    <chart-cash-flow />
    <chart-cash-pie />
    <chart-net-worth />
    <chart-net-trend />
    <chart-goals />
    <!-- </span> -->
  </div>
</template>

<script>
// @ is an alias to /src
import RefreshedTimer from '@/components/RefreshedTimer.vue'
import PlaidButton from '@/components/PlaidButton.vue'
import ChartCashFlow from '@/components/charts/CashFlow.vue'
import ChartCashPie from '@/components/charts/CashPie.vue'
import ChartNetWorth from '@/components/charts/NetWorth.vue'
import ChartNetTrend from '@/components/charts/NetTrend.vue'
import ChartGoals from '@/components/charts/Goals.vue'
import Delay from 'vue-delay'

export default {
  name: 'Home',
  components: {
    RefreshedTimer,
    PlaidButton,
    ChartCashFlow,
    ChartCashPie,
    ChartNetWorth,
    ChartNetTrend,
    ChartGoals,
    Delay,
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
