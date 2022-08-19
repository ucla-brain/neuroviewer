<template>
  <div class="main">
    <h1>{{ msg }}</h1>
    <form>
      <label for='swc_input'>Upload swc files to view them in the Neuroviewer:</label>
      <input type='file' @change="readSwcFile" name='swc_input' id='swc_input' multiple/>
    </form>
    <!-- <label>URL:</label><input v-model="fileurl" @keyup="readUrlFile" placeholder="fileurl" size="95" /> -->
    <div id="container" style='position:relative;width:100%;height:700px'></div>
    <filelist :filenames="filenames"></filelist>
  </div>
</template>

<script>
/* eslint-disable */
import SharkViewer, { swcParser } from '@janelia/sharkviewer'
import filelist from '../components/filelist.vue'

export default {
  components: { filelist },
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Neuroviewer',
      filenames: [],
      fileurl: 'https://github.com/ucla-brain/basalganglia/blob/master/static/files/SNr_reconstructions_Figure_1.swc'
    }
  },
  methods: {
    readSwcFile: function(e) {
      this.filenames = [];
      for( let f of e.target.files ) {
         if (f) {
           const r = new FileReader();
           r.onload = (e2) => {
             const swcTxt = e2.target.result;
             const swc = swcParser(swcTxt);
             if (Object.keys(swc).length > 0) {
               s.loadNeuron(f.name, null, swc, true, false, true);
               s.render();
               this.filenames.push(f.name);
             } else {
               alert("Please upload a valid swc file. " + f.name);
             }
           };
           r.readAsText(f);
         } else {
           alert("Failed to load file " + f.name);
         }
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
    readUrlFile: function(e) {
      console.log(fileurl);
      // CORS policy is blocking...
      // fetch(this.fileurl)
      //   .then(async response => {
      //     const data = await response.json();

      //     // check for error response
      //     if (!response.ok) {
      //       // get error message from body or default to response statusText
      //       const error = (data && data.message) || response.statusText;
      //       return Promise.reject(error);
      //     }

      //     this.totalVuePackages = data.total;
      //   })
      //   .catch(error => {
      //     this.errorMessage = error;
      //     console.error("There was an error!", error);
      //   });      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
label {
  margin-left: 10px;
}
input {
  font-size: 14px;
  margin-left: 3px;
}
</style>
