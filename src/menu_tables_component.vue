<template>
  <div class="page-wrapper">
    <nav class="menu_nav">
      <button class="menu_button" :key="table.table_name" :id="table.table_name" v-for="table in tables"
              v-on:click="current_table = table.table_name">
        {{ table.table_name}}
      </button>
    </nav>
    <table-component :current_table="current_table"></table-component>
  </div>
</template>

<script>
  import axios from 'axios';
  import {url} from './http-common.js';
  import TableComponent from './table_component';

  export default {
    name: "menu_component",
    components: {
      TableComponent
    },
    data() {
      return {
        tables: null,
        test: null,
        current_table: null
      }
    },

    mounted: function () {
      axios.get(url + 'tables', {withCredentials: true}).then(response => {
        this.tables = response.data;
        this.current_table = response.data[0].table_name;
        console.log(this.tables);
      })
    },
    methods: {}
  }
</script>

<style scoped>

</style>
