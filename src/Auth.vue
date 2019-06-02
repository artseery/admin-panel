<template>
  <div class="form-wrapper" id="form-wrapper" key="auth_page">
    <transition name="anim" mode="out-in">
      <form class="form" key="login" v-on:keyup.enter="login">
        <h1>Вход</h1>
        <div>
          <input type="text" v-model="user.login" tabindex="1" required>
          <span class="floating-label">Логин</span>
        </div>
        <div>
          <input id="password" type="password" v-model="user.password" tabindex="2" required>
          <span class="floating-label">Пароль</span>
        </div>
        <button id="login" v-on:click="login">Войти</button>
        <div id="error">{{error_text}}</div>
      </form>
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
        error_text: 'Введен неверный логин или пароль',
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
        let self = this;
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
            if (response.status === 200&&response.data=== 'success') {
              router.push('tables');
            }
            else
              console.log('Server error');
          })
          .catch(function (error) {
            console.log(error);
            if (error.response.status === 401) {
              self.error_text='Введен неверный логин или пароль'
              document.getElementById('error').style.display='block';
            }
            if(error.response.status === 402){
              self.error_text='Ваш аккаунт отключён'
              document.getElementById('error').style.display='block';

            }
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
