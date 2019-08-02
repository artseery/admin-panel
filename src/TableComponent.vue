<template>
  <div class="table_component" :key="table_name">
    <div class="table_wrapper">
      <div v-if="table_name == received_table" class="search_wrapper">
        <button class="action_button create-button create" v-for="action in actions" v-if="action.right_name==='insert'"
                @click="action_click(0, 'create')">
          Добавить запись
        </button>
        <input class="search" type="text" v-model.trim="searchQuery" :key="table_name">
      </div>

      <table :key="table_name">
        <thead>
        <tr>
          <th v-if="title !== 'enabled'" :key="title+'_'+table_name" v-for="(table_row, title) in table[0]"
              @click="sortBy(title)">
            {{ title }}
            <span class="arrow"
                  v-bind:class="{
                  'default':(sortKey !== title),
                  'asc': (orderSort == 'asc'&&sortKey == title),
                  'dsc': (orderSort == 'desc'&&sortKey == title)
                   }">
            </span>
          </th>
          <th v-else>
            {{title}}
          </th>
          <th v-if="actions">
            <div>Actions</div>
          </th>
        </tr>
        </thead>
        <transition-group tag="tbody" name="table_anim">
          <tr v-for="(row, row_key) in orderTable" :key="row_key +'_key'" :class="row_key +'_key'">
            <td v-for="(element, element_key) in row" :key="element_key">
              <div v-if="element_key !== 'enabled'">{{ element }}</div>
              <div v-if="element_key == 'enabled'" class="switch-btn" :class="{'switch-on': element==1}">
                <input @click="enable( element==1 ? '0': '1', row)" type="checkbox" :key="row_key+'_key'">
                <div class="knobs"></div>
              </div>
            </td>
            <td v-if="actions">
              <div class="actions-block-wrapper" v-for="action in actions">

                <div>
                  <edit_button v-if="action.right_name == 'edit'" @edit="action_click(row_key, action.right_name)"></edit_button>
                  <key_button v-if="action.right_name == 'manage_rights'"
                              @manage_rights="action_click(row_key, action.right_name)"></key_button>
                </div>
              </div>
            </td>
          </tr>

        </transition-group>
      </table>

      <modal v-if="showModal" @close="showModal = false" @edit="save_edited_row" @create="insert_row" @manage_rights="manage_rights"
             :action=current_action
             :row=orderedTableCopy[edit_row_index]
             :columns=columns_array
             :rights=rights
             :display_error=display_error>
      </modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {url} from './http-common.js';
  import router from "./main";
  import edit_button from './EditButton';
  import modal from './Modal';
  import key_button from './KeyButton'
  import md5 from 'md5';
  import 'simplebar-vue';
  import 'simplebar/dist/simplebar.css';

  const _ = require('lodash');

  export default {
    components: {edit_button, modal, key_button},
    props: ['table_name'],
    name: "table_component",
    data() {
      return {
        table: '',
        sortKey: '',
        orderSort: 'asc',
        orderedTable: '',
        searchQuery: '',
        searchQueryList: {},
        prev_table: '',
        actions: '',
        received_table: '',
        showModal: false,
        edit_row_index: '',
        orderedTableCopy: '',
        display_error: 'none',
        current_action: '',
        columns_array: '',
        rights: '',
        not_enought_rights: 'У вас нет прав на это действие!'
      }
    },

    mounted: function () {
      this.get_tables(this.table_name);
      axios.get(url, {withCredentials:true}).then(response=>{console.log(response)})
    },
    computed: {
      orderTable: function () {
        this.orderedTable = _.orderBy(this.table, this.sortKey, this.orderSort);
        //Поиск по таблице
        if (this.searchQuery) {
          let searchQuery = this.searchQuery.toLowerCase();
          this.orderedTable = this.orderedTable.filter(row => Object.values(row).some(elem => elem!==null&&elem.toString().toLowerCase().includes(searchQuery)))//Фильтр ищет по пустому id
        }
        this.orderedTableCopy = JSON.parse(JSON.stringify(this.orderedTable));
        return this.orderedTable;
      },
    },

    watch: {
      table_name: function () {
        this.table = '';
        this.get_tables(this.table_name);
      }
      ,
      '$route'(to, from) {
        this.sortKey = ''; //Сброс сортировки при переходе
        //Сохранение данных поля поиска
        this.prev_table = from.params.table_name;
        this.searchQueryList[this.prev_table] = this.searchQuery;
        this.searchQuery = '';
        if (this.searchQueryList[this.table_name] !== '' && this.searchQueryList[this.table_name] !== undefined) {
          this.searchQuery = this.searchQueryList[this.table_name];
        }
      }
    }
    ,
    filters: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    methods: {
      action_click: function (row, action) {
        this.current_action = action;
        this.display_error = 'none';
        this.edit_row_index = row;
        if (action == 'create'||action=='edit') {
          let self = this;
          axios.get(url + 'columns?table_name=' + this.table_name, {withCredentials: true}).then(response => {
            self.columns_array = response.data;
            this.showModal = true;
          });
        }
        if (action == 'edit') {
          this.get_tables(this.table_name);
        }
        if (action == 'manage_rights') {
          this.get_rights(row);
          this.showModal = true;
        }
      },
      get_rights: function(id){
        axios.get(url + 'rights?account_id=' + this.orderedTable[id].id, {withCredentials: true}).then(response => {
          this.rights = response.data;
        })
      },
      save_edited_row: function (row) {
        let self = this;
        let edited_table = {};
        edited_table.new_row = row;
        edited_table.old_row = this.orderedTable[this.edit_row_index];
        edited_table.table_name = this.table_name;
        axios({
          url: url + 'edit',
          crossdomain: true,
          withCredentials: true,
          method: 'POST',
          data: edited_table
        })
          .then(function (response) {
              if (response.status === 200) {
                console.log(response);
                self.showModal = false;
                self.get_tables(self.table_name);
              }
              else {
                alert('server error');
              }
            }
          ).catch(error => {
            if (error.response.status === 403){
              alert('У вас нет прав на это действие!')
            }
            else {
              console.log(error.response);
              //self.get_tables(self.table_name)
              self.display_error = 'block';
            }
        })

      },
      insert_row: function (row) {

        if (Object.entries(row).length === 0 && row.constructor === Object) {
          this.display_error = 'block';
        }
        else {
          let insert_data = {};
          let self = this;
          let row_copy = Object.assign({}, row);
          row_copy.enabled = '1';
          row_copy.password = md5(row_copy.password);
          insert_data.row = row_copy;
          insert_data.table_name = this.table_name;
          axios({
            url: url + 'insert',
            crossdomain: true,
            withCredentials: true,
            method: 'POST',
            data: insert_data
          })
            .then(function (response) {
                if (response.status === 200) {
                  console.log(response);
                  self.get_tables(self.table_name);
                  self.showModal = false;
                }
                else {
                  alert('server error');
                }
              }
            ).catch(error => {
              if (error.response.status === 403){
                alert(this.not_enought_rights)
              }
              else
            {
              console.log(error.response);
              //self.get_tables(self.table_name)
              self.display_error = 'block';
            }
          })
        }
      },
      manage_rights: function(id, right, state, table) {
        let rights = {};
        rights.user_id = id;
        rights.right = right;
        rights.state = state;
        let self = this;
        rights.table_name = table;
        axios({
          url: url + 'manage_rights',
          crossdomain: true,
          withCredentials: true,
          method: 'POST',
          data: rights
        })
          .then(function (response) {
              if (response.status === 200) {
                axios.get(url + 'rights?account_id=' + id, {withCredentials: true}).then(response => {
                  self.rights = response.data;
                });
                self.$emit('update_menu');
                self.get_tables(self.table_name);
              }
              else {
                alert('server error');
              }
            }
          ).catch(error => {
            if (error.response.status === 403)
            {
              alert(this.not_enought_rights)
            }
            if (error.response.status === 423)
            {
              alert('Не блокируйте себе ключевые таблицы!')
            }
            else{
              console.log(error);
            }

        })
      },
      get_tables: function (table_name) {
        axios.get(url + 'tables/' + table_name, {withCredentials: true}).then(response => {
          this.table = response.data.table;
          if (response.data.actions !== undefined) {
            this.actions = JSON.parse(response.data.actions);
          }
          else {
            this.actions = '';
          }
          this.received_table = this.table_name; //Для привязки поиска к текущей таблице при переходах
        }).catch(error => {
          if (error.response.status === 401) {
            router.push('/auth ');
          }
          else {
            router.push('/tables');
          }
        })
      }
      ,
      sortBy: function (key) {
        this.sortKey = key;
        if (this.orderSort === 'desc') //пофиксить
          this.orderSort = 'asc'
        else {
          this.orderSort = 'desc'
        }
      },
      enable: function (enabled, row) {

        let update_row = {};
        let new_row = Object.assign({}, row);
        delete new_row['enabled'];
        delete new_row['user_id']
        update_row.table = this.table_name;
        update_row.where_row = new_row;
        update_row.enabled = enabled;
        var self = this;
        axios({
          url: url + 'update',
          crossdomain: true,
          withCredentials: true,
          method: 'POST',
          data: update_row
        })
          .then(function (response) {
              if (response.status === 200) {
                self.get_tables(self.table_name);
                console.log(response.data)
              }
              else {
                alert('server error');
              }
            }
          ).catch(error => {
          if (error.response.status === 409) {
            alert("Не отключай свой аккаунт!") //TODO Доделать нормальные обработчики ошибок;
          }
          if (error.response.status === 403) {
            alert(this.not_enought_rights);
          }
        })

      }
    }

  }

</script>

<style scoped>

</style>
