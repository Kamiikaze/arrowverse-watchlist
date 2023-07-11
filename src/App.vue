<template>
  <v-app>
    <app-bar/>
    <v-main>
      <user-auth/>
      <series-table/>
      <p>Icons by <a href="https://icons8.com"
                     target="_blank">Icons8</a>
      </p>
    </v-main>
  </v-app>
</template>

<script setup>
import {useAppStore} from "@/store/app";
import {useAuthStore} from "@/store/auth";

import {auth} from "@/plugins/firebase";
import {onAuthStateChanged} from "firebase/auth";

import SeriesTable from "@/components/seriesTable.vue";
import AppBar from "@/components/appBar.vue";
import UserAuth from "@/components/userAuth/index.vue";

const appStore = useAppStore()
const authStore = useAuthStore()

const browserLanguage = navigator.language || navigator.userLanguage;
appStore.setAppLanguage(browserLanguage)
console.log("Set App Language to:", browserLanguage)

onAuthStateChanged(auth, (user) => {
  if (user) {
    auth.useDeviceLanguage();
    authStore.user = user
    console.log("User logged in: ", user)
  } else {
    // User is signed out
    console.log("User logged out")
  }
});


</script>
