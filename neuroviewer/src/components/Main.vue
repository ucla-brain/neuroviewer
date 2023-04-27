<template>
  <div class="main">
    <h1>{{ msg }}</h1>
    <form @submit.prevent='submit'>
      <label>Select upload option and add files to view in the Neuroviewer: </label><br/>
      <input v-model='uploadMethod' @click='clearViewer' class='upload-option' type='radio' id='file' value='file' name='uploadsel'/> <label for="file">File Upload</label><br/>
      <input v-model='uploadMethod' @click='clearViewer' class='upload-option' type='radio' id='git-link' value='git-link' name='uploadsel'/> <label for="git-link"><img src='../assets/github-icon.png' class='icon'/> GitHub</label><br/>
      <input v-model='uploadMethod' @click='clearViewer' class='upload-option' type='radio' id='drive-link' value='drive-link' name='uploadsel'/> <label for="drive-link"><img src='../assets/google-drive-icon.png' class='icon'/> Google Drive</label><br/>
      <Card 
        @files-added= '(event) => readSwcFile(event, null, null)'
        @url-added='(enteredVal) => readUrlFile(enteredVal)'
        @read-swc-file='(content, name) => readSwcFile(null, content,name)'
        @clear-data= 'clearViewer()'
        @drive-file-added='(content, name) => readSwcFile(null, content, name)'
        @limitPrompt='fileLimitPrompt()'
        :uploadMethod= 'uploadMethod' 
        :errored-file-names='erroredFileNames'
        :clearBtn= 'clearBtn'
        :urlVal= 'urlVal'
        :fileLimit='fileLimit'>
      </Card>
    </form>
    <!-- <label>URL:</label><input v-model="fileurl" @keyup="readUrlFile" placeholder="fileurl" size="95" /> -->
    <!-- <template> -->
      <Popper>
        <v-icon icon="mdi-help-circle" class="ctrls-icon"></v-icon>
        <template #content>
          <div id="content" class="ctrls-popup bg-dark"> 
            <label class="ctrls-content"><b>Viewer Controls</b></label>
            <div class="ctrls-text">
              <div class="ctrls-actions">
                <h6>Viewer Action</h6>
                <p class="ctrl-one">Pan:</p>
                <p class="ctrl-two">Rotate:</p>
                <p class="ctrl-three">Zoom:</p>
              </div>
              <div class="ctrl-keys">
                <h6>Controls</h6>
                <p ><div class="arrow-keys">
                  <v-icon class="up-arrow-key" icon="mdi-arrow-up-bold-box-outline"></v-icon>
                  <v-icon icon="mdi-arrow-left-bold-box-outline"></v-icon>
                  <v-icon icon="mdi-arrow-down-bold-box-outline"></v-icon>
                  <v-icon icon="mdi-arrow-right-bold-box-outline"></v-icon>
                </div>[<i>Arrow Keys</i>] <br>or<br> 
                <v-icon icon="mdi-cursor-default-gesture" class="drag-key" size="30px"></v-icon><br>
                [<i>(hold) Option + Click + Drag</i>]</p>
                <p ><v-icon icon="mdi-cursor-default-gesture" class="drag-key" size="30px"></v-icon><br>
                  [<i>Click + Drag</i>]</p>
                <p >
                <v-icon icon="mdi-mouse"></v-icon>
                <v-icon icon="mdi-arrow-up-down"></v-icon><br>
                [scroll wheel] <br> or <br>
                <v-icon icon="mdi-gesture-pinch" size="30px"></v-icon><br>
                [Touch-Pad pinch]</p>
              </div>
            </div>
            <p class="ctrls-footer">[option+click] and [right-click] are interchangeable for touch-pad and mouse respectively</p>
          </div>
        </template>
      </Popper>
    <!-- </template> -->

    <div id="container" style='position:relative; width:100%; height:700px'> 
    </div>
    <filelist 
      v-model:initToggle="initialToggle"
      :fileData="fileData" 
      :filenames="filenames"
      :erroredFileNames="erroredFileNames"
      :newToggleListNeeded="newToggleListNeeded">
    </filelist> 
  </div>
</template>

<script>
/* eslint-disable */
import SharkViewer, { swcParser } from '@janelia/sharkviewer'
import filelist from './filelist.vue'
import Card from './card.vue'
import { Buffer } from 'buffer';
import { Octokit } from 'octokit';


export default {
  components: { filelist, Card },
  name: 'Main',
  data () {
    return {
      fileLimit: 100,
      msg: 'Welcome to Neuroviewer',
      filenames: [],
      fileData: [],
      urlVal: '',
      uploadMethod: '',
      fileinput: '',
      erroredFileNames: [],
      clearBtn: false,
      limitPrompt: true,
      fileCounter: 0,
      initialToggle: true,
      newFileCheck: '',
            fileList: new DataTransfer(),
    }
  },
  methods: {

    clearViewer() {
      for (let file in this.filenames){
        s.unloadNeuron(this.filenames[file])
      }
        this.urlVal = ''
        this.filenames = []
        this.erroredFileNames = []
        this.clearBtn = false
        if (this.fileData.length > 0){
          this.newToggleListNeeded(false)
          if (this.newFileCheck != this.fileData[0].name){
            this.initialToggle = true
          }
          this.newFileCheck = this.fileData[0].name
        }else {
          this.initialToggle = true
        }
        this.fileData = []
        this.filenames = []
        this.erroredFileNames = []
        this.limitPrompt = true
        this.fileCounter = 0
    },

    newToggleListNeeded(newValue) {
      this.initialToggle = newValue;
    },

    eswcToSwc: function(src){
      //vars
      const headerRange = 7; //default header values amount for swc files
      let header = '';
      let header_lines = [];
      let swcTxt = '';

      //header retrieval
      src = src.split('\n');
      for (let i=0; i<src.length; i++){
        if (src[i].includes('#')){
          header_lines.push(src[i].split('#').pop())
          if (header_lines[i].includes(',')){
            header_lines[i] = header_lines[i].replaceAll(',', ' ')
          }
        }
      }
      header = header_lines[header_lines.length-1].split(' ')
      if (header[0] === '') {
        header = header.slice(1, headerRange+1)
      } else if (header[0] === 'n') {
        header = header.slice(0, headerRange)
      }

      //only add contents of each line that correspond to swc headers 
      for (let index=header_lines.length; index<(src.length-1); index++){
        let str = src[index].split(' ');
        //rewrite parent value if needed
        if ((index == header_lines.length) && (str[6] === '0')){
          str[6] = '-1'
        }
        for (let word in header){
          swcTxt  = swcTxt.concat(str[word], ' ')
          if (word==header.length-1)
            swcTxt = swcTxt.concat('\n')
        }
      }

      //remove commas and update headers
      swcTxt = '# ' + header + '\n' + swcTxt
      swcTxt = swcTxt.replaceAll(',',' ')

      return swcTxt;
    },

    loadSwcFile: function (file, swcTxt, name) {
      const swc = swcParser(swcTxt);
      file.parsedSwc = swc;
      if (Object.keys(swc).length > 0) {
        s.loadNeuron(name, null, swc, true, false, true);
        s.render();
        this.filenames.push(name);
      } else {
        let errorMsg = 'Invalid file contents'
        this.erroredFileNames.push({name: name, error: errorMsg})
      }
      this.clearBtn = true;
    },

    fileLimitPrompt(){
      if (this.limitPrompt){
        alert( 'Warning: Neuroviewer file limit has been reached.\nOnly 100 files can be loaded at a time.\n\n\nLoading first 100 valid files...')
        this.limitPrompt = false
      }
    },

    readSwcFile: function(e, content, name) {
      let swcTxt = ''

      if (content){    //for http-url upload
        let file = {
          name: name,
          parsedSwc: ''
        }
        swcTxt = name.includes('.eswc') ? this.eswcToSwc(content) : content;
        let fileObj = new File([''], name)
        fileObj.parsedSwc = swcParser(swcTxt)
        this.fileCounter++;
        if (this.fileCounter > this.fileLimit){
          if (this.limitPrompt){
            this.fileData = this.fileList.files
          }
          this.fileLimitPrompt()
          return
        } else {
          this.loadSwcFile(file, swcTxt, name)
          this.fileList.items.add(fileObj) 
          this.fileData.push(fileObj)
        }
      }
      else {           // for file-input upload
        this.filenames = [];
        for( let f of e.target.files ) {
          if (f) {
            this.fileCounter++;
            if (this.fileCounter > this.fileLimit){
              this.fileLimitPrompt()
              this.fileData = this.fileList.files
              return;
            }
            const r = new FileReader();
            r.onload = (e2) => {
              const swcTxt = f.name.includes('.eswc') ? this.eswcToSwc(e2.target.result) : e2.target.result;
              this.loadSwcFile(f, swcTxt, f.name) 
              this.fileList.items.add(f)
            };
            r.readAsText(f);
          } else {
            alert("Failed to load file " + f.name);
          }
        }    
        this.fileData = e.target.files;
      }
    },

    async readUrlFile(enteredVal){
      //validate & parse user-entered URL
      this.filenames = []
      let url = enteredVal;
      
      if ((url.includes('github.com/')) && (url.length > 30)) {

        //extract URL info
        let repoOwner = url.split('github.com/')[1].split('/')[0]
        let repository = url.split(repoOwner + '/')[1].split('/')[0]
        let path = url.split(repository + '/blob/')[1]
        let filePath = path.substring(path.indexOf('/')+1)
        let fileName = filePath.substring((filePath.lastIndexOf('/'))+1)
      

        const gitData = await Octokit.request('GET /repos/{owner}/{repo}/contents/{path}',{
          owner: repoOwner,
          repo: repository,
          path: filePath
        }).then((value) => {
          const gitDataDecoded = Buffer.from(value.data.content, 'base64').toString('ascii')
          const fileContent = gitDataDecoded
          this.readSwcFile(null, fileContent, fileName)
        })

      } else {
        alert('Please use a valid github URL')
      }
    },

    window:onload = () => {
      /* global sharkViewer */
      let s = null;
      let mdata;

      const swc = swcParser(document.getElementById("swc").text);
      mdata = JSON.parse(document.getElementById("metadata_swc").text);
      s = new SharkViewer({
        animated: false,
        mode: 'particle',
        dom_element: document.getElementById('container'),
        metadata: mdata,
        showAxes: 10000,
        maxVolumeSize: 5000,
        cameraChangeCallback: () => { }
      });
      window.s = s;
      s.init();
      s.animate();
      s.loadNeuron('swc', null, swc, true, false, true);
      s.render();

    },

    toggleDiv: function(val) {
      if (val==='vid'){
        this.display_token_vid = !this.display_token_vid;
      }
      else if (val==='inst'){
        this.display_token_inst = !this.display_token_inst;
      }
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  text-align: center;
}
a {
  color: #42b983;
}
label {
  margin-left: 10px;
}
.upload-option {
  margin-left: 15px;
}
.icon{
  width: 20px;
  margin-left: 10px;
}
form {
  padding-bottom: 20px;
}
.ctrls-icon{
  position: absolute;
  margin-top: -20px;
  right: 5vw; 
}
.ctrls-popup{
  background-color: rgba(75, 77, 81, 0.386);
  color: white;
  position: absolute;
  right: -94.6vw;
  width: 25vw;
  max-width: 350px;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
}
.ctrls-content{
  font-size: large;  
  padding-bottom: 10px;
}
h6{
  text-decoration: underline;
}
.ctrls-text{
  display: grid;
  grid-template-columns:  repeat(2, 1fr);
  background-color: rgba(49,52,56,255);
  text-align: center;
  padding-top: 10px;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 10px;
}
.ctrls-actions, .ctrl-keys{
  display: grid;
  grid-template-rows: 0.5fr 2fr 1fr 1.6fr;
  gap: 5px;
}
.ctrl-keys > p{
  border-left: 1px solid rgba(91, 91, 91, 0.7);
}
.arrow-keys{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: fit-content;
  height: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.up-arrow-key{
  grid-column-start: 2;
  grid-column-end: 4;
  gap: 0px;
}
.drag-key{
  font-size: larger;
  height: 50px;
  width: 50px;
}
.ctrls-footer{
  padding-top: 10px;
}
.ctrl-one, .ctrl-two, .ctrl-three{
  margin: auto;
}
</style>