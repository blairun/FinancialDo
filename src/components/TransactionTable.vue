<template>
  <div class="transaction-table px-3">
    <delay :wait="2000">
      <b-card v-if="items.length === 0" class="mb-4 mt-2" align-h="center">
        No Transaction data yet 🤔<br /><br />
        💸 Click the 'Add New Account' button to link your first account and
        view transactions 💸
        <plaid-button class="mt-4" />
      </b-card>
    </delay>
    <b-form-group class="mb-3">
      <b-input-group>
        <b-form-input
          v-model="filter"
          type="search"
          id="filterInput"
          placeholder="Type to Search"
        ></b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    <b-table
      responsive
      small
      striped
      hover
      borderless
      head-variant="light"
      :sort-desc.sync="sortDesc"
      :sort-by.sync="sortBy"
      :filter="filter"
      :items="items"
      :fields="fields"
      @row-clicked="myRowClickHandler"
      @head-clicked="customSort"
      v-model="visibleRows"
      custom-foot
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
          ></b-table>

          <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
        </b-card>
      </template>
      <!-- calculate total for visble items -->
      <!-- could also be a footer field slot instead -->
      <template slot="bottom-row">
        <td><b>Total</b></td>
        <td></td>
        <!-- this is a computed prop that adds up all the expenses in the visible rows -->
        <td class="text-right bold">
          <b>{{ totalAmount }}</b>
        </td>
      </template>
      <!-- A custom formatted footer cell for field 'name' -->
      <template v-slot:foot(name)="data">
        <span class="text-danger">{{ data.label }}</span>
      </template>

      <!-- Default fall-back custom formatted footer cell -->
      <template v-slot:foot()="data">
        <i>{{ data.label }}</i>
      </template>
    </b-table>
  </div>
</template>

<script>
import numeral from 'numeral'
import PlaidButton from '@/components/PlaidButton.vue'
import Delay from 'vue-delay'
export default {
  name: 'transaction-table',
  components: {
    PlaidButton,
    Delay,
  },
  data() {
    return {
      fields: [
        {
          key: 'TransactionDate',
          label: 'Date',
          class: 'text-left',
          sortable: true,
        },
        { key: 'Description', class: 'text-left' },
        { key: 'DollarAmount', label: 'Amount', class: 'text-right' },
      ],
      details: [
        { key: 'Account' },
        { key: 'DollarAmount' },
        { key: 'Description' },
        // { key: "Pending" },
        { key: 'Category' },
        // { key: "Location" },
        { key: 'Merchant' },
        { key: 'PaymentChannel' },
        { key: 'TransactionType' },
        { key: 'TransactionDate' },
        // { key: "TransactionID" },
      ],
      sortBy: 'TransactionDate',
      // sortBy: 'Amount',
      sortDesc: true,
      // filter: null,
      visibleRows: [],
    }
  },

  mounted() {
    // if (!this.$store.getters.transactions) {
    this.fetchItems()
    // }
  },

  methods: {
    myRowClickHandler(record) {
      // myRowClickHandler(record, index) {
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      // console.log(record, index); // This will be the item data for the row
      record._showDetails = !record._showDetails
    },
    customSort(key) {
      // sort by Amount instead of DollarAmount
      // console.log(key)
      if (key === 'DollarAmount') {
        // TODO figure out how to reverse sort
        // this.sortDesc = !this.sortDesc
        // console.log(this.sortDesc)
        this.sortBy = 'Amount'
      }
    },
    fetchItems() {
      // return the Promise from the action
      return this.$store.dispatch('getTransactions')
    },
  },

  computed: {
    items() {
      const transactions = this.$store.getters.transactions
      // remove Latest and RetrievalDate so they don't affect filter search
      transactions.forEach((t) => {
        // console.log(t)
        delete t.Latest
        delete t.RetrievalDate
      })
      // console.log(transactions)
      return transactions
    },
    totalAmount() {
      let total = this.visibleRows.reduce((accum, item) => {
        // total of visible Amounts
        return accum + parseFloat(item.Amount)
      }, 0.0)
      return numeral(total).format('$0,0')
    },

    filter: {
      // getter
      get: function() {
        // console.log('get')
        // console.log(this.$store.getters.appText.transactionsFilter)
        return this.$store.getters.appText.transactionsFilter
      },
      // setter
      set: function(newValue) {
        // console.log('set')
        // console.log(newValue)
        this.$store.commit('updateAppText', {
          prop: 'transactionsFilter',
          text: newValue,
        })
        // console.log(this.$store.getters.appText.transactionsFilter)
        // this.$store.dispatch('datePickerValue', newValue)
      },
    },
  },
}
</script>

<style scoped>
/* .transaction-table {
  cursor: default;
} */
</style>
