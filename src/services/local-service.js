import axios from "axios"

class LocalService {
  list() {
    const response = axios.get("/local/")
    return response
  }
  detail(id) {
    const response = axios.get(`/local/${id}/detail`)
    return response
  }
}

const instance = new LocalService()
export default instance
