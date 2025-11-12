<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const speechName = route.params.speech_name
</script>

<template>
  <main>
    <p>Speech Name: {{ speechName }}</p>
  </main>
</template>
