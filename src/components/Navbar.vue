<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div class="full-page__row">
      <div class="full-page__unit">
        <h1>
          <RouterLink to="/">SayIt</RouterLink>
        </h1>
        <ul class="inline-list left">
          <li>
            <RouterLink to="/">Home</RouterLink> <!-- 首頁 -->
          </li>
          <li>
            <RouterLink to="/speakers">Speakers</RouterLink>
          </li>
          <li>
            <RouterLink to="/speeches">Speeches</RouterLink>
          </li>
        </ul>
        <ul class="unstyled-list right"></ul>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
