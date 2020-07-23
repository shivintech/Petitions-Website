<template>
<div>
  <NavBar/>
  <div class="container">
    <b-row>
      <b-col></b-col>
      <b-col  style=margin-top:374px>
    <b-form>
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input id="input-1" v-model="email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          class="form-control"
          type="password"
          v-model="password"
          required
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-4">
      </b-form-group>
      <b-button type="submit" v-on:click="onSubmit">Submit</b-button>
    </b-form>
    </b-col>
    <b-col></b-col>
    </b-row>
      </div>
</div>
</template>
<script>


  import axios from 'axios'
  import NavBar from "./NavBar";
  const SERVER_URL = 'http://localhost:4941/api/v1/'

  export default {
    components: {
      NavBar
    },
    data() {
      return {
          email: '',
          password: ''
      }
    },
    methods: {
      onSubmit(e) {
        let currentObj = this;
        if (this.email.trim(), this.password.trim()) {
          if(this.email.trim().length === 0 || this.password.trim().length === 0){
            alert("Please enter your email/password")
            return;};
          axios.post(SERVER_URL + 'users/login', {
            email: this.email,
            password: this.password,
          })
            .then(function(response) {
              localStorage.setItem("userId", response.data.userId);
              localStorage.setItem("token", response.data.token);
              console.log("in login");
           currentObj.$router.push('/');
          }, function(error) {
              alert(error.response.statusText);
            currentObj.error = error;
            currentObj.errorFlag = true;
          });
          e.preventDefault();
      }},
    }
  }
</script>
