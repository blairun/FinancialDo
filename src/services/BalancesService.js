import Api from '@/services/Api'

export default {
  balances() {
    return Api().get(`balances_current`)
  },
  balances_dates() {
    return Api().get(`balances_dates`)
  },
  balances_all() {
    return Api().get(`balances_all`)
  },
  balances_update() {
    return Api().get(`balances_update`)
  },
  // balances_update (id) {
  //   return Api().get(`balances_update/${id}`)
  // },
  balances_error() {
    return Api().get(`balances_error`)
  },
  balances_goals() {
    return Api().get(`balances_goals`)
  },
  balances_date(date) {
    return Api().get(`balances_date/${date}`)
  },
  market_data(marketIndex) {
    return Api().post('market_data', marketIndex)
  },
}
