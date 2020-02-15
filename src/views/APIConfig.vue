<template>
  <section>
    <loading :active.sync="isLoading" :is-full-page="true"></loading>
    <div class="row">
      <div class="col-md-12">
        <div class="float-right">
          <button type="success" class="btn-success btn m-r-10" @click="refreshStatus">Refresh</button>
          <button
            type="success"
            class="btn-success btn m-r-10"
            data-toggle="modal"
            data-target="#senderModal"
            @click="addSender"
          >Add</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width: 5%" scope="col"></th>
              <th style="width: 10%" scope="col">Phone</th>
              <th style="width: 10%" scope="col">Name</th>
              <th style="width: 10%" scope="col">Type</th>
              <th style="width: 15%" scope="col">Reply</th>
              <th style="width: 30%" scope="col">Endpoint</th>
              <!-- <th style="width: 20%" scope="col">API token</th> -->
              <th style="width: 8%" scope="col" v-if="user.role.type=='admin'">User</th>
              <th style="width: 12%" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in senders" :key="item.id" v-bind:person="item">
              <td>
                <!-- <span>{{item.status}}</span> -->
                <span v-show="item.status==0" class="status-dot status-con"></span>
                <span v-show="item.status==1" class="status-dot status-discon"></span>
                <span v-show="item.status==2" class="status-dot status-error"></span>
                <span v-show="item.status==3" class="status-dot status-not-config"></span>
              </td>
              <td>{{item.phone}}</td>
              <td>{{item.name}}</td>
              <td>{{item.type}}</td>
              <td>{{item.autoreply != null ? item.autoreply.name : ""}}</td>
              <td>{{item.endpoint}}</td>
              <!-- <td>{{item.apitoken}}</td> -->
              <td v-if="user.role.type=='admin'">{{item.user.username}}</td>
              <td>
                <!-- Connect / Disconnect -->
                <button class="btn-danger btn btn-sm" @click="onConn(item)">
                  <span>{{item.conn}}</span>
                </button>
                <!-- Edit button -->
                <button
                  class="btn-danger btn btn-sm m-l-5"
                  @click="showSenderModal(item)"
                  type="danger"
                  size="small"
                  data-toggle="modal"
                  data-target="#senderModal"
                >
                  <i class="el-icon-edit"></i>
                </button>

                <!-- Delete button -->
                <el-popconfirm
                  @onConfirm="deleteSender(item)"
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
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="modal fade"
      id="senderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="API configuration"
      aria-hidden="true"
      ref="senderModal"
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
                <input type="text" class="form-control" id="config-phone" v-model="sender.phone" />
                <div
                  v-if="submitted && !sender.phone"
                  class="input-required"
                >Phone number is required</div>
              </div>
              <div class="form-group">
                <label for="config-name" class="col-form-label">Name</label>
                <input type="text" class="form-control" id="config-name" v-model="sender.name" />
                <div v-if="submitted && !sender.name" class="input-required">Name is required</div>
              </div>
              <div class="form-group">
                <label for="config-type" class="col-form-label">Type</label>
                <select class="form-control" v-model="sender.type">
                  <option value="WA.Mercury">WA.Mercury</option>
                  <option value="WA.Chat">WA.Chat</option>
                  <option value="WA.Python">WA.Python</option>
                  <option value="WA.Official">WA.Official</option>
                  <option value="TG.Python">TG.Python</option>
                  <option value="WA.GO">TG.GO</option>
                </select>
              </div>
              <div class="form-group">
                <div v-show="sender.type=='WA.Python' || sender.type == 'WA.GO'">
                  <img class="img-qr" v-bind:src="qrcode" />
                  <button
                    type="button"
                    class="btn btn-success m-l-10"
                    v-show="sender.type=='WA.Python' || sender.type == 'WA.GO'"
                    @click="qrRegister"
                  >Get QR Code</button>
                </div>

                <div v-show="sender.type=='TG.Python'">
                  <label for="config-telecode" class="col-form-label">Telegram Code</label>
                  <input type="text" id="config-telecode" v-model="telecode" class="form-control" />
                  <button
                    type="button"
                    class="float-right m-t-5 m-l-10"
                    @click="submitTeleCode"
                  >Submit Code</button>
                  <button type="button" class="float-right m-t-5" @click="getTeleCode">Request Code</button>
                </div>
              </div>
              <div class="form-group">
                <label for="config-endpoint" class="col-form-label">Endpoint</label>
                <input
                  type="text"
                  class="form-control"
                  id="config-endpoint"
                  v-model="sender.endpoint"
                />
                <div
                  v-if="submitted && !sender.endpoint"
                  class="input-required"
                >Endpoint is required</div>
              </div>
              <div
                class="form-group"
                v-show="sender.type != 'TG.Python' && sender.type != 'WA.Python'"
              >
                <label for="config-token" class="col-form-label">API token</label>
                <input type="text" class="form-control" id="config-token" v-model="sender.apitoken" />
                <div
                  v-if="submitted && !sender.apitoken"
                  class="input-required"
                >API token is required</div>
              </div>
              <div class="form-group">
                <label for="config-reply" class="col-form-label">Auto-reply</label>
                <select class="form-control" v-model="sender.autoreply.id">
                  <option v-for="item in replies" :key="item.id" :value="item.id">{{item.name}}</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="updateSender">Save changes</button>
            <button type="button" class="btn btn-secondary" @click="closeSenderModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import $ from "jquery";
import {
  getSenderService,
  updateSenderService,
  createSenderService,
  deleteSenderService,
  getQRCodeService,
  getWrapperTokenService,
  submitTelegramCodeService,
  attachWebhookTelegramService,
  getTelegramTokenService,
  getConnectionStatusService,
  getTelegramCodeService
} from "../services/service";

export default {
  name: "APIConfig",
  props: ["user", "replies"],
  data() {
    return {
      sender: {
        phone: "",
        type: "WA.Mercury",
        name: "",
        apitoken: "",
        endpoint: "",
        autoreply: {},
        conn: "on"
      },
      senders: [],
      submitted: false,
      telecode: "",
      qrcode: "",
      isLoading: false
    };
  },
  methods: {
    addSender() {
      this.emptySender();
    },

    showSenderModal(item) {
      this.sender = { ...item };
      this.qrcode = "";
      this.telecode = "";
    },

    closeSenderModal() {
      this.submitted = false;
      $("#senderModal").modal("hide");
    },

    updateSender(refreshPage) {
      this.submitted = true;
      if (this.sender.id && this.sender.id != null) {
        updateSenderService(this.sender)
          .then(response => {
            if (response.status == 200) {
              this.$emit(
                "showSuccessMessage",
                "Sender is successfully updated"
              );
              if (refreshPage) {
                this.emptySender();
                this.refreshPage();
              }
            } else {
              this.$emit("showFailMessage", "Cannot update the Sender");
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        // create new
        this.sender.user = this.user.id;
        if (this.sender.apitoken == "") {
          this.$emit("showFailMessage", "Please authenticate first");
          return;
        }
        createSenderService(this.sender)
          .then(response => {
            if (response.status == 200) {
              this.$emit(
                "showSuccessMessage",
                "Sender is successfully created"
              );
              if (refreshPage) {
                this.emptySender();
                this.refreshPage();
              }
            } else {
              this.$emit("showFailMessage", "Cannot create the Sender");
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      }
    },

    emptySender() {
      this.sender = {
        phone: "",
        type: "WA.Mercury",
        name: "",
        apitoken: "",
        autoreply: {},
        conn: "on"
      };
      this.qrcode = "";
    },

    deleteSender(item) {
      deleteSenderService(item)
        .then(response => {
          if (response.status === 200) {
            this.$emit("showSuccessMessage", "Sender is successfully removed");
            this.refreshPage();
          } else {
            this.$emit("showFailMessage", "Cannot delete the sender");
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    async refreshPage() {
      this.closeSenderModal();
      this.submitted = false;
      this.emptySender();

      await getSenderService(this.user.id)
        .then(async response => {
          if (response.status == 200) {
            this.senders = response.data;
            // for (var i = 0; i < this.senders.length; i++) {
            //   this.senders[i].status = 2;
            // }
          } else {
            this.senders = [];
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
      this.refreshStatus();
    },

    async refreshStatus() {
      // get connection status
      this.isLoading = true;
      for (var i = 0; i < this.senders.length; i++) {
        if (
          this.senders[i].type == "WA.Python"
        ) {
          await getConnectionStatusService(
            this.senders[i].apitoken,
            this.senders[i].type
          )
            .then(response => {
              if (response.status == 200) {
                this.senders[i].status = this.getStatusCode(
                  response.data.internetStatus
                );
              } else {
                this.senders[i].status = 2;
              }
            })
            .catch(() => {
              this.senders[i].status = 2;
            });
        } else {
          this.senders[i].status = 3;
        }
      }
      this.isLoading = false;
      this.$forceUpdate();
    },

    getStatusCode(val) {
      if (val == "connected") {
        return 0;
      } else if (val == "disconnected") {
        return 1;
      } else {
        return 2;
      }
    },

    async qrRegister() {
      try {
        if (this.sender.name == "" || this.sender.phone == "") {
          this.$emit("showFailMessage", "Phone and Name is required");
          return;
        }
        if (this.sender.apitoken == "" || this.sender.apitoken == null) {
          // create token
          await getWrapperTokenService(this.sender.name, "Pwd123!@#")
            .then(response => {
              console.log("qrRegister name before create then");
              console.log(response);
              if (
                response.status == 200 &&
                response.data.token &&
                response.data.token != null
              ) {
                this.sender.apitoken = response.data.token;
                this.$emit("showSuccessMessage", this.sender.apitoken);

                // if sender is in senders then save
                const v = this.senders.findIndex(x => x.id == this.sender.id);
                if (v >= 0) {
                  this.updateSender();
                }
              } else {
                this.$emit(
                  "showFailMessage",
                  "Something went wrong, please try again"
                );
                return;
              }
            })
            .catch(error => {
              this.$emit("showFailMessage", error.message);
              return;
            });
        }
        // toke is already created
        // get qr image
        if (
          this.sender.apitoken &&
          this.sender.apitoken != "" &&
          this.sender.apitoken != null
        ) {
          getQRCodeService(this.sender.apitoken)
            .then(response => {
              if (
                response.status == 200 &&
                response.data != null &&
                response.data.qr != null
              ) {
                this.qrcode = "data:image/png;base64, " + response.data.qr;
              } else {
                this.qrcode = "";
                this.$emit(
                  "showFailMessage",
                  "Something went wrong, try again please"
                );
              }
            })
            .catch(error => {
              this.$emit("showFailMessage", error.message);
            });
        }
      } catch (e) {
        console.log(e);
      }
    },

    onConn(item) {
      const s = item;
      if (s.conn == "on") {
        s.conn = "off";
      } else if (s.conn == "off") {
        s.conn = "on";
      }
      updateSenderService(s)
        .then(response => {
          if (response.status == 200) {
            this.$emit("showSuccessMessage", "Connection status is updated");
            // this.refreshPage();
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    // get telegram code
    async getTeleCode() {
      // generate token
      if (this.sender.name == "" || this.sender.phone == "") {
        this.$emit("showFailMessage", "Phone and Name is required");
        return;
      }
      if (this.sender.apitoken == "" || this.sender.apitoken == null) {
        await getTelegramTokenService(this.sender.name, "Pwd123!@#")
          .then(response => {
            if (response.status == 200 && response.data.token != null) {
              this.sender.apitoken = response.data.token;
              // this.$emit("showSuccessMessage", this.sender.apitoken);
              // if sender is in senders then save
              const v = this.senders.findIndex(x => x.id == this.sender.id);
              if (v >= 0) {
                this.updateSender();
              }
            } else {
              this.$emit(
                "showFailMessage",
                "Something went wrong, please try again"
              );
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
            return;
          });
      }
      if (this.sender.apitoken != "" && this.sender.apitoken != null) {
        // request code
        getTelegramCodeService(this.sender.apitoken, this.sender.phone)
          .then(response => {
            if (response.status == 200) {
              this.$emit(
                "showSuccessMessage",
                "You may have code in telegram now"
              );
            } else {
              this.$emit(
                "showFailMessage",
                "Something went wrong, please try again"
              );
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      }
    },

    submitTeleCode() {
      if (
        this.telecode != "" &&
        this.sender.apitoken != "" &&
        this.sender.phone != ""
      ) {
        submitTelegramCodeService(
          this.sender.apitoken,
          this.sender.phone,
          this.telecode,
          "pwd"
        )
          .then(response => {
            if (response.status == 200) {
              this.$emit(
                "showSuccessMessage",
                "Successfully register your number"
              );
              // register webhook url
              attachWebhookTelegramService(
                this.sender.apitoken,
                this.sender.phone
              )
                .then(response => {
                  if (response.status == 200) {
                    this.$emit(
                      "showSuccessMessage",
                      "Successfully register your webhook"
                    );
                  }
                })
                .catch(error => {
                  this.$emit("showFailMessage", error.message);
                });
            } else {
              this.$emit(
                "showFailMessage",
                "Something went wrong with sending code"
              );
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        this.$emit("showFailMessage", "Telegram code is required");
      }
    }
  },
  components: {
    Loading
  },
  async mounted() {
    // load configurations
    await this.refreshPage();
    this.refreshStatus();
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

.input-required {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}

.img-qr {
  width: 200px;
  height: 200px;
}

.status-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
}

.status-con {
  background-color: green;
}
.status-discon {
  background-color: gray;
}
.status-error {
  background-color: red;
}
.status-not-config {
  background-color: lightblue;
}
</style>