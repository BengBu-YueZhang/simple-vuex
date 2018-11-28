import applyMixin from './mixin'
import { clone } from './util'

let Vue

class Store {

  constructor ({
    state = {},
    actions = {},
    mutations = {},
    getter = {}
  }) {
    
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    this._isCommit = false
    this.getter = { ...getter, ...Object.create(null) }
    this._actions = { ...actions, ...Object.create(null) }
    this._mutations = {  ...mutations, ...Object.create(null) }
    this._vm = Object.create(null)

    const store = this

    const { dispatch, commit } = this

    this.dispatch = function (type, payload) {
      return dispatch.call(store, type, payload)
    }

    this.commit = function (type, payload) {
      return commit.call(store, type, payload)
    }

    this.resetStoreVM(state)
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    throw new Error('Need to use commit.')
  }

  commit (type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      throw new Error(`mutations [${type}] not found`)
    } else {
      this._withCommit(() => {
        entry(payload)
      })
    }
  }

  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      throw new Error(`actions [${type}] not found`)
    } else {
      return entry(payload)
    }
  }

  _withCommit (fn) {
    const isCommit = this._isCommit
    this._isCommit = true
    fn()
    this._isCommit = isCommit
  }

  resetStoreVM (state) {
    const getterKeys = Object.keys(this.getter)
    const computed = {}
    for (let i = 0; i < getterKeys.length; i++) {
      let key = getterKeys[i]

      let getter = clone(this.getter[key])

      computed[key] = () => getter(this.state)

      Object.defineProperty(this.getter, key, {
        get: () => {
          return this._vm[key]
        },
        enumerable: true
      })
    }
    
    this._vm = new Vue({
      data: {
        $$state: state
      },
      computed
    })

    this._vm.$watch(
      function () { return  this._data.$$state },
      () => {
        if (  this._isCommit) {
          throw new Error('do not mutate vuex store state outside mutation handlers')
        }
      },
      { deep: true, sync: true }
    )
  }
}

function install (_Vue) {
  Vue = _Vue
  applyMixin(Vue)
}

export default {
  install,
  Store
}
