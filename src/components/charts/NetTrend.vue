<template>
  <b-card class="mb-4" v-b-hover="handleHover">
    <b-row class="mx-2">
      <b-card-title class="title" v-on:click="navigate">
        Net Worth Trend
      </b-card-title>
      <!-- show difference in top right of chart-->
      <b-card-title
        class="text-secondary ml-auto h6"
        :style="empty ? 'display:none' : 'display:block'"
        :title="isHovered ? $store.getters.appText.netTrendChart : ''"
      >
      </b-card-title>
      <!-- allow user to choose different market indexes to compare with net worth trend -->
      <div class="text-secondary ml-lg-auto">
        <b-form-select
          v-model="selected"
          :style="empty ? 'display:none' : 'display:block'"
          :options="options"
          size="sm"
          v-on:change="updateMarketData"
        ></b-form-select>
      </div>
      <b-card-title
        class="text-secondary ml-auto h5"
        :style="empty ? 'display:block' : 'display:none'"
        ><a href="#/balances">Update balances</a> to see the trend.
      </b-card-title>
    </b-row>

    <!-- :style="empty ? 'display:none' : 'display:block'" -->
    <!-- IDEA Update net worth when clicking on net tend -->
    <chart-line
      :chart-data="datacollection"
      :options="chartOptions"
    ></chart-line>
  </b-card>
</template>

<script>
import ChartLine from './Line'
import numeral from 'numeral'
import * as d3 from 'd3'
import dayjs from 'dayjs'

export default {
  components: {
    ChartLine,
  },

  data() {
    return {
      isHovered: false,
      selected: 'TRRMX',
      options: [
        { value: null, text: 'Select market index', disabled: true },
        { value: 'DIA', text: 'Compare with Dow' },
        { value: 'SPY', text: 'Compare with S&P 500' },
        { value: 'QQQ', text: 'Compare with Nasdaq' },
        { value: 'TRRMX', text: 'Compare with T.RowePrice' },
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        normalized: true,
        // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        events: ['click', 'touchmove'],
        animation: {
          // duration: 0,
        },
        // clicking net trend item takes you to balance snapshot
        onClick: async (evt, array) => {
          if (array.length != 0) {
            var position = array[0]._index
            // console.log(position)
            // console.log(this)
            var activeElement = this._watchers[0].value.data[position]
            // console.log(activeElement)
            let date = dayjs(activeElement.t).format('YYYY-MM-DD')
            await this.$store.dispatch('datePickerValue', date)

            this.$store.commit('updateRetrievalDates', {
              prop: 'datePickerValue',
              date: date,
            })
            // this.$router.push({
            //   name: 'balances',
            // })
          } else {
            // console.log('You selected the background!')
          }
        },
        plugins: {
          // Change options for ALL labels of THIS CHART
          // IDEA allow date range selection
          datalabels: {
            display: false,
            formatter: function(value) {
              return numeral(value.y).format('$0,0')
            },
            align: 'end',
            color: 'gray',
            textStrokeColor: 'white',
            textStrokeWidth: 6,
            // display: "auto",
            labels: {
              value: {
                font: {
                  size: 20,
                },
              },
            },
          },
        },

        // raidus = 0 removes dots from line
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          yAxes: [
            {
              id: 'A',
              position: 'right',
              type: 'linear',
              ticks: {
                display: true,
                fontSize: 20,
                maxTicksLimit: 5,
                // stepSize: max - min,
                // min: min,
                // max: max,
                callback: function(label) {
                  return numeral(label).format('$0a')
                },
              },
              gridLines: {
                display: false,
              },
            },
            {
              id: 'B',
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
              type: 'time',
              time: {
                tooltipFormat: 'MMM D, Y',
                // unit: "day",
                // unit: "week",
                // unit: "month",
              },
              ticks: {
                display: true,
                maxTicksLimit: 6,
                beginAtZero: true,
                fontSize: 20,
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
          intersect: false,
          enabled: true,
          titleFontSize: 14,
          bodyFontSize: 14,
          // mode: "nearest",
          // Don't allow pop ups for market line
          filter: function(tooltipItems) {
            return tooltipItems.datasetIndex < 1
          },
          callbacks: {
            label: function(tooltipItems) {
              return numeral(tooltipItems.yLabel).format('$0,0')
            },
          },
        },
        layout: {
          // set padding to display the labels properly.
          padding: {
            // top: ,
            // right: 30,
          },
        },
      },
    }
  },

  mounted() {
    // avoid stutters by giving other charts chance to load before this heavy operation
    setTimeout(() => {
      if (this.$store.getters.balancesAll.length === 0) {
        // console.log('trend all mounted')
        this.fetchItems()
      }
      if (this.$store.getters.marketData.length === 0) {
        // console.log('trend market mounted')
        this.fetchMarketData()
      }
    }, 1000)
  },

  methods: {
    fetchItems() {
      // return the Promise from the action
      // console.log('trend all fetch')
      return this.$store.dispatch('getBalancesAll')
    },
    fetchMarketData() {
      // return the Promise from the action
      // console.log('trend market fetch')
      return this.$store.dispatch('getMarketData')
    },
    handleHover(hovered) {
      this.isHovered = hovered
    },
    navigate() {
      this.$router.push({
        name: 'balances',
      })
    },
    async updateMarketData() {
      this.$store.commit('updateAppText', {
        prop: 'marketIndex',
        text: this.selected,
      })
      await this.$store.dispatch(
        'getMarketData',
        this.$store.getters.appText.marketIndex
      )
    },
  },

  // watch: {
  //   empty(empty) {
  //     console.log('empty changed: ' + empty)
  //   },
  // },

  computed: {
    items() {
      // console.log('trend computed')
      const balancesAll = this.$store.getters.balancesAll
      // console.log(balancesAll);

      const netWorthObj = d3
        .nest()
        .key(function(d) {
          return d.RetrievalDate
        })
        // stoping before rollup would give you balances grouped by retrieval date
        .rollup(function(v) {
          // Sum up net worth by balance retrieval date
          // console.log(v);
          let netWorth = d3.sum(v, function(d) {
            let totalAssets = null
            let liabilities = null

            if (d.Type !== 'loan' && d.Type !== 'credit') {
              // Current net worth may differ from net worth chart
              // due to usage of .current vs .available values
              totalAssets += d.Current
            } else {
              liabilities += d.Current
            }
            return totalAssets - liabilities
          })
          return {
            count: v.length,
            netWorth: netWorth,
          }
        })
        .entries(balancesAll)
      // console.log(netWorthObj)

      // sort netWorthObj by iso timestamps
      netWorthObj.sort(function(a, b) {
        return a.key < b.key ? -1 : a.key > b.key ? 1 : 0
      })

      var net = netWorthObj.map(function(d) {
        return d.value.netWorth
      })
      // console.log(net)

      // dateRange of all balances data object
      var dateRange = netWorthObj.map(function(d) {
        return d.key
      })
      // console.log(dateRange)

      var a = dayjs(dateRange[dateRange.length])
      var b = dayjs(dateRange[0])

      // rough number of workdays in data range (used for market data slice below)
      var dayRange = Math.round(a.diff(b, 'days') * (5 / 7) - 2)
      // console.log(dayRange)

      var min = Math.min(...net)
      var max = Math.max(...net)
      var dif = numeral(max - min).format('$0,0')
      // console.log(dif);
      // var mean = numeral(d3.mean(net)).format("$0,0");
      // console.log(mean);
      this.$store.commit('updateAppText', {
        prop: 'netTrendChart',
        // text: `dif: ${dif} mean: ${mean}`,
        text: `${dif} swing`,
      })

      var data = netWorthObj.map(function(d) {
        return {
          t: dayjs(d.key).format(),
          y: d.value.netWorth,
        }
      })
      // console.log(data)

      const marketData = this.$store.getters.marketData
      // console.log(marketData)
      const mrktData = marketData.slice(
        marketData.length - dayRange, // days of market data to show
        marketData.length
      )

      var mdata = mrktData.map(function(d) {
        return {
          t: dayjs(d.date)
            // add a day since accounts don't react to market data immediately
            .add(1, 'days')
            .format(),
          y: d.close,
        }
      })
      // console.log(mdata)

      return {
        data: data,
        net: net,
        max: max,
        min: min,
        mdata: mdata,
      }
    },

    empty() {
      // console.log(this.items.data)
      return this.items.data.length < 2 ? true : false
    },

    datacollection() {
      // console.log(this.items)
      return {
        datasets: [
          {
            data: this.items.data,
            lineTension: 0.3,
            backgroundColor: '#ffc107',
            borderColor: '#ffc107',
            // hoverRadius: 15,
            hitRadius: 20,
            // pointHoverRadius: 15,
            // pointHoverBackgroundColor: '#ffc107',
            fill: false,
            borderWidth: 5,
            order: 1,
            yAxisID: 'A',
          },
          {
            data: this.items.mdata,
            lineTension: 0.3,
            backgroundColor: '#eeee',
            borderColor: '#eeee',
            fill: false,
            borderWidth: 5,
            order: 2,
            yAxisID: 'B',
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
