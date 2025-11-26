<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const paragraphId = computed(() => route.params.paragraph_id as string)

// 定義 TypeScript 介面
interface Section {
  filename: string
  section_id: number
  section_speaker: string | null
  section_content: string
  previous_section_id: number | null
  next_section_id: number | null
  display_name: string
  photoURL: string | null
  name: string | null
  previous_content: string | null
  next_content: string | null
}

const section = ref<Section | null>(null)
const parsedContent = ref<string>('')
const previousTextPreview = ref<string>('')
const nextTextPreview = ref<string>('')

// 獲取段落內容預覽（前30個字符，去除HTML標籤）
const sectionContentPreview = computed(() => {
  if (!parsedContent.value) {
    return ''
  }
  const plainText = stripHtmlTags(parsedContent.value).trim()
  return plainText.substring(0, 30)
})

// 獲取段落內容的純文字（完整內容，去除HTML標籤）
const sectionContentPlainText = computed(() => {
  if (!parsedContent.value) {
    return ''
  }
  return stripHtmlTags(parsedContent.value).trim()
})

// 動態標題
const title = computed(() => {
  if (sectionContentPreview.value) {
    return `"${sectionContentPreview.value}..." :: SayIt`
  }
  return 'View Paragraph :: SayIt'
})

const ogTitle = computed(() => {
  if (sectionContentPreview.value) {
    return `"${sectionContentPreview.value}..." :: SayIt`
  }
  return 'View Paragraph :: SayIt'
})

const ogDescription = computed(() => {
  return sectionContentPlainText.value
})

useHead({
  title: title,
  meta: [
    {
      property: 'og:title',
      content: ogTitle,
    },
    {
      property: 'og:description',
      content: ogDescription,
    },
  ],
})

// 處理 JSON 跳脫字符
const parseContent = (content: string): string => {
  try {
    // 如果內容是 JSON 跳脫的字符串，先解析
    const parsed = JSON.parse(content)
    return typeof parsed === 'string' ? parsed : content
  } catch {
    // 如果不是有效的 JSON，直接返回原內容
    return content
  }
}

// 移除 HTML 標籤並提取純文字
const stripHtmlTags = (html: string): string => {
  // 創建一個臨時的 DOM 元素來解析 HTML
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// 抓取段落資料的主要函式
const fetchSectionData = async (sectionId: string) => {
  try {
    // 重置狀態
    section.value = null
    parsedContent.value = ''
    previousTextPreview.value = ''
    nextTextPreview.value = ''

    // 調用段落 API
    const response = await axios.get<Section>(
      `https://sayit-backend.audreyt.workers.dev/api/section/${sectionId}`
    )
    section.value = response.data

    // 處理 section_content 的 JSON 跳脫字符
    if (section.value.section_content) {
      parsedContent.value = parseContent(section.value.section_content)
    }

    // 處理上一段的文字預覽（前 30 個字符）
    if (section.value.previous_content) {
      const parsed = parseContent(section.value.previous_content)
      const plainText = stripHtmlTags(parsed).trim()
      previousTextPreview.value = plainText.substring(0, 30)
    }

    // 處理下一段的文字預覽（前 30 個字符）
    if (section.value.next_content) {
      const parsed = parseContent(section.value.next_content)
      const plainText = stripHtmlTags(parsed).trim()
      nextTextPreview.value = plainText.substring(0, 30)
    }
  } catch (error) {
    console.error('Failed to fetch section data:', error)
  }
}

// 監聽路由參數變化
watch(paragraphId, (newId) => {
  if (newId) {
    fetchSectionData(newId)
  }
}, { immediate: false })

// 鍵盤快捷鍵處理
const handleKeydown = (event: KeyboardEvent) => {
  // 如果用戶正在輸入（例如在 input 或 textarea 中），則不觸發快捷鍵
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return
  }

  if (event.key === 'j' && section.value?.previous_section_id) {
    event.preventDefault()
    router.push(getParagraphUrl(section.value.previous_section_id))
  } else if (event.key === 'k' && section.value?.next_section_id) {
    event.preventDefault()
    router.push(getParagraphUrl(section.value.next_section_id))
  }
}

// API 調用邏輯
onMounted(async () => {
  if (paragraphId.value) {
    await fetchSectionData(paragraphId.value)
  }
  // 添加鍵盤事件監聽器
  window.addEventListener('keydown', handleKeydown)
})

// 清理鍵盤事件監聽器
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// 生成講者連結（section_speaker 已經是 URIComponent 編碼）
const getSpeakerUrl = (route_pathname: string) => {
  return `/speaker/${route_pathname}`
}

// 生成演講連結（用於麵包屑）
const getSpeechUrl = (filename: string) => {
  return `/${encodeURIComponent(filename)}`
}

// 生成 Show context 連結
const getContextUrl = (filename: string, sectionId: number) => {
  return {
    path: `/${encodeURIComponent(filename)}`,
    hash: `#s${sectionId}`
  }
}

// 生成上一段/下一段連結
const getParagraphUrl = (sectionId: number) => {
  return `/speech/${sectionId}`
}
</script>

<template>
  <div class="full-page" v-if="section">
    <div class="full-page__row">
      <div class="full-page__unit">
        <div class="single-speech-layout">
          <div class="single-speech-layout__speech-column">
            <div class="speech speech-single-speech">
              <!-- 講者頭像 -->
              <router-link v-if="section.section_speaker && section.photoURL"
                class="speech-single-speech__speaker-portrait" :to="getSpeakerUrl(section.section_speaker)">
                <img :src="section.photoURL" :style="`border-color: #4d89d2; background-color: #4d89d2;`"
                  :alt="section.name || ''"
                  class="speaker-portrait speaker-portrait--left round-image speaker-portrait--large">
              </router-link>
              <!-- 講者信息 -->
              <div class="speech__meta-data">
                <span class="speech__meta-data__speech-type">Speech</span>
                <span v-if="section.section_speaker && section.name"> by <span class="speech__meta-data__speaker-name">
                    <router-link :to="getSpeakerUrl(section.section_speaker)">{{ section.name }}</router-link>
                  </span>
                </span>
              </div>
              <!-- 段落內容 -->
              <div class="speech__content speech__content-single-speech" v-html="parsedContent">
              </div>
              <!-- 麵包屑導航 -->
              <ul class="breadcrumbs" v-if="section.filename">
                <li>
                  <router-link :to="getSpeechUrl(section.filename)">
                    {{ section.display_name }}
                  </router-link>
                </li>
              </ul>
              <!-- Show context 連結 -->
              <div class="speech__links" v-if="section.filename && section.section_id">
                <router-link :to="getContextUrl(section.filename, section.section_id)">
                  <i class="speech-icon icon-link-in-context"></i>Show context
                </router-link>
              </div>
            </div>
            <!-- ./speech -->
            <!-- 上一段/下一段導航 -->
            <div class="speech-navigation">
              <div class="speech-navigation__column speech-navigation__column--one">
                <router-link v-if="section.previous_section_id" :to="getParagraphUrl(section.previous_section_id)"
                  class="button speech-navigation__button">
                  <template v-if="previousTextPreview">
                    ← {{ previousTextPreview }}...
                  </template>
                  <template v-else>
                    ← （...
                  </template>
                </router-link>
                <router-link v-if="section.next_section_id" :to="getParagraphUrl(section.next_section_id)"
                  class="button speech-navigation__button">
                  <template v-if="nextTextPreview">
                    {{ nextTextPreview }}... →
                  </template>
                  <template v-else>
                    （... →
                  </template>
                </router-link>
              </div>
              <div class="speech-navigation__column speech-navigation__column--two">
                <div class="ui-instructions">
                  <h2>Keyboard shortcuts</h2>
                  <p><span class="key-descriptor">j</span> previous speech
                    <span class="key-descriptor">k</span> next speech
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
