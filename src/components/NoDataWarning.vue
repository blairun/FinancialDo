<template>
  <transition name="fade" mode="out-in">
    <delay :from="Date.now()" :wait="1500">
      <!-- Overlay gives user confirmation of saved account -->
      <b-card
        class="mx-lg-auto mb-4 mt-2"
        align-h="center"
        style="max-width: 1000px"
      >
        <b-overlay :show="isBusy" rounded="sm">
          <slot>
            No account data yet 🤔<br /><br />
            📊 Click the 'Add New Account' button to link your first account and
            view charts about your data 📊</slot
          >
          <plaid-button class="mt-4" />
        </b-overlay>
      </b-card>
    </delay>
  </transition>
</template>

<script>
import PlaidButton from '@/components/PlaidButton.vue'
import Delay from 'vue-delay'

export default {
  name: 'noDataWarning',
  components: {
    PlaidButton,
    Delay,
  },
  computed: {
    isBusy() {
      return this.$store.getters.booleanStates.itemUpdating
    },
  },
}
</script>

<style scoped>
.fade-enter-active {
  transition-duration: 1s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter {
  opacity: 0;
}
</style>
