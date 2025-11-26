<script setup lang="ts">
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
                <input type="search" class="site-search__input" placeholder="Search" name="q" />
                <input type="submit" class="icon-search icon-search" value="Search" />
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
</template>

<style scoped></style>
