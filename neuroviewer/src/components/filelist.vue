<template>
  <div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(item, index) in filenames" :key="index">Loaded ..... {{ item }}</li>
      </ul>
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
.list-group{
    max-height: 180px;
    margin-bottom: 5px;
    overflow:scroll;
    -webkit-overflow-scrolling: touch;
}
</style>
