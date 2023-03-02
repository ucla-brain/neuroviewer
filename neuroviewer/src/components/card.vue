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
      <label class='cell' for='url_input'>Enter GitHub URL: </label>
      <input class='cell url-input' type='url' ref='gitInput' placeholder="https://github-url-swc.com" pattern="https?://.+"  required name='url_input' id='url_input' @change='urlUploaded'/> 
      <!-- v-model='urlVal'  -->
    </span>
    <span class='row'>
      <label class='cell' for='url_input'>Enter GitHub Personal Token: </label>
      <input class='cell url-input' type='url' placeholder="hard-coded token atm"/>
      <!-- placeholder="token" -->
    </span>
      <input class='clear-btn git-clear' type='button' value='Clear Data' v-show='clearBtn' @click='clearPress'/>
    <Popper>
      <label><a href='#'>Need help?</a><br/></label>
      <template #content>
        <div id="content" class="bg-dark"> 
          <v-expansion-panels variant='accordion' multiple>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>What is a valid GitHub url?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ul>
                    <p>Valid GitHub URL's must have the following: </p>
                    <li>- Begin with '<i>https://github.com/</i>'</li><br/>
                    <li>- Contains a path to the file</li><br/>
                    <li>- Must contain <i>.swc</i> or <i>.eswc</i> at the end of the url</li><br/>
                    <!-- [If uploading single file]: m -->
                    <!-- <li>- [If uploading a folder]: the folder must contain <i>.swc</i> or <i>.eswc</i> files inside</li><br/><br/> -->
                    <p>Example URL: '<a href='#'>https://github.com/[repository]/[branch_name]/[path_to_file].swc</a>'</p>
                  </ul> 
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>How to create your own token?</label>
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
          </v-expansion-panels>
        </div>
      </template>
    </Popper>
  </div>

  <!-- GOOGLE DRIVE UPLOAD -->
  <div class='method-card' v-if='uploadMethod==="drive-link"'>
    <span class='row'>
      <label class='cell label' v-show='!isAuthenticated' >Authorize Google Drive access:</label>
      <input type='button' value='Authorize' class='clear-btn cell' v-show='!isAuthenticated' @click='authorizeDriveAPI'/>
    </span>
    <span class='row'>
      <label class='cell' for='url_input'>Enter Google Drive URL: </label>
      <input class='cell url-input' type='url' placeholder="https://drive.google.com/file/d/file-ID" pattern="https?://.+" required name='url_input' v-model='urlVal' id='url_input' @change='checkURL'/> 
    </span>
    <!-- <span> -->
      <!-- <input type='button' value='Signout' class='clear-btn' @click='signOut'/> -->
      <input class='clear-btn' type='button' value='Clear Data' v-show='clearBtn' @click='clearPress'/>
    <!-- </span> -->
    <Popper>
      <label><a href='#'>Need help?</a><br/></label>
      <template #content>
        <div id="content" class="bg-dark"> 
          <v-expansion-panels variant='accordion' multiple>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>How to view a Google Drive File?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <ol>
                    <p>Steps to use this method of upload: </p>
                    <li>1. Allow Neuroviewer access of your Google Drive by clicking 'Authorize'</li><br/>
                    <li>2. Sign in to your <i>g.ucla.edu</i> acount, then select 'continue'</li><br/>
                    <li>3. Enter a Google Drive URL and view </li><br/>
                    <p>Example URL: '<a href='#'>https://drive.google.com/file/d/[file-ID]</a>'</p>
                  </ol> 
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class='panel'>
              <v-expansion-panel-title>
                <label class='panel-title'>Why does my URL return errors?</label>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div>
                  <!-- <ol>
                    <li>1. Sign in to your github account</li><br/>
                    <li>2. Click your profile in the top-right hand corner</li><br/>
                    <li>3. Select 'Settings'</li><br/>
                    <li>4. Scroll down and select 'Developer Settings'</li><br/>
                    <li>5. Click 'Personal access tokens', then select 'Tokens (classic)'</li><br/>
                    <li>6. Click 'Generate new token', then select 'Generate new token (classic)'</li><br/>
                    <li>7. Give your token a name, then click 'Generate token'</li><br/>
                    <li>8. Copy and save this token for use with Neuroviewer</li><br/>
                  </ol>  -->
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
let API_KEY = ''
let CLIENT_ID = ''

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

//google drive variables
let api = undefined;
let tokenClient = {};

export default {
  emits: ['files-added', 'url-added', 'drive-file-added', 'clear-data'],
  components: { Popper },
  name: "filelist",
  props:['uploadMethod', 'clearBtn', 'urlVal'],
  data (){
      return{
        isAuthenticated: false,
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

    urlUploaded(enteredUrl) {
      this.$emit('url-added', enteredUrl.target.value)
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
.url-input {
  font-size: 14px;
  margin-left: 3px;
  margin-right: 10px;
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
</style>
  