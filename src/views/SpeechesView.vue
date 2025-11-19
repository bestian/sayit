<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import axios from 'axios'

useHead({
  title: ' Speeches :: Sayit ',
  meta: [
    {
      property: 'og:title',
      content: 'SayIt',
    },
  ],
})

const speech_index = ref<string[]>([])

// 格式化文字：將最後一個數字後面的 "-" 替換成 " "
const formatSpeechName = (name: string): string => {
  // 匹配最後一個數字序列後的 "-"，確保後面沒有更多數字序列
  return name.replace(/(\d+)-(?!.*\d)/, '$1 ')
}

onMounted(async () => {
  try {
    const response = await axios.get<string[]>(
      'https://sayit-backend.audreyt.workers.dev/api/speech_index.json'
    )
    speech_index.value = response.data
  } catch (error) {
    console.error('Failed to fetch speech index:', error)
  }
})
</script>

<template>
  <div class="full-page">
    <div class="full-page__row">
      <div class="full-page__unit">
        <div class="page-header">
          <h1>Speeches</h1>
        </div>
        <ul class="unstyled">
          <li v-for="speech_name in speech_index" :key="speech_name">
            <span class="section-title">
              <router-link :to="'/' + speech_name">
                {{ formatSpeechName(speech_name) }}
              </router-link>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
