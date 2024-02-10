<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import i18next from 'i18next'

import { LocalStrageName } from './type/enums'
import HomeHeader from './components/HomeHeader.vue'

onMounted(() => {
  if (localStorage.getItem(LocalStrageName.userLang) === null) {
    i18next.changeLanguage(navigator.language)
  } else {
    i18next.changeLanguage(localStorage.getItem(LocalStrageName.userLang) as string)
  }
})
</script>

<template>
  <!-- <header>
<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> 

<div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> 
  </header> -->
  <HomeHeader />
  <RouterView />
</template>

<style>
* {
  font-size: 14px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
  --background: #d2dbd6;
  --border-color: #3c493f;
  --text-height: 30px;
  --button-color-selected: #7e8d85;
  --header-height: 80px;
  --border-width: 2px;
}

.game-button {
  width: 120px;
  height: var(--text-height);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--button-color);
  border-radius: 3px;
  border: solid 1px var(--border-color);
  margin: 1px;
  user-select: none;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.game-button:hover {
  background-color: var(--button-color-selected);
  cursor: pointer;
}

.game-button:active {
  transform: scale(0.95);
}

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
