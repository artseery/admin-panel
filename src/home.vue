<template>
    <MenuComponent></MenuComponent>
</template>

<script>
  import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
  import 'simplebar/dist/simplebar.css';
  import $ from 'jquery';
  import MenuComponent from './menu_tables_component.vue';



  export default {
    components: {
      MenuComponent,
    },
    name: "home",
    data() {
      return {
        currentTabComponent: 0
      };
    },
  };
</script>

<style>

  @import "styles/style.css";
</style>
