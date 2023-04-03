<template>
  <div>
      <div class="searchBG" v-if="filesUploaded">
        <Popper :show="showPopperComputed">
          <v-icon icon="mdi-magnify" class="searchIcon"></v-icon>
          <template #content class="temp">
            <p class="temp">No file or folder matches found for: '<i>{{ this.filterVal }}</i>'</p>
          </template>
        </Popper>
        <v-icon icon="mdi-close" class="clearIcon" @click="clearVal" v-if="filterVal.length"></v-icon>
        <input type="search" class="searchBar" list="filesList" v-model="filterVal" placeholder="Filter files by name or path">
        <!-- <datalist id="filesList" class="datalist">
            <option v-for="file in filteredFiles" class="datalist">{{ file.name ? file.name : file }}</option>
        </datalist> -->
      </div>
      
      <div class="tab-bar list-group" v-if="filesUploaded">
        <v-tabs
          class="v-tabs"
          align-tabs="center"
          v-model="tabIndex"
          >
            <v-tab :value="1" :key="1" class="v-tab">
              Uploaded Files
              <v-icon icon="mdi-file-check"></v-icon>
              [<span class="successful-files-count">{{ filteredValidList.length }}</span>]
            </v-tab>
            <v-tab :value="2" :key="2" class="v-tab">
              Errors
              <v-icon icon="mdi-file-remove"></v-icon>
              [<span class="errors-files-count">{{ filteredErrorsList.length }}</span>]
            </v-tab>
          </v-tabs>
        </div>

      <v-window v-model="tabIndex" class="vwindow" v-if="filesUploaded"> 
        <v-window-item :value="1" :key="1">
          <v-card>
            <ul class="list-group" v-if="filteredValidList.length">
              <li class="list-group-item" v-for="(item, index) in filteredValidList" :key="index" >
                Loaded ..... {{ item }} 
                <label class='check-container'>
                </label>
              </li>
            </ul>
          </v-card>
        </v-window-item>
        <v-window-item :value="2" :key="2">
          <v-card>
            <ul class="list-group" v-if="erroredFileNames.length">
              <li class="list-group-item" v-for="(item, index) in filteredErrorsList" :key="index" > 
                <!-- erroredFileNames -->
                File: {{ item.name }} <br> Error: <i class="errors-files-count">{{ item.error }}</i>
                <label class='check-container'>
                </label>
              </li>
            </ul>
          </v-card>
        </v-window-item>
      </v-window>
  </div>
</template>

<script>
/* eslint-disable */
import "@mdi/font/css/materialdesignicons.css";
import Popper from 'vue3-popper';

export default {
  components: { Popper },
  name: "filelist",
  props:['fileData', 'filenames', 'erroredFileNames'],
  data () {
    return {
      expanded: false,
      showPopper: false,
      tab: null,
      filterVal: '',
      filteredFiles: [...this.filenames, ...this.erroredFileNames],
      tabIndex: 1,
    }
  },
  computed: {

    filteredValidList(){
      this.showPopper = false;
      let testarr = []
      let filter = this.filterVal.trim().toLowerCase()
      const containsSubStr = (element) => element.trim().toLowerCase().includes(filter)

      //none entered: everything stays as is
      if (!filter.length){
        return this.filenames
      } 

      //entered file is in successful list
      else if (this.filenames.some(containsSubStr)) {
        this.tabIndex = 1;
        testarr = []
        for (let file in this.filenames){
          if (this.filenames[file].trim().toLowerCase().includes(filter)){
            testarr.push(this.filenames[file])
          }
        }
        return testarr;
      }

      else {
        return testarr
      }

    },

    filteredErrorsList(){
      this.showPopper = false;
      let testarr = []
      let filter = this.filterVal.trim().toLowerCase()
      const containsSubStrObj = (element) => element.name.trim().toLowerCase().includes(filter) 

      if (!filter.length){
        return this.erroredFileNames
      } 
      else if (this.erroredFileNames.some(containsSubStrObj)) { 
        this.tabIndex = 2;
        for (let file in this.erroredFileNames){
          if (this.erroredFileNames[file].name.trim().toLowerCase().includes(filter)){
            testarr.push({'name': this.erroredFileNames[file].name, 'error': this.erroredFileNames[file].error})
          }
        }
        return testarr;
      } 
      else{
        return testarr;
      }
    },

    showPopperComputed() {
      let validList = this.filteredValidList;
      let errorsList = this.filteredErrorsList;
      if ((this.filterVal) && (validList.length == 0) && (errorsList.length == 0)) {
        return true
      }
      return false
    },

    filesUploaded(){
      if ((this.filenames.length > 0) || (this.erroredFileNames.length > 0)){
        return true
      }
      return false;
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

    multipleFiles: function (){
      return (this.filenames.length > 1);
    },

    clearVal(){
      this.filterVal = ''
    }
  }
};
</script>

<style scoped>
.list-group, .vwindow{
    max-height: 70vh;
    max-width: 65vw;
    margin-bottom: 30px;
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
  color: red;
}
.successful-files-count{
  color: rgb(0, 246, 0);
}
.errors-files-count{
  color: rgb(255, 102, 0)
}
.v-tabs{
  background-color: rgba(32,37,41,1);
  max-width: 100%;
  border-radius: 5px;
}
.v-tab{
  background-image: unset;
  text-transform: unset;
  border: none;
  font-size:medium;
  color: white;
  flex: 1 1;
}
.searchBar {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-indent: 30px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
  width: 100%;
  max-height: 2vh;
  min-height: 25px;
}
.searchBG{
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  width: 60vw;
}
.searchIcon{
  position: absolute;
  left: 20.3vw;
  margin-top: 7px;
}
.clearIcon{
  position: absolute;
  right: 20.5vw;
  margin-top: 25px;
}
.tab-bar{
  margin-bottom: 0;
  margin-top: 5px;
}
.temp{
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
  background-color: rgba(32,37,41,1);
  color: white;
  position: relative;
  bottom: 50px;
  left: 125px;
}

</style>