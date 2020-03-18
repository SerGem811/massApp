<template>
  <section>
    <loading
      :active.sync='isLoading'
      :can-cancel='true'
      :is-full-page='true'
    >
    </loading>
    <div class="row">
      <div class="col-md-4">
        <span class="float-right font-bold m-t-5">Auto-reply List :</span>
      </div>
      <div class="col-md-4">
        <select class="form-control m-b-5" @change="onChangeReply($event)">
          <option v-for="item in replies" :key="item.id" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="col-md-4">
        <button
          type="success"
          class="btn-success btn m-r-10 float-right"
          data-toggle="modal"
          data-target="#responseModal"
          :disabled="reply==null"
        >Add Response</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width: 7%" scope="col">Order</th>
              <th style="width: 13%"></th>
              <th style="width: 10%" scope="col">Name</th>
              <th style="width: 10%" scope="col">Trigger</th>
              <th style="width: 60%" scope="col">Resposta</th>
              <th></th>
            </tr>
          </thead>
          <draggable v-model="responses" tag="tbody" @update="updateOrder" handle=".handle">
            <tr
              v-for="item in responses"
              :key="item.id"
              v-bind:class="{'tr-blocked' : item.blocked}"
            >
              <td scope="row" class="handle">{{ item.order }}</td>
              <td class="handle">
                <!-- Edit button -->
                <button
                  class="btn-danger btn btn-sm"
                  @click="updateItem(item)"
                  type="danger"
                  size="small"
                >
                  <i class="el-icon-edit"></i>
                </button>
                <!-- Delete button -->
                <el-popconfirm
                  @onConfirm="deleteResponse(item.id)"
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
                <!-- Block / Unblock item -->
                <el-popconfirm
                  @onConfirm="updateBlock(item.id)"
                  confirmButtonText="Sim"
                  cancelButtonText="Não"
                  icon="el-icon-info"
                  iconColor="red"
                  title="Quer mesmo ativar este gatilho?"
                  v-if="item.blocked"
                >
                  <button
                    slot="reference"
                    class="btn-danger btn btn-sm m-l-5"
                    type="danger"
                    size="small"
                  >
                    <span>off</span>
                  </button>
                </el-popconfirm>
                <el-popconfirm
                  @onConfirm="updateBlock(item.id)"
                  confirmButtonText="Sim"
                  cancelButtonText="Não"
                  icon="el-icon-info"
                  iconColor="red"
                  title="Tem certeza que quer desativar este gatilho?"
                  v-if="!item.blocked"
                >
                  <button
                    slot="reference"
                    class="btn-success btn btn-sm m-l-5"
                    type="success"
                    size="small"
                  >
                    <span>on</span>
                  </button>
                </el-popconfirm>
              </td>
              <td class="handle">{{ item.name }}</td>
              <td class="handle">{{ item.message }}</td>
              <td class="text-align-left">
                <span class="white-space-line">{{ item.response }}</span>
              </td>
              <td></td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>

    <div
      class="modal fade"
      id="responseModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="Resposta"
      aria-hidden="true"
      ref="responseModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add/Edit Resposta</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="response-name" class="col-form-label">Name</label>
                <input type="text" class="form-control" id="response-name" v-model="response.name" />
                <div v-if="submitted && !response.name" class="input-required">Name is required</div>
              </div>
              <div class="form-group">
                <label for="response-message" class="col-form-label">Trigger</label>
                <input
                  type="text"
                  class="form-control"
                  id="response-message"
                  v-model="response.message"
                />
                <div
                  v-if="submitted && !response.message"
                  class="input-required"
                >Trigger is required</div>
              </div>
              <div class="form-group">
                <label for="response-message" class="col-form-label">Resposta</label>
                <VueEmoji
                  ref="emoji"
                  width="100%"
                  height="250"
                  @input="onInput"
                  :value="response.response"
                  class="white-space-line"
                />
                <div
                  v-if="submitted && !response.response"
                  class="input-required"
                >Response is required</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="updateResponse">Save changes</button>
            <button type="button" class="btn btn-secondary" @click="closeResponseModal">Close</button>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import VueEmoji from "emoji-vue";
import draggable from "vuedraggable";
import $ from "jquery";
import {
  getResponsesService,
  createResponseService,
  updateResponseService,
  countResponsesService,
  deleteResponseService
} from "../services/service";

export default {
  name: "Responses",
  props: ["user", "replies"],
  data() {
    return {
      response: {
        id: "",
        name: "",
        response: "",
        message: "",
        phone: ""
      },
      responses: [],
      pagination: {
        count: 2,
        pageSize: 100,
        currentPage: 1
      },
      submitted: false,
      reply: null,
      isLoading: false
    };
  },

  components: {
    VueEmoji,
    draggable,
    Loading
  },

  methods: {
    // input for the emoji
    onInput(event) {
      if (event && event.data) {
        this.response.response = event.data;
      }
    },

    // add new response to the auto-reply list
    addResponse() {
      // add new response
      this.response.blocked = false;

      // get last order
      let maxOrder = 0;
      this.responses.map(function(obj) {
        if (obj.order > maxOrder) maxOrder = obj.order;
      });
      this.response.order = maxOrder + 1;
      this.response.autoreply = this.reply.id;
      createResponseService(this.response)
        .then(response => {
          //notification
          if (response.status === 200) {
            this.closeResponseModal();
            this.refreshPage();
            this.$emit("showSuccessMessage", "New response is created");
          } else {
            this.$emit("showFailMessage", "Cannot create a new response");
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    // update response
    // when click save changes button in dialog
    updateResponse() {
      this.submitted = true;

      // check state
      if(this.response.name == "" || this.response.response == "" || this.response.message == "") {
        return;
      }

      if (this.response.id) {
        updateResponseService(this.response.id, this.response)
          .then(response => {
            if (response.status === 200) {
              this.$emit("showSuccessMessage", "Response is updated");
              this.response = {
                id: "",
                name: "",
                response: "",
                message: ""
              };
              this.closeResponseModal();
              this.refreshPage();
            } else {
              this.$emit("showFailMessage", "Cannot update the response");
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        this.addResponse();
      }
    },

    // when click edit in table
    updateItem(item) {
      this.showResponseModal(item);
    },

    // delete response
    deleteResponse(id) {
      deleteResponseService(id)
        .then(response => {
          if (response.status === 200) {
            this.$emit("showSuccessMessage", "Response is successfully removed");
            this.refreshPage();
          } else {
            this.$emit("showFailMessage", "Cannot remove the response");
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    updateOrder() {
      this.responses.forEach((register, item) => {
        register.order = item;
        updateResponseService(register.id, register);
      });
      this.$emit("showSuccessMessage", "Response orders are updated");
    },

    updateBlock(id) {
      let r = this.responses.find(x => x.id == id);
      if (r) {
        r.blocked = !r.blocked;
        updateResponseService(id, r)
          .then(response => {
            if (response.status === 200) {
              if (r.blocked) {
                this.$emit("showSuccessMessage", "Response is now blocked");
              } else {
                this.$emit("showSuccessMessage", "Response is now activated");
              }
            } else {
              this.$emit("showFailMessage", "Cannot update the response");
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      }
    },

    updateCount() {
      countResponsesService()
        .then(response => {
          let res = response.data;
          this.pagination.count = Math.ceil(res / this.pagination.pageSize);
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },

    async refreshPage() {
      this.isLoading = true;
      if (this.reply !== null) {
        await getResponsesService(this.pagination, this.reply.id)
          .then(response => {
            if (response.status == 200) {
              this.responses = response.data;
              this.updateCount();
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        this.responses = [];
      }
      this.isLoading = false;
    },

    showResponseModal(item) {
      this.response = { ...item };
      $("#responseModal").modal("show");
    },

    closeResponseModal() {
      this.submitted = false;
      $("#responseModal").modal("hide");
      this.emptyResponse();
    },

    onChangeReply(event) {
      const r = this.replies.find(x => x.id == event.target.value);
      if (r) {
        this.reply = r;
      } else {
        this.reply = null;
      }

      this.refreshPage();
    },

    emptyResponse() {
      this.response = {
        id: "",
        name: "",
        response: "",
        message: "",
        phone: ""
      };
    }
  },

  mounted() {
    // load configuration
    if (this.replies && this.replies.length > 0) {
      this.reply = this.replies[0];
      console.log(this.reply);
    } else {
      this.reply = null;
    }
    this.refreshPage();
  },
  watch: {
    replies: {
      immediate: true,
      handler() {
        if (this.replies && this.replies.length > 0) {
          this.reply = this.replies[0];
        } else {
          this.reply = null;
        }
        this.refreshPage();
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
td {
  width: 90px;
}
.tr-blocked {
  background-color: #888 !important;
}
.text-align-left {
  text-align: left!important;
}
</style>

