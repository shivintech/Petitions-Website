<template>
  <div>
    <!--The add petition button and search button  -->
<!--    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">-->
<!--    <span class="btn-group-lg">-->
<!--  <button type="button" class="btn btn-dark btn-circle btn-xl float-lg-right"  data-toggle="modal" data-target=".newPetitionModal"  v-on:click="getCategories">-->
<!--    <i class="material-icons">add</i>-->
<!--  </button>-->
<!--</span>-->
    <!--  Add petition Modal -->

    <div v-if="isLoading">
      <div  class="card-columns" style="margin: 0 auto ;max-width: calc(100% - 30px)" >
        <div v-for="(petition) in petitions" :key="petition" class="card shadow-sm mb-5 bg-white rounded" >
          <div class="modal-header">
            <h4>{{petition.title}}</h4>
          </div>
          <img :src= "'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/photo'" class="card-img-top embed-responsive-item" style="width: 100%" alt="Not Found" onerror="this.onerror=null;this.src='https://cdn4.iconfinder.com/data/icons/files-type-1/512/file-empty-512.png';">
          <br>

          <div class="card-body" style="margin: 0; padding: 0">
            <p class="card-text" style="margin: 0">{{petition.title}}.</p>
            <p class="card-text" style="margin: 0">Category: {{petition.category}}.</p>
            <p class="card-text" style="margin: 0">Author Name: {{petition.authorName}}.</p>
            <p class="card-text" style="margin: 0">Signature Count:{{petition.signatureCount}}</p>

            <button type="button" class="btn btn-outline-danger btn-space float-right" id="explore" style="margin-bottom: 10px" data-toggle="modal" data-target=".bd-example-modal-xl"  v-on:click="getSinglePetition(petition.petitionId)">Explore</button>


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
                  <div class="modal fade editPetitionModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog modal-lg" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="addPetitionModalLabel">Edit Petition Details</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>

                        <!--                      The edit petition modal -->
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
                                      <input  v-model="editedTitle" class="form-control" type="text" value="" placeholder="Enter the title for the petition"/>
                                    </div>
                                  </div>
                                  <div class="form-group row">
                                    <label class="col-lg-3 col-form-label form-control-label">Category</label>
                                    <div class="col-lg-9">

                                      <select name="category" v-model="editedCategory" class="form-control" >
                                        <option value="" disabled selected>Choose a category</option>
                                        <option v-for="category in allCategories" :value="category.categoryId" :key="category.categoryId">{{category.name}}</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div class="form-group row">
                                    <label class="col-lg-3 col-form-label form-control-label">Description</label>
                                    <div class="col-lg-9">
                                      <textarea v-model="editedDescription" class="form-control" style="height: 130px;width: 350px" type="text" value="" placeholder="Enter petition description here"/>
                                    </div>
                                  </div>
                                  <div class="form-group row">
                                    <label class="col-lg-3 col-form-label form-control-label">Closing Date<br/>(optional)</label>
                                    <div class="col-lg-9">
                                      <input class="form-control" v-model="editedClosingDate" name="closingDate" style="font-size: 16px;" type="date" placeholder="Closing Date" required/>
                                    </div>
                                  </div>
                                  <div class="form-group row">
                                  </div>
                                </form>
                              </div>
                              <div class="col-lg-4 order-lg-0 text-center">
                                <img v-if="editedImage == false" src="http://icon-library.com/images/photo-placeholder-icon/photo-placeholder-icon-6.jpg" class="mx-auto img-fluid" alt="">
                                <img v-if="editedImage !== false" :src= "'http://localhost:4941/api/v1/petitions/' + petitionDetail.petitionId + '/photo'" alt="" class="mx-auto img-fluid" alt="">
                                <hr>
                                <h6 class="my-4">Upload a new photo</h6>
                                <b-form-file accept=".jpg, .png, .gif, .jpeg" v-model="file"></b-form-file>
                                <b-form-text>PNG,JPEG,JPG,GIF</b-form-text>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="close" data-dismiss="modal">
                            Close
                          </button>
                          <button type="button" class="close" data-dismiss="modal"  v-on:click="submitEditedPetition(petitionDetail.petitionId)">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="width: 100%;margin: 15px" >
                    <img v-if="image === false" src="http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg" class="mx-auto img-fluid rounded-circle" style="width: 45px;float: left" alt="">
                    <img v-if="image !== false" class="mx-auto img-fluid rounded-circle zoom" :src="image" alt="" style="width: 45px;float: left" alt="Not Found" onerror="this.onerror=null;this.src='http://www.hmcatering.com/wp-content/uploads/2015/05/profile-placeholder.jpg';">
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
                  <button v-if="showButtons && checkCloseDate" type="button" class="btn btn-outline-danger btn-space float-right" id="edit" data-toggle="modal"  style=" margin: 5px 15px;width: calc(100% - 30px);padding: 3px 0 " data-target=".editPetitionModal" v-on:click="editPetition(petitionDetail.title,petitionDetail.description,petitionDetail.image)">Edit</button>
                  <button v-if="showButtons" type="button" class="btn btn-outline-danger btn-space float-right" id="delete"  style=" margin: 5px 15px;width: calc(100% - 30px);padding: 3px 0 " data-toggle="modal" data-target=".bd-example-modal-xl" v-on:click="deletePetition(petitionDetail.petitionId)">Delete</button>
                  <button type="button" class="btn btn-outline-danger btn-space float-right"   style=" margin: 5px 15px;width: calc(100% - 30px);padding: 3px 0 " data-toggle="modal" data-target=".bd-example2-modal-xl"  v-on:click="getAllSignatures(petitionDetail.petitionId)">(Find out everyone who signed this petition)</button>
                  <div class="modal-footer">
<!--                    <h4 style="float: left">{{petition.title}}</h4>-->
<!--                    <h5 >{{petitionDetail.authorName}}</h5>-->
<!--                    <label class="col-form-label" style="margin-left: 15px">{{author.city}}, {{author.country}}</label>-->
<!--                    <img v-if="image === false" src="https://pro2-bar-s3-cdn-cf.myportfolio.com/8ee9e0df6a57e6cb08ce8298364354c5/b08bd9dadf1d517df4671164_rw_1920.jpg?h=c74314500b529431fc9256c3604c7012" class="mx-auto img-fluid rounded-circle" alt="">-->
<!--                    <img v-if="image !== false" class="mx-auto img-fluid rounded-circle zoom" :src="image" alt="" style="width: 200px">-->
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

<script>
  import axios from "axios";
  import 'bootstrap'
  import NavBar from "./NavBar";
  const SERVER_URL = 'http://localhost:4941/api/v1/'


  export default {
    name: "MyPetitions",
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
        selectedOption:null,
        selectedCategory:null,
        editedTitle:'',
        editedDescription: '',
        editedCategory:null,
        editedImage: '',
        editedClosingDate: null,
        title:'',
        description:'',
        newPetitioncategoryId: null,
        file: null,
        closingDate:null,
        showButtons: false,
        myPetitionsList: null,
        checkCloseDate: false,
        openPetition: false,
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
        axios.get(SERVER_URL + 'petitions?authorId=' + localStorage.getItem("userId"))
          .then(function(response) {
            currentObj.petitions = response.data;

            currentObj.petitionsLength =  currentObj.petitions.length;
          }, function(error) {
            alert(error);
            return error;
          });
      },
      getSinglePetition(petitionId){
        var currentObj = this;
        var currentDate = new Date();
        currentDate.setHours(0,0);
        axios.get(SERVER_URL + 'petitions/' + petitionId)
          .then(function(response) {
            currentObj.petitionDetail = response.data;
            currentObj.getAuthorInfo(currentObj.petitionDetail.authorId)
            // this.getAuthorInfo(currentObj.petitionDetail.authorId)
            if(currentObj.petitionDetail.authorId == localStorage.getItem("userId")){
              currentObj.showButtons = true;
            }


            if(currentObj.petitionDetail.closingDate === null){
              currentObj.openPetition = true;
              currentObj.checkCloseDate = true;
              console.log(currentObj.openPetition )
            }
            else{
              let cd = new Date(currentObj.petitionDetail.closingDate)
              if(cd > currentDate){
                console.log("petition is still open")
                currentObj.openPetition = true;
                currentObj.checkCloseDate = true;
              }
            }


          }, function(error) {
            alert(error);
            return error;
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

            console.log(currentObj.allSignatories)
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
        currentObj.showButtons = false;
        currentObj.checkCloseDate = false;
        currentObj.openPetition = false;
        console.log("button status")
        console.log(currentObj.checkCloseDate)

      },
      submitEditedPetition(pId){
        let currentObj = this;
        var currentDate = new Date();
        currentDate.setHours(0,0);

        var obj = {
          title: currentObj.editedTitle,
          description: currentObj.editedDescription,
          categoryId:currentObj.editedCategory,
          closingDate: currentObj.editedClosingDate,
        };

        if (obj.closingDate === null){
          delete obj.closingDate
        }
        if (obj.categoryId === null){
          delete obj.categoryId
        }

        if (obj.title === "" || obj.description === "" || obj.categoryId === "" || obj.file === ""){
          alert("All fields except closing date are mandatory!!")
          return;
        }

        if (obj.closingDate !== null) {
          let cd = new Date(obj.closingDate)
          if (cd < currentDate) {
            alert("Closing date must be in the future!!")
            currentObj.editedClosingDate = null;
            return;
          }
        }

        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.patch(SERVER_URL + 'petitions/' + pId,obj)
          .then(function(response) {
            console.log("petition edited");
            currentObj.getSinglePetition(pId);
            currentObj.getPetitions();
            if(currentObj.file){
                currentObj.image = currentObj.editedImage;
                currentObj.setImage(pId);
                console.log("photo edited");
                location.reload();
            }
          }, function(error) {
            alert(error);
            currentObj.error = error;
            currentObj.errorFlag = true;
          });
      },
      setSignature(pId){
        let currentObj = this;
        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.post(SERVER_URL + 'petitions/' + pId + '/signatures')
          .then(function(response) {
            console.log(response.data);
            console.log("signature added");
          }, function(error) {
            alert(error);
            currentObj.error = error;
            currentObj.errorFlag = true;
          });

      },
      editPetition(title,description,image){
        let currentObj = this;
        currentObj.editedTitle =  title;
        currentObj.editedDescription = description;
        currentObj.editedImage = image;
      },

      deletePetition(pId){
        console.log("in delete petition");
        axios.defaults.headers.common['X-Authorization'] = localStorage.getItem('token');
        axios.delete(SERVER_URL + 'petitions/'+ pId)
          .then(function (response) {
            alert("Petition deleted");
            location.reload();
          })
          .catch(function (error) {
            alert(error);
          });
      },
    },

  }
</script>




<style scoped>
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

  .dropdown-content a:hover {background-color: #ddd;}

  .dropdown:hover .dropdown-content {display: block;}

  .dropdown:hover .dropbutton {background-color: white;}
</style>
