import Chart from 'chart.js'
import { Bar, mixins } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const { reactiveProp } = mixins

// careful! doing this affects all charts
Chart.defaults.global.defaultFontSize = 20

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.addPlugin({
      ChartDataLabels,
    })
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  },
}
