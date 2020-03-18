<template>
  <div class="container">
    <div class="col-sm-6 offset-sm-3 m-t-100px">
      <h2>Login</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            v-model="email"
            name="email"
            class="form-control"
            :class="{'is-invalid': submitted && !email}"
          />
          <div v-show="submitted && !email" class="invalid-feedback">Username is required</div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            v-model="password"
            name="password"
            class="form-control"
            :class="{'is-invalid': submitted && !password}"
          />
          <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary">Login</button>
          <router-link to="/register" class="btn btn-link">Register</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import router from "../router/index";

import { login } from "../services/service";

export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false
    };
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      const { email, password } = this;
      if (email && password) {
        login(email, password)
          .then(response => {
            if (response.status === 200) {
              if (response.data.user.confirmed === true) {
                localStorage.setItem(
                  "user-zap",
                  JSON.stringify(response.data.user)
                );
                localStorage.setItem("jwt-zap", JSON.stringify(response.data.jwt));
                router.push("/");
              } else {
                this.$notify.warning({
                  title: "error",
                  message: "Your account is not activated yet."
                });
              }
            } else {
              this.$notify.error({
                title: "Error",
                message: "Cannot login with this credential"
              });
            }
          })
          .catch(() => {
            this.$notify.error({
              title: "error",
              message: "Invalid credential"
            });
          });
      }
    }
  },
  mounted() {
    localStorage.removeItem("user-zap");
    localStorage.removeItem("jwt-zap");
  }
};
</script>

<style scoped>
</style>