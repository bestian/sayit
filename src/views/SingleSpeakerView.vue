<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const route = useRoute()
const name = route.params.name as string

// 將 URL slug 轉換為可讀的標題（將連字號替換為空格）
const formattedName = computed(() => {
  return name.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
})

const title = computed(() => ` View Speaker: ${formattedName.value} :: SayIt `)
const ogTitle = computed(() => `View Speaker: ${formattedName.value} :: SayIt`)

useHead({
  title: title,
  meta: [
    {
      property: 'og:title',
      content: ogTitle,
    },
  ],
})
</script>

<template>
  <main>
    <p>Speaker Name: {{ name }}</p>
  </main>
</template>
