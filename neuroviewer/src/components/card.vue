<template>

  <!-- FILE UPLOAD -->
  <div class='method-card' v-if='uploadMethod==="file"'>
      <span class='row'>
        <label class='cell' for='swc_input'>Upload <i>.swc</i> or <i>.eswc</i> file(s) directly to viewer: </label>
        <input class='file-input' type='file' ref='fileInput' accept='.eswc, .swc' @change="filesUploaded"  name='swc_input' id='swc_input' multiple/>
        <!-- <br/><br/> -->
      </span>
      <input class='clear-btn file-clear' type='button' value='Clear Data' v-show='clearBtn' @click='clearPress'/>
  </div>

  <!-- GITHUB UPLOAD -->
  <div class='method-card' v-if='uploadMethod==="git-link"'>
    <span class='row'>
      <label class='cell' for='url_input'>Enter GitHub Personal Token: </label>
      <input class='cell url-input' type='url' placeholder="github-access-token" @change="authenticateToken" @keydown='tokenTyped' :style="{color: tokenEntered ? 'inherit':'crimson' }"/>
      <!-- placeholder="token" -->
    </span>
    <span class='row' v-show='tokenEntered'>
      <p class='checkmark' v-show='tokenValid'></p>
      <p class='xmark' v-show='!tokenValid'></p>
    </span>
    <span class='row'>
      <label class='cell' for='url_input'>Enter GitHub URL: </label>
      <input class='cell url-input' type='url' ref='gitInput' placeholder="https://github.com/neuron.eswc" pattern="https?://.+" :style="{'background-color': tokenValid ? 'white' : 'darkgray'}" :disabled="!tokenValid"  name='url_input' id='url_input' @change='urlUploaded'/> 
      <!-- v-model='urlVal'  -->
    </span>
      <input class='clear-btn git-clear' type='button' value='Clear Data' v-show='clearBtn' @click='clearPress'/>
    <Popper>
      <label><a href='#'>Need help?</a><br/></label>
      <template #content>
        <div id="content" class="bg-dark"> 
          <v-expansion-panels variant='accordion' multiple>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>How to view a neuron that is on GitHub?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ol>
                    <p>Steps to view a GitHub file: </p>
                    <li>1. Sign in to your GitHub account and create a '<i>Personal Access Token</i>'</li><br/>
                    <li>2. Copy and Paste the access token in Neuroviewer's token field</li><br/>
                    <li>4. Navigate to GitHub, then navigate to the neuron file you wish to view.</li><br/>
                    <li>5. Copy and Paste the neuron file's URL into Neuroviewer's URL field to view</li><br/>
                  </ol> 
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>How to create your own Personal Access Token?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ol>
                    <li>1. Sign in to your github account</li><br/>
                    <li>2. Click your profile in the top-right hand corner</li><br/>
                    <li>3. Select 'Settings'</li><br/>
                    <li>4. Scroll down and select 'Developer Settings'</li><br/>
                    <li>5. Click 'Personal access tokens', then select 'Tokens (classic)'</li><br/>
                    <li>6. Click 'Generate new token', then select 'Generate new token (classic)'</li><br/>
                    <li>7. Give your token a name, then click 'Generate token'</li><br/>
                    <li>8. Copy and save this token for use with Neuroviewer</li><br/>
                  </ol> 
                </div>
                <label class='shift' @click='loadVideo'>Video Walkthrough</label>
                <video controls>
                  <source src='../assets/token-final.mp4' type='video/mp4'>
                  Your browser does not support the video tag
                </video>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>What is a valid GitHub url?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ul>
                    <p>Valid GitHub URL's must contain the following: </p>
                    <li>- Begin with '<i>https://github.com/</i>'</li><br/>
                    <li>- A path to the file</li><br/>
                    <li>- Must contain '<i>.swc</i>' or '<i>.eswc</i>' at the end of the url</li><br/><br/>
                    <p>Example URL: '<a href='#'>https://github.com/[owner]/[repository]/[branch_name]/[path_to_file].eswc</a>'</p>
                  </ul> 
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </template>
    </Popper>
  </div>

  <!-- GOOGLE DRIVE UPLOAD -->
  <div class='method-card' v-if='uploadMethod==="drive-link"'>
    <span class='row'>
      <label class='cell label' v-show='!isAuthenticated' >Authorize Google Drive access:</label>
      <input type='button' value='Authorize' class='clear-btn auth-btn cell' v-show='!isAuthenticated' @click='authorizeDriveAPI'/>
    </span>
    <span class='row'>
      <label class='cell' for='url_input'>Enter Google Drive URL: </label>
      <input class='cell url-input' type='url' placeholder="https://drive.google.com/file/file-ID" pattern="https?://.+" :style="{'background-color': isAuthenticated ? 'white' : 'darkgray'}" :disabled="!isAuthenticated" required name='url_input' v-model='urlVal' id='url_input' @change='checkURL'/> 
    </span>
      <input class='clear-btn' type='button' value='Clear Data' v-show='clearBtn' @click='clearPress'/>
    <Popper>
      <label><a href='#'>Need help?</a><br/></label>
      <template #content>
        <div id="content" class="bg-dark"> 
          <v-expansion-panels variant='accordion' multiple>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>How to view neuron(s) that are on Google Drive?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ol>
                    <p>Steps to view Google-Drive file(s): </p>
                    <li>1. Allow Neuroviewer access of your Google Drive by clicking 'Authorize'</li><br/>
                    <li>2. Sign in to your '<i>g.ucla.edu</i>' acount, then select 'continue'</li><br/>
                    <li>3. Enter a Google Drive URL and view </li><br/>
                  </ol> 
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>Why can't I authorize Google Drive Access?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ul>
                    <p>To ensure Google Drive access is authorized correctly, please ensure the following:</p>
                    <li>- You are using a '<i>g.ucla.edu</i>' email account</li><br/>
                    <li>- The sign-in window isn't manually closed before authorization is complete</li><br/>
                    <li>- If the sign-in screen already has access from a previous session, click '<i>continue</i>' to re-authorize</li><br/>
                  </ul> 
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>What is a valid Google Drive URL?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ul>
                    <p>Valid GitHub URL's must contain the following: </p>
                    <li>- Begin with '<i>https://drive.google.com/</i>'</li><br/>
                    <li>- Specify '/folders/' or '/file/'</li><br/>
                    <li>- Contain a file or folder ID</li><br/><br/>
                    <p>Example File URL: '<a href='#'>https://drive.google.com/file/d/[eswc-file-ID]</a>'</p>
                    <p>Example Folder URL: '<a href='#'>https://drive.google.com/drive/folders/[folder-ID-for-eswc-files]</a>'</p>
                  </ul>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </template>
    </Popper>
  </div>
</template>

<script>
import Popper from 'vue3-popper';
const { Octokit } = require("@octokit/core");
let API_KEY = ''
let CLIENT_ID = ''
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

//google drive globles
let api = undefined;
let tokenClient = {};
//github globals
let octoKitGlobal = undefined
import { Buffer } from 'buffer';

export default {
  emits: ['files-added', 'url-added', 'drive-file-added', 'clear-data', 'read-swc-file'],
  components: { Popper },
  name: "filelist",
  props:['uploadMethod', 'clearBtn', 'urlVal'],
  data (){
      return{
        //refers to google-drive
        isAuthenticated: false,
        
        //refers to github
        tokenEntered: false,
        tokenValid: false,
        hasGitAccess: false,
      }
  },
  mounted() {    

    function initializeAPIGlobals(){
      API_KEY = process.env.API_KEY
      CLIENT_ID = process.env.CLIENT_ID
    }

    function initializeAPIScripts() {
        let googleAPI = document.createElement('script')
        googleAPI.setAttribute('src', 'https://apis.google.com/js/api.js')

        let googleClient = document.createElement('script')
        googleClient.setAttribute('src', 'https://accounts.google.com/gsi/client')

        document.body.appendChild(googleAPI)
        document.body.appendChild(googleClient)
    }

    initializeAPIScripts();
    initializeAPIGlobals();
  }, 
  methods: {
    filesUploaded(event){
      this.$emit('files-added', event)
    },

    tokenTyped() {
      this.tokenEntered = true;
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
      

        const gitData = await octoKitGlobal.request('GET /repos/{owner}/{repo}/contents/{path}',{
          owner: repoOwner,
          repo: repository,
          path: filePath
        }).then((value) => {
          const gitDataDecoded = Buffer.from(value.data.content, 'base64').toString('ascii')
          const fileContent = gitDataDecoded
          this.$emit('read-swc-file', fileContent, fileName)
        })

      } else {
        alert('Please use a valid github URL')
      }
    },

    urlUploaded(enteredUrl) {
      let urlVal  = enteredUrl.target.value
      let result = urlVal.replace(/^\s+|\s+$/gm,'');
      this.readUrlFile(result)
      // this.$emit('url-added', enteredUrl.target.value)
    },

    driveFileUploaded(content, name){
      this.$emit('drive-file-added', content, name)
    },

    clearPress(method) {
      this.$emit('clear-data')
      let m = method.target.className;
      if (m.includes('file-clear')){
        this.$refs.fileInput.value = ''
      }
      else if (m.includes('git-clear')){
        this.$refs.gitInput.value=  ''
      }
    },

    loadVideo(){
      let video = document.querySelector('video')
      video.playbackRate = 0.85
    },

    async authenticateToken(token) {
      let tokenVal = token.target.value;

      //edge-cases: empty token or removed
      if (tokenVal === ''){
        this.tokenEntered = false;
        return 0;
      }

      octoKitGlobal = new Octokit({
        auth: tokenVal
      })

      try{
        const authenticateToken = await octoKitGlobal.request('GET /repos/{owner}/{repo}', {
          owner: 'octocat',
          repo: 'hello-world'
        }).then((response) => {
          let stat = response.status;
          // this.tokenEntered = true;
          if (stat === 200){
            this.tokenValid = true;
          }
        });
      } catch {
        // this.tokenEntered = true;

        //to handle many attempts
        this.tokenValid = false;
      }
    },

    //Callback after the API client is loaded. Loads the discovery doc to initialize the API.0
    initializeGapiClient() {
      return new Promise (resolve => {
        resolve('success')
        api.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
      })
    },

    gisLoaded() {
      return new Promise((resolve, reject) => {
        resolve('success')
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
        })
      })
    },

    //Authorize user if needed
     async authorizeDriveAPI(){
      api = window.gapi;
      await api.load('client', this.initializeGapiClient)
      this.gisLoaded();
      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw (resp);
        }
        else {
          this.isAuthenticated = true;
        }
      };
      if (this.isAuthenticated === false) {//user is authorized
        let res = await tokenClient.requestAccessToken({prompt: 'consent'});
      }
    },

    checkURL(event) {
      let url = event.target.value;
      let fileId = '';

      //check that url is valid
      if (url.includes('https://drive.google.com/')){
        //if so, parse and snip to get fileID
        fileId = url.split('/d/')[1]
        if (fileId.includes('/')){ 
          fileId = fileId.split('/')[0]
        }
        this.fileDataRetrieval(fileId)
      } else {
        alert('Please enter valid google drive URL')
      }
    },


    async fileDataRetrieval(fileId) {
      let fileName = '';
      let fileContents = '';
      let fileCheckArr = [];

      try{
        const requestName = await api.client.drive.files.get({
          fileId: fileId,
          fields: 'name',
        }).then(function (response) {
          fileName = response.result.name;
        })
        const requestFileContent = await api.client.drive.files.get({
          fileId: fileId,
          alt: 'media'
        }).then(function (response) {
          fileContents = response.body
        })

        fileCheckArr = fileContents.split('\n')
        if (fileCheckArr.length < 5){ // ensuring the file isn't only header comments
          alert('The file has invalid contents. Please ensure file is a valid eswc/swc file')
        } else {
          //display valid file to the viewer
          this.driveFileUploaded(fileContents, fileName)
        }
      } catch (e) {
        console.error('Error getting files', e)
        alert('Error, please authenticate Neuroviewer with Google Drive Access to view drive files in the Neuroviewer')
      }
    },

    signOut() {
      //signout
    }
  },
};
</script>
  
  
<style scoped>
.method-card{
  padding: 10px;
  margin: 10px;
  width: 41vw;
  max-width: 600px;
  border-radius: 8px;
  border: 1px solid rgba(33,37,41,255);
  box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 1;
  background-color: white;
}
.cell {
  flex: 1 1;
}
.label {
  max-width: 50%;
}
.shift{
  margin-left: 15px;
}
.clear-btn {
  width: 100px;
  max-width: 120px;
  height: 25px;
  padding: 0px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  background-color: rgba(233,233,237);
  margin: 5px 10px 0px 0px;
}
.auth-btn {
  margin: 0 0 5px -5px;
}
.url-input {
  max-height: 10%;
  font-size: 14px;
  margin: 0 10px 3px 3px;
  border: 1px solid rgb(104, 104, 104);
  border-radius: 3px;
}
#content{
  margin-top: 10px;
  color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 6px 30px -6px black;
  width: 65vw;
  max-width: 700px;
  margin-left: 10px;
}
.panel {
    color: white;
    background-color: rgba(75, 77, 81, 0.386);
  }
.panel-title {
  text-decoration: underline;
}

ul {
  padding: 0;
  margin: 0;
  margin-left: 20px;
  color: rgb(225, 225, 225);
}
li {
  display: inline-block;
}
video {
  width: 90%;
  display: block;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto; 
}
.checkmark:before {
  content: '\2713';
  display: inline-block;
  color: green;
  padding: 0 6px 0 0;
}
.checkmark {
  list-style-type: none;
  position: absolute;
  left: 42%;
  top: 9%;
  font-size: 1.check
}
.xmark:before {
  content: '\274C';
  display: inline-block;
  padding: 0 6px 0 0;
}
.xmark {
  list-style-type: none;
  position: absolute;
  left: 42%;
  top: 9%;
  font-size: 1.check
}
/* input::placeholder{
  color: red
} */
</style>
  