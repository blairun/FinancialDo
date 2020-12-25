<template>
  <div class="home pt-4 px-4">
    <refreshed-timer />
    <no-data-warning v-if="items.length === 0">
      No account data yet 🤔<br /><br />
      📊 Click the 'Add New Account' button to link your first account and view
      charts about your data 📊
    </no-data-warning>
    <span v-if="items.length > 0">
      <chart-cash-flow />
      <chart-cash-pie />
      <chart-net-worth />
      <chart-net-trend />
      <chart-goals />
    </span>
  </div>
</template>

<script>
// @ is an alias to /src
import RefreshedTimer from '@/components/RefreshedTimer.vue'
import NoDataWarning from '@/components/NoDataWarning.vue'
import ChartCashFlow from '@/components/charts/CashFlow.vue'
import ChartCashPie from '@/components/charts/CashPie.vue'
import ChartNetWorth from '@/components/charts/NetWorth.vue'
import ChartNetTrend from '@/components/charts/NetTrend.vue'
import ChartGoals from '@/components/charts/Goals.vue'

export default {
  name: 'Home',
  components: {
    RefreshedTimer,
    NoDataWarning,
    ChartCashFlow,
    ChartCashPie,
    ChartNetWorth,
    ChartNetTrend,
    ChartGoals,
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
