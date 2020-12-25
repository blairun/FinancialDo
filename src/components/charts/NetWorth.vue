<template>
  <b-card class="mb-4" v-b-hover="handleHover">
    <b-row class="mx-2">
      <b-card-title class="title" v-on:click="navigate">
        Net Worth
      </b-card-title>
      <!-- add refreshed date to chart title bar -->
      <b-card-title
        class="text-secondary ml-auto h6"
        :title="isHovered ? $store.getters.retrievalDates.balanceCharts : ''"
      >
      </b-card-title>
    </b-row>
    <chart-horizontal-bar
      :chart-data="datacollection"
      :options="chartOptions"
    ></chart-horizontal-bar>
  </b-card>
  <!-- </b-overlay> -->
</template>

<script>
import ChartHorizontalBar from './HorizontalBar'
import numeral from 'numeral'

export default {
  components: {
    ChartHorizontalBar,
  },
  data() {
    return {
      isHovered: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        normalized: true,
        // animation: {
        //   duration: 0,
        // },
        plugins: {
          // Change options for ALL labels of THIS CHART
          datalabels: {
            formatter: function(value) {
              //  formatter: function(value, context) {
              // return context.dataIndex + ': ' + Math.round(value*100) + '%';
              return numeral(value).format('$0,0')
            },
            anchor: 'start',
            align: 'end',
            color: 'gray',
            textStrokeColor: 'white',
            textStrokeWidth: 6,
            // textShadowBlur: 2,
            // textShadowColor: "gray",
            labels: {
              value: {
                font: {
                  size: 20,
                  // weight: "bold",
                },
              },
            },
          },
        },

        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
                fontSize: 20,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                display: false,
                beginAtZero: true,
                fontSize: 20,
                // Include a dollar sign in the ticks
                callback: function(value) {
                  return '$' + value
                },
              },
              gridLines: {
                display: false,
                lineWidth: 5,
              },
            },
          ],
        },

        legend: {
          display: false,
        },
        tooltips: {
          // Add pop ups to net worth showing accounts + amounts that are included in each bar
          enabled: true,
          // show nearest tooltip which makes it less of a hassle to click small bars
          intersect: false,
          position: 'average',
          titleFontSize: 14,
          bodyFontSize: 14,
          displayColors: false,
          callbacks: {
            label: (tooltipItems) => {
              // arrow functionsdon't have their own this binding, so 'this' is looked up in scope
              // console.log(this.chartLabels)
              const datasetIndex = tooltipItems.index
              // console.log(datasetIndex)
              // return numeral(tooltipItems.xLabel).format('$0,0')
              return this.items.chartLabels[datasetIndex]
            },
          },
        },
        layout: {
          // set padding to display the labels properly.
          padding: {
            left: 15,
          },
        },
      },
    }
  },

  mounted() {
    if (this.$store.getters.balances.length === 0) {
      // console.log('worth mount')
      this.fetchItems()
    }
  },

  methods: {
    fetchItems() {
      // return the Promise from the action
      // console.log('worth fetch')
      return this.$store.dispatch('getBalances')
    },
    handleHover(hovered) {
      this.isHovered = hovered
    },
    navigate() {
      this.$router.push({
        name: 'balances',
      })
    },
  },

  computed: {
    items() {
      // console.log('worth computed')
      // Sum up net worth values by balance account type in
      // data section of net worth chart, then use them in chart
      let totalAssets = 0,
        totalAssetsLabel = [],
        liquidAssets = 0,
        liquidAssetsLabel = [],
        cash = 0,
        cashLabel = [],
        liabilities = 0,
        liabilitiesLabel = [],
        cardDebt = 0,
        cardDebtLabel = [],
        cardLimit = 0,
        cardUsage = 0,
        netWorth = 0,
        netWorthLabel = []

      this.$store.getters.balances.forEach((i) => {
        // console.log(i.FriendlyName + " - $" + i.Current);
        // console.log(i.Type + " - " + i.Subtype);
        if (i.Type === 'depository' && i.Available !== 0) {
          // capture available instead of current for checking accounts
          totalAssets += i.Available
          totalAssetsLabel.push(label(i.Available))
        } else if (
          i.Type !== 'loan' &&
          i.Type !== 'credit' &&
          i.Current !== 0
        ) {
          totalAssets += i.Current
          totalAssetsLabel.push(label(i.Current))
        } else if (i.Current !== 0) {
          // } else {
          liabilities += i.Current
          liabilitiesLabel.push(label(i.Current))
        }
        if (i.Type === 'depository') {
          cash += i.Available
          cashLabel.push(label(i.Available))
        }
        if (i.Type === 'depository') {
          liquidAssets += i.Available
          liquidAssetsLabel.push(label(i.Available))
        } else if (i.Subtype === 'brokerage') {
          liquidAssets += i.Current
          liquidAssetsLabel.push(label(i.Current))
        }
        if (i.Type === 'credit') {
          cardDebt += i.Current
          cardDebtLabel.push(label(i.Current))
          cardLimit += i.Limit
        }

        function label(amount) {
          return (
            i.Institution +
            ' - ' +
            i.FriendlyName +
            ':   ' +
            numeral(amount).format('$0,0')
          )
        }
      })

      // console.log(totalAssets);
      cardUsage = numeral(cardDebt / cardLimit).format('0%')
      netWorth = totalAssets - liabilities
      netWorthLabel = [
        'Total Assets: ' + numeral(totalAssets).format('$0,0'),
        'Liabilities: ' + numeral(liabilities).format('$0,0'),
      ]

      let chartData = [
        totalAssets,
        liquidAssets,
        cash,
        liabilities,
        cardDebt,
        netWorth,
      ]

      let chartLabels = [
        totalAssetsLabel,
        liquidAssetsLabel,
        cashLabel,
        liabilitiesLabel,
        cardDebtLabel,
        netWorthLabel,
      ]
      // console.log(chartLabels)
      // can't update data var inside computed property:
      // this.chartLabels = chartLabels
      // console.log(this.chartLabels)
      // this.updateLabel(chartLabels)

      let x = 0
      while (x < chartData.length) {
        chartData[x] = chartData[x].toFixed(2)
        x++
      }

      return {
        chartData: chartData,
        cardUsage: cardUsage,
        chartLabels: chartLabels,
      }
    },

    datacollection() {
      return {
        labels: [
          'Total Assets',
          'Liquid Assets',
          'Cash',
          'Liabilities',
          `Card debt (${this.items.cardUsage})`,
          // TODO highlight if > 10%
          // "Credit Usage",
          'Net Worth',
        ],
        datasets: [
          {
            label: '$',
            data: this.items.chartData,
            backgroundColor: [
              // use success/danger color palette
              '#28a745',
              '#aae9b9',
              '#aae9b9',
              '#dc3545',
              '#f0b2b8',
              `#28a745`,
            ],
          },
        ],
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
