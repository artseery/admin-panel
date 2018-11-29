<template>
 <router-view></router-view>
</template>


<script>

  export default {

    name: 'app',
    data() {
      return {
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
  @import "styles/style.css";
</style>
