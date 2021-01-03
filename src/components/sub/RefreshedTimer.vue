<template>
  <div></div>
</template>

<script>
import dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {
  name: 'refreshTimer',
  data() {
    return {
      timer: 0,
    }
  },
  mounted() {
    setTimeout(() => {
      this.checkRefresh()
    }, 500) // give data a chance to load before polling

    this.refreshTimer()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    checkRefresh() {
      let burd = this.$store.getters.retrievalDates.balances
      let turd = this.$store.getters.retrievalDates.transactions
      let balancesTimeAgo = dayjs(burd)
        .add(5, 'second')
        .fromNow()
      let transactionsTimeAgo = dayjs(turd)
        .subtract(5, 'second')
        .fromNow()
      // console.log(transactionsTimeAgo);
      // console.log(balancesTimeAgo);

      this.$store.commit('updateRetrievalDates', {
        prop: 'balanceCharts',
        date: balancesTimeAgo,
      })

      this.$store.commit('updateRetrievalDates', {
        prop: 'transactionCharts',
        date: transactionsTimeAgo,
      })

      let page = this.$router.currentRoute.name
      // console.log(page);

      switch (page) {
        case 'balances':
          this.$store.commit('updateRetrievalDates', {
            prop: 'navText',
            date: 'Refreshed ' + balancesTimeAgo,
          })
          break
        case 'transactions':
          this.$store.commit('updateRetrievalDates', {
            prop: 'navText',
            date: 'Refreshed ' + transactionsTimeAgo,
          })
          break
        default:
          break
      }
    },
    refreshTimer: function() {
      this.timer = setInterval(() => {
        this.checkRefresh()
      }, 60000)
    },
  },
  watch: {
    $route(to) {
      this.page = to.name
      console.log(this.page)
    },
  },
}
</script>

<style></style>
