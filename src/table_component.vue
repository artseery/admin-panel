<template>
  <div class="table_component">
    <div class="table_wrapper">
      <div class="search_wrapper">
        <input type="text" :key="current_table" v-model.trim="searchQuery">
        <span class="search_icon"></span>
      </div>
      <table>
        <thead>
        <tr>
          <td :key="table_line.name" v-for="(table_line, title) in table[0]" @click="sortBy(title)"
              :class="{ active: sortKey == title }">
            {{ title }}
            <span class="arrow"
                  v-bind:class="{'default':(sortKey !== title), 'asc': (orderSort === 'asc'&&sortKey === title), 'dsc': (orderSort === 'desc'&&sortKey === title)}">
          </span>
          </td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, row_key) in orderTable" :key="row_key">
          <td v-for="(element, element_key) in row" :key="element_key">
            {{ element }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {url} from './http-common.js';

  let orderBy = require('lodash.orderby');

  export default {
    props: ['current_table'],
    name: "table_component",
    data() {
      return {
        table: '',
        sortKey: '',
        sortOrders: {},
        orderSort: 'asc',
        orderedTable: '',
        searchQuery: '',
        searchQueryList: {},
        prev_table: ''
      }
    },
    mounted: function () {
    },
    computed: {
      orderTable: function () {
        this.orderedTable = orderBy(this.table, this.sortKey, this.orderSort)
        if (this.searchQuery) {
          let searchQuery = this.searchQuery.toLowerCase();
          this.orderedTable = this.orderedTable.filter(row => Object.values(row).some(elem => elem.toString().toLowerCase().includes(searchQuery)))
        }
        return this.orderedTable;
      }
    },
    watch: {
      current_table: function () {
        this.get_tables(this.current_table);

      },
    },
    filters: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    methods: {
      get_tables: function (table_name) {
        axios.get(url + table_name, {withCredentials: true}).then(response => {
          this.table = response.data;
          //Сохранение данных полей
          if (this.prev_table === '')
            this.prev_table = this.current_table;
          this.searchQueryList[this.prev_table] = this.searchQuery;
          this.searchQuery = '';
          if (this.searchQueryList[this.current_table] !== ''&& this.searchQueryList[this.current_table] !== undefined) {
            this.searchQuery = this.searchQueryList[this.current_table];
          }
          this.prev_table = this.current_table;
        });

      },
      sortBy: function (key) {

        if (this.sortKey !== key) {
          this.orderSort = 'asc';
          this.sortKey = key;
        }
        else if (this.orderSort === 'desc') //пофиксить
          this.orderSort = 'asc'
        else
          this.orderSort = 'desc'
      }
    }
  }
</script>

<style scoped>

</style>
