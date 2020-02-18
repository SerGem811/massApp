<template>
  <section>
    <div class="row">
      <div class="col-md-2">
        <span class="float-right font-bold m-t-5">Sender : </span>
      </div>
      <div class="col-md-3">
        <select class="form-control m-b-5" @change="onChangeSender($event)">
          <option :value="-1">-----------</option>
          <option v-for="item in senders" :key="item.id" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="col-md-1">
        <span class="float-right font-bold m-t-5">Title : </span>
      </div>
      <div class="col-md-4">
        <input type="text" class="form-control" id="massive-title" v-model="title" />
      </div>
      <div class="col-md-2"></div>
    </div>
    <div class="row m-t-30px">
      <div class="col-md-2">
        <span class="float-right font-bold m-t-5">Repeat : </span>
      </div>
      <div class="col-md-2">
        <input type="number" class="form-control" v-model="times" />
      </div>
      <div class="col-md-5"></div>
      <div class="col-md-2">
        <button type="button" class="btn-success btn float-right" @click="confirmSend">Send</button>
      </div>
    </div>
    <div class="row m-t-30px">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <label class="col-form-label font-bold">Message</label>
        <VueEmoji
          ref="emoji"
          width="100%"
          height="250"
          @input="onInput"
          :value="message"
          class="white-space-line"
        />
      </div>
    </div>

    <div class="row m-t-30px">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <label class="col-form-label font-bold">Phone List</label>
        <h6 class="font-description">*you can use comma, space and enter for split number</h6>
        <textarea class="form-control" style="height: 500px;" v-model="phones"></textarea>
      </div>
    </div>
    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      ref="confirmModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm before sending</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <span>Sending message to {{count}} phones</span>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="sendMessage">Send</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { getSenderService, sendWAGOBulkSendService } from "../services/service";
import VueEmoji from "emoji-vue";
import $ from "jquery";
export default {
  name: "MassiveMessage",
  props: ["user"],
  data() {
    return {
      sender: {},
      senders: [],
      title: "",
      message: "",
      phones: "",
      phonesL: [],
      count: 0,
      times: 1
    };
  },
  components: {
    VueEmoji
  },
  methods: {
    onInput(event) {
      if (event && event.data) {
        this.message = event.data;
      }
    },
    async refreshPage() {
      await getSenderService(this.user.id)
        .then(response => {
          if (response.status == 200) {
            this.senders = response.data;
          } else {
            this.senders = [];
          }
        })
        .catch(error => {
          this.$emit("showFailMessage", error.message);
        });
    },
    confirmSend() {
      if (
        this.sender.id &&
        this.title != "" &&
        this.message != "" &&
        this.phones != ""
      ) {
        // parse phone number
        let p = this.phones;
        p = p.replace(/\+/g, "");
        p = p.replace(/\(/g, "");
        p = p.replace(/\)/g, "");
        p = p.replace(/-/g, "");
        p = p.replace(/ /g, "");
        const v = p.split(/[,\n\t]/);
        for (let i = 0; i < v.length; i++) {
          var isnum = /^\d+$/.test(v[i]);
          if (!isnum) {
            this.$emit("showFailMessage", "Please correct the phone : " + v[i]);
            return;
          }
          if(v[i].length < 7) {
            this.$emit("showFailMessage", "Please correct the phone : " + v[i]);
            return;
          }
        }
        this.count = v.length;
        this.phonesL = v.join(",");
        $("#confirmModal").modal("show");
      } else {
        this.$emit("showFailMessage", "Please fill all input");
      }
    },
    sendMessage() {
      this.closeModal();
      sendWAGOBulkSendService(this.sender.id, this.message, this.phonesL, this.times)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    closeModal() {
      $("#confirmModal").modal("hide");
    },
    onChangeSender(event) {
      if (event.target.value) {
        if (event.target.value == "-1") {
          this.sender = {};
        } else {
          this.sender = this.senders.find(x => x.id == event.target.value);
        }
      }
    }
  },
  mounted() {
    this.refreshPage();
  }
};
</script>

<style scoped>
.font-description {
  font-size: 14px;
  color: coral;
}
</style>