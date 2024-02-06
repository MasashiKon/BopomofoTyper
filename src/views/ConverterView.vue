<script setup lang="ts"></script>

<template>
  <main>
    <div class="converter-container">
      <input type="text" />
      <div class="game-button">Convert</div>
      <input type="text" />
    </div>
  </main>
</template>

<style>
main {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--header-height) - var(--border-width));
}
.converter-container {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
@media screen and (min-width: 1040px) {
}

@media screen and (min-width: 960px) and (max-width: 1039px) {
}

@media screen and (max-width: 959px) {
}
</style>
