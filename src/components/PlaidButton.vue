<template>
  <section>
    <plaid-link
      :env="$store.getters.user.plaidEnv"
      :publicKey="plaidPublicKey"
      clientName="FinancialVue"
      product="transactions"
      v-bind="{ onSuccess }"
    >
      <template slot="button" slot-scope="props">
        <b-button @click="props.onClick" style="width: 200px"
          >Add New Account</b-button
        >
        <!-- Make it obvious to user when they are in Plaid sandbox mode vs dev mode -->
        <span style="width: 200px">
          <div
            v-if="$store.state.user.plaidEnv === 'sandbox'"
            class="text-info"
          >
            Your are using the<br />
            Plaid sandbox environment.<br />
            Use these credentials »<br />
            username: user_good<br />
            password: pass_good
          </div>
          <div v-else class="text-danger">
            You are using the<br />
            Plaid dev environment.<br />
            Use real credentials.<br />
            This will deplete one<br />
            of your 100 Plaid Items.
          </div>
        </span>
      </template>
    </plaid-link>
  </section>
</template>

<script>
import PlaidLink from 'vue-plaid-link'
import AccountsService from '../services/AccountsService'

export default {
  components: { PlaidLink },
  data() {
    return {
      plaidPublicKey: process.env.VUE_APP_PLAID_PUBLIC_KEY,
    }
  },
  methods: {
    async onSuccess(token, metadata) {
      // console.log(token);
      // console.log(metadata);

      this.$store.commit('updateBooleanStates', {
        prop: 'itemUpdating',
        state: true,
      })
      // save new plaid token/userid to db
      const response = await AccountsService.add_plaid({
        UserID: this.$store.getters.user.id,
        ItemName: metadata.institution.name,
        PlaidToken: token,
      })
      console.log(response)
      // refresh balance, transaction and account data
      // update balances
      this.$store.commit('updateAppText', {
        prop: 'balanceError',
        text: '',
      })
      this.$store.commit('updateBooleanStates', {
        prop: 'balancesUpdating',
        state: true,
      })
      await this.$store.dispatch('updateBalances')
      await this.$store.dispatch('getBalanceError')
      this.$store.commit('updateBooleanStates', {
        prop: 'balancesUpdating',
        state: false,
      })

      // update transactions
      this.$store.commit('updateAppText', {
        prop: 'transactionError',
        text: '',
      })
      this.$store.commit('updateBooleanStates', {
        prop: 'transactionsUpdating',
        state: true,
      })
      // grab 6 months of data during first fetch
      await this.$store.dispatch('updateTransactions', 6)
      await this.$store.dispatch('getTransactionError')
      this.$store.commit('updateBooleanStates', {
        prop: 'transactionsUpdating',
        state: false,
      })
      // update list of institutions on user accounts page
      // (after balance updates since that is where account metadata is injected)
      await this.$store.dispatch('getAccountMetas')
      this.$store.commit('updateBooleanStates', {
        prop: 'itemUpdating',
        state: false,
      })
    },
  },
}
</script>
