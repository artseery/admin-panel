<template>
  <div class="form-wrapper">
    <div class="form" v-if="login===true">
      <h1>Регистрация</h1>
      <div>
        <input type="text" required>
        <span class="floating-label">Логин</span>
      </div>
      <div>
        <input type="text" required>
        <span class="floating-label">Email</span>
      </div>
      <div>
        <input type="password" required>
        <span class="floating-label">Пароль</span>
      </div>
      <button>Зарегестрироваться</button>
      <a v-on:click="changestate">Уже есть аккаунт?</a>
    </div>

    <div class="form" v-else>
      <h1>Вход</h1>
      <div>
        <input type="text" required>
        <span class="floating-label">Логин</span>
      </div>
      <div>
        <input type="password" required>
        <span class="floating-label">Пароль</span>
      </div>
      <button>Войти</button>
      <a v-on:click="changestate">Нет аккаунта? Зарегестрируйтесь!</a>
    </div>
  </div>
</template>


<script>

  export default {

    name: 'app',
    data() {
      return {
        button_text: '',
        login: true,
      }
    },
    methods: {
      changestate: function () {
        this.login = this.login !== true;
      }
    },
    beforeCreate: function () {
      let totalCount = 12;
      this.image_num = Math.ceil(Math.random() * totalCount);
      document.body.style.backgroundImage = 'url(images/pixels' + this.image_num + '.gif)';
    },

  }
</script>

<style>
  @font-face {
    font-family: 'PixelFont';
    src: url("/fonts/3572.ttf") format("truetype"),
    url("/fonts/12345.woff") format("woff");
  }

  html, body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    background-repeat: no-repeat;
  }

  button, html, body, input {
    font-size: 1em;
    font-family: "PixelFont", sans-serif;
    font-weight: bold;
  }

  .form-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

  }

  .form {
    background: white;
    position: relative;
    display: block;
    width: 400px;
    padding: 30px 30px;

  }

  .form > h1 {
    color: #f06292;

  }

  .form input, button {

    box-shadow: none;
    width: 100%;
    margin: 5px auto;
    height: 50px;
    box-sizing: border-box;
  }

  .form button {
    background: #f06292;
    border: none;
    color: white;
  }

  .form input {
    font-weight: normal;
    background: inherit;
    border: none;
    border-bottom: 2px solid;
    transition: border-bottom-color 0.3s ease-in-out;
  }

  .form > a {
    color: #f06292;
    font-weight: normal !important;
  }

  a:hover {
    cursor: pointer;

  }

  .floating-label {
    color: gray;
    position: absolute;
    pointer-events: none;
    left: 30px;
    margin-top: 20px;
    transition: 0.3s ease all;
    font-weight: normal !important;
  }

  input:focus ~ .floating-label,
  input:valid ~ .floating-label {
    margin-top: 0;
    font-size: 0.7em;
    color: #f06292;
  }

  input:focus,
  input:valid{
    border-color: #f06292 !important;
  }
</style>
