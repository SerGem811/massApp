<template>
  <section>
    <div class="row">
      <div class="col-md-3 form-group">
        <label class="font-bold">Nome</label>
        <el-input placeholder="Nome" v-model="response.name"></el-input>
      </div>
      <div class="col-md-3 form-group">
        <label class="font-bold">Gatilho (trigger)</label>
        <el-input placeholder="trigger" v-model="response.message"></el-input>
      </div>
      <div class="col-md-4 form-group">
        <label class="font-bold">Resposta</label>
        <VueEmoji ref="emoji" width="100%" height="100" @input="onInput" :value="response.response" />
      </div>
      <div class="col-md-2 form-group">
        <button
          class="float-left btn-danger btn-sm btn"
          style="margin-top: 40px;"
          v-if="!activeState"
          @click="addResponse"
          type="danger"
        >Submit</button>
        <button
          class="float-left mt-5 btn-danger btn btn-sm"
          v-if="activeState"
          @click="updateResponse"
          type="danger"
        >Update</button>
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
              v-bind:class="{'tr-blocked' : item.Blocked}"
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
                  v-if="item.Blocked"
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
                  v-if="!item.Blocked"
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
  </section>
</template>

<script>
import VueEmoji from "emoji-vue";
import draggable from "vuedraggable";
import {
  getAllResponses,
  addResponseService,
  updateResponseService,
  countResponsesService,
  deleteResponseService
} from "../services/service";
export default {
  data() {
    return {
      myText: "",
      response: {
        id: "",
        name: "",
        response: "",
        message: ""
      },
      responses: [],
      activeState: 0,
      pagination: {
        count: 2,
        pageSize: 100,
        currentPage: 1
      }
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
      this.response.Blocked = false;

      // get last order
      let maxOrder = 0;
      this.responses.map(function(obj) {
        if (obj.order > maxOrder) maxOrder = obj.order;
      });
      this.response.order = maxOrder + 1;
      addResponseService(this.response)
        .then(response => {
          //notification
          if (response.status === 200) {
            this.refreshPage();
            this.showSuccessNotification("New response created");
          } else {
            this.showFailedNotification("Can't add new response");
          }
        })
        .catch(error => {
          this.showFailedNotification(error.message);
        });
    },

    // update response
    updateResponse() {
      updateResponseService(this.response.id, this.response)
        .then(response => {
          if (response.status === 200) {
            this.showSuccessNotification("Response is updated");
            this.activeState = 0;
            this.response = {
              id: "",
              name: "",
              response: "",
              message: ""
            };
          } else {
            this.showFailedNotification("Can't update the response");
          }
        })
        .catch(error => {
          this.showFailedNotification(error.message);
        });
    },

    updateItem(data) {
      this.response = data;
      this.activeState = 1;
    },

    deleteResponse(id) {
      deleteResponseService(id)
        .then(response => {
          if (response.status === 200) {
            this.showSuccessNotification("Response is successfully removed");
            this.refreshPage();
          } else {
            this.showFailedNotification("Can't remove the response");
          }
        })
        .catch(error => {
          this.showFailedNotification(error.message);
        });
    },

    updateOrder() {
      this.responses.forEach((register, item) => {
        register.order = item;
        updateResponseService(register.id, register);
      });
      this.showSuccessNotification("Response order updated");
    },

    updateBlock(id) {
      let r = this.responses.find(x => x.id == id);
      if (r) {
        r.Blocked = !r.Blocked;
        updateResponseService(id, r)
          .then(response => {
            if (response.status === 200) {
              if (r.Blocked) {
                this.showSuccessNotification("Response is now blocked");
              } else {
                this.showSuccessNotification("response is now activated");
              }
            } else {
              this.showSuccessNotification("Can't update the response");
            }
          })
          .catch(error => {
            this.showFailedNotification(error.message);
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
          this.showFailedNotification(error.message);
        });
    },

    refreshPage() {
      getAllResponses(this.pagination)
        .then(response => {
          if (response.status == 200) {
            this.responses = response.data;
          }
        })
        .catch(error => {
          this.showFailedNotification(error.message);
        });

      this.updateCount();
    },

    showSuccessNotification(message) {
      this.$notify({
        title: "Success",
        message: message,
        type: "success"
      });
    },

    showFailedNotification(message) {
      this.$notify.error({
        title: "Failed",
        message: message,
      });
    }
  },

  mounted() {
    this.refreshPage();
  }
};
</script>

<style scoped>
td {
  width: 90px;
}
.table td, th {
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

