<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import axios from 'axios'

// 定義 TypeScript 介面
interface SpeechItem {
  filename: string
  display_name: string
}

useHead({
  title: ' Speeches :: Sayit ',
  meta: [
    {
      property: 'og:title',
      content: 'SayIt',
    },
  ],
})

const speech_index = ref<SpeechItem[]>([])

onMounted(async () => {
  try {
    const response = await axios.get<SpeechItem[]>(
      'https://sayit-backend.audreyt.workers.dev/api/speech_index.json'
    )
    speech_index.value = response.data
  } catch (error) {
    console.error('Failed to fetch speech index:', error)
  }
})

// 生成演講連結
const getSpeechUrl = (filename: string) => {
  return `/${encodeURIComponent(filename)}`
}
</script>

<template>
  <div class="full-page">
    <div class="full-page__row">
      <div class="full-page__unit">
        <div class="page-header">
          <h1>Speeches</h1>
        </div>
        <ul class="unstyled">
          <li v-for="speech in speech_index" :key="speech.filename">
            <span class="section-title">
              <router-link :to="getSpeechUrl(speech.filename)">
                {{ speech.display_name }}
              </router-link>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
