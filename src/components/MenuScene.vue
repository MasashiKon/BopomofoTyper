<script setup lang="ts">
import { Level, GameState } from '@/type/enums'

const isDev:boolean = import.meta.env.MODE === 'development'
const { level } = defineProps<{
  level: Level
  isFocused: boolean
}>()
const emit = defineEmits(['setLevel', 'toggleGame'])
</script>

<template>
  <div>{{ $t('title') }}</div>
  <div class="level-container">
    <div
      class="game-button"
      :class="[level === Level.practice ? 'level-selected' : '']"
      :data-value="Level.practice"
      @click.stop="(e) => emit('setLevel', e)"
    >
      {{ $t('practice') }}
    </div>
    <div
      v-if="isDev"
      class="game-button"
      :class="[level === Level.debug ? 'level-selected' : '']"
      :data-value="Level.debug"
      @click.stop="(e) => emit('setLevel', e)"
    >
      {{ $t('debug') }}
    </div>
    <div
      class="game-button"
      :class="[level === Level.easy ? 'level-selected' : '']"
      :data-value="Level.easy"
      @click.stop="(e) => emit('setLevel', e)"
    >
      {{ $t('easy') }}
    </div>
    <div
      class="game-button"
      :class="[level === Level.hard ? 'level-selected' : '']"
      :data-value="Level.hard"
      @click.stop="(e) => emit('setLevel', e)"
    >
      {{ $t('hard') }}
    </div>
  </div>
  <div
    @click.prevent="(e) => emit('toggleGame', e, GameState.playing)"
    id="start-button"
    class="game-button"
    :class="{
      'startbotton-focused': isFocused
    }"
  >
    {{ $t('start') }}
  </div>
</template>
