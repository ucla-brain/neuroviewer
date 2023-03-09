<template>
  <div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(item, index) in filenames" :key="index">
          Loaded ..... {{ item }} 
          <!-- <label class='check-container'>
            <input type='checkbox' class='check-btn'>
          </label> -->
          <!-- <button @click='toggleSwc(item, index)' v-if='multipleFiles()' class='sel-btn'>Select</button> -->
        </li>
      </ul>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {},
  name: "filelist",
  props:['fileData', 'filenames'],
  methods: {
    toggleSwc: function(fileName, index) {
      //unload all uploaded neurons
      for (let file in this.filenames) {
        s.unloadNeuron(this.filenames[file]);
      }
      //only load the selected neuron
      s.loadNeuron(fileName, null, this.fileData[index].parsedSwc, true, false, true);
      s.render();
    },

    multipleFiles: function (){
      return (this.filenames.length > 1);
    }
  }
};
</script>

<style scoped>
.list-group{
    max-height: 70vh;
    max-width: 60vw;
    margin-top: 20px;
    margin-bottom: 30px;
    overflow:scroll;
    margin-left: auto;
    margin-right: auto;
    -webkit-overflow-scrolling: touch;
}
.sel-btn{
  position: absolute;
  right: 0;
}
.check-btn{
  position: absolute;
  right: 2%;
  bottom: 30%;
}
/* Style for consistency */
button {
  background-image: linear-gradient(#f7f8fa ,#e7e9ec);
  border-color: #adb1b8 #a2a6ac #8d9096;
  border-style: solid;
  border-width: 1px;
  border-radius: 3px;
  box-shadow: rgba(255,255,255,.6) 0 1px 0 inset;
  box-sizing: border-box;
  color: #0f1111;
  cursor: pointer;
  display: inline-block;
  font-family: "Amazon Ember",Arial,sans-serif;
  font-size: 14px;
  height: 29px;
  font-size: 13px;
  outline: 0;
  overflow: hidden;
  padding: 0 11px;
  text-align: center;
  text-decoration: none;
  text-overflow: ellipsis;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
}

</style>
