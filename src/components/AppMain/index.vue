<template>
  <div class="main">
   <app-link></app-link>
    <router-view></router-view>
  </div>
</template>
<script>
import AppLink from './Link'
export default {
   components:{
      AppLink
   }
}
</script>