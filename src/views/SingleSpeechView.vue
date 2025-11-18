<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const route = useRoute()
const speechName = route.params.speech_name as string

// 將 URL slug 轉換為可讀的標題（將連字號替換為空格，並處理特殊字符）
const formattedSpeechName = computed(() => {
  return speechName
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
})

const title = computed(() => ` View Section: ${formattedSpeechName.value} :: SayIt `)
const ogTitle = computed(() => `View Section: ${formattedSpeechName.value} :: SayIt`)

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
    <p>Speech Name: {{ speechName }}</p>
  </main>
</template>
