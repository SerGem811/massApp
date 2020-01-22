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
          <el-tabs v-model="mainTab" class="home-tabs">
            <el-tab-pane name="1" label="Auto Resposta">
              <Responses v-bind:user="user" v-bind:senders="senders" />
            </el-tab-pane>

            <el-tab-pane name="2" label="BulkData Import">
              <BulkData />
            </el-tab-pane>

            <el-tab-pane name="3" label="Configuration">
              <APIConfig v-bind:user="user" v-bind:senders="senders" @senderUpdated="loadSenders" />
            </el-tab-pane>
            <el-tab-pane name="4" label="Message Massive"></el-tab-pane>

            <el-tab-pane name="5" label="Chat">
              <Chat />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Responses from "./Responses";
import BulkData from "./BulkData";
import APIConfig from "./APIConfig";
import Chat from "./Chat";

import { getAllSenderdata, getSenderdata } from "../services/service";

export default {
  data() {
    return {
      mainTab: "1",
      user: "",
      senders: []
    };
  },
  name: "home",
  components: {
    Responses,
    BulkData,
    APIConfig,
    Chat
  },
  methods: {
    loadSenders() {
      if (this.user.role.type === "admin") {
        getAllSenderdata()
          .then(response => {
            this.updateSenders(response);
          })
          .catch(error => {
            this.updateErrorSenders(error);
          });
      } else {
        getSenderdata(this.user.id)
          .then(response => {
            this.updateSenders(response);
          })
          .catch(error => {
            this.updateErrorSenders(error);
          });
      }
    },
    emptySenders() {
      this.senders = [];
    },
    updateSenders(response) {
      if (response.status === 200) {
        if (response.data.length > 0) {
          this.senders = response.data;
        } else {
          this.emptySenders();
        }
      } else {
        this.showFailMessage("Cannot load the configuration data");
        this.emptySenders();
      }
    },
    updateErrorSenders(error) {
      this.showFailMessage(error.message);
      this.emptySenders();
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
    }
  },
  created() {
    const v = localStorage.getItem("userMass");
    const user = JSON.parse(v);
    this.user = user;
  },
  mounted() {
    this.loadSenders();
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