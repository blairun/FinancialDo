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
          >Connect New Account</b-button
        >
        <!-- Make it obvious to user when they are in Plaid sandbox mode vs dev mode -->
        <!-- <span style="width: 200px">
          <div
            v-if="$store.state.user.plaidEnv === 'sandbox'"
            class="text-info"
          >
            Plaid sandbox environment.<br />
            Use these credentials »<br />
            user_good | pass_good
          </div>
          <div v-else class="text-danger">
            Plaid dev environment.<br />
            Use real credentials.<br />
            Will deplete 1 Plaid item.
          </div>
        </span> -->
      </template>
    </plaid-link>
  </section>
</template>

<script>
import PlaidLink from 'vue-plaid-link'
import AccountsService from '../../services/AccountsService'
import UpdateAccounts from './UpdateAccounts'

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

      // async function addPlaid() {
      // arrow function to pass -this-
      const addPlaid = async () => {
        await AccountsService.add_plaid({
          UserID: this.$store.getters.user.id,
          ItemName: metadata.institution.name,
          PlaidToken: token,
        })
      }

      UpdateAccounts.updateAccounts(addPlaid, 6)
    },
  },
}
</script>
