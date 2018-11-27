let Vue

class Store {

  constructor () {
    this._isCommit = false
    this.state = Object.create(null)
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._vm = new Vue()

    const store = this

    const { dispatch, commit } = this

    this.dispatch = function (type, payload) {
      return dispatch.call(store, type, payload)
    }

    this.commit = function (type, payload) {
      return commit.call(store, type, payload)
    }
  }

  get state () {

  }

  set state () {
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

  resetStoreVM () {
  }
}

export default Store
