import Api from '@/services/Api'

export default {
  add_plaid(credentials) {
    // console.log(credentials);
    return Api().post('plaid_add', credentials)
  },
  update_plaid(credentials) {
    return Api().post('plaid_update', credentials)
  },
  remove_plaid(plaidId) {
    return Api().post('plaid_remove', plaidId)
  },
  account_metas() {
    return Api().get(`account_metas`)
  },
  account_metas_update(body) {
    return Api().post('account_metas_update', body)
  },
}
