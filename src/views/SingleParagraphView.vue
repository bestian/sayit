<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const route = useRoute()
const paragraphId = route.params.paragraph_id

useHead({
  title: ' View Paragraph :: SayIt ',
  meta: [
    {
      property: 'og:title',
      content: 'SayIt',
    },
  ],
})
</script>

<template>
  <main>
    <p>Paragraph ID: {{ paragraphId }}</p>
  </main>
</template>

