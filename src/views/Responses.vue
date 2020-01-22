<template>
  <section>
    <div class="row">
      <div class="col-md-2">
        <span class="float-right font-bold m-t-5">Phone number :</span>
      </div>
      <div class="col-md-3">
        <select class="form-control m-b-5" @change="onChangeNumber($event)">
          <option v-for="item in senders" :key="item.id" :value="item.id">{{item.phone}}</option>
        </select>
      </div>
      <div class="col-md-5">
        <span class="font-bold d-flex m-t-5">Name : {{senderdata? senderdata.name : ""}}</span>
      </div>
      <div class="col-md-2">
        <button
          type="success"
          class="btn-success btn m-r-10 float-right"
          data-toggle="modal"
          data-target="#responseModal"
          :disabled="senderdata==null"
        >Add</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width: 5%" scope="col">Order</th>
              <th style="width: 20%"></th>
              <th style="width: 10%" scope="col">Name</th>
              <th style="width: 10%" scope="col">Trigger</th>
              <th style="width: 55%" scope="col">Resposta</th>
              <th></th>
            </tr>
          </thead>
          <draggable v-model="responses" tag="tbody" @update="updateOrder">
            <tr
              v-for="item in responses"
              :key="item.id"
              v-bind:class="{'tr-blocked' : item.blocked}"
            >
              <td scope="row">{{ item.order }}</td>
              <td>
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
                  <el-button
                    slot="reference"
                    class="btn-danger btn btn-sm m-l-5"
                    type="danger"
                    size="small"
                  >
                    <span>off</span>
                  </el-button>
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
              <td>{{ item.name }}</td>
              <td>{{ item.message }}</td>
              <td>
                <label class="float-left;">{{ item.response }}</label>
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
                  height="100"
                  @input="onInput"
                  :value="response.response"
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
import VueEmoji from "emoji-vue";
import draggable from "vuedraggable";
import $ from "jquery";
import {
  getAllResponses,
  addResponseService,
  updateResponseService,
  countResponsesService,
  deleteResponseService
} from "../services/service";

export default {
  name: "Responses",
  props: ["user", "senders"],
  data() {
    return {
      myText: "",
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
      senderdata: null
    };
  },

  components: {
    VueEmoji,
    draggable
  },

  methods: {
    onInput(event) {
      if (event && event.data) {
        this.response.response = event.data;
      }
    },

    // add new response to the database
    addResponse() {
      // add new response
      this.response.blocked = false;

      // get last order
      let maxOrder = 0;
      this.responses.map(function(obj) {
        if (obj.order > maxOrder) maxOrder = obj.order;
      });
      this.response.order = maxOrder + 1;
      this.response.senderdata = this.senderdata.id;
      addResponseService(this.response)
        .then(response => {
          //notification
          if (response.status === 200) {
            this.closeResponseModal();
            this.refreshPage();
            this.showSuccessMessage("New response created");
          } else {
            this.showFailMessage("Can't add new response");
          }
        })
        .catch(error => {
          this.showFailMessage(error.message);
        });
    },

    // update response
    // when click save changes button in dialog
    updateResponse() {
      this.submitted = true;
      if (this.response.id) {
        updateResponseService(this.response.id, this.response)
          .then(response => {
            if (response.status === 200) {
              this.showSuccessMessage("Response is updated");
              this.response = {
                id: "",
                name: "",
                response: "",
                message: ""
              };
              this.closeResponseModal();
              this.refreshPage();
            } else {
              this.showFailMessage("Can't update the response");
            }
          })
          .catch(error => {
            this.showFailMessage(error.message);
          });
      } else {
        this.addResponse();
      }
    },

    // when click edit in table
    updateItem(data) {
      this.showResponseModal(data);
    },

    deleteResponse(id) {
      deleteResponseService(id)
        .then(response => {
          if (response.status === 200) {
            this.showSuccessMessage("Response is successfully removed");
            this.refreshPage();
          } else {
            this.showFailMessage("Can't remove the response");
          }
        })
        .catch(error => {
          this.showFailMessage(error.message);
        });
    },

    updateOrder() {
      this.responses.forEach((register, item) => {
        register.order = item;
        updateResponseService(register.id, register);
      });
      this.showSuccessMessage("Response order updated");
    },

    updateBlock(id) {
      let r = this.responses.find(x => x.id == id);
      if (r) {
        r.blocked = !r.blocked;
        updateResponseService(id, r)
          .then(response => {
            if (response.status === 200) {
              if (r.blocked) {
                this.showSuccessMessage("Response is now blocked");
              } else {
                this.showSuccessMessage("response is now activated");
              }
            } else {
              this.showSuccessMessage("Can't update the response");
            }
          })
          .catch(error => {
            this.showFailMessage(error.message);
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
          this.showFailMessage(error.message);
        });
    },

    refreshPage() {
      if (this.senderdata !== null) {
        getAllResponses(this.pagination, this.senderdata.id)
          .then(response => {
            if (response.status == 200) {
              this.responses = response.data;
              this.updateCount();
            }
          })
          .catch(error => {
            this.showFailMessage(error.message);
          });
      } else {
        this.responses = [];
      }
    },

    showSuccessMessage(message) {
      this.$notify.success({
        title: "Success",
        message: message
      });
    },

    showFailMessage(message) {
      this.$notify.error({
        title: "Failed",
        message: message
      });
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

    onChangeNumber(event) {
      const sender = this.senders.find(x => x.id == event.target.value);
      if (sender) {
        this.senderdata = sender;
      } else {
        this.senderdata = null;
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
    if (this.senders && this.senders.length > 0) {
      this.senderdata = this.senders[0];
    } else {
      this.senderdata = null;
    }
    this.refreshPage();
  },
  watch: {
    senders: {
      immediate: true,
      handler() {
        if (this.senders && this.senders.length > 0) {
          this.senderdata = this.senders[0];
        } else {
          this.senderdata = null;
        }
        this.refreshPage();
      }
    }
  }
};
</script>

<style scoped>
td {
  width: 90px;
}
.table td,
th {
  padding: 5px;
  text-align: center;
}
.tr-blocked {
  background-color: #888 !important;
}
.font-bold {
  font-weight: bold;
}
</style>

