<template>
  <section>
    <div class="row">
      <div class="col-md-2">
        <span class="float-right font-bold m-t-5">Phone :</span>
      </div>
      <div class="col-md-3">
        <select class="form-control m-b-5" @change="onChangeSender($event)">
          <option :value="-1">-----------</option>
          <option v-for="item in senders" :key="item.id" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="col-md-1">
        <span class="float-right font-bold m-t-5">Title :</span>
      </div>
      <div class="col-md-4">
        <input type="text" class="form-control" id="massive-title" v-model="title" />
      </div>
      <div class="col-md-2"></div>
    </div>
    <div class="row m-t-10">
      <div class="col-md-2">
        <span class="float-right font-bold m-t-5">Repeat :</span>
      </div>
      <div class="col-md-2">
        <input type="number" class="form-control" v-model="times" />
      </div>
      <div class="col-md-2">
        <span class="float-right font-bold m-t-5">Delay :</span>
      </div>
      <div class="col-md-2">
        <input type="number" class="form-control" v-model="delay" />
      </div>
      <div class="col-md-1"></div>
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
          height="150"
          @input="onInput"
          :value="message"
          class="white-space-line"
        />
      </div>
    </div>
    <div class="row m-t-10">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <div class="float-right">
          <el-radio-group v-model="attachType" class="float-left m-r-10" size="small" @change="onTypeChange">
            <el-radio-button label="Doc"></el-radio-button>
            <el-radio-button label="Video"></el-radio-button>
            <el-radio-button label="Audio"></el-radio-button>
            <el-radio-button label="Image"></el-radio-button>
          </el-radio-group>
          <el-upload
            :accept="acceptType"
            class="float-left m-l-10"
            :action="upload_url"
            name="files"
            :on-success="successUpload"
          >
            <el-button size="small" type="primary">Attach file</el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <div class="row m-t-30px">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <label class="col-form-label font-bold">Phone List</label>
        <h6 class="font-description">*you can use comma and enter for split number</h6>
      </div>
    </div>
    <div class="row m-b-30">
      <div class="col-md-1"></div>
      <div class="col-md-4">
        <textarea class="form-control" style="height: 500px;" v-model="phones"></textarea>
      </div>
      <div class="col-md-1">
        <button type="button" class="btn-success btn" @click="parseNumber">Parse</button>
      </div>
      <div class="col-md-5">
        <textarea class="form-control" style="height: 500px;" v-model="phonesL" readonly></textarea>
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
                <span>Sending message to {{count}} phones for {{times}} times</span>
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
import { sendWAGOBulkSendService } from "../services/service";
import { UPLOAD_URL } from "../services/endpoints";

import VueEmoji from "emoji-vue";
import $ from "jquery";
export default {
  name: "MassiveMessage",
  props: ["user", "senders"],
  data() {
    return {
      sender: {},
      title: "",
      message: "",
      phones: "",
      phonesL: [],
      count: 0,
      times: 1,
      delay: 100,
      upload_url: UPLOAD_URL,
      attachFileUrl: "",
      attachFileType: "",
      acceptType: ".doc, .docx, .pdf",
      attachType: "Doc"
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

    async successUpload(event) {
      let response = event[0];
      if (response) {
        this.attachFileUrl = response.url;
        this.attachFileType = this.attachType;
      }
    },

    confirmSend() {
      if (
        this.sender.id &&
        this.title != "" &&
        this.message != "" &&
        this.phonesL != ""
      ) {
        // parse phone number

        $("#confirmModal").modal("show");
      } else {
        this.$emit("showFailMessage", "Please fill all input");
      }
    },

    parseNumber() {
      if (this.phones != "") {
        let p = this.phones;
        p = p.replace(/\+/g, "");
        p = p.replace(/\(/g, "");
        p = p.replace(/\)/g, "");
        p = p.replace(/-/g, "");
        p = p.replace(/ /g, "");
        const v = p.split(/[,\n\t]/);
        let arr = [];
        for (let i = 0; i < v.length; i++) {
          var isnum = /^\d+$/.test(v[i]);
          if (!isnum) {
            this.$emit("showFailMessage", "Please correct the phone : " + v[i]);
            continue;
          }
          if (v[i].length < 7) {
            this.$emit("showFailMessage", "Please correct the phone : " + v[i]);
            continue;
          }
          arr.push(v[i]);
        }
        this.count = arr.length;
        this.phonesL = arr.join("\n");
      }
    },

    sendMessage() {
      this.closeModal();

      const pl = this.phonesL.replace(/\n/g, ",");

      if(this.attachFileType == "") {
        this.attachFileType = "Text";
      }
      sendWAGOBulkSendService(
        this.sender.id,
        this.message,
        pl,
        this.times,
        this.delay,
        this.attachFileUrl,
        this.attachFileType
      )
        .then(response => {
          if (response.status == "200") {
            this.$emit("showSuccessMessage", "Bulk messages are in process");
          } else {
            this.$emit(
              "showFailMessage",
              "Something went wrong in bulk message"
            );
          }
        })
        .catch(() => {
          this.$emit("showFailMessage", "Something went wrong in bulk message");
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
    },

    onTypeChange(val) {
      
      this.attachType = val;
      if(val == "Doc") {
        this.acceptType = ".doc, .docx, .pdf";
      } else if(val == "Image") {
        this.acceptType = "image/*";
      } else if(val == "Video") {
        this.acceptType = "video/*";
      } else if(val == "Audio") {
        this.acceptType = "audio/*";
      }
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.font-description {
  font-size: 14px;
  color: coral;
}
</style>