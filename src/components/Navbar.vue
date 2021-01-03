<template>
  <div class="mb-5">
    <b-navbar
      toggleable="lg"
      variant="info"
      type="dark"
      fixed="top"
      class="shadow"
    >
      <b-navbar-brand href="#/">FinancialVue</b-navbar-brand>

      <!-- Show # of hours/days/weeks/months ago -->
      <!-- hide when screen is wider than lg-->
      <!-- Put spinner over refreshed text rather than on tables -->
      <b-overlay
        :show="isBusy"
        variant="info"
        opacity="0.5"
        spinner-variant="secondary"
        class="d-lg-none ml-auto"
        v-if="
          $store.getters.booleanStates.updateButtonVisible &&
            $store.state.isUserLoggedIn
        "
      >
        <b-nav-text>
          {{ $store.getters.retrievalDates.navText }}
        </b-nav-text>
      </b-overlay>

      <b-navbar-toggle
        target="nav-collapse"
        class="ml-auto"
        v-if="$store.state.isUserLoggedIn"
      >
        <!-- down/up arrows rather than hamburger -->
        <!-- <template v-slot:default="{ expanded }">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon>
        </template> -->
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav v-model="visible">
        <b-navbar-nav v-if="$store.state.isUserLoggedIn">
          <b-nav-item href="#/balances">Balances</b-nav-item>
          <b-nav-item href="#/transactions">Transactions</b-nav-item>
          <!-- <b-nav-item href="#/bills" disabled>Bills</b-nav-item> -->
          <!-- <b-nav-item href="#/goals">Goals</b-nav-item> -->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="$store.state.isUserLoggedIn">
          <!-- hide when screen is smaller than lg-->
          <b-overlay
            :show="isBusy"
            variant="info"
            opacity="0.5"
            spinner-variant="secondary"
            class="d-none d-lg-block mr-3"
            v-if="$store.getters.booleanStates.updateButtonVisible"
          >
            <b-nav-text>
              {{ $store.getters.retrievalDates.navText }}
            </b-nav-text>
          </b-overlay>

          <!-- Enable/disable date picker depending on page -->
          <!-- TODO report/fix bootstrap vue calendar picker in narrow navbar -->
          <!-- IDEA highlight balances / transactions when more than a day old 
          (in a way that will be visible when on phone) -->
          <b-navbar-nav
            class="mr-lg-3 mr-xs-0"
            v-if="$store.getters.booleanStates.datePickerVisible"
          >
            <b-form-datepicker
              v-model="datePickerValue"
              placeholder="Past Snapshots"
              :date-disabled-fn="dateDisabled"
              locale="en"
              :date-format-options="{
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
              }"
            ></b-form-datepicker>
          </b-navbar-nav>

          <b-navbar-nav
            class="my-2 my-lg-0"
            v-if="$store.getters.booleanStates.updateButtonVisible"
          >
            <b-button
              @click="
                updateButton()
                visible = !visible
              "
              type="submit"
              :class="visible ? null : 'collapsed'"
              variant="light"
              class="text-secondary"
            >
              {{ $store.getters.appText.updateButtonText }}
            </b-button>
          </b-navbar-nav>

          <!-- TODO change primary color of clicked button -->
          <b-nav-item-dropdown right class="ml-lg-2 ml-0">
            <!-- put username in navbar button when logged in -->
            <template v-slot:button-content>
              <em>{{ username }}</em>
            </template>
            <b-dropdown-item
              :to="{
                name: 'user',
              }"
            >
              User Profile
            </b-dropdown-item>
            <b-dropdown-item
              :to="{
                name: 'about',
              }"
            >
              About
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logout">
              Log Out
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
      <b-navbar-nav class="ml-auto" v-if="!$store.state.isUserLoggedIn">
        <b-nav-item href="#/login">Sign in</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-3" v-if="!$store.state.isUserLoggedIn">
        <b-nav-item href="#/about">About</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    // console.log(this.$store.getters.user.username);
    // let navRefreshText = this.$store.getters.retrievalDates.navText
    // let datePickerValue = this.$store.getters.retrievalDates.datePickerValue
    // console.log(navRefreshText);
    return {
      // datePickerValue: datePickerValue,
      visible: false, // visible = open = true
      page: '',
      // navRefreshText: navRefreshText,
      // username: this.$store.getters.user.username,
    }
  },

  mounted() {},

  methods: {
    async updateButton() {
      // console.log(this.page);
      switch (this.page) {
        case 'balances':
          this.$store.commit('updateAppText', {
            prop: 'balanceError',
            text: '',
          })
          this.$store.commit('updateBooleanStates', {
            prop: 'balancesUpdating',
            state: true,
          })
          await this.$store.dispatch('updateBalances')
          await this.$store.dispatch('getBalancesAll')
          await this.$store.dispatch('getBalanceError')
          this.$store.commit('updateBooleanStates', {
            prop: 'balancesUpdating',
            state: false,
          })
          break
        case 'transactions':
          this.$store.commit('updateAppText', {
            prop: 'transactionError',
            text: '',
          })
          this.$store.commit('updateBooleanStates', {
            prop: 'transactionsUpdating',
            state: true,
          })
          // defaults to fetching 1+ month of data in vuex store
          await this.$store.dispatch('updateTransactions')
          await this.$store.dispatch('getTransactionError')
          this.$store.commit('updateBooleanStates', {
            prop: 'transactionsUpdating',
            state: false,
          })
          break
        default:
          break
      }
    },
    dateDisabled(ymd) {
      // function runs for every day shown on the calendar popup
      // let dates = this.$store.getters.balancesDates;
      let dates = this.$store.getters.balancesDates
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i].RetrievalDate
        // console.log(d);
        // console.log(dayjs(d).format('YYYY-MM-DD'))
        if (ymd === dayjs(d).format('YYYY-MM-DD')) {
          return false
        }
      }
      return true
    },
    logout() {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      // only really necessary when user was on the about page;
      // otherwise all other pages already redirect to login
      this.$router.push({
        name: 'login',
      })
      // Vuex (and Vue) state is in memory while you are on the same browser page
      // and is reset when you reload the page. If you call router.go(), the page
      // will refresh and all the Vuex stores will go back to their original state.
      // This will also clear any state you may be holding in the components.
      this.$router.go()
    },
  },

  watch: {
    $route(to) {
      // $route(to, from) {
      // this.show = false;
      // console.log(to);
      // console.log(to.name);
      this.page = to.name
    },
  },

  computed: {
    isBusy() {
      // let page = this.$router.currentRoute.name;
      // console.log(this.page);
      let bu = this.$store.getters.booleanStates.balancesUpdating
      let tu = this.$store.getters.booleanStates.transactionsUpdating
      switch (this.page) {
        case 'balances':
          return bu
        case 'transactions':
          return tu
        default:
          return false
      }
    },
    username() {
      return this.$store.getters.user.username
    },
    datePickerValue: {
      // getter
      get: function() {
        // console.log('get')
        return this.$store.getters.retrievalDates.datePickerValue
      },
      // setter
      set: function(newValue) {
        // console.log('set')
        // console.log(val)
        this.$store.commit('updateRetrievalDates', {
          prop: 'datePickerValue',
          date: newValue,
        })
        this.$store.dispatch('datePickerValue', newValue)
      },
    },
  },
}
</script>

<style scoped></style>
