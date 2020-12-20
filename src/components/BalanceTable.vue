<template>
  <div class="balance-table px-3">
    <!-- IDEA Ctrl click for quick balance calculator or shift click balances to see total -->
    <!-- these would be useful in the goal chart calcs too -->
    <!-- Another idea would be to add calculated columns to balance/metadata table -->
    <b-table
      responsive
      small
      striped
      hover
      borderless
      head-variant="light"
      :sort-by.sync="sortBy"
      :items="items"
      :fields="fields"
      @row-clicked="myRowClickHandler"
    >
      <template v-slot:row-details="row">
        <b-card class="text-center">
          <b-table
            small
            hover
            stacked
            fixed
            :items="[row.item]"
            :fields="details"
            class="text-left"
          >
            <!-- Adds link to institution, if it exists -->
            <template v-slot:cell(Institution)="data">
              <!-- {{ data.item }} -->
              <span v-if="data.item.Link === null">{{
                data.item.Institution
              }}</span>
              <b-link v-else :href="data.item.Link" target="_blank">{{
                data.item.Institution
              }}</b-link>
            </template>
          </b-table>
          <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
        </b-card>
      </template>

      <!-- Custom formatted snapshot column comparing past balances to current-->
      <template v-slot:cell(CurrentPastFormatted)="data">
        <!-- {{ data.item.CurrentPastFormatted }} -->
        <span v-if="data.item.CurrentPastDifference > 0" class="text-success">
          {{ data.item.CurrentPastFormatted }}
          {{ data.item.CurrentPastSymbol }}
        </span>
        <span
          v-else-if="data.item.CurrentPastDifference < 0"
          class="text-danger"
        >
          {{ data.item.CurrentPastFormatted }}
          {{ data.item.CurrentPastSymbol }}
        </span>
        <span v-else class="text-muted">
          {{ data.item.CurrentPastFormatted }}
          {{ data.item.CurrentPastSymbol }}
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'balance-table',
  data() {
    return {
      // IDEA make table groups collapsable
      details: [
        // { key: "FriendlyName" },
        { key: 'Institution' },
        // { key: 'Link' },
        { key: 'Name' },
        { key: 'DollarAvailable' },
        { key: 'DollarCurrent' },
        { key: 'DollarLimit' },
        { key: 'Notes' },
        { key: 'Type' },
        { key: 'Subtype' },
      ],
      sortBy: 'Order',
    }
  },
  mounted() {
    if (this.items.length === 0) {
      this.fetchItems()
    }
  },

  methods: {
    myRowClickHandler(record) {
      // myRowClickHandler(record, index) {
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      // console.log(record, index); // This will be the item data for the row
      record._showDetails = !record._showDetails
    },
    fetchItems() {
      // return the Promise from the action
      return this.$store.dispatch('getBalances')
    },
  },
  computed: {
    items() {
      return this.$store.getters.balances
    },
    fields() {
      let fields = []
      // switch visible fields depending on content of past balances array
      if (this.$store.getters.balancesPast.length === 0) {
        fields = [
          { key: 'TableName', label: 'Name' },
          { key: 'Subtype', label: 'Type' },
          { key: 'DollarCurrent', label: 'Current', class: 'text-right' },
        ]
      } else {
        let date = dayjs(
          this.$store.getters.retrievalDates.datePickerValue
        ).format('M/D/YYYY')
        fields = [
          { key: 'TableName', label: 'Name' },
          {
            key: 'DollarCurrentPast',
            label: `${date} Snapshot`,
            class: 'text-right',
          },
          {
            key: 'CurrentPastFormatted',
            label: 'Current Comparison',
            class: 'text-right',
          },
        ]
      }
      return fields
    },
  },
}
</script>

<style scoped></style>
