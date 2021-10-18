import axios from "axios"
class AuthService {
  login(data) {
    const response = axios.post("/login/", data)
    return response
  }
}

const instance = new AuthService()
export default instance
