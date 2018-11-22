<template>

  <div class="form-wrapper">
    <transition
      name="anim" mode="out-in"
      appear
      appear-class="on_appear"
      appear-to-class="on_appear_to"
      appear-active-class="on_appear_active"
    >
    <div class="form" v-if="login===true" key="registration">
      <h1>Регистрация</h1>
        <div>
          <input type="text" required>
          <label class="floating-label">Логин</label>
        </div>
        <div>
          <input type="text" required>
          <label class="floating-label">Email</label>
        </div>
        <div>
          <input type="password" required>
          <label class="floating-label">Пароль</label>
        </div>

      <button>Зарегестрироваться</button>
      <a v-on:click="changestate">Уже есть аккаунт?</a>
    </div>

    <div class="form" v-else key="login">
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
    </transition>
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
    beforeCreate: function () {
      let totalCount = 12;
      this.image_num = Math.ceil(Math.random() * totalCount);
      document.body.style.backgroundImage = 'url(images/pixels' + this.image_num + '.gif)';
    },
    methods: {
      changestate: function () {
        this.login = this.login !== true;
      },
    }
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

    z-index: 1;
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

    width: 100%;
    color: gray;
    position: absolute;
    pointer-events: none;
    top: 25px;
    left: 0;
    bottom: auto;
    transition: 0.3s ease all;
    font-weight: normal !important;
    z-index: 2;
  }


  input:focus ~ .floating-label,
  input:valid ~ .floating-label {
    top: 0;
    font-size: 0.7em;
    color: #f06292;
  }

  .form>div{
    position: relative;
    line-height: 1em;
  }

  input:focus,
  input:valid {
    outline:0;
    border-color: #f06292 !important;
  }

  .anim-enter-active, .anim-leave-active {
    transition: opacity .2s;
  }

  .anim-enter, .anim-leave-to, .on_appear {
    opacity: 0;
  }
  .on_appear_to, .on_appear_active{
    transition: opacity .4s;
  }
</style>
