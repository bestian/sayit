<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({
  title: ' Home :: SayIt ',
  meta: [
    {
      property: 'og:title',
      content: 'SayIt',
    },
  ],
})

const ccText = ref('')

onMounted(() => {
  if (navigator.language.toLowerCase() === 'zh-tw') {
    ccText.value = '本站由 唐鳳 維運，除另有標示外，內容以創用 CC0 授權條款釋出'
  } else {
    ccText.value = 'This site is maintained and operated by Audrey Tang. Unless otherwise indicated, the content is released under the terms of the Creative Commons CC0 license.'
  }
})
</script>

<template>
  <div class="full-page">
    <div class="full-page__row">
      <div class="full-page__unit">
        <div class="page-content__row">
          <div class="homepage-search">
            <h2>Search speeches and statements</h2>
            <form class="site-search site-search--homepage" action="/search/" method="get">
              <div class="search-wrapper">
                <input type="search" class="site-search__input" placeholder="搜尋" name="q" />
                <input type="submit" class="icon-search icon-search" value="搜尋" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="homepage-stats">
      <div class="full-page__row">
        <div class="full-page__unit">
          <RouterLink to="/speeches"><strong>400841</strong></RouterLink> speeches;
          <RouterLink to="/speakers"><strong>8037</strong></RouterLink> speakers;
          <RouterLink to="/speeches"><strong>2193</strong></RouterLink> sections
        </div>
      </div>
      <div class="full-page__row">
        <div class="full-page__unit"></div>
      </div>
    </div>
  </div>
  <footer class="full-page__row">
    <div class="full-page__unit" style="display: flex">
      <div class="row">
        <div class="columns small-12 large-9" style="padding: 0">
          <p style="font-size: 1em; font-weight: bold; display: flex; margin-inline-end: auto;" id="cc">
            {{ ccText }}
          </p>
        </div>
        <div class="columns small-12 large-3" style="padding: 0">
          <p style="font-size: 1em; font-weight: bold; display: flex; justify-content: end">
            <a id="tos"></a>
            <a id="privacy" style="margin-left: 1rem"></a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
