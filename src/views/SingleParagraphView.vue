<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const paragraphId = route.params.paragraph_id
</script>

<template>
  <main>
    <p>Paragraph ID: {{ paragraphId }}</p>
  </main>
</template>

