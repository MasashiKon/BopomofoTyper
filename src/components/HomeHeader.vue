<template>
  <header>
    <div class="icon">
      <img src="/images/bt_icon1.png" alt="icon" draggable="false" />
    </div>
    <ul class="link-container">
      <li class="page-link">
        <a href="/">Home</a>
      </li>
      <li class="page-link">
        <a href="/Converter">Converter</a>
      </li>
    </ul>
  </header>
</template>

<style>
header {
  width: 100%;
  height: var(--header-height);
  background-color: var(--background);
  border: var(--border-width) var(--border-color);
  border-bottom-style: solid;
  display: flex;
  justify-content: space-between;
}
.icon {
  margin-left: 20px;
  display: flex;
  align-items: center;
  img {
    height: 50px;
    widows: 50px;
  }
}
.link-container {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
}
.page-link {
  a {
    text-decoration: none;
    color: black;
  }
}
</style>
