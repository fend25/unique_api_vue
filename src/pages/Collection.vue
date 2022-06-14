<script setup lang="ts">
import Links from '../components/Links.vue'
import {useInit} from "../srclib";

const {chainRef, ethAccountsRef, initTask} = useInit()

</script>

<template>
  <Links/>
  <h1>Collection</h1>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}


</style>


<script lang="ts">
export default {
  name: 'Collection'
}
</script>
