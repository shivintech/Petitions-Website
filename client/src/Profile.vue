<template>
  <div>
    <NavBar v-bind:loggedIn="loggedIn">
    </NavBar>
  <div>
    <b-row>
      <b-col></b-col>
      <b-col  style=margin-top:44px>
    <div class="large-4 large-offset-4 columns">

      <div class="panel text-center">
        <img v-if="image == false" src="http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg" class="mx-auto img-fluid rounded-circle" style="width: 400px" alt="">
        <img v-if="image !== false" class="circle" :src="image" alt="" style="width: 400px">
        <hr>
        <button type="button" class="btn btn-outline-danger btn-space" data-toggle="modal" data-target="#editUserModal" v-on:click="editUser">
          Edit
        </button>
                <div class="modal fade" id="editUserModal" tabindex="-1" role="dialog" arialabelledby="editUserModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>

<!--                      The edit profile modal -->
                      <div class="modal-body">
                        <div class="container py-2">
                          <div class="row my-2">
                            <div class="col-lg-4">
                              <h2 class="text-center font-weight-light">{{editedName}}'s Profile</h2>
                            </div>
                            <div class="col-lg-8">
                            </div>
                            <div class="col-lg-8 order-lg-1 personal-info">
                              <form role="form">
                                <div class="form-group row">
                                  <label class="col-lg-3 col-form-label form-control-label">Name</label>
                                  <div class="col-lg-9">
                                    <input v-model="editedName" class="form-control" type="text" value="" placeholder="Your Full Name"/>
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label class="col-lg-3 col-form-label form-control-label">Email</label>
                                  <div class="col-lg-9">
                                    <input v-model="editedEmail" class="form-control" type="email" value=""
                                           placeholder="email@email.com(Please have your email in this form)"/>
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label class="col-lg-3 col-form-label form-control-label">Name</label>
                                  <div class="col-lg-9">
                                    <input v-model="editedCity" class="form-control" type="text" value=""/>
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label class="col-lg-3 col-form-label form-control-label">Name</label>
                                  <div class="col-lg-9">
                                    <input v-model="editedCountry" class="form-control" type="text" value=""/>
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label class="col-lg-3 col-form-label form-control-label">Old Password</label>
                                  <div class="col-lg-9">
                                    <input  v-model="currentPassword" class="form-control" type="password"/>
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label class="col-lg-3 col-form-label form-control-label">New password</label>
                                  <div class="col-lg-9">
                                    <input  v-model="password" class="form-control" type="password"/>
                                  </div>
                                </div>
                                <div class="form-group row">
                                </div>
                              </form>
                            </div>
                            <div class="col-lg-4 order-lg-0 text-center">
                              <img v-if="editedImage == false" src="http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg" class="mx-auto img-fluid rounded-circle" style="width: 200px" alt="">
                              <img v-if="editedImage !== false" class="circle" :src="image" alt="" style="width: 200px">

                              <button type="button" class="btn btn-secondary btn-space" data-toggle="modal" data-target="#deleteUserPhotoModal">
                                Delete Photo
                              </button>
                              <hr>
                              <h6 class="my-4">Upload a new photo</h6>
                              <b-form-file accept=".jpg, .png, .gif, .jpeg" v-model="file"></b-form-file>
                              <b-form-text>PNG,JPEG,JPG,GIF</b-form-text>
                            </div>
                          </div>
                        </div>

                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                          Close
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="saveUser">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

<!--        The modal for deleting user photo-->
        <div class="modal fade" id="deleteUserPhotoModal" tabindex="-1" role="dialog" arialabelledby="deleteUserPhotoModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteUserPhotoModalLabel">Delete User</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure that you want to delete this photo?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" v-on:click="deletePhoto" data-dismiss="modal">
                  Delete
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <p>{{name}}</p>
        <p>{{email}}</p>
        <hr>
        <a href="#" class="ellipsis">{{city}}, {{country}}</a>
      </div>

    </div>


      </b-col>
      <b-col></b-col>
    </b-row>
  </div>
    <div>
    <MyPetitions>
    </MyPetitions>
    </div>

  </div>
</template>
<style>
  .circle {
    border-radius: 100%;
  }
  .btn-space {
    margin-top: 15px;
  }

</style>

<script>

  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1/users/'
  import NavBar from "./NavBar";
  import 'bootstrap'
  import MyPetitions from "./MyPetitions";

  export default {
    name: "Profile",
    components: {
      MyPetitions,
      NavBar
    },
    data() {
      return {
        name: '',
        city: '',
        country: '',
        email: '',
        photo_filename: null,
        image: '',
        loggedIn: true,
        editedName: '',
        editedCity: '',
        editedCountry: '',
        editedEmail: '',
        currentPassword:'',
        password: '',
        editedImage:'',
        validation: false,
        file : null
      }
    },
    mounted() {
      this.getSingleUser();
      this.loggedIn = localStorage.getItem("token") != null;
    },
    methods: {
      getSingleUser() {
        let currentObj = this;
        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.get(SERVER_URL + localStorage.getItem("userId"))
          .then(function (response) {
              if (response.data.hasOwnProperty('email')) {
                currentObj.email = response.data.email;
              }
              currentObj.name = response.data.name;
              currentObj.city = response.data.city;
              currentObj.country = response.data.country;
              currentObj.photo_filename = response.data.photo_filename;
              console.log(currentObj.name);
              currentObj.setProfileImage()
            },
            function (error) {
              currentObj.error = error;
              currentObj.errorFlag = true;
            })
          .catch(function (error) {
            alert(error);
          });
      },
      setProfileImage: function () {
        const currentObj = this;
          axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
          axios.get(SERVER_URL + localStorage.getItem("userId") + '/photo', {responseType: 'blob'})
            .then(function (response) {
              let fileReader = new FileReader();
              fileReader.readAsDataURL(response.data);
              fileReader.onload = () => {
                currentObj.image = fileReader.result
                console.log(currentObj.image);
              }
            })
            .catch(function (error) {
              alert(error);
            });
      },

      editUser(){
        let currentObj = this;
        currentObj.editedName =  currentObj.name;
        currentObj.editedCity = currentObj.city;
        currentObj.editedCountry = currentObj.country;
        currentObj.editedEmail = currentObj.email;
        currentObj.editedImage = currentObj.image;
      },
      saveUser(){

        let currentObj = this;
        var trigger = false;
        var trigger2 = true;

        console.log(currentObj.editedCity)
        console.log(currentObj.editedCountry)
        var obj = {
          name: currentObj.editedName,
          email: currentObj.editedEmail,
          currentPassword: currentObj.currentPassword,
          password: currentObj.password,
          city: currentObj.editedCity,
          country: currentObj.editedCountry

        };

        if((obj.name.length) <1){
          trigger = true;
          alert("Name must be of at least length 1!!");
        }
        else if(obj.country.length < 1 || obj.city.length < 1){
          trigger = true;
          alert("City or Country name should be of at least length 1!!");
        }

        if (!obj.currentPassword){
          delete obj.currentPassword
          delete obj.password
        }

        if(currentObj.name === currentObj.editedName) {
          delete obj.name
        }
        if(currentObj.email === currentObj.editedEmail) {
          delete obj.email
        }
        if(currentObj.city === currentObj.editedCity) {
          delete obj.city
        }
        if(currentObj.country === currentObj.editedCountry) {
          delete obj.country
        }

        if(currentObj.file){
          console.log("in comparison");
          currentObj.image = currentObj.editedImage;
          currentObj.setImage();
        }

        if(trigger || Object.keys(obj).length == 0){return};
        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.patch(SERVER_URL + localStorage.getItem("userId"), obj)
          .then(function(response) {
            console.log("updated details");
            currentObj.getSingleUser();
          }, function(error) {
            console.log(error.response.statusText);
            if(error.response.statusText === "Bad Request: email already in use"){
              alert("Email already in use");
              return;
            }
            alert(error);
            currentObj.error = error;
            currentObj.errorFlag = true;
          });
      },
      deletePhoto(){
        let currentObj = this;
        console.log("in delete photo");
        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.delete(SERVER_URL + localStorage.getItem("userId") + '/photo')
          .then(function (response) {
            console.log(response.data);
            alert("Photo deleted");
            currentObj.image = '';
            currentObj.editedImage = '';
          })
          .catch(function (error) {

            alert(error);
          });
      },
      setImage: function () {
        let currentObj = this;
        console.log("in set image herer");
        console.log(localStorage.getItem("userId"));
        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');

        axios.put(SERVER_URL + localStorage.getItem("userId")  + "/photo",
          this.file,
          {headers: {
              "Content-Type": this.file.type
            }
          })
          .then(function (response) {
            location.reload();
          })
          .catch(function (error) {
            alert(error);
          });
      },
    }
    }
</script>

