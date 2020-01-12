<template>
  <div class="col-md-12">
    <div class="row">
      <div class="col-md-4 left-pane">
        <div class="row left-pane-header">
          <div class="col-md-6" id="userImg">
            
          </div>
          <div class="col-md-6 text-right icons">
            <span
              @click="gotoHome"
              @mouseover="goConfig = true"
              @mouseleave="goConfig = false"
              class="left-pane-back-config"
            >
              <i class="el-icon-arrow-left"></i>
              <span v-if="goConfig" class="text-link">Go to configuration</span>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 search-box">
            <div class="input-search center-item">
              <i style="font-size:23px;" class="el-icon-search" />
              <input
                @input="onSearchName"
                type="text"
                class="col-md-10"
                id="inputSearch"
                v-model="nameToSearch"
                placeholder="Buscar o empezar un chat nuevo"
              />
            </div>
          </div>
        </div>
        <div class="row flex">
          <div class="col-md-12 users-list flex-auto" id="usersList">
            <div class="row user-container" v-for="user in filterUsers" :key="user.key">
              <div class="col-md-12" :id="user.key" @click="loadChat(user)"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8 right-pane"></div>
    </div>
  </div>
</template>

<script>
import router from "../router/index";

export default {
  props: ["user"],
  data() {
    return {
      goConfig: false,
      nameToSearch: "",
      filterUsers: []
    };
  },
  methods: {
    gotoHome() {
      router.push("/");
    },
    onSearchName() {},

    loadUser(){

    }
  },
  mounted() {

  }
};
</script>

<style scoped>
.left-pane {
  height: 100vh;
  border-right: 1px solid #dee2e6;
  background-color: #fff;
  flex-direction: column;
  display: flex;
}

.left-pane-header {
  background-color: #eee;
  padding-top: 0.6rem;
  padding-bottom: 0.5rem;
  flex: none;
}

.right-pane {
  height: 100vh;
  flex-direction: column;
  display: flex;
  background-color: #e5ddd5;
  background-image: url("../assets/chat_bg.png");
}

.left-pane-back-config {
  margin: 10px 0 10px 10px;
}
.icons svg {
  margin: 0.4rem;
}

.search-box {
  background-color: #fbfbfb;
  border-bottom: 1px solid #dddcdc;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
}

.input-search {
  font-size: 0.8rem;
  background-color: #fff;
  border: 1px solid #f6f6f6;
  border-radius: 0.3rem;
}

.input-search input {
  background-color: #fff;
  border: none;
  height: 30px;
}

.input-search i {
  color: #d5d7d4;
  padding-left: 0.9rem;
}

.flex {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.users-list {
  background-color: #fff;
  border-bottom-left-radius: 3px;
}

.user-container {
  padding: 0.6rem 0;
  border-bottom: 1px solid#ece6e0;
}

.user-container:hover {
  cursor: pointer;
  background-color: #f3f3f3;
}
</style>