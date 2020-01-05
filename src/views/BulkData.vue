<template>
  <section>
    <div class="row center-text center-item">
      <el-upload
        class="upload-demo"
        drag
        :action="endpointUpload"
        multiple
        name="files"
        :on-success="successUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Upload here your file
          <em>click to load</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          can upload CSV and TXT
          <b>2GB</b>. you can download
          the template from
          <a href="/data.csv">here</a>
        </div>
      </el-upload>
    </div>
  </section>
</template>

<script>
import { BASE_URL } from "../services/endpoints";
import { setBulkData, getBulkData } from "../services/service";

export default {
  data() {
    return {
      endpointUpload: BASE_URL + "/upload",
      bulkData: []
    };
  },
  methods: {
    async successUpload(event) {
      let response = event[0];
      try {
        await setBulkData({
          url: response.url,
          start: new Date(),
          processed: false,
          whatsappMode: true
        });
        this.getAllBulkData();
        this.$notify({
          title: "Success",
          message: "CSV was saved.",
          type: "success"
        });
      } catch (error) {
        this.$notify.error({
          title: "error",
          message: error.message
        });
      }
    },

    getAllBulkData() {
      getBulkData()
        .then(response => {
          if(response.status === 200) {
            this.bulkData = response.data;
          } else {
            this.$notify.error({
              title: "error",
              message: "An error occurs"
            });
          }
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          })
        });
    }
  }
};
</script>