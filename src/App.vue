<template>
  <div id="app">
    <navbar />
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/">Dashboard</router-link> |
      <router-link to="/balances">Balances</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
    <!-- set progressbar -->
    <!-- <vue-progress-bar></vue-progress-bar> -->
  </div>
</template>

<script>
// IDEA Make it obvious to user when they are in Plaid sandbox mode vs dev mode
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

<style></style>
