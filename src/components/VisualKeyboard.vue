<script setup lang="ts">
defineProps({ isShift: Boolean })
</script>

<template>
  <div class="keyboard-container">
    <div class="keyboard">
      <div class="keyboard-row">
        <div class="keyboard-key">
          <div>1</div>
          <div v-if="!isShift">ㄅ</div>
          <div v-else>！</div>
        </div>
        <div class="keyboard-key">
          <div>2</div>
          <div v-if="!isShift">ㄉ</div>
        </div>
        <div class="keyboard-key">
          <div>3</div>
          <div v-if="!isShift">ˇ</div>
        </div>
        <div class="keyboard-key">
          <div>4</div>
          <div v-if="!isShift">ˋ</div>
        </div>
        <div class="keyboard-key">
          <div>5</div>
          <div v-if="!isShift">ㄓ</div>
        </div>
        <div class="keyboard-key">
          <div>6</div>
          <div v-if="!isShift">ˊ</div>
        </div>
        <div class="keyboard-key">
          <div>7</div>
          <div v-if="!isShift">˙</div>
        </div>
        <div class="keyboard-key">
          <div>8</div>
          <div v-if="!isShift">ㄚ</div>
        </div>
        <div class="keyboard-key">
          <div>9</div>
          <div v-if="!isShift">ㄞ</div>
        </div>
        <div class="keyboard-key">
          <div>0</div>
          <div v-if="!isShift">ㄢ</div>
        </div>
        <div class="keyboard-key">
          <div>-</div>
          <div v-if="!isShift">ㄦ</div>
        </div>
      </div>
      <div class="keyboard-row">
        <div class="keyboard-key">
          <div>Q</div>
          <div v-if="!isShift">ㄆ</div>
        </div>
        <div class="keyboard-key">
          <div>W</div>
          <div v-if="!isShift">ㄊ</div>
        </div>
        <div class="keyboard-key">
          <div>E</div>
          <div v-if="!isShift">ㄍ</div>
        </div>
        <div class="keyboard-key">
          <div>R</div>
          <div v-if="!isShift">ㄐ</div>
        </div>
        <div class="keyboard-key">
          <div>T</div>
          <div v-if="!isShift">ㄔ</div>
        </div>
        <div class="keyboard-key">
          <div>Y</div>
          <div v-if="!isShift">ㄗ</div>
        </div>
        <div class="keyboard-key">
          <div>U</div>
          <div v-if="!isShift">ㄧ</div>
        </div>
        <div class="keyboard-key">
          <div>I</div>
          <div v-if="!isShift">ㄛ</div>
        </div>
        <div class="keyboard-key">
          <div>O</div>
          <div v-if="!isShift">ㄟ</div>
        </div>
        <div class="keyboard-key">
          <div>P</div>
          <div v-if="!isShift">ㄣ</div>
        </div>
      </div>
      <div class="keyboard-row">
        <div class="keyboard-key">
          <div>A</div>
          <div v-if="!isShift">ㄇ</div>
        </div>
        <div class="keyboard-key">
          <div>S</div>
          <div v-if="!isShift">ㄋ</div>
        </div>
        <div class="keyboard-key">
          <div>D</div>
          <div v-if="!isShift">ㄎ</div>
        </div>
        <div class="keyboard-key">
          <div>F</div>
          <div v-if="!isShift">ㄑ</div>
        </div>
        <div class="keyboard-key">
          <div>G</div>
          <div v-if="!isShift">ㄕ</div>
        </div>
        <div class="keyboard-key">
          <div>H</div>
          <div v-if="!isShift">ㄘ</div>
        </div>
        <div class="keyboard-key">
          <div>J</div>
          <div v-if="!isShift">ㄨ</div>
        </div>
        <div class="keyboard-key">
          <div>K</div>
          <div v-if="!isShift">ㄜ</div>
        </div>
        <div class="keyboard-key">
          <div>L</div>
          <div v-if="!isShift">ㄠ</div>
        </div>
        <div class="keyboard-key">
          <div>;</div>
          <div v-if="!isShift">ㄤ</div>
        </div>
      </div>
      <div class="keyboard-row">
        <div class="keyboard-key">
          <div>Z</div>
          <div v-if="!isShift">ㄈ</div>
        </div>
        <div class="keyboard-key">
          <div>X</div>
          <div v-if="!isShift">ㄌ</div>
        </div>
        <div class="keyboard-key">
          <div>C</div>
          <div v-if="!isShift">ㄏ</div>
        </div>
        <div class="keyboard-key">
          <div>V</div>
          <div v-if="!isShift">ㄒ</div>
        </div>
        <div class="keyboard-key">
          <div>B</div>
          <div v-if="!isShift">ㄖ</div>
        </div>
        <div class="keyboard-key">
          <div>N</div>
          <div v-if="!isShift">ㄙ</div>
        </div>
        <div class="keyboard-key">
          <div>M</div>
          <div v-if="!isShift">ㄩ</div>
        </div>
        <div class="keyboard-key">
          <div>,</div>
          <div v-if="!isShift">ㄝ</div>
          <div v-else>，</div>
        </div>
        <div class="keyboard-key">
          <div>.</div>
          <div v-if="!isShift">ㄡ</div>
          <div v-else>。</div>
        </div>
        <div class="keyboard-key">
          <div>/</div>
          <div v-if="!isShift">ㄥ</div>
          <div v-else>？</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.keyboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: chartreuse;
  width: 640px;
  height: 200px;
}

.keyboard {
  --key-size: 40px;
  --row-gap: 15px;
  --row-base-margin: -15px;
  .keyboard-row {
    display: flex;
    padding: 2px 0;
    .keyboard-key {
      width: var(--key-size);
      height: var(--key-size);
      background-color: whitesmoke;
      border: 1px solid black;
      text-align: center;
      margin: 0 2px;
    }
    .key-pressed {
      background-color: rgb(177, 177, 177);
    }
  }

  .keyboard-row:nth-child(1) {
    margin-left: calc(var(--row-base-margin) + var(--row-gap));
  }

  .keyboard-row:nth-child(2) {
    margin-left: calc(var(--row-base-margin) + (var(--row-gap) * 2));
  }

  .keyboard-row:nth-child(3) {
    margin-left: calc(var(--row-base-margin) + (var(--row-gap) * 3));
  }

  .keyboard-row:nth-child(4) {
    margin-left: calc(var(--row-base-margin) + (var(--row-gap) * 4));
  }
}
</style>
