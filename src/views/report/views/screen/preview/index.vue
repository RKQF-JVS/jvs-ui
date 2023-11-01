<template>
  <div class="mainbox" ref="dragContainer">
    <div
      :style="{
        height: screenProperties.height + 'px',
        width: screenProperties.width + 'px',
        background: screenProperties.background,
        backgroundImage: 'url(' + screenProperties.imgUrl + ')',
      }"
    >
      <draggables
        :components="components"
        ref="draggable"
        :draggable="false"
        :resizable="false"
        :myclass="'myclass'"
        :isView="true"
      ></draggables>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style scoped="">
.mainbox {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.mainbox::-webkit-scrollbar {
  display: none;
}
</style>
