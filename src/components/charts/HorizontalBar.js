import { HorizontalBar, mixins } from 'vue-chartjs'
import chartAnnotation from 'chartjs-plugin-annotation'
import chartDataLabels from 'chartjs-plugin-datalabels'
import chartStacked100 from 'chartjs-plugin-stacked100'

const { reactiveProp } = mixins

export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.addPlugin({
      chartAnnotation,
      chartDataLabels,
      chartStacked100,
    })
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  },
}
