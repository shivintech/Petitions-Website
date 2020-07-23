<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>
    <div v-if="$route.params.userId">
      <div id="user">
        <router-link :to="{ usernmae: 'users'}">Back to Users</router-link>

        <br /><br />
        <table>
          <tr>
            <td>User ID</td>
            <td>Username</td>
          </tr>
          <tr>
            <td>{{ $route.params.userId }}</td>
            <td>{{ getSingleUser($route.params.userId).username }}</td>
          </tr>

        </table>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editUserModal" v-on:click="tempName = getSingleUser($route.params.userId).username, tempId = getSingleUser($route.params.userId).user_id">
          Edit
        </button>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#deleteUserModal">
          Delete
        </button>
      </div>

      <div class="modal fade" id="editUserModal" tabindex="-1" role="dialog" arialabelledby="editUserModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input v-model="tempName">
<!--              <input v-model="tempId">-->
              Are you sure that you want to edit this user?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="editUser(tempId,tempName)">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>



      <div class="modal fade" id="deleteUserModal" tabindex="-1" role="dialog" arialabelledby="deleteUserModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteUserModalLabel">Delete User</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure that you want to delete this user?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="deleteUser($route.params.userId)">
                Delete User
              </button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-else>
      <div id="users">
        <table>
          <tr v-for="user in users">
              <td>{{ user.username }}</td>
            <td><router-link :to="{ name: 'user', params: { userId: user.user_id}}">View</router-link></td>
          </tr>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addUserModal">
            Add User
          </button>
        </table>
        <div class="modal fade" id="addUserModal" tabindex="-1" role="dialog" arialabelledby="addUserModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addUserModalLabel">Add New User</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <input v-model="tempName">
                Are you sure that you want to add this user?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="addUser(tempName)">
                  Save
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    data (){
      return{
        error: "",
        errorFlag: false,
        users: [],
        tempId: null,
        tempName:""
      }
    },
    mounted: function() {
      this.getUsers();
     // this.getSingleUser();
    //  this.deleteUser();
     // this.editUser();
    },
    methods: {
      getUsers: function() {
        console.log("here");
        // this.$http.get('http://localhost:3000/api/users')
        this.$http.get('Http://csse-s365.canterbury.ac.nz:4001/api/v1/users/login')
          .then(function(response) {
            this.users = response.data;
            console.log(response.data);
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getSingleUser: function(id){
        // this.$http.get('http://localhost:3000/api/users/' + id)
        this.$http.get('Http://csse-s365.canterbury.ac.nz:4001/api/v1/users/9')
          .then(function(response) {
            this.users = response.data;
            console.log(response.data);
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

       deleteUser: function(user_id) {
         this.$http.delete('http://localhost:3000/api/users/' + user_id)
           .then(function(response){

             for(var i = 0; i < this.users.length; i++){
              if(user_id == this.users[i].user_id){
                 this.users.splice(i, 1);
               }
             }
             this.$router.push('/users');
           }, function(error){
             this.error = error;
             this.errorFlag = true;
          });
       },
      editUser: function(user_id, tempName) {
        console.log(user_id);
        console.log(tempName);
        var obj = { "username": tempName };
        this.$http.put(('http://localhost:3000/api/users/' + user_id),
          JSON.stringify(obj)
        ).then(function(response) {
          this.getUsers();
          this.users = response.data;
        });
      },

      addUser: function(tempName) {
        var obj = { "username": this.tempName };
        console.log( JSON.stringify(obj));
        if (this.username === "") {
          alert("Please enter an username !");
        } else {
          this.$http.post('http://localhost:3000/api/users',
            JSON.stringify(obj)
          ).then(function(response) {
            this.getUsers();
            this.users = response.data;
          })
        }
      },
    }
  }
</script>
