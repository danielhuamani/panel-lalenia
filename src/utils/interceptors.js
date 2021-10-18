import Vue from "vue"

export default function setupAxios() {
  Vue.axios.interceptors.request.use(
    (config) => {
      const token = Vue.localStorage.get("token")
      if (token) {
        config.headers.common.Authorization = "JWT " + token
      }
      return config
    },
    function(error) {
      return Promise.reject(error)
    }
  )

  Vue.axios.interceptors.response.use(
    function(response) {
      return response
    },
    function(error) {
      const originalRequest = error.config
      if (
        (error.response.status === 401 && !originalRequest._retry) ||
        (error.response.data.detail === "Signature has expired." &&
          error.response.status === 403) ||
        (error.response.data.detail === "Invalid signature." &&
          error.response.status === 403)
      ) {
        Vue.localStorage.remove("token")
        Vue.localStorage.remove("email")
        Vue.localStorage.remove("first_name")
        Vue.localStorage.remove("last_name")
        window.location.href = "/"
        return Promise.reject(error)
      }
    }
  )
}
