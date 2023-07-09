<template>
  <v-app-bar>

    <v-app-bar-title>Arrowverse-Watchlist</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-menu
      open-on-hover
    >
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">
          {{ getUser.name || "Login" }}
          <v-icon class="ml-2" size="24">mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list v-if="getUser.name">
        <v-list-item>
          <v-list-item-title>{{ "Test" }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon @click="toggleTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>

    <!--v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn-->
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
    episodes: [
      {
        serie: 'Arrow',
        season: 3,
        episode: 10,
        'episode-name': 'Left Behind',
        published: '2015-01-21',
        watched: false,
      }, {
        serie: 'Game of Thrones',
        season: 7,
        episode: 4,
        'episode-name': 'The Spoils of War',
        published: '2017-08-06',
        watched: false,
      }, {
        serie: 'Stranger Things',
        season: 2,
        episode: 5,
        'episode-name': 'Dig Dug',
        published: '2017-10-27',
        watched: false,
      }
    ]
  }),
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark ? 'light' : 'dark'
    }
  },
  computed: {
    ...mapState(useAppStore, ['getUser'])
  }
}

</script>
