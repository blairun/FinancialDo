<template>
  <div class="pt-4">
    <!-- :show="isBusy" -->
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
            <!-- IDEA Better Accounts ui. maybe modal popup for each balance -->
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
                        label-cols-sm="3"
                        :label="d.key"
                        label-align-sm="right"
                        label-align="left"
                        :label-for="d.key"
                      >
                        <b-form-input
                          :id="d.key"
                          v-model="row.item[d.key]"
                        ></b-form-input>
                      </b-form-group>
                    </b-form>
                    <!-- {{ row }} -->
                    <!-- class="float-left" -->
                    <!-- <b-button
                      size="sm"
                      @click="row.toggleDetails"
                      variant="outline-secondary"
                      >Hide Details</b-button
                    > -->
                  </b-card>
                  <!-- class="float-right" -->
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
import PlaidButton from '@/components/PlaidButton.vue'
import DeleteAccount from '@/components/DeleteAccount.vue'
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
        { key: 'BackupAmount' },
        // { key: "BackupType" },
        { key: 'Order' },
        // { key: "Closed" },
      ],
      details: [
        { key: 'FriendlyName', label: 'Name' },
        // { key: "Institution" },
        { key: 'BackupType' },
        { key: 'BackupAmount' },
        { key: 'Link' },
        // { key: "PlaidID" },
        // { key: "AccountID" },
        { key: 'GoalID' },
        // { key: "LoanID" },
        { key: 'Order' },
        // { key: "Cost" },
        // { key: "Salvage" },
        // { key: "Life" },
        // { key: "StartDate" },
        { key: 'Notes' },
        { key: 'Closed' },
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
    async addPlaid() {
      try {
        // const data = (await AuthenticationService.plaid())
        // this.$store.dispatch("getPlaid")
        this.$router.push({
          name: 'plaid',
        })
        // console.log(data);
        console.log('plaid worked')
      } catch (error) {
        console.log('plaid error')
      }
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

<style></style>
