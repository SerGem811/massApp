<template>
  <section>
    <div class="form-container">
      <div class="row m-t-5">
        <div class="col-md-12">
          <router-link to="/login" class="float-right">Logout</router-link>
          <span class="float-right m-r-10">You logged in as {{user.username}}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <el-tabs v-model="mainTab" class="home-tabs" @tab-click="onTabChange">
            <el-tab-pane name="page-resposta" label="Auto Resposta">
              <Responses
                v-bind:user="user"
                v-bind:replies="replies"
                @showSuccessMessage="showSuccessMessage"
                @showFailMessage="showFailMessage"
              />
            </el-tab-pane>

            <el-tab-pane name="page-reply" label="Auto-reply List">
              <AutoReply
                v-bind:user="user"
                v-bind:replies="replies"
                @loadReplies="loadReplies"
                @showSuccessMessage="showSuccessMessage"
                @showFailMessage="showFailMessage"
              />
            </el-tab-pane>

            <el-tab-pane name="page-config" label="Configuration">
              <APIConfig
                v-bind:user="user"
                v-bind:replies="replies"
                @showSuccessMessage="showSuccessMessage"
                @showFailMessage="showFailMessage"
              />
            </el-tab-pane>

            <el-tab-pane name="page-import" label="BulkData Import">
              <BulkData />
            </el-tab-pane>

            <el-tab-pane name="page-bulksend" label="Message Massive">
              <MassiveMessage
                v-bind:user="user"
                @showSuccessMessage="showSuccessMessage"
                @showFailMessage="showFailMessage"
              />
            </el-tab-pane>

            <el-tab-pane name="page-chat" label="Chat">
              <Chat />
            </el-tab-pane>

            <el-tab-pane name="page-admin" label="Admin">
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Responses from "./Responses";
import AutoReply from "./AutoReply";
import BulkData from "./BulkData";
import APIConfig from "./APIConfig";
import Chat from "./Chat";
import MassiveMessage from "./MassiveMessage";

import {
  getAutoRepliesService
} from "../services/service";

export default {
  props: ["mTab"],
  data() {
    return {
      mainTab: "1",
      user: "",
      senders: [],
      replies: []
    };
  },
  name: "home",
  components: {
    Responses,
    AutoReply,
    BulkData,
    APIConfig,
    Chat,
    MassiveMessage
  },
  methods: {
    loadReplies() {
      let userid = -1;
      if (this.user.role.type != "admin") {
        userid = this.user.id;
      }
      getAutoRepliesService(userid)
        .then(response => {
          this.updateReplies(response);
        })
        .catch(error => {
          this.updateErrorReplies(error);
        });
    },

    emptyReplies() {
      this.replies = [];
    },

    updateReplies(response) {
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.replies = response.data;
        } else {
          this.emptyReplies();
        }
      } else {
        this.showFailMessage("Cannot load the configuration data");
        this.emptyReplies();
      }
    },

    updateErrorReplies(error) {
      this.showFailMessage(error.message);
      this.emptyReplies();
    },

    showFailMessage(message) {
      this.$notify.error({
        title: "Failed",
        message: message
      });
    },

    showSuccessMessage(message) {
      this.$notify.success({
        title: "Success",
        message: message
      });
    },

    onTabChange(e) {
      this.$router.push(e.name);
    }
  },
  created() {
    const v = localStorage.getItem("userMass");
    const user = JSON.parse(v);
    this.user = user;
  },
  mounted() {
    this.loadReplies();
  },
  watch: {
    mTab: {
      immediate: true,
      handler() {
        this.mainTab = this.mTab
      }
    }
  }
};
</script>
<style scoped>
.form-container {
  margin: auto;
  max-width: 1024px;
}
.home-tabs {
  min-height: 400px;
  margin-top: 10px;
}
</style>