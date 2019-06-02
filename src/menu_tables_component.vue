<template>
  <div class="page-wrapper">
    <nav class="menu_nav">
      <router-link :to="{name: 'table', params: {table_name: table.table_name}}" tag="button" class="menu_button"
                   :key="table.table_name" :id="table.table_name" v-for="table in tables" @click="get_tables">
        <div class="menu_content_wrapper">{{ table.table_name | capitalize_clean }}</div>
      </router-link>
      <button class="menu_button" @click="exit">Exit</button>
    </nav>
    <transition name="fade-table">
      <keep-alive>
        <router-view @update_menu = "get_tables"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios';
  import {url} from './http-common.js';
  import TableComponent from './table_component';
  import router from './main.js'

  export default {
    name: "menu_component",
    components: {
      TableComponent
    },
    data() {
      return {
        tables: null,
        test: null,
      }
    },
    filters: {
      capitalize_clean: function (value) {
        if (!value) return '';
        value = value.toString().replace('_', ' ');
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    watch:
      {
        '$route': function () {
          if (this.$route.name === 'table_menu') {
            router.push('/tables/' + this.tables[0].table_name)
          }
        }
      },
    mounted: function () {
      axios.get(url + 'tables', {withCredentials: true}).then(response => {
        this.tables = response.data;
        router.push('/tables/' + this.tables[0].table_name);
      })

    },
    methods: {
      exit: function () {
        axios.get(url + 'destroysession', {withCredentials: true}).then(response => {
            console.log(response);
            router.push('auth')
          }
        );
      },
      get_tables:function () {
        axios.get(url + 'tables', {withCredentials: true}).then(response => {
          this.tables = response.data;
        })
      }

    }
  }
</script>

<style scoped>

</style>
