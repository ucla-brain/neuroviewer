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
        :uploadMethod= 'uploadMethod' 
        :errored-file-names='erroredFileNames'
        :clearBtn= 'clearBtn'
        :urlVal= 'urlVal'>
      </Card>
    </form>
    <!-- <label>URL:</label><input v-model="fileurl" @keyup="readUrlFile" placeholder="fileurl" size="95" /> -->
    <div id="container" style='position:relative; width:100%; height:700px'> 
    </div>
    <filelist 
      :fileData="fileData" 
      :filenames="filenames"
      :erroredFileNames="erroredFileNames">
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
      msg: 'Welcome to Neuroviewer',
      filenames: [],
      fileData: [],
      urlVal: '',
      uploadMethod: '',
      fileinput: '',
      erroredFileNames: [],
      clearBtn: false,
      fileurl: 'https://github.com/ucla-brain/basalganglia/blob/master/static/files/SNr_reconstructions_Figure_1.swc',
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
        this.fileData = []
        this.filenames = []
        this.erroredFileNames = []
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

    readSwcFile: function(e, content, name) {
      let swcTxt = ''
      if (content){ //for http-url upload
        let file = {
          name: name,
          parsedSwc: ''
        }
        swcTxt = name.includes('.eswc') ? this.eswcToSwc(content) : content;
        this.loadSwcFile(file, swcTxt, name)
        let swcTxtArr = swcTxt.split(/[\r\n]+/);
        let fileObj = new File([''], name)
        fileObj.parsedSwc = swcParser(swcTxt)
        this.fileData.push(fileObj)
      }
      else { // for file-input upload
        this.filenames = [];
        for( let f of e.target.files ) {
          if (f) {
            const r = new FileReader();
            r.onload = (e2) => {
              const swcTxt = f.name.includes('.eswc') ? this.eswcToSwc(e2.target.result) : e2.target.result;
              this.loadSwcFile(f, swcTxt, f.name)
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
</style>