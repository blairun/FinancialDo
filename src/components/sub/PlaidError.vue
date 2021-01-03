<template>
  <b-card
    :border-variant="cardVariant"
    align="justify"
    class="mx-3 mb-3"
    id="plaid-error"
  >
    <!-- link to plaid login from error message. -->
    <!-- <a href="http://192.168.1.150:8082" target="blank" id="plaid-link" /> -->
    {{ error }}

    <!-- update plaid items with public token from server side -->
    <section v-if="buttonVisible">
      <br />
      <plaid-link
        :env="$store.getters.user.plaidEnv"
        :publicKey="plaidPublicKey"
        clientName="FinancialVue"
        product="transactions"
        v-bind="{ onSuccess, onExit }"
        :token="$store.getters.appText.publicToken"
      >
        <!-- maybe clear process.env.PLAID_broken_public_token on server side every time? -->
        <template slot="button" slot-scope="props">
          <b-button @click="props.onClick">
            <b-icon
              icon="exclamation-triangle-fill"
              scale="1"
              variant="warning"
            ></b-icon>
            Update Plaid Connection</b-button
          >
        </template>
      </plaid-link>
    </section>
  </b-card>
</template>

<script>
import PlaidLink from 'vue-plaid-link'

export default {
  name: 'plaidError',
  components: { PlaidLink },
  props: {
    error: {
      type: String,
    },
  },
  data() {
    return {
      plaidPublicKey: process.env.VUE_APP_PLAID_PUBLIC_KEY,
      buttonVisible: true,
      cardVariant: 'danger',
    }
  },
  methods: {
    onSuccess(token, metadata) {
      console.log(token)
      console.log(metadata)
      this.$store.commit('updateAppText', {
        prop: 'balanceError',
        text: 'Account has been successfully updated!',
      })
      this.$store.commit('updateAppText', {
        prop: 'transactionError',
        text: 'Account has been successfully updated!',
      })
      this.$store.commit('updateAppText', {
        prop: 'publicToken',
        text: '',
      })
      this.buttonVisible = false
      this.cardVariant = 'success'
    },
    onExit() {
      // console.log('plaid onExit')
    },
  },
}
</script>

<style scoped>
#plaid-error {
  white-space: pre-wrap;
}
#plaid-link {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
