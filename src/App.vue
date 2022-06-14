<script setup lang="ts">
import {useInitProvider} from './srclib'

useInitProvider({
  connectToPolkadotExtensionsAs: 'test app',
  substrateNodeWsUrl: import.meta.env.VITE_NODE_SUB_A,
})
</script>

<template>
  <RouterView/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<script lang="ts">
export default {
  name: 'App'
}
</script>
