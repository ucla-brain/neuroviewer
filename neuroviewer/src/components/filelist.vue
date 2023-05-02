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
        <input @keydown="syncFileList()" type="search" class="searchBar" list="filesList" v-model="filterVal" placeholder="Filter files by name or path">
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
              <div class="form-check form-switch">
                    <input class="form-check-input toggleAll" type="checkbox" role="switch" id="allFlexSwitchCheckChecked" @click="handleToggle(null, null, $event)" checked>
              </div>
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
              <div class="form-check form-switch">
                <span class="valid-list">
                  Loaded ..... {{ item }} 
                </span>
                <input class="form-check-input fileToggle" type="checkbox" role="switch" :id="'flexSwitchCheckChecked'+index"  @click="handleToggle($event, item, null)" checked>
              </div>
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
  props:['initToggle', 'fileData', 'filenames', 'erroredFileNames', 'newToggleListNeeded'],
  emits: ['update:initToggle'],
  data () {
    return {
      expanded: false,
      showPopper: false,
      tab: null,
      tabIndex: 1,
      filterVal: '',
      filteredFiles: [...this.filenames, ...this.erroredFileNames],
      allToggledFiles: [],
    }
  },
  computed: {

    filteredValidList(){
      this.showPopper = false;
      let filteredList = []
      let filter = this.filterVal.trim().toLowerCase()
      const containsSubStr = (element) => element.trim().toLowerCase().includes(filter)

      //none entered: everything stays as is
      if (!filter.length){
        return this.filenames
      } 

      //entered file is in successful list
      else if (this.filenames.some(containsSubStr)) {
        this.tabIndex = 1;
        filteredList = []
        for (let file in this.filenames){
          if (this.filenames[file].trim().toLowerCase().includes(filter)){
            filteredList.push(this.filenames[file])
          }
        }
        return filteredList;
      }

      else {
        return filteredList
      }

    },

    filteredErrorsList(){
      this.showPopper = false;
      let filteredList = []
      let filter = this.filterVal.trim().toLowerCase()
      const containsSubStrObj = (element) => element.name.trim().toLowerCase().includes(filter) 

      if (!filter.length){
        return this.erroredFileNames
      } 
      else if (this.erroredFileNames.some(containsSubStrObj)) { 
        this.tabIndex = 2;
        for (let file in this.erroredFileNames){
          if (this.erroredFileNames[file].name.trim().toLowerCase().includes(filter)){
            filteredList.push({'name': this.erroredFileNames[file].name, 'error': this.erroredFileNames[file].error})
          }
        }
        return filteredList;
      } 
      else{
        return filteredList;
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
    },

  },
  methods: {

    syncFileList() { 
      const config = { attributes: true, childList: true, subtree: true}
      const callback  = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {  
            //Executes when list is filtered from search bar 
            for (let item in this.filteredValidList){
              let elementID = 'flexSwitchCheckChecked' + item
              let toggleElement = document.getElementById(elementID)
              let allToggledFileIndex = this.allToggledFiles.findIndex(obj => obj.name === this.filteredValidList[item])

              if (toggleElement.checked != this.allToggledFiles[allToggledFileIndex].toggled) { 
                toggleElement.checked = !toggleElement.checked
              }
            }
          }
        }
      };
      const observer = new MutationObserver(callback);

      if (this.initToggle) { 
        this.createToggleList()
        this.$emit('update:initToggle', false)
      }
  
      let validFilesListNode = document.getElementsByClassName('list-group')
      observer.observe(validFilesListNode[1], config)
    },
    
    multipleFiles(){
      return (this.filenames.length > 1);
    },
    
    clearVal(){
      this.filterVal = ''
      this.syncFileList()
    },

    toggleAll(toggleValue){
        for (let fileIndex in this.allToggledFiles){
          //set thetoggled status of each valid file to the same as the 'toggle-all' button
          this.allToggledFiles[fileIndex].toggled = (toggleValue ? true: false);
          if (toggleValue){
            this.loadToggledSwcFiles(this.allToggledFiles[fileIndex].name, this.allToggledFiles[fileIndex].swcIndex)
          }else {
            this.unloadViewer()
          }
        }

        let toggleElement = document.getElementsByClassName('fileToggle')
        for (let el of toggleElement){ 
          if (el.checked != toggleValue){
            el.checked = toggleValue
          }
        }
    },

    loadToggledSwcFiles(fileName, index) {
      s.loadNeuron(fileName, null, this.fileData[index].parsedSwc, true, false, true);
      s.render();
    },

    unloadViewer(){
      for (let file in this.filenames) {
        s.unloadNeuron(this.filenames[file]);
      }
    },

    createToggleList(){
      this.allToggledFiles = []
      let inx = 0;

      //initializes the global allToggledfiles[] obj with new toggled and swcIndex properties
      this.allToggledFiles = this.filenames.map(fname => ({
        name: fname,
        toggled: true,
        swcIndex: inx
      })) 
      
      // dual object list traversals to sync corresponding swcIndex from fileData[] to allToggledFiles[]
      for (let fileDataIndex in this.fileData) {
        const fName = this.fileData[fileDataIndex].name
        for (let toggledIndex in this.allToggledFiles){
          if (fName === this.allToggledFiles[toggledIndex].name) {
            inx = fileDataIndex
            this.allToggledFiles[toggledIndex].swcIndex = inx;
          }
        }
      }
    },
    
    handleToggle(event, fileName, toggleAllEvent){
      //initialize required data
      let allItemsToggledOff = true;
      let toggleAllBtn = document.getElementById('allFlexSwitchCheckChecked')
      
      if (this.initToggle) { 
        this.createToggleList()
        this.$emit('update:initToggle', false)
      }

      if (toggleAllEvent) { //for toggling all neurons at once
        const toggleVal = toggleAllEvent.target.checked
        this.toggleAll(toggleVal)
      } else {               //single-neuron toggling
        let toggleStatus = event.target.checked;
        let fileNameIndex = this.filenames.indexOf(fileName);
        this.allToggledFiles[fileNameIndex].toggled = (toggleStatus ? true : false);
        this.unloadViewer()

        //reload viewer with only toggled items 
        for (let fileIndex in this.allToggledFiles){
          if ((this.allToggledFiles[fileIndex].toggled) && (fileIndex != fileNameIndex)) {
            this.loadToggledSwcFiles(this.allToggledFiles[fileIndex].name, this.allToggledFiles[fileIndex].swcIndex)
          }
          if (this.allToggledFiles[fileIndex].toggled){
            allItemsToggledOff = false;
          } 
        }
        if (allItemsToggledOff) {
            toggleAllBtn.checked = false
        } else {
          toggleAllBtn.checked = true
        }

        //loads the newly toggled-on file at the end, due the FIFO loading style of the viewer
        if (toggleStatus) { 
          this.loadToggledSwcFiles(this.allToggledFiles[fileNameIndex].name, this.allToggledFiles[fileNameIndex].swcIndex)
        }
      }
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
    overflow: auto;
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
.form-check-input{
  position: absolute;
  right: 15px;
  
}
.form-check-input-checked-color{
  color: red;
}
.valid-list{
  margin-left: -35px;
}
.toggleAll{
  position: relative;
  left: 15px;
}
</style>