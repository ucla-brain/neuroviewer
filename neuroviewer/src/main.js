/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import SharkViewer, { swcParser } from '@janelia/sharkviewer'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  methods: {
    readSwcFile: function(e) {
      for( let f of e.target.files ) {
         if (f) {
           const r = new FileReader();
           r.onload = (e2) => {
             const swcTxt = e2.target.result;
             const swc = swcParser(swcTxt);
             if (Object.keys(swc).length > 0) {
               s.loadNeuron(f.name, null, swc, true, false, true);
               s.render();
             } else {
               alert("Please upload a valid swc file.");
             }
           };
           r.readAsText(f);
         } else {
           alert("Failed to load file");
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
    }
  },
  mounted() {
    document
    .getElementById("swc_input")
    .addEventListener("change", this.readSwcFile, false);
  }
})
