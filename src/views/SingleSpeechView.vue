<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import axios from 'axios'

const route = useRoute()
const speechName = route.params.speech_name as string

// 定義 TypeScript 介面
interface Section {
  filename: string
  section_id: number
  previous_section_id: number | null
  next_section_id: number | null
  section_speaker: string | null
  section_content: string
  display_name: string
  photoURL: string | null
  name: string | null
}

const sections = ref<Section[]>([])
const loading = ref(true)

// 獲取演講資料
const fetchSpeechData = async () => {
  try {
    loading.value = true
    const response = await axios.get<Section[]>(
      `https://sayit-backend.audreyt.workers.dev/api/speech/${encodeURIComponent(speechName)}`
    )
    sections.value = response.data
  } catch (error) {
    console.error('Failed to fetch speech data:', error)
  } finally {
    loading.value = false
  }
}

// 將 URL slug 轉換為可讀的標題（將連字號替換為空格，並處理特殊字符）
const formattedSpeechName = computed(() => {
  if (sections.value.length > 0 && sections.value[0]) {
    return sections.value[0].display_name
  }
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

// 生成連結的輔助函數
const getLinkInContextUrl = (section: Section) => {
  return {
    path: `/${encodeURIComponent(section.filename)}`,
    hash: `#s${section.section_id}`
  }
}

const getSpeechPageUrl = (sectionId: number) => {
  return `/speech/${sectionId}`
}

const getSpeakerUrl = (sectionSpeaker: string) => {
  return `/speaker/${sectionSpeaker}`
}

// 獲取講者顏色（如果有講者照片，可能需要根據講者生成顏色）
const getSpeakerColor = (): string => {
  // 這裡可以根據需要實現顏色邏輯
  // 暫時返回一個預設顏色
  return '#4d89d2'
}

onMounted(() => {
  fetchSpeechData()
})
</script>

<template>
  <div class="full-page">
    <div class="full-page__row">
      <div class="full-page__unit">
        <div class="page-header page-header--speech">
          <ul class="breadcrumbs">
          </ul>
          <h1 v-if="!loading && sections.length > 0 && sections[0]">{{ sections[0].display_name }}</h1>
          <h1 v-else>{{ formattedSpeechName }}</h1>
        </div>
        <div class="page-content__row" v-if="!loading">
          <div class="primary-content__unit">
            <ul class="section-list">
              <li v-for="section in sections" :key="section.section_id" :id="`s${section.section_id}`" :class="[
                'speech',
                'speech--',
                'speech--border',
                section.section_speaker ? 'speech--with-portrait' : ''
              ]" :style="section.section_speaker ? { borderLeftColor: getSpeakerColor() } : {}">
                <div class="speaker-portrait-wrapper" v-if="section.section_speaker && section.photoURL">
                  <img :src="section.photoURL"
                    :style="`border-color: ${getSpeakerColor()}; background-color: ${getSpeakerColor()};`"
                    :alt="section.name || ''"
                    class="speaker-portrait speaker-portrait--left round-image speaker-portrait--medium">
                </div>
                <div class="speech-wrapper">
                  <div class="speech__meta-data" v-if="section.section_speaker && section.name">
                    <span class="speech__meta-data__speaker-name">
                      <router-link :to="getSpeakerUrl(section.section_speaker)">
                        {{ section.name }}
                      </router-link>
                    </span>
                  </div>
                  <div class="speech__content" v-html="section.section_content">
                  </div>
                  <div class="speech__links">
                    <router-link :to="getLinkInContextUrl(section)" title="Link in context">
                      <i class="speech-icon icon-link-in-context"></i>Link in context
                    </router-link>
                    <router-link :to="getSpeechPageUrl(section.section_id)" title="Link">
                      <i class="speech-icon icon-link"></i>Link
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- close primary-content__unit -->
          <div class="sidebar__unit section-detail-sidebar">
          </div>
          <!-- close sidebar__unit -->
        </div>
        <!-- close page-content_row -->
      </div>
    </div>
  </div>
</template>
