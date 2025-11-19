<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import axios from 'axios'

const route = useRoute()
const route_pathname = route.params.route_pathname as string

interface Speech {
  summary: string
  speech_name: string
  section_id: number
}

interface Speaker {
  id: number
  route_pathname: string
  name: string
  photoURL: string
  appearances_count: number
  speeches_count: number
  speeches: Speech[]
  longest_speech: Speech
}

const speaker = ref<Speaker | null>(null)

// 將 URL slug 轉換為可讀的標題（將連字號替換為空格）
const formattedName = computed(() => {
  if (speaker.value) {
    return speaker.value.name
  }
  return route_pathname.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
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

// 生成演講連結（包含 hash，用於 router-link）
const getSpeechUrl = (speechName: string, sectionId: number) => {
  return {
    path: `/${encodeURIComponent(speechName)}`,
    hash: `#s${sectionId}`
  }
}

// 生成演講頁面連結
const getSpeechPageUrl = (sectionId: number) => {
  return `/speech/${sectionId}`
}

// 生成演講名稱連結（不含 hash）
const getSpeechNameUrl = (speechName: string) => {
  return `/${encodeURIComponent(speechName)}`
}

onMounted(async () => {
  try {
    const response = await axios.get<Speaker>(
      `https://sayit-backend.audreyt.workers.dev/api/speaker_detail/${encodeURIComponent(route_pathname)}.json`
    )
    speaker.value = response.data
  } catch (error) {
    console.error('Failed to fetch speaker data:', error)
  }
})
</script>

<template>
  <div class="full-page" v-if="speaker">
    <div class="full-page__row">
      <div class="full-page__unit">
        <div class="page-header page-header--with-portrait">
          <div class="page-header__row">
            <div class="speaker-page__details">
              <img :src="speaker.photoURL" style="border-color: #4d89d2; background-color: #4d89d2;"
                class="speaker-portrait speaker-portrait--left speaker-portrait--large round-image"
                :alt="`Headshot of ${speaker.name}`">
              <div class="speaker-information">
                <h1>{{ speaker.name }}</h1>
              </div>
              <div class="speaker-page__stats">
                <div class="stat">
                  <div class="stat__figure">
                    {{ speaker.appearances_count }}
                  </div>
                  <div class="stat__descriptor">
                    Appearances
                  </div>
                </div>
                <div class="stat">
                  <div class="stat__figure">
                    {{ speaker.speeches_count }}
                  </div>
                  <div class="stat__descriptor">
                    Speeches
                  </div>
                </div>
                <!--
								<div class="stat">
									<div class="stat__figure">
										4<sup>th</sup>
									</div>
									<div class="stat__descriptor">
										of 60 speakers
									</div>
								</div>
								-->
                <div class="stat" v-if="speaker.longest_speech">
                  <div class="stat__figure">
                    <router-link
                      :to="getSpeechUrl(speaker.longest_speech.speech_name, speaker.longest_speech.section_id)">
                      "{{ speaker.longest_speech.summary }}"
                    </router-link>
                  </div>
                  <div class="stat__descriptor">
                    Longest speech
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="speaker-page__speeches-collection">
          <div class="full-page__row nested-row">
            <div class="speaker-page__speeches-title">
              <h2>Speeches</h2>
            </div>
            <div class="speaker-page__add-speech">
            </div>
            <div class="speaker-page__search">
              <form class="site-search site-search" action="/search/" method="get">
                <input type="hidden" name="p" :value="speaker.id">
                <div class="search-wrapper">
                  <input type="search" class="site-search__input" placeholder="Search this person's speeches" name="q">
                  <input type="submit" class="icon-search icon-search" value="搜尋">
                </div>
              </form>
            </div>
          </div>
          <ul class="unstyled js-masonry"
            data-masonry-options="{&quot;columnWidth&quot;:&quot;.speech&quot;,&quot;itemSelector&quot;:&quot;.speech&quot;,&quot;gutter&quot;:&quot;.gutter-sizer&quot;}">
            <li class="gutter-sizer"></li>
            <li v-for="speech in speaker.speeches" :key="speech.section_id" :id="`s${speech.section_id}`"
              class="speech speech--speech speech--border" style="border-left-color: rgb(77, 137, 210);">
              <div class="speech-wrapper">
                <div class="speech__breadcrumb">
                  <ul class="breadcrumbs">
                    <li>
                      <router-link :to="getSpeechNameUrl(speech.speech_name)">
                        {{ speech.speech_name.replace(/-/g, ' ') }}
                      </router-link>
                    </li>
                    <li class="no-content-after">
                      <span class="breadcrumbs__date">
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="speech__meta-data">
                </div>
                <router-link :title="`Link in context`" :to="getSpeechUrl(speech.speech_name, speech.section_id)"
                  class="speech__content-link">
                  <div class="speech__content">
                    <p>{{ speech.summary }}</p>
                  </div>
                </router-link>
                <div class="speech__links">
                  <router-link :title="`Link in context`" :to="getSpeechUrl(speech.speech_name, speech.section_id)">
                    <i class="speech-icon icon-link-in-context"></i>Link in context
                  </router-link>
                  <router-link :title="`Link`" :to="getSpeechPageUrl(speech.section_id)">
                    <i class="speech-icon icon-link"></i>Link
                  </router-link>
                </div>
              </div>
            </li>
          </ul>
          <div class="pagination">
            <span class="button--disabled button search-pagination-button">← Previous</span>
            <span class="button current pagination__page-number">1</span>
            <a href="?page=2" class="button pagination__page-number">2</a>
            <a href="?page=3" class="button pagination__page-number">3</a>
            ...
            <a href="?page=1911" class="button pagination__page-number">1911</a>
            <a href="?page=1912" class="button pagination__page-number">1912</a>
            <a href="?page=2" class="button search-pagination-button">Next →</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
