<template>
  <div class="main">
    <h1>{{ msg }}</h1>
    <form @submit.prevent='submit'>
      <label>Select upload option and add files to view in the Neuroviewer: </label><br/>
      <input v-model='uploadMethod' @click='clearData' class='upload-option' type='radio' id='file' value='file' name='uploadsel'/> <label for="file">File Upload</label><br/>
      <input v-model='uploadMethod' @click='clearData' class='upload-option' type='radio' id='git-link' value='git-link' name='uploadsel'/> <label for="git-link"><img src='../assets/github-icon.png' class='icon'/> GitHub</label><br/>
      <input v-model='uploadMethod' @click='clearData' class='upload-option' type='radio' id='drive-link' value='drive-link' name='uploadsel'/> <label for="drive-link"><img src='../assets/google-drive-icon.png' class='icon'/> Google Drive</label><br/>
      <Card 
        @files-added= '(event) => readSwcFile(event, null, null)'
        @url-added='(enteredVal) => readUrlFile(enteredVal)'
        @clear-data= 'clearData()'
        :uploadMethod= 'this.uploadMethod' 
        :clearBtn= 'this.clearBtn'
        :urlVal= 'this.urlVal'>
      </Card>
    </form>
    <!-- <label>URL:</label><input v-model="fileurl" @keyup="readUrlFile" placeholder="fileurl" size="95" /> -->
    <div id="container" style='position:relative; width:100%; height:700px'> 
    </div>
    <filelist :fileData="fileData" :filenames="filenames"></filelist>
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
      clearBtn: false,
      fileurl: 'https://github.com/ucla-brain/basalganglia/blob/master/static/files/SNr_reconstructions_Figure_1.swc',
    }
  },
  methods: {

    clearData() {
      for (let file in this.filenames){
        s.unloadNeuron(this.filenames[file])
      }
      this.urlVal = ''
      this.filenames = []
      this.clearBtn = false
    },

    eswcToSwc: function(src){
      const headerLines = 3; 
      const headers = ['n','type','x','y','z','radius','parent'];
      let swcTxt = '';

      //seperate each line of text
      src = src.split('\n');

      //only add contents of each line that correspond to new amount of headers
      for (let index=headerLines; index<(src.length-1); index++){
        let str = src[index].split(' ');
        for (let header in headers){
          swcTxt  = swcTxt.concat(str[header], ' ')
          if (header==headers.length-1)
            swcTxt = swcTxt.concat('\n')
        }
      }

      //remove commas and update headers
      swcTxt = swcTxt.replaceAll(',','')
      swcTxt = '# ' + headers + '\n' + swcTxt
      
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
        alert("Please upload a valid swc file. " + name);
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

        const octokit = new Octokit({
            auth: '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'
        });

        const gitData = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}',{
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
</style>