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
        <router-link to ="home">
        <button>Зарегестрироваться</button>
        </router-link>
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
        name: "auth",
          data() {
            return {
              button_text: '',
              login: true,
            }
          },
          methods: {
            changestate: function () {
              this.login = this.login !== true;
            },
        }
    }
</script>

<style>
  @import "styles/style.css";
</style>
