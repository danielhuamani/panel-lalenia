import axios from 'axios'

class MetriService {
  getOrderByDate() {
    const response = axios.get(`/metric/order-by-date/`)
    return response
  }
  getOrderByPaymentMethods(params) {
    console.log(params)
    const response = axios.get(`/metric/payment-methods/`, {
      params: params,
    })
    return response
  }
  getRankingProduct(params) {
    const response = axios.get(`/metric/ranking-product/`, {
      params: params,
    })
    return response
  }
}

const instance = new MetriService()
export default instance
