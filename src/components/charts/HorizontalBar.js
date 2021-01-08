import { HorizontalBar, mixins } from 'vue-chartjs'
import chartStacked100 from 'chartjs-plugin-stacked100'
import chartDataLabels from 'chartjs-plugin-datalabels'
import chartAnnotation from 'chartjs-plugin-annotation'

const { reactiveProp } = mixins

export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    // load stacked first since datalabels depend on it
    this.addPlugin([chartStacked100, chartDataLabels])

    // https://github.com/apertureless/vue-chartjs/issues/673
    this.addPlugin(chartAnnotation)
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  },
}
