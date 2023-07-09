<template>
  <v-app>
    <app-bar/>
    <v-main>
      <user-auth/>
      <series-table/>
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
