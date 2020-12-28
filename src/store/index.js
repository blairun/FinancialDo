import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import numeral from 'numeral'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  // persistent login data, but not other data so that it is force refreshed on each load:
  plugins: [
    createPersistedState({ paths: ['user', 'isUserLoggedIn', 'token'] }),
  ],
  state: {
    accountMetas: [],
    balances: [],
    balancesPast: [],
    balancesAll: [],
    balancesDates: [],
    transactions: [],
    goals: [],
    // must have keys pre defined in your state for reactivity
    appText: {
      balanceError: '',
      transactionError: '',
      updateButtonText: 'Update Button',
      netTrendChart: '',
      goalChart: '$1,111',
      transactionsFilter: '',
      marketIndex: 'TRRMX',
    },
    booleanStates: {
      balancesUpdating: false,
      transactionsUpdating: false,
      updateButtonVisible: false,
      datePickerVisible: false,
      itemUpdating: false,
    },
    retrievalDates: {
      balances: {},
      transactions: {},
      navText: '',
      balanceCharts: '',
      transactionCharts: '',
      datePickerValue: '',
    },
    marketData: [],
    token: null,
    user: {},
    isUserLoggedIn: false,
  },
  mutations: {
    updateBalances(state, balances) {
      let balancesCurrent = updateBalances(balances)
      // console.log('balancesCurrent')
      // console.log(balancesCurrent)
      state.balances = balancesCurrent
    },
    updateBalancesPast(state, balances) {
      const balancesPast = updateBalances(balances)
      // console.log('balancesPast')
      // console.log(balancesPast)
      state.balancesPast = balancesPast

      const balancesCurrent = state.balances
      // loop through all current balances
      balancesCurrent.forEach(function(obj) {
        // console.log(obj);
        // check each current balance against past balances
        for (let i = 0; i < balancesPast.length; i++) {
          const bp = balancesPast[i]
          // upon match, add data to current balance array
          // comparing current and past account balances
          if (bp.AccountID === obj.AccountID) {
            let CurrentPastDifference = 0
            let DollarCurrentPast = ''

            // special treatment for equity values, otherwise use current values
            if (obj.Equity) {
              CurrentPastDifference = obj.Equity - bp.Equity
              DollarCurrentPast = numeral(bp.Equity).format('$0,0')
            } else if (obj.Type === 'loan' || obj.Type === 'credit') {
              CurrentPastDifference = bp.Current - obj.Current
              DollarCurrentPast = numeral(bp.Current).format('$0,0')
            } else {
              CurrentPastDifference = obj.Current - bp.Current
              DollarCurrentPast = numeral(bp.Current).format('$0,0')
            }

            obj.DollarCurrentPast = DollarCurrentPast
            obj.CurrentPastDifference = CurrentPastDifference
            obj.CurrentPastFormatted = numeral(CurrentPastDifference).format(
              '$0,0'
            )

            if (CurrentPastDifference > 0) {
              obj.CurrentPastSymbol = '▲'
            } else if (CurrentPastDifference < 0) {
              obj.CurrentPastSymbol = '▼'
            } else {
              obj.CurrentPastSymbol = '--'
            }
          }
        }
      })

      // console.log(balancesCurrent)
      state.balances = balancesCurrent
    },
    updateAccountMetas(state, accountMetas) {
      accountMetas.forEach(function(obj) {
        obj._showDetails = false
        // obj._rowVariant = 'info'
      })

      state.accountMetas = accountMetas
    },
    updateBalancesAll(state, balancesAll) {
      state.balancesAll = balancesAll
    },
    updateBalancesDates(state, balancesDates) {
      state.balancesDates = balancesDates
      // console.log(state.balancesDates);
    },

    updateTransactions(state, transactions) {
      let max = Math.max.apply(
        Math,
        transactions.map(function(o) {
          return o.Amount
        })
      )
      let min = Math.min.apply(
        Math,
        transactions.map(function(o) {
          return o.Amount
        })
      )

      transactions.forEach(function(obj) {
        obj.DollarAmount = numeral(obj.Amount).format('$0,0')
        obj._showDetails = false
        if (obj.Amount > 0.25 * max) {
          obj._rowVariant = 'success'
        }
        if (obj.Amount < 0.25 * min) {
          obj._rowVariant = 'danger'
        } else if (obj.Amount < 0.1 * min) {
          obj._rowVariant = 'warning'
        }
        if (obj.Pending === 1) {
          obj._rowVariant = 'info'
        }
      })
      state.transactions = transactions
    },

    updateGoals(state, goals) {
      state.goals = goals
      // console.log(goals);
    },
    updateBooleanStates(state, data) {
      state.booleanStates[data.prop] = data.state
      // console.log(state.booleanStates);
    },
    updateAppText(state, data) {
      state.appText[data.prop] = data.text
      // console.log(state.appText);
    },
    updateMarketData(state, data) {
      state.marketData = data
      // console.log(state.marketData);
    },
    updateRetrievalDates(state, data) {
      state.retrievalDates[data.prop] = data.date
      // console.log(state.retrievalDates);
      // console.log(data.date);
      // console.log('navText');
      // console.log(state.retrievalDates.navText);
    },
    setToken(state, token) {
      state.token = token
      state.isUserLoggedIn = !!token
    },
    setUser(state, user) {
      state.user = user
    },
  },
  getters: {
    balances: (state) => state.balances,
    balancesPast: (state) => state.balancesPast,
    accountMetas: (state) => state.accountMetas,
    balancesAll: (state) => state.balancesAll,
    balancesDates: (state) => state.balancesDates,
    transactions: (state) => state.transactions,
    goals: (state) => state.goals,
    retrievalDates: (state) => state.retrievalDates,
    booleanStates: (state) => state.booleanStates,
    appText: (state) => state.appText,
    marketData: (state) => state.marketData,
    user: (state) => state.user,
  },
  actions,
})

function updateBalances(balances) {
  let equities = []
  balances.forEach(function(obj) {
    // console.log(obj);
    obj.DollarAvailable = numeral(obj.Available).format('$0,0')
    obj.DollarCurrent = numeral(obj.Current).format('$0,0')
    obj.DollarLimit = numeral(obj.Limit).format('$0,0')
    obj.TableName = obj.Institution + ' - ' + obj.FriendlyName
    obj._showDetails = false

    if (obj.Type === 'credit') {
      obj._rowVariant = 'danger'
    } else if (obj.Type === 'loan') {
      obj._rowVariant = 'warning'
    } else if (obj.Type === 'depository') {
      obj._rowVariant = 'success'
    } else {
      obj._rowVariant = 'info'
    }

    if (obj.LoanID) {
      equities.push(obj)
    }
  })

  // add in calculated equity values here?
  for (let i = 0; i < equities.length; i++) {
    const e = equities[i]
    // console.log(e);
    let outstandingLoan = ''

    // search for assets associated LoanID
    for (let j = 0; j < balances.length; j++) {
      // look for the entry with a matching `LoanID` value
      if (balances[j].AccountID === e.LoanID) {
        outstandingLoan = balances[j].Current
      }
    }

    let equity = [e].map(function(y) {
      let eqty = y.Current - outstandingLoan
      return {
        AccountID: `${y.AccountID}-equity`,
        TableName: `${y.Name} equity`,
        Subtype: 'Equity',
        // set to zero to avoid actually changing net worth calcs
        Current: 0,
        Equity: eqty,
        DollarCurrent: numeral(eqty).format('$0,0'),
        Order: y.Order,
        _rowVariant: 'secondary',
        _showDetails: false,
      }
    })
    balances.push(equity[0])
  }
  return balances
}
