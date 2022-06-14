<template>
  <p>
    <span v-for="route in routes">
      <router-link v-if="route.path !== currentRoute.path" :to="route.path" class="link">
        {{ route.component.name }}
      </router-link>
    </span>
  </p>
</template>

<script setup lang="ts">

import {routes} from "../routes";
import {useRoute} from "vue-router";

const currentRoute = useRoute()
</script>

<script lang="ts">
export default {
  name: 'Links'
}
</script>

<style scoped lang="scss">
.link {
  margin-right: 1rem;
}
</style>
