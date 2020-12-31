<template>
  <div class="goals pt-4 px-4">
    <chart-goals />
    <!-- TODO ! form to add/update goals. Currently added/updated through database -->

    <b-card class="mb-4" title="Edit Goals">
      Under construction...
    </b-card>
  </div>
</template>

<script>
import ChartGoals from '@/components/charts/Goals.vue'

export default {
  name: 'Goals',
  components: {
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

<style></style>
