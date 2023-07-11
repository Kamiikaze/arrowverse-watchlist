<template>
  <v-app-bar>

    <v-app-bar-title>Arrowverse-Watchlist</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-menu
      :open-on-hover="isLoggedIn"
    >
      <template v-slot:activator="{ props }">
        <v-btn v-if="isLoggedIn" v-bind="props">
          {{ getUser.name }}
          <v-icon class="ml-2" size="24">mdi-account</v-icon>
        </v-btn>
        <v-btn v-else @click="openDialog">
          {{ "Login" }}
          <v-icon class="ml-2" size="24">mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list v-if="isLoggedIn">
        <v-list-item>
          <v-list-item-title>{{ "Settings" }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>{{ "Logout" }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon @click="toggleTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>

</template>

<script>
import {mapState} from "pinia";
import {useAppStore} from "@/store/app";

export default {
  data: () => ({
    headers: [
      {title: 'Serie', align: 'start', key: 'serie'},
      {title: 'Staffel', align: 'start', key: 'season'},
      {title: 'Episode', align: 'start', key: 'episode'},
      {title: 'Episode Name', align: 'start', key: 'episode-name'},
      {title: 'Veröffentlicht', align: 'start', key: 'published'},
      {title: 'Gesehen', key: 'watched'},
    ],
  }),
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark ? 'light' : 'dark'
    },
    openDialog() {
      useAppStore().openDialog()
    }
  },
  computed: {
    ...mapState(useAppStore, ['getUser', "isLoggedIn"])
  }
}

</script>
