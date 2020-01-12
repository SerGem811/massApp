<template>
  <div class="m-t-30px text-center">
    <h3>Enter in whtasapp here:</h3>
    <br />
    <button class="btn-danger btn btn-lg m-l-30" type="danger" @click="goChat">Go to Chat</button>
  </div>
</template>
<script>
import router from "../router/index";
export default {
  methods: {
    goChat() {
      router.push("/chat");
    }
  }
};
</script>