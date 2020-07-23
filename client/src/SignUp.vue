<template>
  <div>
    <NavBar/>
  <div class="container">
    <b-row>
      <b-col style=margin-top:74px>
        <div class="container py-2">
          <div class="row my-2">
            <!-- edit form column -->
            <div class="col-lg-4">
              <h2 class="text-center font-weight-light">User Profile</h2>
            </div>
            <div class="col-lg-8">
            </div>
            <div class="col-lg-8 order-lg-1 personal-info">
              <form role="form">
                <div class="form-group row">
                  <label class="col-lg-3 col-form-label form-control-label">Name</label>
                  <div class="col-lg-9">
                    <input v-model="name" class="form-control" type="text" value="" placeholder="Your Full Name"/>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-lg-3 col-form-label form-control-label">Email</label>
                  <div class="col-lg-9">
                    <input v-model="email" class="form-control" type="email" value=""
                           placeholder="email@email.com(Please have your email in this form)"/>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-lg-3 col-form-label form-control-label">Address</label>
                  <div class="col-lg-9">
                    <input v-model="city" class="form-control" type="text" value="" placeholder="City"/>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-lg-3 col-form-label form-control-label"></label>
                  <div class="col-lg-9">
                    <input v-model="country" class="form-control" type="text" value="" placeholder="Country"/>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-lg-3 col-form-label form-control-label">Password</label>
                  <div class="col-lg-9">
                    <input v-model="password" class="form-control" type="password" value="11111122333"/>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-lg-3 col-form-label form-control-label">Confirm password</label>
                  <div class="col-lg-9">
                    <input v-model="confirmPassword" class="form-control" type="password" value="11111122333"/>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-lg-9 ml-auto text-right">
                    <input type="reset" class="btn btn-outline-secondary" value="Cancel"/>
                    <!--                <input type="button" class="btn btn-primary" value="Confirm" v-on onclick="registerUser()"/>-->
                    <b-button type="confirm" v-on:click="registerUser">Confirm</b-button>
                  </div>
                </div>
              </form>
            </div>
            <div class="col-lg-4 order-lg-0 text-center">
              <img src="http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg" style="width: 200px" class="mx-auto img-fluid rounded-circle"
                   alt="avatar"/>
              <h6 class="my-4">Upload a new photo</h6>
              <b-form-file accept=".jpg, .png, .gif, .jpeg" v-model="file"></b-form-file>
              <b-form-text>PNG,JPEG,JPG,GIF</b-form-text>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
  </div>
</template>

<script>
  import NavBar from "./NavBar";
  import axios from 'axios'

  const SERVER_URL = 'http://localhost:4941/api/v1/'

  export default {
    components: {
      NavBar
    },
    data() {
      return {
        name: '',
        city: '',
        country: '',
        email: '',
        password: '',
        confirmPassword: '',
        file: null
      }
    },
    methods: {
      registerUser(e) {
        let currentObj = this;
        var obj = {
          name: currentObj.name,
          email: currentObj.email,
          password: currentObj.password,
          confirmPassword: currentObj.confirmPassword,
          city: currentObj.city,
          country: currentObj.country,
          validation: false,
          file: null

        };
        console.log(JSON.stringify(obj));
        currentObj.validation = this.inputValidation()
        if (!currentObj.validation){return};
          console.log(" validation passed");
          axios.post(SERVER_URL + 'users/register', obj).then(function (response) {
            console.log("Response from registration")
            console.log(response.data);
            return axios.post(SERVER_URL + 'users/login', {
              email: currentObj.email,
              password: currentObj.password,
            })
          })
            .then(response => {
              console.log("Response from logging")
              localStorage.setItem('token', response.data.token)
              localStorage.setItem('userId', response.data.userId)
              // if there is no photo here then we just return
              if (!currentObj.file) {
                currentObj.$router.push('/profile')
              }
              else{
                console.log("there is photo");
                this.setImage();
                currentObj.$router.push('/profile');
              }
            },function(error) {
              alert(error.response.statusText);
            })
          .catch(err => console.log(err));
        e.preventDefault();
      },

      inputValidation(){
        let currentObj = this;
        if (currentObj.name === "" || currentObj.city === "" || currentObj.country === "" || currentObj.password === "" || currentObj.password === "") {
          alert("Please fill all the mandatory fields!!");
        }
        else if((currentObj.name).length < 1){
          alert("Name should be of at least length 1!!");
        }
        else if((currentObj.country).length < 1 || (currentObj.city).length < 1){
          alert("City or Country name should be of at least length 1!!");
        }
        else if( currentObj.password !== currentObj.confirmPassword) {
          alert("The two passwords field don't match!!");
        }
        else{
         return true;
        }
        return false;
      },
      setImage: function () {
        let currentObj = this;
        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.put( SERVER_URL +'users/' + localStorage.getItem("userId")  + "/photo",
          this.file,
          {headers: {
              "Content-Type": this.file.type
            }
          })
          .then(function (response) {

          })
          .catch(function (error) {
            alert(error);
          });
      },
      handleFileUpload() {
        let currentObj = this;
        currentObj.file = currentObj.$refs.file.files[0];
      }
    }
  }
</script>
<style scoped>

</style>
