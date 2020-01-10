<template>
  <section>
    <div class="form-container">
      <div class="row m-t-5">
        <div class="col-md-12">
          <router-link to="/login" class="float-right">Logout</router-link>
          <span class="float-right m-r-10">You logged in as {{username}}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <el-tabs v-model="mainTab" class="home-tabs">
            <el-tab-pane name="1" label="Auto Resposta">
              <Responses />
            </el-tab-pane>

            <el-tab-pane name="2" label="BulkData Import">
              <BulkData />
            </el-tab-pane>

            <!-- <el-tab-pane name="3" label="Mercury API Config">
              <MercuryAPIConfig />
            </el-tab-pane>

            <el-tab-pane name="4" label="Chat API Config">
              <ChatAPIConfig />
            </el-tab-pane> -->

            <el-tab-pane name="5" label="Configuration">
              <APIConfig />
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
// import MercuryAPIConfig from "./MercuryAPIConfig";
// import ChatAPIConfig from "./ChatAPIConfig";
import APIConfig from "./APIConfig";

export default {
  data() {
    return {
      mainTab: "1",
      username: ""
    };
  },
  name: "home",
  components: {
    Responses,
    BulkData,
    // MercuryAPIConfig,
    // ChatAPIConfig,
    APIConfig
  },
  mounted() {
    const v = localStorage.getItem('userMass');
    const user = JSON.parse(v);
    this.username = user.username;
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