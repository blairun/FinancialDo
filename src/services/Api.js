import axios from 'axios'
import store from '@/store/index'

export default () => {
  return axios.create({
    // baseURL: `https://localhost:9990/`,
    // baseURL: `https://192.168.1.150:9990/`,
    baseURL: `https://financial-do-x4bpn.ondigitalocean.app`,
    headers: {
      Authorization: `Bearer ${store.state.token}`,
    },
  })
}
