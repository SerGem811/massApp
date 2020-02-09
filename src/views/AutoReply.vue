<template>
  <section>
    <div class="row">
      <div class="col-md-12">
        <button
          type="success"
          class="btn-success btn m-r-10 float-right"
          data-toggle="modal"
          data-target="#replyModal"
          @click="addReply"
        >Add Response</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width: 10%" scope="col">No</th>
              <th style="width: 15%" scope="col">Action</th>
              <th style="width: 20%" scope="col">Name</th>
              <th style="width: 50%" scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in replies" :key="item.id">
              <td>{{index + 1}}</td>
              <td>
                <!-- Edit button -->
                <button
                  class="btn-danger btn btn-sm"
                  @click="showReplyModal(item)"
                  type="danger"
                  size="small"
                  data-toggle="modal"
                  data-target="#replyModal"
                >
                  <i class="el-icon-edit"></i>
                </button>

                <!-- Delete button -->
                <el-popconfirm
                  @onConfirm="deleteReply(item)"
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
              <td>{{item.name}}</td>
              <td>{{item.description}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="modal fade"
      id="replyModal"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      ref="replyModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Reply</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="reply-name" class="col-form-label">Name</label>
              <input type="text" class="form-control" id="reply-name" v-model="reply.name" />
              <div v-if="submitted && !reply.name" class="input-required">Auto-reply name is required</div>
            </div>
            <div class="form-group">
              <label for="reply-description" class="col-form-label">Description</label>
              <input type="text" class="form-control" id="reply-description" v-model="reply.description" />
              <div v-if="submitted && !reply.description" class="input-required">Auto-reply description is required</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="updateReply">Save changes</button>
            <button type="button" class="btn btn-secondary" @click="closeReplyModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from "jquery";
import {
  createAutoReplyService,
  updateAutoReplyService,
  deleteAutoReplyService
} from "../services/service";

export default {
  name: "AutoReply",
  props: ["user", "replies"],
  data() {
    return {
      reply: {
        name: "",
        description: ""
      },
      submitted: false
    };
  },
  methods: {
    addReply() {
      this.reply = {
        name: "",
        description: ""
      };
    },

    showReplyModal(item) {
      this.reply = { ...item };
    },

    updateReply() {
      this.submitted = true;
      if (this.reply.id == undefined || this.reply.id == "") {
        // create new
        this.reply.user = this.user.id;
        createAutoReplyService(this.reply)
          .then(response => {
            if (response.status == 200) {
              this.reply = {
                name: "",
                description: ""
              };
              this.$emit("loadReplies");
              this.$emit("showSuccessMessage", "Auto-reply is successfully created");
              this.closeReplyModal();
            } else {
              this.$emit("showFailMessage", "Cannot add the Auto-reply");
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      } else {
        // update new
        updateAutoReplyService(this.reply.id, this.reply)
          .then(response => {
            if (response.status == 200) {
              this.reply = {
                name: "",
                description: ""
              };
              this.$emit("loadReplies");
              this.$emit("showSuccessMessage", "Auto-reply is successfully updated");
              this.closeReplyModal();
            }
          })
          .catch(error => {
            this.$emit("showFailMessage", error.message);
          });
      }
    },

    deleteReply(item) {
      deleteAutoReplyService(item.id)
        .then(response => {
          if (response.status == 200) {
            this.$emit("loadReplies");
              this.$emit("showSuccessMessage", "Auto-reply is removed");
          } else {
            this.$emit("showFailMessage", "Cannot remove the Auto-reply");
          }
        })
        .catch(error => {
          this.$$emit("showFailMessage", error.message);
        });
    },

    closeReplyModal() {
      this.submitted = false;
      $("#replyModal").modal("hide");
    },
  },

  mounted() {

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
</style>