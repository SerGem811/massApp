<template>
  <section>
    <div class="row">
      <div class="col-md-12">
        <button
          type="success"
          class="btn-success btn m-r-10 float-right"
          data-toggle="modal"
          data-target="#userModal"
          @click="addUser"
        >Add User</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width:10%;">No</th>
              <th style="width:15%">Action</th>
              <th style="width:30%">Username</th>
              <th style="width:35%">Email</th>
              <th style="width:10%">Lines</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in users" :key="item.id">
              <td>{{index + 1}}</td>
              <td>
                <!-- Edit button -->
                <button
                  class="btn-danger btn btn-sm"
                  @click="showEditModal(item)"
                  type="danger"
                  size="small"
                  data-toggle="modal"
                  data-target="#userModal"
                >
                  <i class="el-icon-edit"></i>
                </button>

                <!-- Delete button -->
                <el-popconfirm
                  @onConfirm="deleteUser(item)"
                  confirmButtonText="Sim"
                  cancelButtonText="Não"
                  icon="el-icon-info"
                  iconColor="red"
                  title="Quer deletar?"
                  v-show="item.role.type!='admin'"
                >
                  <el-button
                    slot="reference"
                    class="btn-danger btn btn-sm m-l-5"
                    type="danger"
                    size="small"
                  >
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-popconfirm>
              </td>
              <td>{{item.username}}</td>
              <td>{{item.email}}</td>
              <td>{{item.line_limit}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="modal fade"
      id="userModal"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      ref="userModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="user-username" class="col-form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="user-username"
                v-model="currentUser.username"
              />
              <div
                v-if="submitted && !currentUser.username"
                class="input-required"
              >Username is required</div>
            </div>
            <div class="form-group">
              <label for="user-email" class="col-form-label">Email</label>
              <input type="email" class="form-control" id="user-email" v-model="currentUser.email" />
              <div v-if="submitted && !currentUser.email" class="input-required">Email is required</div>
            </div>
            <div class="form-group">
              <label for="user-password" class="col-form-label">Password</label>
              <input type="password" class="form-control" id="user-password" v-model="password" />
              <div v-if="submitted && !password" class="input-required">Password is required</div>
            </div>
            <div class="form-group">
              <label for="user-password" class="col-form-label">Lines</label>
              <input type="number" class="form-control" id="user-lines" v-model="currentUser.line_limit" />
              <div v-if="submitted && currentUser.line_limit<0" class="input-required">Check your lines again</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="updateUser">Save changes</button>
            <button type="button" class="btn btn-secondary" @click="closeUserModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from "jquery";
import {
  addUserService,
  deleteUserService,
  updateUserService,
  updateSenderService
  // updateUserService,
  // deleteUserService
} from "../services/service";

export default {
  name: "UsersPage",
  props: ["users", "senders"],
  data() {
    return {
      currentUser: {
        username: "",
        email: "",
        line_limit: 5
      },
      submitted: false,
      password: ""
    };
  },
  methods: {
    addUser() {
      this.currentUser = {
        username: "",
        email: "",
        line_limit: 5
      };
      this.password = "";
    },

    showEditModal(item) {
      this.currentUser = { ...item };
    },

    deleteUser(item) {
      // delete user
      deleteUserService(item.id)
        .then(response => {
          if (response.status == 200) {
            this.$emit("loadUsers");
          } else {
            this.$emit(
              "showFailMessage",
              "Something went wrong while deleting user"
            );
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    updateUser() {
      this.submitted = true;
      // create
      if (this.currentUser.username == "" || this.currentUser.email == "") {
        return;
      }
      if (this.currentUser.id == undefined && this.password == "") {
        return;
      }

      if(this.currentUser.line_limit < 0) {
        return;
      }

      if (this.currentUser.id == undefined) {
        // create
        addUserService(
          this.currentUser.username,
          this.password,
          this.currentUser.email,
          this.currentUser.line_limit
        )
          .then(response => {
            if (response.status == 200) {
              this.closeUserModal();
              this.$emit("loadUsers");
              this.$emit("showSuccessMessage", "New user created");
            } else {
              this.$emit(
                "showFailMessage",
                "Something went wrong while creating user"
              );
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        // update
        const u = this.users.find(x => x.id == this.currentUser.id);
        if(u.username != this.currentUser.username || u.email != this.currentUser.email || u.line_limit != this.currentUser.line_limit) {
          updateUserService(this.currentUser.id, this.currentUser)
          .then(response => {
            if(response.status == 200) {
              if(u.line_limit > this.currentUser.line_limit && this.currentUser.role.type != 'admin') {
                this.updateOnOff(this.currentUser);
              }
              this.closeUserModal();

              // case for line_limit
              
              this.$emit("loadUsers");
              this.$emit("showSuccessMessage", "User updated");
            } else {
              this.$emit("showFailMessage", "Something went wrong while updating ")
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
        } else if(this.password != "") {
          console.log("update password");
        } else {
          this.closeUserModal();
        }
      }
      this.submitted = false;
    },

    closeUserModal() {
      this.currentUser = {
        username: "",
        email: ""
      };
      this.password = "";
      this.submitted = false;
      $("#userModal").modal("hide");
    },

    updateOnOff(user) {
      let indexes = [];
      this.senders.forEach((s, i) => {
        if(s.user.id == user.id && s.conn == "on") {
          indexes.push(i);
        }
      });
      const limit = parseInt(user.line_limit);
      if(limit < indexes.length) {
        for(let j = limit ; j < indexes.length; j++) {
          this.senders[indexes[j]].conn = "off";
          const s = this.senders[indexes[j]];
          updateSenderService(s);
        }
      }
    }
  }
};
</script>

<style scoped>
.table {
  table-layout: fixed;
}
.table td,
th {
  padding: 5px;
  text-align: center;
  overflow-wrap: break-word;
}


</style>