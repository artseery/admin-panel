<template>

  <div class="form-wrapper" id="form-wrapper">
    <transition name="anim" mode="out-in">
      <div class="form" key="login" v-on:keyup.enter="login">
        <h1>Вход</h1>
        <div>
          <input type="text" v-model="user.login" required>
          <span class="floating-label">Логин</span>
        </div>
        <div>
          <input type="password" v-model="user.password" required>
          <span class="floating-label">Пароль</span>
        </div>
        <button id="login" v-on:click="login">Войти</button>
        <div id="error">Введен неверный логин или пароль</div>
      </div>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios';
  import {url} from './http-common.js';
  import router from './main.js';

  let md5 = require('md5');

  export default {
    name: "auth",
    data() {
      return {
        button_text: '',
        errors: [],
        auth_data: {},
        user: {
          login: '',
          password: ''
        }
      }
    },
    mounted: function () {
      let totalCount = 12;
      this.image_num = Math.ceil(Math.random() * totalCount);
      let back_element = document.getElementById("form-wrapper");
      back_element.style.backgroundImage = 'url(images/pixels' + this.image_num + '.gif)';
    },
    methods: {
      login: function () {
        if (this.user.login !== '' && this.user.password !== '') {
          this.auth_data.login = this.user.login;
          this.auth_data.password = md5(this.user.password);
          this.send_data()
        }
      },
      send_data: function () {
        console.log(this.auth_data);
        axios({
          url: url + 'auth',
          crossdomain: true,
          withCredentials: true,
          method: 'POST',
          dataType: "text",
          data: this.auth_data
        })
          .then(function (response) {
            console.log(response.data);
            if (response.data === "success") {
              router.push('home');
            }
            if (response.data === "error") {
              document.getElementById('error').style.display='block';
            }
            else
              console.log('Server error');
          })
          .catch(function (error) {
            console.log(error);
          })
          .catch(e => {
            this.errors.push(e);
          })
      }
    }
  }
</script>

<style>
  @import "styles/style.css";
</style>
