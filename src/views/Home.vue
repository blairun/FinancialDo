<template>
  <div class="home pt-4">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <refreshed-timer />
    <chart-cash-flow />
    <chart-cash-pie />
    <chart-net-worth />
    <chart-net-trend />
    <chart-goals />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import RefreshedTimer from '@/components/RefreshedTimer.vue'
import ChartCashFlow from '@/components/charts/CashFlow.vue'
import ChartCashPie from '@/components/charts/CashPie.vue'
import ChartNetWorth from '@/components/charts/NetWorth.vue'
import ChartNetTrend from '@/components/charts/NetTrend.vue'
import ChartGoals from '@/components/charts/Goals.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    RefreshedTimer,
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
  },
}
</script>
