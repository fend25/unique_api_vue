<script setup lang="ts">
import {ref} from 'vue'
import Links from "../components/Links.vue";

const count = ref(0)
</script>


<template>
  <Links/>
  <h1>home</h1>
  <button type="button" @click="count++">count is: {{ count }}</button>
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
  name: 'Home'
}
</script>
