<template>
  <div>
    <div style="width:100%;height:54px;margin-bottom: 20px"></div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" style="position: fixed;top: 0; width: 100%;z-index: 10">
<!--    <form class="form-inline my-2 my-lg-0">-->
<!--      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">-->
<!--      <div class="search-bar">-->
<!--        <button class="search-button " type="submit"> <i class="material-icons">search</i></button>-->
<!--        <input class="search-input" type="search" placeholder="Search" aria-label="Search">-->
<!--      </div>-->
<!--      <br>-->
<!--    </form>-->
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
      </ul>

      <form class="form-inline my-2 my-lg-0">
      <button type="button" class="btn btn-outline-danger btn-space" v-on:click="navigateToHomePage">Petition</button>
      </form>
      <form class="form-inline my-2 my-lg-0" v-if="loggedIn">
        <button type="button" class="btn btn-outline-danger btn-space" v-on:click="navigateToProfile">Profile</button>
        <br>
      </form>
      <form class="form-inline my-2 my-lg-0" v-if="loggedIn">
        <button type="button" class="btn btn-outline-danger btn-space" v-on:click="logoutUser">Logout</button>
        <br>
      </form>
      <form class="form-inline my-2 my-lg-0" v-if="!loggedIn">
        <button type="button" class="btn btn-outline-danger btn-space" v-on:click="registerUser">Register</button>
        <br>
        <button type="button" class="btn btn-outline-danger btn-space" v-on:click="navigateLogin()">Login</button>
      </form>
    </div>
  </nav>
  </div>
</template>

<script>

  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1/'

  export default {
    name: "NavBar",
    methods: {
       logoutUser() {
        let currentObj = this;
        console.log("in NavBar");
        const token = localStorage.getItem('token')
        console.log(token)
         axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.post(SERVER_URL + 'users/logout')
          .then(response => {
            console.log(response)
            localStorage.clear()
            currentObj.$router.push('/login')
          }).catch(err => console.log(err));
      },
      registerUser() {
        console.log("in register user");
        let currentObj = this;
        this.$router.push('/signup');
      },
      navigateLogin() {
        console.log("in login user");
        let currentObj = this;
        this.$router.push('/login');
      },
      navigateToProfile(){
         let currentObj = this;
         console.log(this.$router.push('/profile'));
        currentObj.$router.push('/profile')
      },
      navigateToHomePage(){
         let currentObj = this;
        this.$router.push('/')
      },
      navigateToMyPetitionsPage(){
        let currentObj = this;
        console.log("here")
        this.$router.push('/myPetitions')
      }
    },
    props: ["loggedIn"]
  }
</script>

<style scoped>
  .btn-space {
    margin-right: 15px;
  }
  .btn:hover
  {
    transform: scale(1.2);
    box-shadow: 0 5px 14px rgba(51, 51, 51, 0.3);;
  }

  .btn:active
  {
    transform: scale(0.9);
    box-shadow:0 4px 9px rgba(51, 51, 51, 0.55);
  }
  .search-bar {
    background-color: #FFBF69;
    border-radius: 30px;
    padding: 0;
    height: 60px;
    display: flex;

  }

  .search-input {
    color: darkred;
    border: 0;
    background-color: transparent;
    outline: 0;
    width: 0;
    transition: width 1s ease, padding-left 1s ease;
  }

  .search-input::placeholder {
    color: darkred;
    opacity: 0.5;
  }

  .search-input::-webkit-search-cancel-button{
    -webkit-appearance: none;
  }

  .search-button {
    color: darkred;
    width: 40px;
    height: 40px;
    margin: auto 5px auto 10px;
    border: 0;
    border-radius: 40px;
    background-color: transparent;
  }

  .search-bar:hover > .search-input {
    display: inline-block;
    margin: auto 0;
    padding-left: 20px;
    width: 400px;
    transition: width 1s ease, padding-left 1s ease;
  }
  .btn-circle {
    width: 70px;
    height: 70px;
    padding: 10px 16px;
    border-radius: 40px;
    font-size: 12px;
    text-align: center;
  }

  nav {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .search-bar:hover > .search-button {
    color: #FFBF69;
    background-color: #FFFFFF;
  }

</style>
