import Vue from "vue"

export const login = (token) => {
  console.log(token, "token")
  Vue.localStorage.set("token", token)
}

export const setUser = (user) => {
  console.log(user, "user")
  Vue.localStorage.set("firstName", user.first_name)
  Vue.localStorage.set("lastName", user.last_name)
  Vue.localStorage.set("email", user.email)
}
