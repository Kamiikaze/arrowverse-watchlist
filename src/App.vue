<template>
  <v-app>
    <app-bar/>
    <v-main>
      <user-auth/>
      <series-table/>
      <p>Icons by <a href="https://icons8.com"
                     target="_blank">Icons8</a>
      </p>
      {{ this.$vuetify.locale.current }}
    </v-main>
  </v-app>
</template>

<script setup>
import SeriesTable from "@/components/seriesTable.vue";
import AppBar from "@/components/appBar.vue";
import {useAppStore} from "@/store/app";
import UserAuth from "@/components/userAuth/index.vue";

const store = useAppStore()


</script>
