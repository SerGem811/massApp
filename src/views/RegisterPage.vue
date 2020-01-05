<template>
  <div class="container">
    <div class="col-sm-6 offset-sm-3 m-t-100px">
      <h2>Register</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            v-model="username"
            name="username"
            class="form-control"
            :class="{'is-invalid': submitted && !username}"
          />
          <div v-show="submitted && !username" class="invalid-feedback">Username is required</div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            v-model="email"
            name="email"
            class="form-control"
            :class="{'is-invalid': submitted && !username}"
          />
          <div v-show="submitted && !email" class="invalid-feedback">Email is required</div>
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
          <button class="btn btn-primary">Register</button>
          <router-link to="/login" class="btn btn-link">Back to login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import router from "../router/index";

import { register } from "../services/service";

export default {
  data() {
    return {
      username: "",
      password: "",
      email: "",
      submitted: false
    };
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      const { username, password, email } = this;
      if (username && password) {
        register(username, password, email)
          .then(response => {
            if (response.status === 200) {
              localStorage.setItem('userMass', JSON.stringify(response.data.user));
              router.push('/');
            } else {
              this.$notify.error({
                title: "error",
                message: "Can't register for the user"
              });
            }
          })
          .catch(() => {
            this.$notify.error({
              title: "error",
              message: "Server error"
            });
          });
      }
    }
  },
  mounted() {
    localStorage.removeItem("userMass");
  }
};
</script>

<style scoped>
</style>