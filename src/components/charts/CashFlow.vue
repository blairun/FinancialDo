<template>
  <b-card id="cash" class="mb-4" v-b-hover="handleHover">
    <b-row class="mx-2">
      <b-card-title class="title" v-on:click="navigate">
        Monthly Cash Flow
      </b-card-title>
      <!-- IDEA click bars to automatically filter transactions table -->
      <!-- allow user to pick number of months to show -->
      <b-card-title class="ml-auto">
        <b-button-group size="sm">
          <b-button
            @click="zoomOut"
            variant="light"
            :disabled="monthRemoveDisabled"
            v-b-tooltip.hover.bottom
            title="Zoom out"
          >
            <b-icon icon="dash"></b-icon>
          </b-button>
          <b-button
            @click="zoomIn"
            variant="light"
            :disabled="monthAddDisabled"
            v-b-tooltip.hover.top
            title="Zoom in"
          >
            <b-icon icon="plus"></b-icon>
          </b-button>
        </b-button-group>
      </b-card-title>
    </b-row>
    <chart-bar :chart-data="datacollection" :options="chartOptions"></chart-bar>
  </b-card>
</template>

<script>
import ChartBar from './Bar'
import numeral from 'numeral'
// TODO only import needed d3 libraries (array and collection)
import * as d3 from 'd3'
import dayjs from 'dayjs'

export default {
  components: {
    ChartBar,
  },

  data() {
    return {
      isHovered: false,
      monthCount: 7,
      monthRemoveDisabled: false,
      monthAddDisabled: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        // https://www.chartjs.org/docs/master/general/performance/
        normalized: true,
        // animation: {
        //   duration: 0,
        // },
        plugins: {
          // Change options for ALL labels of THIS CHART
          datalabels: {
            formatter: function(value) {
              return numeral(value).format('$0,0')
            },
            align: 'end',
            color: 'gray',
            textStrokeColor: 'white',
            textStrokeWidth: 6,
            display: false,
            labels: {
              value: {
                font: {
                  size: 20,
                },
              },
            },
          },
        },

        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
            {
              // barPercentage: 0.6,
              stacked: true,
              ticks: {
                reverse: true,
                display: true,
                beginAtZero: true,
                fontSize: 20,
                // Include a dollar sign in the ticks
                // callback: function(value) {
                //   return "$" + value;
                // },
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },

        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
          titleFontSize: 14,
          bodyFontSize: 14,
          mode: 'single',
          callbacks: {
            label: function(tooltipItems) {
              return numeral(tooltipItems.yLabel).format('$0,0')
            },
          },
        },
        layout: {
          // set padding to display the labels properly.
          padding: {
            right: 20,
            left: 40,
          },
        },
      },
    }
  },

  mounted() {
    if (this.$store.getters.transactions.length === 0) {
      // console.log('flow mount')
      this.fetchItems()
    }
  },

  methods: {
    fetchItems() {
      // return the Promise from the action
      // console.log('flow fetch')
      return this.$store.dispatch('getTransactions')
    },
    handleHover(hovered) {
      this.isHovered = hovered
    },
    navigate() {
      this.$router.push({
        name: 'transactions',
      })
    },
    zoomOut() {
      // console.log('adds')
      // console.log(this.monthCount)
      // console.log(this.monthQty)
      if (this.monthCount < 12 && this.monthCount < this.monthQty) {
        this.monthCount += 1
      } else {
        this.toast('Zoom out')
      }
      // this.monthRemoveDisabled = false
      // if (this.monthCount === 12) {
      //   this.monthAddDisabled = true
      // }
    },
    zoomIn() {
      // Sync monthCount with monthQty, so '-' button works even if monthCount > monthQty
      if (this.monthCount > this.monthQty) this.monthCount = this.monthQty
      if (this.monthCount > 2) {
        this.monthCount -= 1
      } else {
        this.toast('Zoom in')
      }
      // this.monthAddDisabled = false
      // if (this.monthCount === 2) {
      //   this.monthRemoveDisabled = true
      // }
    },
    toast(toaster) {
      this.$bvToast.toast(`${toaster} - No more data`, {
        toaster: 'b-toaster-bottom-center',
        autoHideDelay: 3000,
        noCloseButton: true,
        variant: 'secondary',
        appendToast: true,
      })
    },
  },
  computed: {
    items() {
      // console.log('flow computed')
      const transactions = this.$store.getters.transactions
      // console.log(transactions);

      const filtered = transactions.filter(function(f) {
        return !f.Description.match(/autopay|automatic payment|transfer/gim)
        // g global (dont return after first match)
        // m multiline (probably not needed)
        // i case insensitive
      })
      // console.log(filtered);

      // IDEA seperate out this variable so it can be used for future lookups
      // e.g. all purchases for a given month (like pivot table double click)
      // const cashFlowByMonth = d3.nest()
      //   .key(function(d) {
      //     // group by month and year (first 7 characters)
      //     // "2020-01-01"
      //     return d.TransactionDate.substring(0, 7);
      //   })
      //   .entries(filtered);
      // console.log(cashFlowByMonth);

      const cashFlowByMonth = d3
        .nest()
        .key(function(d) {
          // group by month and year (first 7 characters)
          // "2020-01-01"
          return d.TransactionDate.substring(0, 7)
        })
        .rollup(function(v) {
          return {
            Count: v.length,
            Income: d3.sum(v, function(d) {
              if (d.Amount > 0) {
                return d.Amount
              }
            }),
            Spend: d3.sum(v, function(d) {
              if (d.Amount < 0) {
                return d.Amount
              }
            }),
            Net: d3.sum(v, function(d) {
              return d.Amount
            }),
            // avg: d3.mean(v, function(d) {
            //   return d.amount;
            // }),
          }
        })
        .object(filtered)
      // console.log(cashFlowByMonth)

      const income = Object.values(cashFlowByMonth).map((a) => a.Income)
      // console.log(income);
      const spend = Object.values(cashFlowByMonth).map((a) => a.Spend)
      // console.log(spend);
      const net = Object.values(cashFlowByMonth).map((a) => a.Net)
      // console.log(net);
      // const months = Object.keys(cashFlowByMonth)
      const months = Object.keys(cashFlowByMonth).map((a) =>
        dayjs(a).format('MMM')
      )

      return {
        cashFlowByMonth: cashFlowByMonth,
        income: income,
        spend: spend,
        net: net,
        months: months,
      }
    },
    // get count of months for use in add/remove buttons
    monthQty() {
      return this.items.months.length
    },
    datacollection() {
      const i = this.items
      const cnt = this.monthCount
      const income = i.income.slice(0, cnt)
      // console.log(income);
      const spend = i.spend.slice(0, cnt)
      const net = i.net.slice(0, cnt)

      // disregard current month for mean calculations
      var income2 = income.slice(1, cnt)
      // console.log(income2)
      const meanIncome = d3.mean(income2)
      const meanSpend = d3.mean(spend.slice(1, cnt))
      const meanNet = new Array(cnt)
      meanNet[cnt - 1] = d3.mean(net.slice(1, cnt))
      const expectedIncome =
        (dayjs().date() / dayjs().daysInMonth()) * meanIncome
      const expectedSpend = (dayjs().date() / dayjs().daysInMonth()) * meanSpend

      const months = i.months.slice(0, cnt)

      // bootstrap colors:
      // client/node_modules/bootstrap/dist/css/bootstrap.css

      return {
        datasets: [
          {
            // Changes this dataset to become a line
            type: 'line',
            data: net,
            lineTension: 0.3,
            backgroundColor: '#ffc107',
            borderColor: '#ffc107',
            fill: false,
            borderWidth: 5,
            order: 1,
            hitRadius: 20,
            datalabels: {
              display: 'auto',
            },
          },
          {
            data: income,
            backgroundColor: '#28a745',
            order: 2,
            barPercentage: 0.6,
          },
          {
            data: spend,
            backgroundColor: '#dc3545',
            order: 3,
            barPercentage: 0.6,
          },
          {
            type: 'line',
            data: meanNet,
            order: 0,
            datalabels: {
              display: true,
              align: 'left',
            },
          },
          {
            type: 'line',
            data: [meanSpend],
            borderColor: 'gray',
            borderWidth: 5,
            order: 0,
          },
          {
            type: 'line',
            data: [meanIncome],
            borderColor: 'gray',
            borderWidth: 5,
            order: 0,
          },
          {
            type: 'line',
            data: [expectedSpend],
            borderColor: 'gray',
            order: 0,
          },
          {
            type: 'line',
            data: [expectedIncome],
            borderColor: 'gray',
            order: 0,
          },
        ],
        labels: months,
      }
    },
  },
}
</script>

<style scoped>
.title {
  cursor: pointer;
}
</style>
