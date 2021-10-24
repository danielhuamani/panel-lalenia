import axios from "axios"

class LocalDriverService {
  create(localID, data) {
    const response = axios.post(`/local/${localID}/driver/`, data)
    return response
  }
  list(localID, driveIdExclude) {
    const response = axios.get(`/local/${localID}/driver/`, {
      params: {
        local_driver_id: driveIdExclude,
      },
    })
    return response
  }
  update(id, data) {
    const response = axios.put(`/driver/${id}/`, data)
    return response
  }
  delete(id, data) {
    const response = axios.delete(`/driver/${id}/`, data)
    return response
  }
}

const instance = new LocalDriverService()
export default instance
