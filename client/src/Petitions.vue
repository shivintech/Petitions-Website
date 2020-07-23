<template>
<div>
  <NavBar v-bind:loggedIn="loggedIn">
  </NavBar>

  <!--The add petition button and search button  -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <span class="btn-group-lg">
  <button v-if="loggedIn" type="button" class="btn btn-dark btn-circle btn-xl float-lg-right" style="position: fixed; bottom: 20px; right: 20px;z-index:10"  data-toggle="modal" data-target=".newPetitionModal"  v-on:click="getCategories">
    <i class="material-icons">add</i>
  </button>
</span>


  <span class="btn-group-lg">
     <div>
       <form v-on:submit.prevent="getPetitions" class="form-inline d-flex justify-content-center md-form form-sm mt-0">
  <i class="fas fa-search" aria-hidden="true"></i>
  <input  name="q" v-model="tempSearchedTerm" class="form-control form-control-sm ml-3" type="text" placeholder="Search"
         aria-label="Search" style="width: 200px">
         <button  class="btn btn-outline-danger btn-space my-0" type="submit" style="margin-left: 10px;padding: 1px 5px">Search</button>

        <select name="category" v-model="selectedCategory" class="form-control" style="margin-left: 20px;margin-right: 10px" >
            <option value="" selected >Choose a category</option>
          <option v-for="category in allCategories" :value="category.categoryId" :key="category.categoryId">{{category.name}}</option>
                      </select>
            <select name="category" v-model="selectedOption" class="form-control">
             <option value="" selected>Choose a category</option>
          <option v-for="item in sortByOptions" :value="item.sortByValue" :key="item.sortByText">{{item.sortByText}}</option>
                      </select>
              </form>
        </div>
</span>
<!--  Add petition Modal -->

  <div class="modal fade newPetitionModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addPetitionModalLabel">Add Petition Details</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container py-2">
            <div class="row my-2">
              <div class="col-lg-4">
                <h2 class="text-center font-weight-light">Petition's Name</h2>
              </div>
              <div class="col-lg-8">
              </div>
              <div class="col-lg-8 order-lg-1 personal-info">
                <form role="form">
                  <div class="form-group row">
                    <label class="col-lg-3 col-form-label form-control-label">Title</label>
                    <div class="col-lg-9">
                      <input  v-model="title" class="form-control" type="text" value="" placeholder="Enter the title for the petition"/>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-lg-3 col-form-label form-control-label">Category</label>
                    <div class="col-lg-9">
                      <select name="category" v-model="newPetitioncategoryId" class="form-control" >
                        <option value="" disabled selected>Choose a category</option>
                        <option v-for="category in allCategories" :value="category.categoryId" :key="category.categoryId">{{category.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-lg-3 col-form-label form-control-label">Description</label>
                    <div class="col-lg-9">
                      <textarea v-model="description" class="form-control" style="height: 130px;width: 350px" type="text" value="" placeholder="Enter petition description here"/>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-lg-3 col-form-label form-control-label">Closing Date<br/>(optional)</label>
                    <div class="col-lg-9">
                      <input class="form-control" v-model="closingDate" name="closingDate" style="font-size: 16px;" type="date" placeholder="Closing Date" required/>
                    </div>
                  </div>
                  <div class="form-group row">
                  </div>
                </form>
              </div>
              <div class="col-lg-4 order-lg-0 text-center">
                <img  src="http://icon-library.com/images/photo-placeholder-icon/photo-placeholder-icon-6.jpg" class="mx-auto img-fluid" alt="">
                <hr>
                <h6 class="my-4">Upload a new photo</h6>
                <b-form-file accept=".jpg, .png, .gif" v-model="file"></b-form-file>
                <b-form-text>PNG,JPEG,JPG,GIF</b-form-text>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal"  v-on:click="submitNewPetition">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading">

    <b-pagination
      class="paginationClass pagination-circle"
      v-model="currentPages"
      :total-rows="petitionsLength"
      :per-page="perPage"
      aria-controls="petitions"
      style="margin-left: 800px;margin-top: 10px;margin-bottom: 15px;color: #EE5757"
    ></b-pagination>
    <div  class="card-columns" style="margin: 0 auto ;max-width: calc(100% - 30px)" >
  <div v-for="(petition) in petitions.slice(perPage * (currentPages - 1), perPage * currentPages)" :key="petition" class="card shadow-lg mb-3 bg-white rounded" style="margin: 0;padding: 0">
    <img :src= "'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/photo'" class="card-img-top embed-responsive-item" style="width: 100%" alt="Responsive image">
    <br>
      <h4>{{petition.title}}.</h4>
    <div class="card-body" style="margin: 0; padding: 0">
      <p class="card-text" style="margin: 0">{{petition.title}}.</p>
      <p class="card-text" style="margin: 0">Category: {{petition.category}}.</p>
      <p class="card-text" style="margin: 0">Author Name: {{petition.authorName}}.</p>
      <p class="card-text" style="margin: 0">Signature Count:{{petition.signatureCount}}</p>

      <button type="button" class="btn btn-outline-danger btn-space float-right" id="explore" style="margin: 15px;padding: 3px 10px" data-toggle="modal" data-target=".bd-example-modal-xl"  v-on:click="getSinglePetition(petition.petitionId)">Explore</button>


      <div class="modal fade bd-example-modal-xl"  id="eachPetitionModal" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl" style="width:calc(100% - 30px); max-width: 900px;display: block;margin: 30px auto">
          <div class="modal-content">
            <div class="modal-header">
              <h4 v-if="!openPetition" style="padding: 15px;color: red">THIS PETITION HAS ALREADY EXPIRED<br/>
              <strong style="color: black">{{petitionDetail.title}}</strong></h4>
              <h4 v-if="openPetition" style="padding: 15px">{{petitionDetail.title}}</h4>
              <button style="margin: 2px" type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" v-on:click="changeStatus">&times;</span>
              </button>
            </div>
            <img :src= "'http://localhost:4941/api/v1/petitions/' + petitionDetail.petitionId + '/photo'" class="card-img-top embed-responsive-item" style="height: 30rem;" alt="Responsive image">
            <div class="modal fade bd-example2-modal-xl"  tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                  <h4>List of individuals who signed this petition</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true" v-on:click="changeStatus">x</span>
                    </button>
                  </div>
                  <hr>
                  <div  class="card-columns">
                    <div v-for="(eachSignature, i) in allSignatories" :key="i" class="card shadow-lg mb-5 bg-white rounded" >
                      <img :src= "'http://localhost:4941/api/v1/users/' + eachSignature.signatoryId + '/photo'" class="card-img-top embed-responsive-item" style="width: 100%" alt="Not Found" onerror="this.onerror=null;this.src='http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg';">
                      <br>
                      <h4>{{eachSignature.name}}.</h4>
                      <br>
                      <br>
                      <div class="card-body">
                        <p class="card-text"><b>City: </b>{{eachSignature.city}}.</p>
                        <p class="card-text"><b>Country: </b>{{eachSignature.country}}.</p>
                        <div class="modal-footer">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <div style="width: 100%;margin: 15px" >
            <img v-if="image === false" src="http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg" class="mx-auto img-fluid rounded-circle" style="width: 65px;float: left">
            <img v-if="image !== false" class="mx-auto img-fluid rounded-circle zoom" :src="image"  style="width: 45px;float: left" alt="Not Found" onerror="this.onerror=null;this.src='http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg';">
            <div style="float: left;margin-left: 15px">
            <h5 class="modal-title" style="font-size: 17px;margin-top: 4px" id="exampleModalLongTitle">{{petitionDetail.authorName}}</h5>
            <h5 class="col-form-label" style="font-size: 11px;margin-top: -4px;font-weight: 400">{{author.city}}, {{author.country}}</h5>
            </div>
            <div style="clear: both">
            </div>
          </div>
            <div style="width:calc(100% - 30px);margin: 10px 15px">
            <p style="font-size: 16px">
              {{petitionDetail.description}}
            </p>
            </div>
            <social-sharing url inline-template>
              <div style="margin-left: 15px;margin-bottom: 20px">
                <network network="facebook">
                  <i class="fa fa-fw fa-facebook"></i> Facebook
                </network>
                <network network="email">
                  <i class="fa fa-envelope"></i> Email
                </network>
                <network network="linkedin">
                  <i class="fa fa-fw fa-linkedin"></i> LinkedIn
                </network>
                <network network="pinterest">
                  <i class="fa fa-fw fa-pinterest"></i> Pinterest
                </network>
                <network network="reddit">
                  <i class="fa fa-fw fa-reddit"></i> Reddit
                </network>
                <network network="twitter">
                  <i class="fa fa-fw fa-twitter"></i> Twitter
                </network>
                <network network="whatsapp">
                  <i class="fa fa-fw fa-whatsapp"></i> Whatsapp
                </network>
              </div>
            </social-sharing>
            <table class="table table-striped" style="overflow-x: auto;display: block;margin-bottom: 20px" >
              <thead>
              <tr style="font-size: 14px">
                <th style="font-family:'Courier New'">Category</th>
                <th style="font-family:'Courier New'">Author's Name</th>
                <th style="font-family:'Courier New'">Signature Count</th>
                <th style="font-family:'Courier New'">Creation Date</th>
                <th style="font-family:'Courier New'">Closing Date</th>
              </tr>
              </thead>
              <tbody>
              <tr style="font-size: 14px">
                <td style="font-family:'Courier New'">{{petitionDetail.category}}</td>
                <td style="font-family:'Courier New'">{{petitionDetail.authorName}}</td>
                <td style="font-family:'Courier New'">{{petitionDetail.signatureCount}}</td>
                <td style="font-family:'Courier New'">{{petitionDetail.createdDate}}</td>
                <td style="font-family:'Courier New'">{{petitionDetail.closingDate}}</td>
              </tr>
              </tbody>
            </table>
            <hr>
            <button type="button" class="btn btn-outline-danger btn-space float-right"  style=" margin: 5px 15px;width: calc(100% - 30px);padding: 3px 0 " data-toggle="modal" data-target=".bd-example2-modal-xl"  v-on:click="getAllSignatures(petitionDetail.petitionId)">(Find out everyone who signed this petition)</button>
            <button v-if="loggedIn && openPetition && !isAuthor && !userAlreadySignedPetition" type="button" class="btn btn-outline-danger float-right"  style=" margin: 5px 15px;width: calc(100% - 30px);padding: 3px 0 " v-on:click="setSignature(petitionDetail.petitionId)"  data-toggle="modal" data-target="#exampleModal">(Your voice matters !! Sign this petition today)</button>
            <button v-if="loggedIn && openPetition && !isAuthor && userAlreadySignedPetition" type="button" class="btn btn-outline-danger float-right" style=" margin: 5px 15px;width: calc(100% - 30px);padding: 3px 0 " v-on:click="deleteSignature(petitionDetail.petitionId)"  data-toggle="modal" data-target="#exampleModal">Un-sign this petition</button>


<!--       modal to show that petition is signed      -->
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body" v-if="petitionSigned">
                  Yoo hoo!! You just signed a petition
                  </div>
                  <div class="modal-body" v-if="petitionCreated">
                    Yoo hoo!! Petition created
                  </div>
                  <div class="modal-body" v-if="petitionUnsigned">
                    Signature removed
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="reloadPage">Close</button>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  </div>
</div>
</div>
</div>
</div>
</template>

<style scoped>

  /**{*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*}*/

  .container {
    padding-top: 10px;
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
  .btn-circle.btn-xl {
    width: 70px;
    height: 70px;
    padding: 10px 16px;
    border-radius: 35px;
    font-size: 12px;
    text-align: center;
  }
  body{
    margin-top:20px;
    background:#eee;
  }
  a {
    color: #f96332;
  }
  .m-t-5{
    margin-top: 5px;
  }
  .card1 {
    background: #fff;
    /*margin-top: 30px;*/
    margin-left: 650px;
    transition: .5s;
    border: 0;
    border-radius: .1875rem;
    display: inline-block;
    position: center;
    width: 30%;
    box-shadow: none;
  }
  .card .body {
    font-size: 14px;
    color: #424242;
    padding: 20px;
    font-weight: 400;
  }
  .zoom:hover {
    transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
  }

  .paginationClass{
    margin: 0 auto;


  }

  .dropdown {
    position: relative;
    display: block;
    z-index: 10;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  body.modal-open {
    overflow: hidden;
  }


  .dropdown-content a:hover {background-color: #ddd;}

  .dropdown:hover .dropdown-content {display: block;}

  .dropdown:hover .dropbutton {background-color: white;}


</style>

<script>
    import axios from "axios";
    import 'bootstrap'
    import NavBar from "./NavBar";
    const SERVER_URL = 'http://localhost:4941/api/v1/'


    export default {
      name: "Petitions",
      components: {NavBar},
      data() {
        return {
          isLoading: true,
          petitions:null,
          petitionDetail:'',
          loggedIn: null,
          currentLoggedInUser: null,
          allCategories:null,
          author_id: null,
          ifClicked:false,
          image: '',
          authorImage:'',
          allSignatories:'',
          currentPages: 1,
          selectedOption:'',
          perPage: 10,
          searchedTerm: '',
          tempSearchedTerm: '',
          petitionsLength: 0,
          selectedCategory:'',
          sortByOptions: [{sortByText: "alphabetically by title,A-Z", sortByValue:"ALPHABETICAL_ASC"},
            {sortByText: "alphabetically by title Z-A", sortByValue:"ALPHABETICAL_DESC"},
            {sortByText: "number of signatures from least to most", sortByValue:"SIGNATURES_ASC"},
            {sortByText: "number of signatures from most to least", sortByValue:"SIGNATURES_DESC"}],
          title:'',
          description:'',
          newPetitioncategoryId: null,
          file: null,
          closingDate:null,
          newPetitionId: '',
          openPetition: false,
          isAuthor: false,
          userAlreadySignedPetition: false,
          petitionCreated: false,
          petitionSigned: false,
          petitionUnsigned: false,
          author: {
            city: "",
            country: ""
          }

        }
      },
      mounted() {
        this.getPetitions();
        this.getCategories();
        if(this.$route.params.id != null){
          this.getSinglePetition(this.$route.params.id);
          document.getElementById("explore").click();
          $(window).on('load',function(){
            $('#eachPetitionModal').modal('show');
          });
        }
        this.loggedIn = localStorage.getItem("token") != null;
        this.currentLoggedInUser = localStorage.getItem("token");
        console.log("checking logged in boolean")
        console.log(this.loggedIn);
      },
      methods: {
        getPetitions() {
          var currentObj = this;
          var tempCategory= null;
          var tempSelectedOption = null;
          // if(this.$route.query.category != null){
          //   this.selectedCategory = this.$route.query.category;
          //   console.log(this.selectedCategory);
          // }
          console.log("id should print here ");
          console.log(currentObj.selectedCategory);
          if(currentObj.selectedCategory !== ""){
            tempCategory = currentObj.selectedCategory;
          }
          if(currentObj.selectedOption !== ""){
            tempSelectedOption = currentObj.selectedOption;
          }
          if(currentObj.tempSearchedTerm === ''){
            currentObj.searchedTerm = null
          }
          else{
            currentObj.searchedTerm = currentObj.tempSearchedTerm
          }
            axios.get(SERVER_URL + 'petitions'
              , {
              params: {
                q: currentObj.searchedTerm,
                categoryId: tempCategory,
                sortBy: tempSelectedOption

              }}
              )
              .then(function(response) {
                currentObj.petitions = response.data;
                currentObj.petitionsLength =  currentObj.petitions.length;
              }, function(error) {
                alert(error);
                return error;
              });
          },

        reloadPage(){
          location.reload();
        },
        getSinglePetition(petitionId){
          var currentObj = this;
          var currentDate = new Date();
          currentDate.setHours(0,0);
         axios.get(SERVER_URL + 'petitions/' + petitionId)
           .then(function(response) {
             currentObj.petitionDetail = response.data;
             currentObj.getAuthorInfo(currentObj.petitionDetail.authorId)
             console.log("this is the closing date.")
             console.log(currentObj.openPetition )
             console.log(currentObj.petitionDetail.closingDate)

             if(currentObj.petitionDetail.closingDate === null){
               currentObj.openPetition = true;
               console.log(currentObj.openPetition )
             }
             else{
               let cd = new Date(currentObj.petitionDetail.closingDate)
               if(cd > currentDate){
                 console.log("petition is still open")
                 currentObj.openPetition = true;
               }
             }



             if(currentObj.petitionDetail.authorId === parseInt(localStorage.getItem("userId"))){
               currentObj.isAuthor = true;
               console.log("is author comparison")
               console.log(currentObj.isAuthor);
             }
             currentObj.checkSignature(petitionId);

           }, function(error) {
             alert(error);
             return error;
           });
        },

        //To check if this petition  has already been signed by this user
        checkSignature(pId){
          let currentObj = this;
          axios.get(SERVER_URL + 'petitions/' + pId +'/signatures')
            .then(function(response) {
              currentObj.allSignatories = response.data;
              for(var i = 0; i < currentObj.allSignatories.length; i++){
                console.log(currentObj.allSignatories[i]["signatoryId"]);
                if(currentObj.allSignatories[i]["signatoryId"] === parseInt(localStorage.getItem("userId"))){
                  currentObj.userAlreadySignedPetition = true;
                  return;
                }
              }
            }, function(error) {
              alert(error);
              currentObj.error = error;
              currentObj.errorFlag = true;
            });

        },
        getCategories(){
          let currentObj = this;
          axios.get(SERVER_URL + 'petitions/' + 'categories')
            .then(function(response) {
              currentObj.allCategories = response.data;
              console.log(currentObj.allCategories)
            }, function(error) {
              alert(error);
              return error;
            });
        },
        getAuthorInfo(authorId){

          let currentObj = this;
          axios.get(SERVER_URL + 'users/' + authorId)
            .then(function (response) {
                currentObj.author = response.data;
                currentObj.ifClicked = true;
                currentObj.setProfileImage(authorId)
              },
              function (error) {
                currentObj.error = error;
                currentObj.errorFlag = true;
              })
            .catch(function (error) {
              alert(error);
            });
        },
        setProfileImage: function (authorId) {
          const currentObj = this;
          axios.get(SERVER_URL + 'users/' + authorId + '/photo', {responseType: 'blob'})
            .then(function (response) {
              console.log(response)
              let fileReader = new FileReader();
              fileReader.readAsDataURL(response.data);
              fileReader.onload = () => {
                currentObj.image = fileReader.result
              }
            })
            .catch(function (error) {

              console.log("User does not have a photo uploaded");
            });
        },
        getAllSignatures(pId){
          let currentObj = this;
          axios.get(SERVER_URL + 'petitions/' + pId +'/signatures')
            .then(function(response) {
              currentObj.allSignatories = response.data;
              console.log(currentObj.allSignatories);
            }, function(error) {
              alert(error);
              return error;
            });
        },
        setImage: function (pId) {
          console.log("in set image here");
          console.log(localStorage.getItem("userId"));
          axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
          axios.put(SERVER_URL + 'petitions/' + pId + "/photo",
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
        changeStatus(){
          let currentObj = this;
          console.log("in status change");
          currentObj.openPetition = false;
          currentObj.isAuthor = false;
          currentObj.userAlreadySignedPetition = false;
        },
        submitNewPetition(){
          let currentObj = this;
          var currentDate = new Date();
          currentDate.setHours(0,0);

          var obj = {
            title: currentObj.title,
            description: currentObj.description,
            categoryId:currentObj.newPetitioncategoryId,
            file: currentObj.file,
            closingDate: currentObj.closingDate
          };
          if (obj.closingDate === null){
            delete obj.closingDate
          }
          if (obj.closingDate !== null){
            let closingDate = new Date(obj.closingDate)
            if(closingDate < currentDate){
              alert("Closing date must in the future")
              return;
            }
          }

          currentObj.validation = this.inputValidation()
          if (!currentObj.validation){return};
          console.log(" validation passed");
          axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
          axios.post(SERVER_URL + 'petitions',obj)
            .then(function(response) {
              currentObj.newPetitionId = response.data.petitionId
              console.log(currentObj.newPetitionId);
              currentObj.setImage(currentObj.newPetitionId);
              currentObj.signPetition(currentObj.newPetitionId);
              console.log("petition created");
        }, function(error) {
              alert(error);
              currentObj.error = error;
              currentObj.errorFlag = true;
            });
        },
        //To check if this petition  has already been signed by this user
        setSignature(pId){
          let currentObj = this;
          let isSigned = false;
          axios.get(SERVER_URL + 'petitions/' + pId +'/signatures')
            .then(function(response) {
              currentObj.allSignatories = response.data;
              console.log(typeof(currentObj.allSignatories[0]["signatoryId"]));
              console.log(typeof(parseInt(localStorage.getItem("userId"))));
              for(var i = 0; i < currentObj.allSignatories.length; i++){
                console.log(currentObj.allSignatories[i]["signatoryId"]);
                if(currentObj.allSignatories[i]["signatoryId"] === parseInt(localStorage.getItem("userId"))){
                  isSigned = true;
                  console.log(currentObj.allSignatories[i]["signatoryId"]);
                  console.log(((localStorage.getItem("userId"))));
                  alert("You have already signed this petition. You are only allowed to sign a petition once!!")
                  return;
                }
              }
              if(!isSigned){
                currentObj.signPetition(pId)
              }
            }, function(error) {
              alert(error);
              currentObj.error = error;
              currentObj.errorFlag = true;
            });

        },
        signPetition(pId,newPetition){
          let currentObj = this;
          axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
          axios.post(SERVER_URL + 'petitions/' + pId + '/signatures')
            .then(function(response) {
              currentObj.petitionSigned = true;
            }, function(error) {
              alert(error);
              currentObj.error = error;
              currentObj.errorFlag = true;
            });
        },

        deleteSignature(pId){
          let currentObj = this;
          axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
          axios.delete(SERVER_URL + 'petitions/' + pId + '/signatures')
            .then(function(response) {
              currentObj.petitionUnsigned = true;
            }, function(error) {
              alert(error);
              currentObj.error = error;
              currentObj.errorFlag = true;
            });

        },
        inputValidation(){
          let currentObj = this;
          if (currentObj.title === "" || currentObj.description === "" || currentObj.categoryId === null || currentObj.file === null) {
            alert("All fields except closing date are mandatory including the image");
          }
          else{
            return true;
          }
          return false;
        },
      },
      // props: ["loggedIn"]
    }
</script>


