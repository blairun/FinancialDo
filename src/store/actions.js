import TransactionsService from '../services/TransactionsService'
import BalancesService from '../services/BalancesService'
import AccountsService from '../services/AccountsService'
import dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {
  async getBalances({ commit }) {
    try {
      const response1 = (await BalancesService.balances_dates()).data
      let items1 = response1.data
      commit('updateBalancesDates', items1)

      const response2 = (await BalancesService.balances()).data
      let items2 = response2.data
      commit('updateBalances', items2)

      let balancesRetrievalDate = dayjs(items2[0].RetrievalDate)
      commit('updateRetrievalDates', {
        prop: 'balances',
        date: balancesRetrievalDate,
      })

      // update balances retrieval date
      const timeAgo = dayjs(balancesRetrievalDate)
        .subtract(5, 'second')
        .fromNow()
      commit('updateRetrievalDates', {
        prop: 'navText',
        date: 'Refreshed ' + timeAgo,
      })
    } catch (error) {
      console.error(error)
    }
  },

  async getAccountMetas({ commit }) {
    try {
      const response = (await AccountsService.account_metas()).data
      let items = response.data
      commit('updateAccountMetas', items)
    } catch (error) {
      console.error(error)
    }
  },

  async getBalancesAll({ commit }) {
    try {
      const response = (await BalancesService.balances_all()).data
      let items = response.data
      commit('updateBalancesAll', items)
    } catch (error) {
      console.error(error)
    }
  },

  async updateBalances({ dispatch }) {
    try {
      await BalancesService.balances_update()
      await dispatch('getBalances')
    } catch (error) {
      console.error(error)
    }
  },

  async getTransactions({ commit }) {
    try {
      const response = (await TransactionsService.transactions()).data
      // console.log(response);
      let items = response.data
      commit('updateTransactions', items)

      // first item since transactions come sorted from API
      let transactionsRetrievalDate = dayjs(items[0].RetrievalDate)
      commit('updateRetrievalDates', {
        prop: 'transactions',
        date: transactionsRetrievalDate,
      })

      // update transactions retrieval date
      const timeAgo = dayjs(transactionsRetrievalDate)
        .subtract(5, 'second')
        .fromNow()
      commit('updateRetrievalDates', {
        prop: 'navText',
        date: 'Refreshed ' + timeAgo,
      })
    } catch (error) {
      console.error(error)
    }
  },

  async getGoals({ commit }) {
    try {
      const response = (await BalancesService.balances_goals()).data
      let items = response.data
      commit('updateGoals', items)
    } catch (error) {
      console.error(error)
    }
  },

  async updateTransactions({ dispatch }, months = 1) {
    try {
      await TransactionsService.transactions_update({ months: months })
      await dispatch('getTransactions')
    } catch (error) {
      console.error(error)
    }
  },

  async datePickerValue({ commit, getters }, val) {
    // console.log(val)
    try {
      let dates = getters.balancesDates
      let shortDate = ''
      let longDate = ''
      // match the calendar short date with the long form retrieval date from database
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i].RetrievalDate
        // console.log(d);
        shortDate = dayjs(d).format('YYYY-MM-DD')
        // console.log(shortDate)
        if (val === shortDate) {
          longDate = d
        }
      }
      // grab data associated with chosen date
      const response = (await BalancesService.balances_date(longDate)).data
      let items = response.data

      // console.log(val)
      if (val === dayjs().format('YYYY-MM-DD')) {
        // don't compare balances when selecting today
        this.state.balancesPast = []
        commit('updateBalances', items)
      } else {
        // update past balances array for any other dates
        // by folding in past balance data
        commit('updateBalancesPast', items)
      }

      // update balances retrieval date, then use that to update the retrieval date text box
      // const retrievalDate = dayjs(longDate)
      // const timeAgo = retrievalDate.fromNow()
      // commit('updateRetrievalDates', { prop: 'navText', date: timeAgo })
    } catch (error) {
      console.error(error)
    }
  },

  async getBalanceError({ commit }) {
    try {
      const response = await BalancesService.balances_error()
      // console.log(response)
      let error = response.data.error
      let publicToken = response.data.publicToken

      commit('updateAppText', {
        prop: 'balanceError',
        text: error,
      })
      commit('updateAppText', {
        prop: 'publicToken',
        text: publicToken,
      })
    } catch (err) {
      console.error(err)
    }
  },

  async getTransactionError({ commit }) {
    try {
      const response = await TransactionsService.transactions_error()
      let error = response.data.error
      let publicToken = response.data.publicToken

      commit('updateAppText', {
        prop: 'transactionError',
        text: error,
      })
      commit('updateAppText', {
        prop: 'publicToken',
        text: publicToken,
      })
    } catch (err) {
      console.error(err)
    }
  },

  async getMarketData(
    { commit, getters },
    marketIndex = getters.appText.marketIndex
  ) {
    try {
      const data = (
        await BalancesService.market_data({ marketIndex: marketIndex })
      ).data
      // console.log(data)
      commit('updateMarketData', data.data)
    } catch (err) {
      console.error(err)
    }
  },
  setToken({ commit }, token) {
    commit('setToken', token)
  },
  setUser({ commit }, user) {
    // console.log(user);
    commit('setUser', user)
  },
}
