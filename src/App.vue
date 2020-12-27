<template>
  <div id="app">
    <navbar />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
// IDEA Add overlays for onboarding (https://github.com/usablica/intro.js) /
// IDEA Make app more personal with icons/pictures/fonts (undraw.co drawkit.io ionicons.com)

import Navbar from './components/Navbar'

export default {
  name: 'App',

  components: {
    Navbar,
  },

  watch: {
    $route(to) {
      document.title = to.meta.title || 'FinancialVue'
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
