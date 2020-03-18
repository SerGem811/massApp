<template>
  <section>
    <loading :active.sync="isLoading" :is-full-page="true"></loading>
    <div class="row">
      <div class="col-md-12">
        <div class="float-right">
          <button
            type="success"
            class="btn-success btn m-r-10"
            @click="refreshStatus(true)"
          >Refreh All</button>
          <button
            type="success"
            class="btn-success btn m-r-10"
            data-toggle="modal"
            data-target="#senderModal"
            @click="emptySender"
          >Add</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width: 8%">No</th>
              <th style="width: 5%" scope="col"></th>
              <th style="width: 12%" scope="col">Phone</th>
              <th style="width: 10%" scope="col">Name</th>
              <th style="width: 8%" scope="col">Type</th>
              <th style="width: 15%" scope="col">Reply</th>
              <!-- <th style="width: 30%" scope="col">Endpoint</th> -->
              <!-- <th style="width: 20%" scope="col">API token</th> -->
              <th style="width: 10%" scope="col" v-if="user.role.type=='admin'">Owner</th>
              <th style="width: 20%" scope="col"></th>
            </tr>
          </thead>
          <draggable v-model="senders" tag="tbody" handle=".handle" @update="updateOrder">
            <tr
              v-for="(item, index) in senders"
              :key="item.id"
              v-bind:person="item"
              v-bind:class="{'tr-blocked' : item.conn == 'off'}"
            >
              <td class="handle">{{index + 1}}</td>
              <td class="handle">
                <span v-show="item.status==status_conn" class="status-dot status-con"></span>
                <span v-show="item.status==status_disconn" class="status-dot status-discon"></span>
                <span v-show="item.status==status_err" class="status-dot status-error"></span>
                <span v-show="item.status==status_no_config" class="status-dot status-not-config"></span>
              </td>
              <td>{{item.phone}}</td>
              <td>{{item.name}}</td>
              <td>{{item.type}}</td>
              <td>{{item.autoreply != null ? item.autoreply.name : ""}}</td>
              <!-- <td>{{item.endpoint}}</td> -->
              <!-- <td>{{item.apitoken}}</td> -->
              <td v-if="user.role.type=='admin'">{{item.user.username}}</td>
              <td>
                <!-- Connect / Disconnect -->
                <button class="btn-danger btn btn-sm" @click="onRefreshStatus(item)">
                  <i class="el-icon-refresh"></i>
                </button>
                <button
                  class="btn btn-sm m-l-5"
                  @click="onConn(item)"
                  v-bind:class="{'btn-danger' : item.conn == 'off', 'btn-success' : item.conn == 'on'}"
                >
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
          </draggable>
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
              <!-- owner -->
              <div class="form-group" v-show="isAdmin == true">
                <label for="config-owner" class="col-form-label">Owner</label>
                <select class="form-control" v-model="sender.user.id">
                  <option v-for="item in users" :key="item.id" :value="item.id">{{item.username}}</option>
                </select>
              </div>
              <!-- phone number -->
              <div class="form-group">
                <label for="config-phone" class="col-form-label">Phone</label>
                <input type="text" class="form-control" id="config-phone" v-model="sender.phone" />
                <div
                  v-if="submitted && !sender.phone"
                  class="input-required"
                >Phone number is required</div>
              </div>
              <!-- name -->
              <div class="form-group">
                <label for="config-name" class="col-form-label">Name</label>
                <input type="text" class="form-control" id="config-name" v-model="sender.name" />
                <div v-if="submitted && !sender.name" class="input-required">Name is required</div>
              </div>
              <!-- type -->
              <div class="form-group">
                <label for="config-type" class="col-form-label">Type</label>
                <select class="form-control" v-model="sender.type">
                  <option value="WA.Mercury">WA.Mercury</option>
                  <option value="WA.Chat">WA.Chat</option>
                  <option value="WA.Python">WA.Python</option>
                  <option value="WA.Official">WA.Official</option>
                  <option value="TG.Python">TG.Python</option>
                  <option value="WA.GO">WA.GO</option>
                </select>
              </div>
              <!-- whatsapp qr, telegram code -->
              <div class="form-group">
                <div v-show="sender.type=='WA.Python' || sender.type == 'WA.GO'">
                  <img class="img-qr" v-bind:src="qrcode" />
                  <button type="button" class="btn btn-success m-l-10" @click="qrScan">Get QR Code</button>
                  <button
                    type="button"
                    class="btn btn-success m-l-10"
                    v-show="sender.type == 'WA.GO'"
                    @click="qrRegister"
                  >Hook</button>
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
              <!-- endpoint -->
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
              <!-- api token -->
              <div
                class="form-group"
                v-show="sender.type != 'TG.Python' && sender.type != 'WA.Python' && sender.type != 'WA.GO'"
              >
                <label for="config-token" class="col-form-label">API token</label>
                <input type="text" class="form-control" id="config-token" v-model="sender.apitoken" />
                <div
                  v-if="submitted && !sender.apitoken"
                  class="input-required"
                >API token is required</div>
              </div>
              <!-- auto reply -->
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
import { uuid } from "vue-uuid";
import QRCode from "qrcode";
import draggable from "vuedraggable";
import $ from "jquery";
import {
  updateSenderService,
  createSenderService,
  deleteSenderService,
  getWAPythonQRCodeService,
  getWAPythonTokenService,
  submitTGPythonCodeService,
  attachWebhookTGPythonService,
  getTGPythonTokenService,
  getConnectionStatusService,
  getTGPythonCodeService,
  getWAGOQRCodeService,
  registerWebhookWAGOService
} from "../services/service";

import {
  STATUS_CONNECT,
  STATUS_DISCONNECT,
  STATUS_ERROR,
  STATUS_NOT_CONFIG,
} from "../services/endpoints";

export default {
  name: "PhoneLines",
  props: ["user", "replies", "senders", "users"],
  data() {
    return {
      sender: {
        phone: "",
        type: "WA.Mercury",
        name: "",
        apitoken: "",
        endpoint: "",
        autoreply: {},
        conn: "off",
        user: {},
        order: -1
      },
      submitted: false,
      telecode: "",
      qrcode: "",
      isLoading: false,
      isAdmin: false,
      isInit: true,
      cache_senders: [],
      orders: [],
      status_conn: STATUS_CONNECT,
      status_disconn: STATUS_DISCONNECT,
      status_err: STATUS_ERROR,
      status_no_config: STATUS_NOT_CONFIG
    };
  },
  methods: {
    // before showing modal
    showSenderModal(item) {
      this.sender = { ...item };
      this.qrcode = "";
      this.telecode = "";
    },

    // close modal
    closeSenderModal() {
      this.submitted = false;
      this.emptySender();
      $("#senderModal").modal("hide");
    },

    // create & update sender
    updateSender() {
      this.submitted = true;
      if (
        this.sender.phone == "" ||
        this.sender.name == "" ||
        this.sender.endpoint == ""
      ) {
        return;
      }
      if (this.sender.id && this.sender.id != null) {
        updateSenderService(this.sender)
          .then(response => {
            if (response.status == 200) {
              this.$emit(
                "showSuccessMessage",
                "Sender is successfully updated"
              );
              this.closeSenderModal();
              this.orders = [];
              this.$emit("loadSenders");
            } else {
              this.$emit("showFailMessage", "Cannot update the Sender");
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        // create new
        if (this.sender.apitoken == "") {
          this.$emit("showFailMessage", "Please authenticate first");
          return;
        }
        // add order
        let maxOrder = 0;
        this.senders.map(function(obj) {
          if (obj.order > maxOrder) maxOrder = obj.order;
        });
        this.sender.order = maxOrder + 1;
        if (!this.isAdmin) {
          this.sender.user = this.user.id;
        }
        // check for the current limitation
        this.getEnableState();

        createSenderService(this.sender)
          .then(response => {
            if (response.status == 200) {
              this.$emit(
                "showSuccessMessage",
                "Sender is successfully created"
              );
              this.closeSenderModal();
              this.orders = [];
              this.$emit("loadSenders");
            } else {
              this.$emit("showFailMessage", "Cannot create the Sender");
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      }
    },

    // update order, trigger on drag & drop in table
    updateOrder() {
      this.senders.forEach((s, item) => {
        s.order = this.orders[item];
        updateSenderService(s);
      });
      this.cache_senders = this.senders.map(a => ({ ...a }));
      this.$emit("showSuccessMessage", "Configuration orders are updated");
    },

    // clear the current sender
    emptySender() {
      this.sender = {
        phone: "",
        type: "WA.Mercury",
        name: "",
        apitoken: "",
        autoreply: {},
        conn: "on",
        user: this.user
      };
      this.qrcode = "";
    },

    // delete sender
    deleteSender(item) {
      deleteSenderService(item)
        .then(response => {
          if (response.status === 200) {
            this.$emit("showSuccessMessage", "Sender is successfully removed");
            const index = this.cache_senders.findIndex(x => x.id == item.id);
            this.cache_senders.splice(index, 1);
            this.orders = [];
            this.$emit("loadSenders");
          } else {
            this.$emit("showFailMessage", "Cannot delete the sender");
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    // refresh status
    async refreshStatus(all) {
      // get connection status
      this.isLoading = true;
      if (all) {
        this.senders.forEach(s => {
          s.status = undefined;
        });
      }
      for (let i = 0; i < this.senders.length; i++) {
        const s = this.senders[i];
        if (s.status != undefined) {
          continue;
        }
        if (s.type == "WA.Python" || s.type == "WA.GO") {
          if (s.conn == "off") {
            s.status = 1;
          } else {
            await getConnectionStatusService(s.apitoken, s.type)
              .then(response => {
                if (response.status == 200) {
                  if (s.type == "WA.Python") {
                    s.status = this.getStatusCode(response.data.internetStatus);
                  } else if (s.type == "WA.GO") {
                    s.status = STATUS_CONNECT;
                  }
                } else {
                  s.status = STATUS_DISCONNECT;
                }
              })
              .catch(() => {
                s.status = STATUS_ERROR;
              });
          }
        } else {
          s.status = STATUS_NOT_CONFIG;
        }
        this.$forceUpdate();
      }

      // make exact copy cache
      this.cache_senders = this.senders.map(a => ({ ...a }));

      if (this.orders.length == 0) {
        this.senders.forEach(s => {
          this.orders.push(s.order);
        });
      }

      this.isLoading = false;
    },

    // get status code from the string
    getStatusCode(val) {
      if (val == "connected") {
        return STATUS_CONNECT;
      } else if (val == "disconnected") {
        return STATUS_DISCONNECT;
      } else {
        return STATUS_ERROR;
      }
    },

    // generate qr code
    async qrScan() {
      try {
        if (this.sender.name == "" || this.sender.phone == "") {
          this.$emit("showFailMessage", "Phone and Name is required");
          return;
        }
        if (this.sender.apitoken == "" || this.sender.apitoken == null) {
          // create token
          if (this.sender.type == "WA.Python") {
            await getWAPythonTokenService(this.sender.name, "Pwd123!@#")
              .then(response => {
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
          } else if (this.sender.type == "WA.GO") {
            this.sender.apitoken = uuid.v4();
            const v = this.senders.findIndex(x => x.id == this.sender.id);
            if (v >= 0) {
              this.updateSender();
            }
          }
        }
        // toke is already created
        // get qr image
        if (
          this.sender.apitoken &&
          this.sender.apitoken != "" &&
          this.sender.apitoken != null
        ) {
          if (this.sender.type == "WA.Python") {
            getWAPythonQRCodeService(this.sender.apitoken)
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
          } else if (this.sender.type == "WA.GO") {
            await getWAGOQRCodeService(this.sender.apitoken)
              .then(response => {
                if (
                  response.status == 200 &&
                  response.data.base64 &&
                  response.data.base64 != null
                ) {
                  // this.qrcode = "data:image/png;base64, " + response.data.base64;
                  QRCode.toDataURL(
                    response.data.base64,
                    { errorCorrectionLevel: "H" },
                    (err, url) => {
                      if (err) {
                        this.$emit(
                          "showFailMessage",
                          "Something went wrong while parsing qrcode"
                        );
                      } else {
                        this.qrcode = url;
                      }
                    }
                  );
                } else {
                  this.qrcode = "";
                  this.$emit(
                    "showFailMessage",
                    "Something went wrong, please try again"
                  );
                }
              })
              .catch(error => {
                this.qrcode = "";
                this.$emit("showFailMessage", error.message);
                return;
              });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    // after qr code registgerd, we need to register hook
    qrRegister() {
      if (
        this.sender.apitoken != "" &&
        this.sender.apitoken != null &&
        this.qrcode != "" &&
        this.qrcode != null
      ) {
        registerWebhookWAGOService(this.sender.apitoken)
          .then(response => {
            if (response.status == 200) {
              this.$emit(
                "showSuccessMessage",
                "Hook is successfully registered"
              );
            } else {
              this.$emit(
                "showFailMessage",
                "Something went wrong with register hook"
              );
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        this.$emit("showFailMessage", "Please Get QR code and scan it first");
        return;
      }
    },

    // change on / off for the line
    onConn(item) {
      this.sender = item;
      if (this.sender.conn == "on") {
        this.sender.conn = "off";
      } else if (this.sender.conn == "off") {
        if (!this.getEnableState()) {
          return;
        }
        this.sender.conn = "on";
      }

      updateSenderService(this.sender)
        .then(response => {
          if (response.status == 200) {
            this.$emit("showSuccessMessage", "Connection status is updated");
            this.orders = [];
            this.$emit("loadSenders");
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    // refresh the selected item
    onRefreshStatus(item) {
      const i = this.senders.findIndex(x => x.id == item.id);
      if (i >= 0) {
        this.isLoading = true;
        this.senders[i].status = undefined;
        this.refreshStatus(false);
      }
    },

    // get telegram code
    async getTeleCode() {
      // generate token
      if (this.sender.name == "" || this.sender.phone == "") {
        this.$emit("showFailMessage", "Phone and Name is required");
        return;
      }
      if (this.sender.apitoken == "" || this.sender.apitoken == null) {
        await getTGPythonTokenService(this.sender.name, "Pwd123!@#")
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
        getTGPythonCodeService(this.sender.apitoken, this.sender.phone)
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
    // submit telegram code
    submitTeleCode() {
      if (
        this.telecode != "" &&
        this.sender.apitoken != "" &&
        this.sender.phone != ""
      ) {
        submitTGPythonCodeService(
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
              attachWebhookTGPythonService(
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
    },

    // get enabled on/off
    getEnableState() {
      // get count of user
      let count = 0;
      this.senders.forEach(s => {
        let uid = this.sender.user;
        if(typeof this.sender.user == 'object') {
          uid = this.sender.user.id;
        }
        if (s.user.id == uid && s.conn == "on") {
          count++;
        }
      });
      let u = this.user;
      if (this.isAdmin) {
        u = this.users.find(x => x.id == this.sender.user.id);
      }
      if (count >= u.line_limit) {
        this.$emit(
          "showFailMessage",
          "Active Line numbers limited, you need to off one of your other number to activate thie number"
        );
        this.sender.conn = "off";
        return false;
      }
      this.sender.conn = "on";
      return true;
    }
  },
  components: {
    Loading,
    draggable
  },
  watch: {
    senders: {
      immediate: true,
      handler() {
        // set status
        this.cache_senders.forEach(s => {
          let v = this.senders.find(x => x.id == s.id);
          v.status = s.status;
        });
        this.refreshStatus(false);
      }
    },
    user: {
      immediate: true,
      handler() {
        if (this.user.role.type == "admin") {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
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

.tr-blocked {
  background-color: #888 !important;
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
  background-color: lightcoral;
}
</style>