<template>
  <div class="main">
    <h1>{{ msg }}</h1>
    <form>
      <label for='swc_input'>Upload swc files to view them in the Neuroviewer:</label>
      <input type='file' name='swc_input' id='swc_input' multiple/>
    </form>
    <div id="container" style='position:relative;width:100%;height:700px'></div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Neuroviewer'
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
</style>
