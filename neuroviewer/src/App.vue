<template>
  <div id="app">
    <myheader></myheader>
    <router-view/>
  </div>
</template>

<script>
import myheader from './components/myheader.vue'

export default {
  name: 'App',
  components: {
    myheader
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
canvas, #container {
  width: 90vw !important;
  margin-right: auto ;
  margin-left: auto;
}
canvas {
  border: 1px solid lightgray;
  border-radius: 8px;
}
#axesCanvas {
  width: unset !important;
  border: unset;
}
#node_key {
  top: 10px !important;
}
</style>
