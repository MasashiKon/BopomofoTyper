<script setup lang="ts">
import { ref } from 'vue'

const isPressed = ref(false)
const detectA = () => {
  isPressed.value = !isPressed.value
}
</script>

<template>
  <main>
    <div tabindex="0" @keydown.a="detectA" :class="{ pressed: isPressed }">a</div>
    <button>Start</button>
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
