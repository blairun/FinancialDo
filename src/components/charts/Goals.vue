<template>
  <b-card class="mx-4 mb-4" v-b-hover="handleHover">
    <b-row class="mx-2">
      <b-card-title class="title" v-on:click="navigate">
        {{ year }} Goals
      </b-card-title>
      <!-- adds popup to available savings number like spreadsheet -->
      <b-card-title
        class="text-secondary ml-auto h6"
        :title="isHovered ? $store.getters.appText.goalChart : ''"
        v-b-popover.hover.topleft="popover"
      >
      </b-card-title>
    </b-row>
    <chart-horizontal-bar
      class="fixed-height-chart"
      :chart-data="datacollection"
      :options="chartOptions"
    ></chart-horizontal-bar>
  </b-card>
</template>

<script>
import ChartHorizontalBar from './HorizontalBar'
import numeral from 'numeral'
import dayjs from 'dayjs'
var dayOfYear = require('dayjs/plugin/dayOfYear')
dayjs.extend(dayOfYear)
var advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)
import * as d3 from 'd3'

export default {
  components: {
    ChartHorizontalBar,
  },
  data() {
    let date = dayjs().format('MMM Do')
    let year = dayjs().year()
    let dateRatio = (dayjs().dayOfYear() / 365) * 100
    // console.log(dateRatio);
    return {
      year: year,
      isHovered: false,
      popover: `Money currently available for goals.`,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 5,
        normalized: true,

        animation: {
          duration: 0,
        },
        plugins: {
          // totalizer: [totalizer],
          // Change options for ALL labels of THIS CHART
          datalabels: {
            formatter: (_value, context) => {
              const data = context.chart.data
              const { datasetIndex, dataIndex } = context
              return `${numeral(
                data.originalData[datasetIndex][dataIndex]
              ).format('$0.0a')}`
            },
            //   (${numeral(
            //     data.calculatedData[datasetIndex][dataIndex] / 100
            //   ).format("0%")})`;
            // },

            anchor: 'start',
            align: 'end',
            color: 'gray',
            textStrokeColor: 'white',
            textStrokeWidth: 6,
            labels: {
              value: {
                font: {
                  size: 20,
                },
              },
            },
          },

          stacked100: { enable: true, replaceTooltipLabel: false },
        },

        // FIXME !! Annotations and tooltips broke. Try it with real data?
        annotation: {
          annotations: [
            {
              // drawTime: 'beforeDatasetsDraw',
              drawTime: 'afterDatasetsDraw',
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: dateRatio,
              borderColor: 'white',
              borderWidth: 4,
              // borderDash: [5, 5],
              // borderDashOffset: 5,
              label: {
                enabled: true,
                fontFamily: 'Segoe UI',
                // Font style of text, default is bold
                fontStyle: '',
                fontSize: 20,
                backgroundColor: 'rgba(0,0,0,0)',
                fontColor: 'gray',
                content: date,
                position: 'top',
                yAdjust: -6,
                xAdjust: 45,
              },
            },
          ],
        },

        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                reverse: true,
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
              stacked: true,
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
          enabled: true,
          mode: 'single',
          titleFontSize: 14,
          bodyFontSize: 14,
          callbacks: {
            // show % and amount
            label: (tooltipItem, data) => {
              // console.log(data);
              const datasetIndex = tooltipItem.datasetIndex
              // const datasetLabel = data.datasets[datasetIndex].label;
              const originalValue =
                data.originalData[datasetIndex][tooltipItem.index]
              const percentValue =
                data.calculatedData[datasetIndex][tooltipItem.index]
              // console.log(percentValue);
              return `${numeral(originalValue).format(
                '$0,0'
              )}  ${percentValue}%`
            },
          },
        },
        layout: {
          // set padding to display the labels properly.
          padding: {
            // left: 15,
          },
        },
      },
    }
  },

  mounted() {
    // console.log(this.$store.getters.goals.length);
    if (this.$store.getters.goals.length === 0) {
      this.fetchItems()
    }
    // console.log(this.$store.getters.marketData.length);
    if (this.$store.getters.marketData.length === 0) {
      this.fetchMarketData()
    }

    setTimeout(() => {
      let balances = this.$store.getters.balances
      // console.log(balances);
      balances.forEach((i) => {
        if (i.Subtype === 'money market') {
          // console.log(i.FriendlyName);
          this.$store.commit('updateAppText', {
            prop: 'goalChart',
            text: numeral(i.Current).format('$0,0'),
          })
        }
      })
    }, 1000) // give data a chance to load before polling
  },

  methods: {
    fetchItems() {
      // return the Promise from the action
      return this.$store.dispatch('getGoals')
    },
    fetchMarketData() {
      // return the Promise from the action
      return this.$store.dispatch('getMarketData')
    },
    handleHover(hovered) {
      this.isHovered = hovered
    },
    navigate() {
      // this.$router.push({
      //   name: 'goals',
      // })
    },
  },

  computed: {
    items() {
      const goals = this.$store.getters.goals
      // console.log(goals);
      const marketData = this.$store.getters.marketData
      // console.log("goals Market Data");
      // console.log(marketData);
      let marketFlux = 1
      if (marketData.length > 0) {
        marketFlux =
          marketData[marketData.length - 1].close / marketData[0].close
      }
      // console.log(marketFlux);

      const goalSummary = d3
        .nest()
        .key(function(d) {
          // group by goal ID
          // console.log(d.Name);
          return d.Name
        })
        .rollup(function(v) {
          // console.log(v);
          return {
            Start: d3.mean(v, function(d) {
              // include market fluctuations in retirement goal by mutiplying
              // starting value by market % change since the beginning of the year
              // console.log(d);
              if (d.Name === 'Retirement') {
                return d.Start * marketFlux
              } else {
                return d.Start
              }
            }),
            Add: d3.mean(v, function(d) {
              return d.Add
            }),
            Current: d3.sum(v, function(d) {
              // Enables home equity to be included in down payment goal
              if (d.Type === 'loan') {
                return -d.Current
              } else {
                return d.Current
              }
            }),
          }
        })
        .object(goals)
      // console.log(goalSummary);

      const names = Object.keys(goalSummary).map((a) => a)
      // console.log(names)

      const current = Object.values(goalSummary).map((a) => {
        if (a.Current < 0) return 0
        return a.Current
      })
      // console.log(current)

      const progress = Object.values(goalSummary).map((a) => {
        if (a.Current - a.Start < 0) return 0
        return a.Current - a.Start
      })
      // console.log(progress)

      const remaining = Object.values(goalSummary).map((a) => {
        let remaining = a.Start + a.Add - a.Current
        // don't let remaining go negative
        if (remaining < 0) remaining = 0
        // don't let it get bigger than goal (if a.Current is negative)
        if (remaining > a.Add) remaining = a.Add
        return remaining
      })
      // console.log(remaining)

      return {
        names: names,
        current: current,
        progress: progress,
        remaining: remaining,
      }
    },

    // bootstrap colors:
    // ./client/node_modules/bootstrap/dist/css/bootstrap.css

    datacollection() {
      return {
        labels: this.items.names,
        datasets: [
          {
            // data: this.items.current, // absolute
            data: this.items.progress, // relative
            stack: 'goals',
            backgroundColor: '#fd7e14',
            barPercentage: 0.7,
          },
          {
            label: '$',
            data: this.items.remaining,
            stack: 'goals',
            backgroundColor: '#6f42c1',
            barPercentage: 0.7,
            datalabels: {
              // https://github.com/chartjs/chartjs-plugin-datalabels/issues/16
              formatter: (value, ctx) => {
                const data = ctx.chart.data.originalData
                let sum = 0
                data.map((dataset) => {
                  sum += dataset[ctx.dataIndex]
                })
                return numeral(sum).format('$0a')
              },
              anchor: 'end',
              align: 'start',
            },
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
.fixed-height-chart {
  height: 250px;
}
/* .title {
  cursor: pointer; */
/* } */
</style>
