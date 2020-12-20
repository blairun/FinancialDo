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
  // mounted() {
  //   //  [App.vue specific] When App.vue is finish loading finish the progress bar
  //   this.$Progress.finish()
  // },
  // created() {
  //   //  [App.vue specific] When App.vue is first loaded start the progress bar
  //   this.$Progress.start()
  //   //  hook the progress bar to start before we move router-view
  //   // IDEA Page update bar starting sooner?
  //   this.$router.beforeEach((to, from, next) => {
  //     //  does the page we want to go to have a meta.progress object
  //     if (to.meta.progress !== undefined) {
  //       let meta = to.meta.progress
  //       // parse meta tags
  //       this.$Progress.parseMeta(meta)
  //     }
  //     //  start the progress bar
  //     this.$Progress.start()
  //     //  continue to next page
  //     next()
  //   })
  //   //  hook the progress bar to finish after we've finished moving router-view
  //   this.$router.afterEach(() => {
  //     //  finish the progress bar
  //     this.$Progress.finish()
  //   })
  // },
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* color: #2c3e50; */
}

/* #nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
