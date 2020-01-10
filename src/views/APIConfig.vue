<template>
  <section>
    <div class="row">
      <div class="col-md-12">
        <div class="float-right">
          <button
            type="success"
            class="btn-success btn m-r-10"
            data-toggle="modal"
            data-target="#configModal"
          >Add</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width: 10%" scope="col">Phone</th>
              <th style="width: 10%" scope="col">Type</th>
              <th style="width: 20%" scope="col">Endpoint</th>
              <th style="width: 20%" scope="col">API token</th>
              <th style="width: 10%" scope="col" v-if="user.role.type=='admin'">User</th>
              <th style="width: 10%" scope="col"></th>
            </tr>
          </thead>
          <tr v-for="item in configs" :key="item.id">
            <td>{{item.phone}}</td>
            <td>{{item.Type}}</td>
            <td>{{item.name}}</td>
            <td>{{item.apitoken}}</td>
            <td v-if="user.role.type=='admin'">{{item.user.username}}</td>
            <td>
              <!-- Edit button -->
              <button
                class="btn-danger btn btn-sm"
                @click="showConfigModal(item)"
                type="danger"
                size="small"
                data-toggle="modal"
                data-target="#configModal"
              >
                <i class="el-icon-edit"></i>
              </button>

              <!-- Delete button -->
              <el-popconfirm
                @onConfirm="deleteConfig(item)"
                confirmButtonText="Sim"
                cancelButtonText="Não"
                icon="el-icon-info"
                iconColor="red"
                title="Quer deletar?"
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
          </tr>
        </table>
      </div>
    </div>
    <div
      class="modal fade"
      id="configModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="API configuration"
      aria-hidden="true"
      ref="configModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Configuration</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="config-phone" class="col-form-label">Phone</label>
                <input type="text" class="form-control" id="config-phone" v-model="config.phone" />
                <div
                  v-if="submitted && !config.phone"
                  class="input-required"
                >Phone number is required</div>
              </div>
              <div class="form-group">
                <label for="config-type" class="col-form-label">Type</label>
                <select class="form-control" v-model="config.Type">
                  <option value="MercuryAPI">MercuryAPI</option>
                  <option value="ChatAPI">ChatAPI</option>
                </select>
              </div>
              <div class="form-group">
                <label for="config-endpoint" class="col-form-label">Endpoint</label>
                <input type="text" class="form-control" id="config-endpoint" v-model="config.name" />
                <div
                  v-if="submitted && !config.name"
                  class="input-required"
                >Endpoint is required</div>
              </div>
              <div class="form-group">
                <label for="config-token" class="col-form-label">API token</label>
                <input type="text" class="form-control" id="config-token" v-model="config.apitoken" />
                <div
                  v-if="submitted && !config.apitoken"
                  class="input-required"
                >API token is required</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="updateConfig">Save changes</button>
            <button type="button" class="btn btn-secondary" @click="closeConfigModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from "jquery";
import {
  getAllSenderdata,
  getSenderdata,
  updateConfigDataService,
  createConfigDataService,
  deleteConfigDataService
} from "../services/service";

export default {
  data() {
    return {
      configs: [],
      user: {
        username: "",
        email: "",
        provider: "",
        role: ""
      },
      config: {
        phone: "",
        Type: "MercuryAPI",
        name: "",
        apitoken: ""
      },
      submitted: false
    };
  },
  methods: {
    showConfigModal(item) {
      this.config = {...item};
    },

    closeConfigModal() {
      this.submitted = false;
      $("#configModal").modal("hide");
    },

    updateConfig() {
      this.submitted = true;
      if (
        this.config.phone &&
        this.config.Type &&
        this.config.name &&
        this.config.apitoken
      ) {
        if (this.config.id === undefined) {
          this.config.user = this.user.id;
          createConfigDataService(this.config)
            .then(response => {
              if (response.status === 200) {
                this.config = {
                  phone: "",
                  Type: "MercuryAPI",
                  name: "",
                  apitoken: ""
                };
                this.showSuccessMessage("configration created");

                this.refreshPage();
              } else {
                this.showFailMessage("Cannot add the configuration");
              }
            })
            .catch(error => {
              this.showFailMessage(error.message);
            });
        } else {
          updateConfigDataService(this.config)
            .then(response => {
              if (response.status === 200) {
                this.config = {
                  phone: "",
                  Type: "MercuryAPI",
                  name: "",
                  apitoken: ""
                };
                this.showSuccessMessage("Success in update configuration");
                this.refreshPage();
              } else {
                this.showFailMessage("Cannot update the configuration");
              }
            })
            .catch(error => {
              this.showFailMessage(error.message);
            });
        }
      }
    },

    deleteConfig(item) {
      deleteConfigDataService(item)
        .then(response => {
          if (response.status === 200) {
            this.showSuccessMessage("Configuration removed");
            this.refreshPage();
          } else {
            this.showFailMessage("Cannot delete the configuraiton");
          }
        })
        .catch(error => {
          this.showFailMessage(error.message);
        });
    },

    refreshPage() {
      this.closeConfigModal();
      this.submitted = false;
      if (this.user.role.type === "admin") {
        getAllSenderdata()
          .then(response => {
            if (response.status === 200) {
              this.configs = response.data;
            } else {
              this.showFailMessage("Cannot load the configuration data");
            }
          })
          .catch(error => {
            this.showFailMessage(error.message);
          });
      } else {
        getSenderdata(this.user.id)
          .then(response => {
            if (response.status === 200) {
              this.configs = response.data;
            } else {
              this.showFailMessage("Cannot load the configuration data");
            }
          })
          .catch(error => {
            this.showFailMessage(error.message);
          });
      }
    },

    showFailMessage(message) {
      this.$notify.error({
        title: "Error",
        message: message
      });
    },

    showSuccessMessage(message) {
      this.$notify.success({
        title: "Success",
        message: message
      });
    }
  },

  mounted() {
    // user information
    const u = localStorage.getItem("userMass");
    if (u) {
      this.user = JSON.parse(u);
    } else {
      this.user = {};
    }
    // load configurations
    this.refreshPage();
  }
};
</script>

<style scoped>
.table td,
th {
  padding: 5px;
  text-align: center;
}

.input-required {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
</style>