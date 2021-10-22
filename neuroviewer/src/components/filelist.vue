<template>
  <div>
      <label v-for="(item, index) in filenames" :key="index">{{ item }}</label>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {},
  name: "filelist",
  props: ['filenames']
};
</script>

<style scoped>
div {
    overflow: scroll;
    height: 180px;
} 
</style>
