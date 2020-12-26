<template>
  <transition name="fade" mode="out-in">
    <delay :from="Date.now()" :wait="1500">
      <b-card
        class="mx-lg-auto mb-4 mt-2"
        align-h="center"
        style="max-width: 1000px"
      >
        <slot>
          No account data yet 🤔<br /><br />
          📊 Click the 'Add New Account' button to link your first account and
          view charts about your data 📊</slot
        >
        <plaid-button class="mt-4" />
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
