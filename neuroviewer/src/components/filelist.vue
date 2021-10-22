<template>
  <div>
    <div>
      <label v-for="(item, index) in filenames" :key="index">{{ item }}</label>
    </div>
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
</style>
