<template>
    <div>
      <div class="container text-center">
        <h2>Please enter password to access this page.</h2>
  
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <form class="form-inline" v-on:submit.prevent="validateBeforeSubmit">
              <div class="form-group text-left">
                <label class="custom-label control-label">Password</label>
                <input class="form-control password-field" type="password" name="password" v-model.trim="password">
                <span class="error help-block" ></span>
              </div>
              <div class="text-danger" v-if="error"><p>Incorrect password.</p></div>
              <button class="btn btn-primary" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import storageHelper from 'storage-helper'
  import router from '../router/index.js'
  
  export default {
    data () {
      return {
        error: null,
        password: null
      }
    },
    methods: {
      validateBeforeSubmit () {
        let validPassword = process.env.SERVER_PASSWORD
        if (this.password === validPassword) {
            this.error = false
            storageHelper.setItem('user-password', this.password)
            router.push(this.$route.query.from)
        } else {
            this.error = true
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .form-group {
    margin-right: 1rem;  
  }
  
  label {
    margin-right: 0.5rem;  
  }
  </style>