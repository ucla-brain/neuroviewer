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
      <ul class="list-group" v-if="erroredFileNames.length">
        <v-expansion-panels> 
          <v-expansion-panel class="errored-files-pane">

            <v-expansion-panel-title id="error-panel-title" expand-icon="none" collapse-icon="none" @click="toggleExpanded">
              Failed Uploads: {{ erroredFileNames.length }}
              <v-icon icon="mdi-plus" class="icon" v-show="!expanded"></v-icon>
              <v-icon icon="mdi-minus" class="icon" v-show="expanded"></v-icon>
            </v-expansion-panel-title>

            <div class="errored-files-list">
              <li v-for="file in erroredFileNames" class="error-panel-item" :style="{borderBottom: expanded ? '1px solid rgb(224,220,220)' : 'none'}"> 
                <v-expansion-panel-text class="error-panel-item">
                <p>File: <i>{{ file.name }}</i></p>
                <p>Error: <i class="errorMsg">{{ file.error }}</i></p>
                </v-expansion-panel-text>
              </li>
            </div>
          </v-expansion-panel>
        </v-expansion-panels>
      </ul>
  </div>
</template>

<script>
/* eslint-disable */
import "@mdi/font/css/materialdesignicons.css";

export default {
  components: {},
  name: "filelist",
  props:['fileData', 'filenames', 'erroredFileNames'],
  data () {
    return {
      expanded: false,
    }
  },
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

    toggleExpanded: function(){
      this.expanded = !this.expanded;
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

.errored-files-pane {
  overflow: hidden;
  border: 1px solid rgb(224,220,220); 
  border-radius: 5px; 
}

.errored-files-list {
  overflow: auto;
  max-height: 25vh;
}

#error-panel-title{
  all: unset;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style-type: none;
  padding: 0;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 5px 0px 5px 7px;
  width: 100%;
  background-color: rgba(32,37,41,1);
  color: white;
}
.error-panel-item{
  overflow-x: auto;
  max-height: fit-content;
}
.icon {
  position: absolute;
  right: 2%;
}
.errorMsg{
  color: red
}

</style>