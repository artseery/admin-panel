<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <button class="modal-default-button cross" @click="$emit('close')">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"
                     version="1.1" width="100px" height="100px">
                  <g id="surface1">
                    <path style=" "
                          d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z "/>
                  </g>
                </svg>
              </button>
              {{action|capitalize}}
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div v-if="action=='edit'&&label_key !=='enabled'&&label_key !== 'id'" v-for="(element, label_key) in row"
                   class="form-body" :key="label_key">
                <label>{{label_key | capitalize}}</label>
                <select v-if="Object.keys(columns.possible_values[0])[0]==label_key" class="select" v-model="row[label_key]">
                  <option>{{null}}</option>
                  <option v-for="elements in columns.possible_values">{{Object.values(elements)[0]}}</option>
                </select>
                <input v-model="row[label_key]" v-else>
              </div>
              <div v-if="action=='create'&&column.COLUMN_NAME !== 'id'&&column.COLUMN_NAME !== 'enabled'"
                   v-for="(column, key) in columns.columns" class="form-body" :key="key">
                <label>{{column.COLUMN_NAME | capitalize}}</label>
                <select v-if="Object.keys(columns.possible_values[0])[0]==column.COLUMN_NAME" class="select"
                        v-model="insert_array[column.COLUMN_NAME]">
                  <option></option>
                  <option v-for="elements in columns.possible_values">{{Object.values(elements)[0]}}</option>

                </select>
                <input v-model="insert_array[column.COLUMN_NAME]" v-else>
              </div>
              <table v-if="action=='manage_rights'">
                <tr class="rights-block-wrapper"
                    v-for="all_rights_elements in rights.all_rights">
                  <td>{{all_rights_elements.table_name| capitalize}}:</td>
                  <td class="rights-block">
                    <div v-for="right in all_rights_elements.rights" :key="right">

                      <button
                        class="trigger_button"
                        @click="$emit('manage_rights', row.id, right, rights.current_rights.filter(obj =>{ return obj.table_name === all_rights_elements.table_name}).some(el => el.rights.includes(right)), all_rights_elements.table_name)"
                        :class="{active:rights.current_rights.filter(obj =>{ return obj.table_name === all_rights_elements.table_name}).some(el => el.rights.includes(right))}">
                        {{right}}
                      </button>
                    </div>
                  </td>
                </tr>
              </table>
            </slot>
          </div>

          <div class="modal-footer clearfix">
            <slot name="footer">
                <button v-if="action!=='manage_rights'" class="modal-default-button checkmark"
                        @click="$emit(action, action=='create'? insert_array: row)">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 50 50"
                       version="1.1" width="100px" height="100px">
                    <g id="surface1">
                      <path style=" "
                            d="M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z "/>
                    </g>
                  </svg>
                </button>
              <div id="edit-error" :style="{ display: display_error }">Введены неверные данные или не заполнены
                обязательные поля
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: ['action', 'row', 'display_error', 'columns', 'rights'],
    name: "modal",
    data() {
      return {
        insert_array: {}
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return '';
        value = value.toString().replace('_', ' ');
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    methods: {},
  }

</script>

<style>
  @import "styles/modal_style.css";
</style>
