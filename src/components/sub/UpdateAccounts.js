import store from '@/store/index'

export default {
  async updateAccounts(updateAccount, transactionMonths) {
    store.commit('updateBooleanStates', {
      prop: 'itemUpdating',
      state: true,
    })

    // add/remove account
    await updateAccount()

    // refresh balance, transaction and account data
    // update balances
    store.commit('updateAppText', {
      prop: 'balanceError',
      text: '',
    })
    store.commit('updateBooleanStates', {
      prop: 'balancesUpdating',
      state: true,
    })
    await store.dispatch('updateBalances')
    await store.dispatch('getBalancesAll')
    await store.dispatch('getBalanceError')
    store.commit('updateBooleanStates', {
      prop: 'balancesUpdating',
      state: false,
    })

    // update transactions
    store.commit('updateAppText', {
      prop: 'transactionError',
      text: '',
    })
    store.commit('updateBooleanStates', {
      prop: 'transactionsUpdating',
      state: true,
    })
    // grab 6 months of data during first fetch, otherwise 1+ month
    await store.dispatch('updateTransactions', transactionMonths)
    await store.dispatch('getTransactionError')
    store.commit('updateBooleanStates', {
      prop: 'transactionsUpdating',
      state: false,
    })

    // update list of institutions on user accounts page
    // (after balance updates since that is where account metadata is injected)
    await store.dispatch('getAccountMetas')
    store.commit('updateBooleanStates', {
      prop: 'itemUpdating',
      state: false,
    })
  },
}
