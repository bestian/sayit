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
  <div class="full-page">
    <div class="full-page__row">
      <div class="full-page__unit">
        <div class="single-speech-layout">
          <div class="single-speech-layout__speech-column">
            <div class="speech speech-single-speech">
              <a class="speech-single-speech__speaker-portrait" href="/speaker/%E5%94%90%E9%B3%B3-3">
                <img
                  src="https://sayit.archive.tw/media/speakers/default/pic_AudreyTang-small.jpg.96x96_q85_crop-smart_face_upscale.jpg"
                  style="border-color: #4d89d2; background-color: #4d89d2;" alt=""
                  class="speaker-portrait speaker-portrait--left round-image speaker-portrait--large">
              </a>
              <div class="speech__meta-data">
                <span class="speech__meta-data__speech-type">Speech</span> by <span
                  class="speech__meta-data__speaker-name"> <a href="/speaker/%E5%94%90%E9%B3%B3-3">唐鳳</a> </span>
              </div>
              <div class="speech__content speech__content-single-speech">
                <p>柏林晚安。非常榮幸能來到這裡——這座城市向世人證明，當人們攜手並肩時，即使高牆也能倒塌。</p>
              </div>
              <ul class="breadcrumbs">
                <li><a
                    href="/2025-11-10-%E6%9F%8F%E6%9E%97%E8%87%AA%E7%94%B1%E6%9C%83%E8%AD%B0ai-%E7%9A%84%E8%A7%92%E8%89%B2">2025-11-10
                    柏林自由會議：AI 的角色</a>
                </li>
              </ul>
              <div class="speech__links">
                <a
                  href="/2025-11-10-%E6%9F%8F%E6%9E%97%E8%87%AA%E7%94%B1%E6%9C%83%E8%AD%B0ai-%E7%9A%84%E8%A7%92%E8%89%B2#s628198"><i
                    class="speech-icon icon-link-in-context"></i>Show context</a>
              </div>
            </div>
            <!-- ./speech -->
            <div class="speech-navigation">
              <div class="speech-navigation__column speech-navigation__column--one">
                <a href="/speech/628197" class="button speech-navigation__button">←
                  （...</a>
                <a href="/speech/628199" class="button speech-navigation__button">我認為柏林是討論 AI 角色的完美地點，因為這裡 1989 ...
                  →</a>
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
