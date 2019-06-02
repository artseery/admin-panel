<template>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>


<script>

  export default {
    name: 'app',
    data() {
      return {}
    },
  }
</script>

<style>
  @import "styles/style.css";
</style>
