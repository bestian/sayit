import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SpeechesView from '../views/SpeechesView.vue'
import SpeakersView from '../views/SpeakersView.vue'
import SingleSpeakerView from '../views/SingleSpeakerView.vue'
import SingleSpeechView from '../views/SingleSpeechView.vue'
import SingleParagraphView from '../views/SingleParagraphView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/speeches',
      name: 'speeches',
      component: SpeechesView,
    },
    {
      path: '/speech/:paragraph_id',
      name: 'single-paragraph',
      component: SingleParagraphView,
    },
    {
      path: '/speakers',
      name: 'speakers',
      component: SpeakersView,
    },
    {
      path: '/speaker/:name',
      name: 'single-speaker',
      component: SingleSpeakerView,
    },
    {
      path: '/:speech_name',
      name: 'single-speech',
      component: SingleSpeechView,
    },
  ],
})

export default router
