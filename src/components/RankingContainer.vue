<script setup lang="ts">
import type { Ranker } from '@/type/types'
defineProps({ rankers: Array<Ranker> })
</script>

<template>
  <div class="highscore-container">
    <div class="highscore-title">{{ $t('highScore') }}</div>
    <div v-if="rankers?.length">
      <ol>
        <li v-for="ranker of rankers" :key="ranker.name + ranker.date.getUTCDate()">
          <div class="ranker-container">
            <div>{{ $t('name') }}: {{ ranker.name }}</div>
            <div>{{ $t('score') }}: {{ ranker.score }}</div>
            <div>
              {{
                `${ranker.date.getFullYear()}/${
                  ranker.date.getMonth() + 1 > 9
                    ? ranker.date.getMonth() + 1
                    : '0' + (ranker.date.getMonth() + 1)
                }/${ranker.date.getDate()} ${
                  ranker.date.getHours() > 9 ? ranker.date.getHours() : '0' + ranker.date.getHours()
                }:${
                  ranker.date.getMinutes() > 9
                    ? ranker.date.getMinutes()
                    : '0' + ranker.date.getMinutes()
                }`
              }}
            </div>
          </div>
        </li>
      </ol>
    </div>
    <div v-else>No score</div>
  </div>
</template>

<style>
/*
  color:
  #3c493f
  #5d6b62
  #7e8d85
  #99a69f
  #b3bfb8
  #d2dbd6
  #f0f7f4
  #c9eddc
  #a2e3c4
}*/

.highscore-container {
  border: solid var(--border-color) 2px;
  border-radius: 10px;
  background-color: var(--background);
  padding: 5px;
  overflow: scroll;
  width: 200px;
  height: 400px;
}

.highscore-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2em;
}

.ranker-container {
  margin: 10px 5px;
}

ol {
  list-style-position: inside;
}

@media screen and (min-width: 1040px) {
  .highscore-container {
    grid-row-start: 2;
    grid-column-start: 4;
    justify-self: center;
    align-self: center;
  }
}

@media screen and (min-width: 960px) and (max-width: 1039px) {
  .highscore-container {
    margin-top: 50px;
  }
  .ranker-container {
    margin: 20px 5px;
  }
  ol {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

@media screen and (max-width: 959px) {
  .highscore-container {
    margin-top: 50px;
  }
  .ranker-container {
    margin: 20px 5px;
  }
  ol {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
