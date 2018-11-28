## 介绍

简易的Vuex实现, 没有实现复杂的模块化功能(模块化那块的源码, 我看的不是很明白)。实现了简易的commit, dispatch, getter等功能。**不能用于生产环境, 这个只是我的玩具**。通过阅读Vuex的dev分支和早期的0.3.0, 0.4.0分支"借鉴"而来。如果说是抄也可以, 哈哈哈, 对于我来说学到就是赚到。

## 使用方法

```js

// main.js
import Vue from 'vue'
import App from './App.vue'
import Vuex from '../../simple-vuex/src/main'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    name: 'Hello'
  },
  actions: {
    async getName (context, payload) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const { commit } = context
          commit('setName', payload)
          resolve()
        }, 1000)
      })
    }
  },
  mutations: {
    setName (state, payload) {
      state.name = payload
    }
  },
  getter: {
    hello (state) {
      return `${state.name} Vue`
    }
  }
})

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
```

```html
<template>
  <div id="app">
    <h1>{{ name }}</h1>
    <h1>{{ hello }}</h1>
  </div>
</template>

<script>
export default {
  name: 'app',

  computed: {
    name () {
      return this.$store.state.name
    },

    hello () {
      return this.$store.getter.hello
    }
  },

  created () {
    setTimeout(() => {
      this.$store.commit('setName', 'Hi')
      this.$store.dispatch('getName', 'Hello')
    }, 1000)
  }
}
</script>
```