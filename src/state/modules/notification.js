export const state = {
  alert: {
    type: "",
    msg: "",
    is_alert: false,
  },
}
export const mutations = {
  SET_ALERT(state, value) {
    state.alert.type = value.type
    state.alert.msg = value.msg
    state.alert.is_alert = value.is_alert
  },
}

export const actions = {
  setAlert({ commit }, alert) {
    commit("SET_ALERT", alert)
  },
}

export const getters = {
  getAlert(state) {
    return state.alert
  },
}
