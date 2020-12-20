import Api from '@/services/Api'

export default {
  transactions() {
    return Api().get(`transactions_current`)
  },
  transactions_update(months) {
    return Api().post(`transactions_update`, months)
  },
  transactions_error() {
    return Api().get(`transactions_error`)
  },
}
