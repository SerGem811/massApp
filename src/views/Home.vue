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
                v-bind:senders="senders"
                v-bind:users="users"
                @loadSenders="loadSenders"
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
                v-bind:senders="senders"
                @showSuccessMessage="showSuccessMessage"
                @showFailMessage="showFailMessage"
              />
            </el-tab-pane>

            <el-tab-pane name="page-chat" label="Chat">
              <Chat />
            </el-tab-pane>

            <!-- <el-tab-pane name="page-admin" label="Admin">
            </el-tab-pane> -->
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
  getAutoRepliesService,
  getSenderService,
  getUsersService,
} from "../services/service";

export default {
  props: ["mTab"],
  data() {
    return {
      mainTab: "page-resposta",
      user: "",
      senders: [],
      replies: [],
      users: [],
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
    // get replies from api
    loadReplies() {
      let userid = -1;
      if (this.user.role.type != "admin") {
        userid = this.user.id;
      }
      getAutoRepliesService(userid)
        .then(response => {
          if(response.status == 200) {
            if(response.data.length > 0) {
              this.replies = response.data;
            } else {
              this.updateErrorReplies("0 replies found");
            }
          } else {
            this.updateErrorReplies("Something went wrong while loading replies");
          }
        })
        .catch(error => {
          this.updateErrorReplies(error.message);
        });
    },

    // get senders from api
    loadSenders() {
      let userid = -1;
      if(this.user.role.type != "admin") {
        userid = this.user.id;
      }
      getSenderService(userid)
      .then(response => {
        if(response.status == 200) {
          if(response.data.length > 0) {
            this.senders = response.data;
          } else {
            this.updateErrorSenders('0 senders found');
          }
        } else {
          this.updateErrorSenders('Something went wrong while loading configurations');
        }
      })
      .catch(error => {
        this.updateErrorSenders(error.message);
      });

    },

    // get users from api
    loadUsers() {
      if(this.user.role.type == 'admin') {
        getUsersService()
          .then(response => {
            if(response.status == 200 ) {
              this.users = response.data;
            } else {
              this.users = [];
            }
          })
          .catch(error => {
            this.showFailMessage(error.message);
            this.users = [];
          });
      }
    },

    updateErrorReplies(error) {
      this.showFailMessage(error.message);
      this.replies = [];
    },

    updateErrorSenders(error) {
      this.showFailMessage(error);
      this.senders = [];
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
    this.loadSenders();
    this.loadUsers();

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