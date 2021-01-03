<template>
  <div>
    <b-button v-b-modal="accountName" variant="outline-danger">Delete</b-button>
    <b-modal
      :id="accountName"
      ref="modal"
      :title-html="
        'Delete <i>all</i> data about ' + accountName.toUpperCase() + '?'
      "
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Type DELETE and press OK to confirm."
          label-for="confirmation-input"
          invalid-feedback="User input is required"
          :state="confirmationState"
        >
          <b-form-input
            id="confirmation-input"
            v-model="confirmation"
            :state="confirmationState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import AccountsService from '../../services/AccountsService'
import UpdateAccounts from './UpdateAccounts'

export default {
  props: {
    plaidId: {
      type: Number,
    },
    accountName: {
      type: String,
    },
  },
  data() {
    return {
      confirmation: '',
      confirmationState: null,
    }
  },
  methods: {
    checkFormValidity() {
      let str = this.confirmation.replace(/\s/g, '')
      this.confirmationState = str === 'DELETE' ? true : false
      return this.confirmationState
    },
    resetModal() {
      this.confirmation = ''
      this.confirmationState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      // console.log(this.plaidId)
      // console.log(this.accountName)
      if (!this.checkFormValidity()) {
        return
      }
      // Push the confirmation to submitted confirmations
      // this.submittedNames.push(this.confirmation)
      // Hide the modal programatically
      this.$nextTick(() => {
        this.$bvModal.hide(this.accountName)
      })

      this.removeAccount()
    },

    async removeAccount() {
      // console.log(this.plaidId)
      // arrow function to pass -this-
      const removePlaid = async () => {
        await AccountsService.remove_plaid({
          plaidId: this.plaidId,
          accountName: this.accountName,
        })
      }

      UpdateAccounts.updateAccounts(removePlaid, 1)
    },
  },
}
</script>
