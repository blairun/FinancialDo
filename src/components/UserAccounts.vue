<template>
  <div class="pt-4">
    <b-card
      class="mx-lg-auto mb-4"
      align-h="center"
      style="max-width: 1000px"
      title="Edit Accounts"
    >
      <!-- Overlay gives user confirmation of saved account -->
      <b-overlay :show="isBusy" rounded="sm">
        <b-card no-body class="mb-1" v-for="a in accounts" :key="a.key">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <!-- expand/collapse institution accounts -->
            <!-- IDEA Research payment integrations like square/stripe -->
            <b-button
              variant="light-info"
              squared
              block
              v-b-toggle:[a.key]
              size="lg"
            >
              {{ a.key.toUpperCase() }}</b-button
            >
          </b-card-header>
          <!-- visible -->
          <b-collapse :id="a.key" accordion="my-accordion" role="tabpanel">
            <b-card
              no-body
              border-variant=""
              class="rounded-0"
              style="border: none"
            >
              <!-- :sort-by.sync="sortBy" -->
              <b-table
                responsive
                small
                striped
                hover
                borderless
                head-variant="light"
                sort-by="Order"
                :items="a.values"
                :fields="fields"
                @row-clicked="myRowClickHandler"
              >
                <template v-slot:row-details="row">
                  <b-card class="text-center">
                    <!-- @submit.stop.prevent="onSubmit" -->
                    <b-form
                      autocomplete="off"
                      v-for="d in details"
                      :key="d.key"
                    >
                      <b-form-group
                        :label-for="d.key"
                        :label="d.label"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-align="left"
                        v-b-tooltip.hover
                        :title="d.info"
                      >
                        <b-form-input
                          v-if="d.key !== 'Closed'"
                          :id="d.key"
                          v-model="row.item[d.key]"
                        ></b-form-input>
                        <b-form-checkbox
                          class="float-left mt-2"
                          v-if="d.key === 'Closed'"
                          :id="d.key"
                          v-model="row.item[d.key]"
                        ></b-form-checkbox>
                      </b-form-group>
                    </b-form>
                  </b-card>
                </template>
              </b-table>
              <div class="d-flex justify-content-between mx-3">
                <!-- delete account button with modal confirmation-->
                <delete-account
                  :plaidId="a.values[0].PlaidID"
                  :accountName="a.key"
                />
                <!-- TODO ! Only update the account data that has been changed -->
                <b-button @click="saveAccountMeta">Save Changes</b-button>
              </div>

              <div class="d-flex justify-content-end mx-4 my-2">
                <div class="text-success">{{ saveConfirmation }}</div>
                <div class="text-danger">{{ saveError }}</div>
              </div>
            </b-card>
          </b-collapse>
        </b-card>
        <plaid-button class="mt-3 d-flex justify-content-end" />
      </b-overlay>
    </b-card>
    <!-- {{ items }} -->
    <!-- {{ accounts }} -->
  </div>
</template>

<script>
import * as d3 from 'd3'
import PlaidButton from '@/components/sub/PlaidButton.vue'
import DeleteAccount from '@/components/sub/DeleteAccount.vue'
import AccountsService from '../services/AccountsService'

export default {
  // TODO manual updates to custom accounts (e.g. cars, cash, and non-banking assets)
  name: 'user-accounts',
  components: {
    PlaidButton,
    DeleteAccount,
  },

  data() {
    return {
      fields: [
        { key: 'FriendlyName', label: 'Name' },
        { key: 'DollarBackupAmount', label: 'Backup Amount' },
        // { key: "BackupType" },
        { key: 'Order', label: 'Sort Order' },
        // { key: "Closed" },
      ],
      details: [
        { key: 'FriendlyName', label: 'Name' },
        // { key: "Institution" },
        {
          key: 'BackupType',
          label: 'Backup Type',
          info: "Used on balance table, if Plaid doesn't provide account type",
        },
        {
          key: 'BackupAmount',
          label: 'Backup Amount',
          info: "Used in Balances table, if Plaid doesn't provide amount",
        },
        {
          key: 'Link',
          label: 'Link',
          info:
            'Hyperlink shown on Balances table, for easy access to account website',
        },
        // { key: "PlaidID" },
        // { key: "AccountID" },
        {
          key: 'GoalID',
          label: 'Goal Id',
          info: 'Goal Id that this account should count towards',
        },
        // { key: "LoanID" },
        {
          key: 'Order',
          label: 'Sort Order',
          info: 'Order of accounts shown on the Balances table, low to high',
        },
        // { key: "Cost" },
        // { key: "Salvage" },
        // { key: "Life" },
        // { key: "StartDate" },
        {
          key: 'Notes',
          label: 'Notes',
          info: 'General notes, not used elsewhere',
        },
        {
          key: 'Closed',
          label: 'Closed',
          info:
            'If checked, this account will no longer be shown on Balances table',
        },
      ],
      // accounts: [],
      // sortBy: "Order",
      saveError: null,
      saveConfirmation: null,
    }
  },
  mounted() {
    // if (this.items.length === 0) {
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
      record._rowVariant = record._rowVariant === 'info' ? null : 'info'
    },
    fetchItems() {
      // return the Promise from the action
      return this.$store.dispatch('getAccountMetas')
    },
    async saveAccountMeta() {
      try {
        this.saveConfirmation = null
        // console.log(this.items)
        // console.log(this.accounts)
        await AccountsService.account_metas_update(this.items)
        // const response = await AccountsService.account_metas_update(this.items)
        // console.log(response);
        this.saveConfirmation = 'Account changes have been saved.'

        // update balances incase account(s) have been closed
        this.$store.commit('updateAppText', {
          prop: 'balanceError',
          text: '',
        })
        this.$store.commit('updateBooleanStates', {
          prop: 'balancesUpdating',
          state: true,
        })
        await this.$store.dispatch('updateBalances')
        await this.$store.dispatch('getBalancesAll')
        await this.$store.dispatch('getBalanceError')
        this.$store.commit('updateBooleanStates', {
          prop: 'balancesUpdating',
          state: false,
        })

        // this.saveError = 'test error'
        setTimeout(() => {
          this.saveConfirmation = null
        }, 5000)
      } catch (error) {
        console.log(error)
        this.saveConfirmation = null
        this.saveError = error.response.data.error
      }
    },
  },
  computed: {
    items() {
      return this.$store.getters.accountMetas
    },
    accounts() {
      var accountsByPlaidItem = d3
        .nest()
        .key(function(d) {
          return d.Institution
        })
        // .entries(this.items);
        .entries(this.$store.getters.accountMetas)
      // console.log(accountsByPlaidItem)
      return accountsByPlaidItem
    },
    isBusy() {
      return this.$store.getters.booleanStates.itemUpdating
    },
  },
}
</script>
