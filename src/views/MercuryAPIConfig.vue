<template>
  <section>
    <div class="row m-t-30px">
      <div class="col-md-4">
        <label class="float-left" style="font-weight: bold">Name</label>
        <el-input v-model="config.name"></el-input>
      </div>
      <div class="col-md-4">
        <label class="float-left" style="font-weight: bold">API</label>
        <el-input v-model="config.apitoken"></el-input>
      </div>
      <div class="col-md-2">
        <button
          class="btn btn-danger btn-sm float-left"
          style="margin-top:35px;"
          @click="updateConfig"
          type="danger"
        >Update</button>
      </div>
    </div>
  </section>
</template>

<script>
import {
  createConfigDataService,
  getConfigDataService,
  updateConfigDataService
} from "../services/service";

export default {
  data() {
    return {
      config: {
        name: "",
        apitoken: ""
      }
    };
  },
  methods: {
    updateConfig() {
      if (this.config.id === undefined) {
        // create config
        this.config.Type = "MercuryAPI";
        createConfigDataService(this.config)
          .then(response => {
            this.config = response.data;
            this.$notify({
              title: "Success",
              message: "Mercury API is created",
              type: "success"
            });
          })
          .catch(error => {
            this.$notify.error({
              title: "Error",
              message: error.message
            });
          });
      } else {
        // update config
        updateConfigDataService(this.config)
          .then(response => {
            this.config = response.data;
            this.$notify({
              title: "Success",
              message: "Mercury API is updated",
              type: "success"
            });
          })
          .catch(error => {
            this.$notify.error({
              title: "Error",
              message: error.message
            });
          });
      }
    }
  },
  mounted() {
    getConfigDataService("MercuryAPI")
      .then(response => {
        if (response.status === 200) {
          this.config = response.data[0];
        } else {
          this.$notify.error({
            title: "error",
            message: "Can't load the configuration"
          });
        }
      })
      .catch(error => {
        this.$notify.error({
          title: "error",
          message: error.message
        });
      });
  }
};
</script>