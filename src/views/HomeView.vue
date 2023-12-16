<script setup lang="ts">
import { ref } from 'vue'

const isPressed = ref(false)
const isStart = ref(false)
const timeCount = ref(0)
let interval: number | null
const detectA = () => {
  isPressed.value = !isPressed.value
}
const toggleIsStart = () => {
  if (isStart.value) {
    if (!interval) return
    clearInterval(interval)
    interval = null
  } else {
    interval = setInterval(() => {
      timeCount.value = timeCount.value + 1
    }, 1000)
  }
  isStart.value = !isStart.value
}
</script>

<template>
  <main>
    <div tabindex="0" @keydown.a="detectA" :class="{ pressed: isPressed }">
      <span>a</span><span>{{ timeCount }}</span>
    </div>
    <button @click="toggleIsStart">{{ isStart ? 'Stop' : 'Start' }}</button>
  </main>
</template>

<style>
/*@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}*/

main {
  padding: 0;
  margin: 0;
}

div {
  width: 50vw;
  height: 50vh;
  background-color: aqua;
  margin: 0px;
  padding: 0px;
  border: black 2px solid;
}

div:focus {
  outline: none;
}

.pressed {
  color: red;
}
</style>
