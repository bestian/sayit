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
const sortedSections = ref<Section[]>([])
const isMonotonic = ref(true)
const loading = ref(true)

// 檢查 section_id 是否單調上升
const checkMonotonic = (sections: Section[]): boolean => {
  if (sections.length <= 1) {
    return true
  }
  for (let i = 1; i < sections.length; i++) {
    const current = sections[i]
    const previous = sections[i - 1]
    if (current && previous && current.section_id <= previous.section_id) {
      return false
    }
  }
  return true
}

// 重新排列段落順序
const reorderSections = (sections: Section[]): Section[] => {
  if (sections.length === 0) {
    return []
  }

  // 創建新的陣列，不修改原始陣列
  const newArray: Section[] = []
  const remaining = [...sections] // 複製原始陣列

  // 1. 找到最小 section_id 的物件當最前面
  if (remaining.length === 0 || !remaining[0]) {
    return []
  }

  let minIndex = 0
  let minSectionId = remaining[0].section_id
  for (let i = 1; i < remaining.length; i++) {
    const current = remaining[i]
    if (current && current.section_id < minSectionId) {
      minSectionId = current.section_id
      minIndex = i
    }
  }

  // 將最小 section_id 的物件加入新陣列
  const firstSection = remaining[minIndex]
  if (firstSection) {
    newArray.push(firstSection)
    remaining.splice(minIndex, 1)
  }

  // 2. 用 for 迴圈數陣列長度那麼多次，每次把 previous_section_id 和陣列中最後一位的 section_id 相同的接上去
  const arrayLength = sections.length
  for (let i = 0; i < arrayLength - 1; i++) {
    const lastItem = newArray[newArray.length - 1]
    if (!lastItem) {
      break
    }

    const lastSectionId = lastItem.section_id
    let found = false

    // 尋找 previous_section_id 等於最後一位 section_id 的物件
    for (let j = 0; j < remaining.length; j++) {
      const current = remaining[j]
      if (current && current.previous_section_id === lastSectionId) {
        newArray.push(current)
        remaining.splice(j, 1)
        found = true
        break
      }
    }

    // 如果找不到，可能已經到結尾或資料有問題
    if (!found) {
      break
    }
  }

  return newArray
}

// 獲取演講資料
const fetchSpeechData = async () => {
  try {
    loading.value = true
    const response = await axios.get<Section[]>(
      `https://sayit-backend.audreyt.workers.dev/api/speech/${encodeURIComponent(speechName)}`
    )
    const rawData = response.data

    // 檢查是否單調上升
    const isMonotonicValue = checkMonotonic(rawData)
    isMonotonic.value = isMonotonicValue

    if (isMonotonicValue) {
      // 如果單調上升，直接使用原始資料
      sections.value = rawData
      sortedSections.value = []
    } else {
      // 如果不是單調上升，重新排列
      sections.value = rawData
      sortedSections.value = reorderSections(rawData)
    }
  } catch (error) {
    console.error('Failed to fetch speech data:', error)
  } finally {
    loading.value = false
  }
}

// 根據 isMonotonic 決定使用哪個陣列
const displaySections = computed(() => {
  return isMonotonic.value ? sections.value : sortedSections.value
})

// 將 URL slug 轉換為可讀的標題（將連字號替換為空格，並處理特殊字符）
const formattedSpeechName = computed(() => {
  if (displaySections.value.length > 0 && displaySections.value[0]) {
    return displaySections.value[0].display_name
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
          <h1 v-if="!loading && displaySections.length > 0 && displaySections[0]">{{ displaySections[0].display_name }}
          </h1>
          <h1 v-else>{{ formattedSpeechName }}</h1>
        </div>
        <div class="page-content__row" v-if="!loading">
          <div class="primary-content__unit">
            <ul class="section-list">
              <li v-for="section in displaySections" :key="section.section_id" :id="`s${section.section_id}`" :class="[
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
