import { createStore } from 'vuex'
import { auth } from './auth/index'
import { cart } from './cart/index'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {

  },
  actions: {
  },
  modules: {
    auth,
    cart
  }
})