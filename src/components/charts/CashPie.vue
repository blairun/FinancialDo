<template>
  <b-card class="mx-4 mb-4" v-b-hover="handleHover">
    <b-row class="mx-2">
      <!-- Discretionary Spending -->
      <b-card-title class="title" v-on:click="navigate">
        {{ monthFormatted }} Budget
      </b-card-title>
      <!-- <b-card-title
        class="text-secondary ml-auto h6"
        :title="
          isHovered ? $store.getters.retrievalDates.transactionCharts : ''
        "
      >
      </b-card-title> -->
      <!-- allow user to pick month -->
      <b-card-title class="ml-auto">
        <b-button-group size="sm">
          <b-button
            @click="back"
            variant="light"
            :disabled="monthBeforeDisabled"
          >
            <b-icon icon="chevron-left"></b-icon>
          </b-button>
          <b-button
            @click="forward"
            variant="light"
            :disabled="monthAfterDisabled"
          >
            <b-icon icon="chevron-right"></b-icon>
          </b-button>
        </b-button-group>
      </b-card-title>
    </b-row>
    <chart-pie :chart-data="datacollection" :options="chartOptions"></chart-pie>
  </b-card>
</template>

<script>
import ChartPie from './Pie'
import numeral from 'numeral'
import * as d3 from 'd3'
import dayjs from 'dayjs'
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

export default {
  components: {
    ChartPie,
  },

  data() {
    let month = dayjs()
    let monthFormatted = dayjs(month).format('MMMM')
    let dateRatio = dayjs().date() / dayjs().daysInMonth()
    return {
      dateRatio: dateRatio,
      month: month,
      monthFormatted: monthFormatted,
      monthBefore: -1,
      monthAfter: 1,
      monthBeforeDisabled: false,
      monthAfterDisabled: true,
      legendPosition: 'right',
      currentSpendColor: '#28a745',
      isHovered: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        normalized: true,
        // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        // animation: {
        //   duration: 0,
        // },
        rotation: Math.PI,
        cutoutPercentage: 30,
        circumference: 1 * Math.PI,

        // // clicking white donuts takes you to current month's transactions
        // onClick: async (evt, array) => {
        //   // console.log(array)
        //   // console.log(evt)
        //   try {
        //     // if (array.length != 0) {
        //     if (array[0]._datasetIndex > 1) {
        //       this.$store.commit('updateAppText', {
        //         prop: 'transactionsFilter',
        //         text: dayjs().format('YYYY-MM'),
        //       })
        //       this.$router.push({
        //         name: 'transactions',
        //       })
        //     } else {
        //       // otherwise clicking on the legend would also navigate to transactions
        //       // console.log('You selected the background!')
        //     }
        //   } catch (error) {
        //     //  console.log(error);
        //   }
        // },

        plugins: {
          // Change options for ALL labels of THIS CHART
          datalabels: {
            formatter: function(value) {
              // console.log(value)
              if (value === 0) return null
              return numeral(value).format('$0,0')
            },
            // display: 'auto',
            display: (data) => {
              // always show overspent categories
              if (this.highlightCurrentData(data) === 'over') return true
              return 'auto'
            },
            color: (data) => {
              // console.log(data)
              if (this.highlightCurrentData(data) === 'under') return '#28a745'
              if (this.highlightCurrentData(data) === 'over') return '#dc3545'
              // else default 'gray'
            },
            textStrokeColor: 'white',
            textStrokeWidth: 6,

            labels: {
              value: {
                font: {
                  size: 20,
                },
                // font: (data) => {
                //   if (this.highlightCurrentData(data) === 'over') {
                //     return {
                //       size: 20,
                //       // style: 'italic',
                //       // style: 'bold',
                //     }
                //   }
                //   return { size: 20 }
                // },
              },
            },
          },
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontSize: 20,
          },
        },
        tooltips: {
          // Add pop ups to net worth showing accounts + amounts that are included in each bar
          enabled: true,
          titleFontSize: 14,
          bodyFontSize: 14,
          filter: function(tooltipItem) {
            return tooltipItem.datasetIndex < 2
          },
          callbacks: {
            label: (tooltipItems, data) => {
              // console.log(tooltipItems)
              // console.log(data)
              // arrow functions don't have their own this binding, so 'this' is looked up in scope
              let label = this.items.chartLabels[tooltipItems.index]
              let value =
                data.datasets[tooltipItems.datasetIndex].data[
                  tooltipItems.index
                ]
              // console.log(value)
              let formattedValue = numeral(value).format('$0,0')

              let count = ''
              // current
              if (tooltipItems.datasetIndex === 0) {
                // count = this.items.currentCount[tooltipItems.index]
                let transactions = []
                if (this.items.currentTransactions[tooltipItems.index]) {
                  transactions = this.items.currentTransactions[
                    tooltipItems.index
                  ]
                } else {
                  return `${label}: ${formattedValue}`
                }
                if (transactions[1] !== '-----------------') {
                  transactions.unshift('-----------------')
                  transactions.unshift(`${label}: ${formattedValue}`)
                }
                // let trans = JSON.stringify(transactions).slice(1, -1)
                // let newArray = transactions.slice()
                // return [[`${label}: ${formattedValue}`], JSON.parse(trans)]
                return transactions
              }
              // past
              else if (tooltipItems.datasetIndex === 1) {
                count = Math.round(this.items.pastCount[tooltipItems.index] / 6)
                // console.log(count)
                return [
                  [`${label}: ${formattedValue}`],
                  [`Transaction count: ${count}`],
                ]
              }
            },
          },
        },
        layout: {
          // set padding to display the labels properly.
          padding: {
            left: 10,
            right: 10,
          },
        },
      },
    }
  },

  // redundant because cash flow chart already updates transactions
  // mounted() {
  //   console.log(this.$store.getters.transactions.length)
  //   if (this.$store.getters.transactions.length === 0) {
  //     console.log('pie mount')
  //     this.fetchItems()
  //   }
  // },

  methods: {
    // fetchItems() {
    //   console.log('pie fetch')
    //   // return the Promise from the action
    //   return this.$store.dispatch('getTransactions')
    // },
    handleHover(hovered) {
      this.isHovered = hovered
    },
    changeColor(color) {
      this.currentSpendColor = color
    },
    navigate() {
      this.$store.commit('updateAppText', {
        prop: 'transactionsFilter',
        text: dayjs(this.month).format('YYYY-MM'),
      })
      this.$router.push({
        name: 'transactions',
      })
    },
    back() {
      if (this.month > dayjs().subtract(12, 'M')) {
        this.monthBefore -= 1
        this.monthAfter -= 1
        this.month = dayjs(this.month).subtract(1, 'M')
        this.monthFormatted = dayjs(this.month).format('MMMM')
      }
      // limit history to one year back
      if (this.month > dayjs().subtract(12, 'M')) {
        this.monthBeforeDisabled = false
        this.monthAfterDisabled = false
        this.dateRatio = 1
      } else {
        this.monthBeforeDisabled = true
        this.monthAfterDisabled = false
        this.dateRatio = 1
      }
    },
    forward() {
      if (this.month < dayjs().subtract(1, 'M')) {
        this.monthBefore += 1
        this.monthAfter += 1
        this.month = dayjs(this.month).add(1, 'M')
        this.monthFormatted = dayjs(this.month).format('MMMM')
      }
      if (this.month < dayjs().subtract(1, 'M')) {
        this.monthAfterDisabled = false
        this.monthBeforeDisabled = false
        this.dateRatio = 1
      } else {
        this.monthAfterDisabled = true
        this.monthBeforeDisabled = false
        this.dateRatio = dayjs().date() / dayjs().daysInMonth()
      }
    },
    highlightCurrentData(data) {
      if (data.datasetIndex === 0) {
        if (!this.items.pastData[data.dataIndex]) {
          // don't highlight remainder value
          return
        } else if (
          data.dataset.data[data.dataIndex] >
          this.items.pastData[data.dataIndex]
        ) {
          return 'over'
        } else {
          return 'under'
        }
      }
      // return false
    },
  },

  computed: {
    // currentMonth() {
    //   return dayjs().format('MMMM')
    // },

    items() {
      // console.log('pie computed')
      // categorize transactions
      const transactions = this.$store.getters.transactions
      // console.log(transactions)

      function filter(begin = -1, end = 1) {
        const filtered = transactions
          .filter(function(f) {
            return dayjs(f.TransactionDate).isBetween(
              dayjs().add(begin, 'M'),
              dayjs().add(end, 'M'),
              'M'
            )
          })
          .filter(function(f) {
            return !f.Description.match(/autopay|automatic payment|transfer/gim)
            // g global (dont return after first match)
            // i case insensitive
            // m multiline (probably not needed)
          })
          .filter(function(f) {
            // further filter out by Expenses (rather than Income)
            return f.Amount < 0
          })
          .filter(function(f) {
            // further filter out nodiscretionary transactions by Category
            // console.log(f.Category)
            // IDEA have Loans/Utilities (Bills) visible somewhere on the chart
            return !f.Category.match(
              /Transfer,Deposit|Loans|Utilities|Cable|Billpay|Insurance/gim
            )
          })
        // console.log(filtered)
        return filtered
      }

      // pull in transactions from current month (or uncomment for past 1-3 months)
      let currentFiltered = filter(this.monthBefore, this.monthAfter)
      // let currentFiltered = filter(-0, -2)
      // let currentFiltered = filter(-1, -3)
      // let currentFiltered = filter(-2, -4)
      // let currentFiltered = filter(-3, -5)
      // let currentFiltered = filter(-4, -6)
      // create baseline from last six months of transactions
      let pastFiltered = filter(0, -7)

      function categorize(filteredExpenses, divisor = 1) {
        // 5 categories
        const categories = [
          {
            category: 'Groceries',
            descriptions: [
              'Food and Drink,Restaurants',
              'Shops,Food and Beverage Store',
              'Shops,Supermarkets and Groceries',
              'Shops,Warehouses and Wholesale Stores',
            ],
          },
          {
            category: 'Shopping',
            descriptions: [
              'Shops,Clothing and Accessories',
              'Shops,Discount Stores',
              'Shops,Hardware Store',
              'Service,Personal Care',
              'Shops,Convenience Stores',
              'Shops,Digital Purchase',
            ],
          },
          {
            category: 'Entertainment',
            descriptions: [
              'Recreation,Gyms and Fitness Centers',
              'Shops,Computers and Electronics,Video Games',
              'Service,Subscription',
              'Service,Entertainment',
            ],
          },
          {
            category: 'Cars',
            descriptions: [
              'Service,Automotive,Maintenance and Repair',
              'Travel,Gas Stations',
            ],
            // Other
          },
        ]

        // console.log(filteredExpenses)

        // create cleaner groups based on plaid category descriptions
        filteredExpenses.forEach(function(obj) {
          // using some rather than forEach since you can break out of some
          categories.some(function(element) {
            if (element.descriptions.includes(obj.Category)) {
              obj.cat = element.category
              return true
            }
          })
          if (!obj.cat) {
            // console.log(obj)
            obj.cat = 'Other'
          }
        })

        // add order and fill in array in case categories are missing (e.g. at beginning of month)
        filteredExpenses.push(
          { cat: 'Groceries', order: 1 },
          { cat: 'Shopping', order: 2 },
          { cat: 'Entertainment', order: 3 },
          { cat: 'Cars', order: 4 },
          { cat: 'Other', order: 5 }
        )

        const expensesByType = d3
          .nest()
          .key(function(d) {
            // sum by category
            return d.cat
          })
          .rollup(function(v) {
            return {
              count: v.length,
              spend: d3.sum(v, function(d) {
                return Math.abs(d.Amount) / divisor
              }),
              order: d3.max(v, function(d) {
                return d.order
              }),
              transactions: v.map(function(d) {
                let amount = numeral(Math.abs(d.Amount)).format('$0,0')
                // console.log(d.Description)
                if (!d.Merchant) {
                  try {
                    let desc = toTitleCase(d.Description)
                    desc =
                      desc.length > 25 ? desc.substring(0, 25) + '... ' : desc
                    return [`${desc}: ${amount}`]
                  } catch (error) {
                    // console.log(error)
                  }
                } else return [`${d.Merchant}: ${amount}`]
              }),
            }
          })
          .entries(filteredExpenses)
        // console.log(expensesByType)

        // used above
        function toTitleCase(str) {
          return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          })
        }

        // sort from largest to smallest
        expensesByType.sort(function(a, b) {
          // console.log(b.value.order)
          return a.value.order - b.value.order
        })
        // console.log(expensesByType)

        var spend = expensesByType.map(function(d) {
          return d.value.spend
        })
        // console.log(spend)
        var count = expensesByType.map(function(d) {
          // remove placeholder value that was added to filteredExpenses above
          return d.value.count - 1
        })
        // console.log(count)
        var transactions = expensesByType.map(function(d) {
          // remove placeholder value (last element of array) that was added to filteredExpenses above
          d.value.transactions.pop()
          return d.value.transactions
        })
        // console.log(transactions)
        var labels = expensesByType.map(function(d) {
          return d.key
        })
        // console.log(labels)
        return {
          spend: spend,
          count: count,
          transactions: transactions,
          labels: labels,
        }
      }

      // categorize current month's transactions
      let currentCategorized = categorize(currentFiltered)
      // console.log(currentCategorized)

      // categorize last six months of transactions
      let pastCategorized = categorize(pastFiltered, 6)
      // console.log(pastCategorized)

      // start these off with $0.01 so the chart has some non-zero value
      let pastSum = 0.01
      let currentSum = 0.01
      for (let i = 0; i < pastCategorized.spend.length; i++) {
        const p = pastCategorized.spend[i]
        const c = currentCategorized.spend[i]
        pastSum += p
        currentSum += c
      }
      let diff = pastSum - currentSum
      // console.log(diff)
      // add remaining spend to current rainbow chart
      if (diff < 0) {
        pastCategorized.spend.push(-diff)
      } else {
        currentCategorized.spend.push(diff)
        currentCategorized.labels.push('Remaining')
      }

      // highlight spent if it is above expected amount for this time of the month
      let expected = pastSum * this.dateRatio - currentSum
      if (expected < 0) {
        this.changeColor('#dc3545')
      } else {
        this.changeColor('#28a745')
      }

      return {
        currentData: currentCategorized.spend,
        pastData: pastCategorized.spend,
        currentSum: currentSum,
        pastSum: pastSum,
        currentCount: currentCategorized.count,
        currentTransactions: currentCategorized.transactions,
        pastCount: pastCategorized.count,
        chartLabels: currentCategorized.labels,
      }
    },

    datacollection() {
      return {
        datasets: [
          {
            data: this.items.currentData,
            // borderColor: (data) => {
            //   if (this.highlightCurrentData(data) === 'over') return '#dc3545'
            // },
            borderColor: '#ffffff00',
            backgroundColor: [
              '#6f42c1',
              '#007bff',
              '#20c997',
              '#ffc107',
              // '#e83e8c',
              '#fd7e14',
            ],
          },

          {
            data: this.items.pastData,
            borderColor: '#ffffff00',
            backgroundColor: [
              '#ad93dc',
              '#8fc5ff',
              '#7beac9',
              '#fee18a',
              // '#f49fc7',
              '#febc86',
              '#ffffff00',
            ],
          },
          // signpost to compare current date with spending progress
          // {
          //   data: [30, 1, 70],
          //   backgroundColor: ['#ffffff00', '#828282', '#ffffff00'],
          //   borderColor: '#ffffff00',
          //   hoverBackgroundColor: '#ffffff00',
          //   hoverBorderColor: '#ffffff00',
          //   datalabels: {
          //     display: false,
          //   },
          // },
          {
            data: [this.items.currentSum],
            backgroundColor: '#ffffff00',
            borderColor: '#ffffff00',
            hoverBackgroundColor: '#ffffff00',
            hoverBorderColor: '#ffffff00',
            datalabels: {
              formatter: function(value, data) {
                // console.log(data)
                value = Math.round(value / 100) * 100
                let v = numeral(value).format('$0,0')
                let current = data.chart.data.datasets[0].data
                // console.log(current)
                // look for remainder value in current dataset
                if (current[5]) {
                  // return `Spent: ${v}\nRemaining: ${current[5]}`
                  return `Spent: ${v}`
                } else {
                  // return `Spent: ${v}\nOver!`
                  return `Spent: ${v}`
                }
              },
              display: 'true',
              align: 'start',
              offset: 20,
              color: this.currentSpendColor,
            },
          },
          {
            data: [this.items.pastSum],
            backgroundColor: '#ffffff00',
            borderColor: '#ffffff00',
            hoverBackgroundColor: '#ffffff00',
            hoverBorderColor: '#ffffff00',
            datalabels: {
              formatter: (value) => {
                value = value * this.dateRatio
                value = Math.round(value / 100) * 100
                let v = numeral(value).format('$0,0')
                return `Expected: ${v}`
              },
              display: 'true',
              align: 'start',
              offset: 20,
              // color: this.currentSpendColor,
            },
          },
        ],
        labels: this.items.chartLabels,
      }
    },
  },
}
</script>

<style scoped>
/* https://www.digitalocean.com/community/tutorials/css-cursor-property */
.title {
  cursor: pointer;
}
/* --blue: #007bff;#8fc5ff
  --indigo: #6610f2;#af82f7
  --purple: #6f42c1; #ad93dc
  --pink: #e83e8c;#f49fc7
  --red: #dc3545; '#eb939c'
  --orange: #fd7e14;#febc86
  --yellow: #ffc107; '#fee18a'
  --green: #28a745;#78dd90
  --teal: #20c997;#7beac9
  --cyan: #17a2b8; '#66d9eb'
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40; */
</style>
