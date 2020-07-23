<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>File
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      </label>
      <button v-on:click="submitFile()">Submit</button>
    </div>
  </div>
</template>


<script>
  import axios from "axios";
  // const SERVER_URL = 'http://csse-s365.canterbury.ac.nz:4001/api/v1/';
  const SERVER_URL = 'http://localhost:4941/api/v1/'


  export default {
    data(){
      return {
        file: ''
      }
    },
    methods: {
      handleFileUpload(){
        this.file = this.$refs.file.files[0];

      },
      submitFile(){
        let formData = new FormData();
        formData.append('file', this.file);
        axios.put(SERVER_URL + 'users/' + '1' + '/photo', formData, {headers: {"X-Authorization" : localStorage.getItem("token")}}).then(function(){
          console.log('SUCCESS!!');
        })
          .catch(function(){
            console.log('FAILURE!!');
          });
      },
    }
  }
</script>

