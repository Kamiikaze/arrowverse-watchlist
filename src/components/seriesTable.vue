<template>
  <v-card>
    <v-card-item class="">
      <v-row>
        <v-col cols="3">
          <v-select
            v-model="activeFilters.series"
            :items="filters.series"
            chips
            class="ma-2 ml-0"
            hint="Select Series to show"
            item-title="name"
            item-value="value"
            label="Series"
            multiple
            persistent-hint
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="activeFilters.watched"
            :items="filters.watched"
            class="ma-2"
            clearable
            hint="Filter by Seen-State"
            item-title="name"
            item-value="value"
            label="Status"
            persistent-hint
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-combobox
            v-model="activeFilters.itemsPerPage"
            :items="[10,25, 50, 100, 'All']"
            class="ma-2"
            hint="Episodes per Page"
            label="Episodes per Page"
            persistent-hint
            variant="outlined"
          ></v-combobox>
        </v-col>
        <v-col cols="5">
          <v-card elevation="0">
            <v-card-item>
              <v-card-title>Stats</v-card-title>
              <v-card-subtitle>&nbsp;</v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <v-row class="mt-n4">
                <v-col cols="4 text-center font-weight-bold">Series Stats</v-col>
                
                <v-col cols="4 text-center font-weight-bold">Watchtime</v-col>
              </v-row>
              <v-row class="mt-n4">
                <v-col cols="2">Series</v-col>
                <v-col cols="2 text-right">{{ uniqueSeries.length }}</v-col>
                <v-divider vertical></v-divider>
                <v-col cols="2">Avg.</v-col>
                <v-col cols="2 text-right">{{ "42 m" }}</v-col>
              </v-row>
              <v-row class="mt-n4">
                <v-col cols="2">Episodes</v-col>
                <v-col cols="2 text-right">{{ episodes.length }}</v-col>
                <v-divider vertical></v-divider>
                <v-col cols="2">Total</v-col>
                <v-col cols="2 text-right">{{ ((episodes.length * 42) / 60) + " h" }}</v-col>
              </v-row>
              <v-row class="mt-n4">
                <v-col cols="2">Watched</v-col>
                <v-col cols="2 text-right">{{ watchlist.length }}</v-col>
                <v-divider vertical></v-divider>
                <v-col cols="2">Seen</v-col>
                <v-col cols="2 text-right">{{ ((watchlist.length * 42) / 60) + " h" }}</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
  <v-data-table
    v-if="episodes.length > 0"
    :headers="headers"
    :items="filtered"
    :items-per-page="activeFilters.itemsPerPage"
    :loading="false"
    :sort-by="[{ key: 'air_date', order: 'asc' }]"
    class="elevation-1"
    fixed-header
  >
    <template v-slot:[`item.watched`]="{ item }">
      <v-checkbox-btn
        v-model="item.raw.watched"
        class="justify-center"
        @click="updateEntry(item)"
      >
        <v-tooltip
          v-if="item.raw.watched"
          activator="parent"
          location="bottom"
        >{{ 'Seen at: ' + formatDate(item.raw.seenAt, true) }}
        </v-tooltip>
      </v-checkbox-btn>
    </template>
    <template v-slot:[`item.air_date`]="{ item }">
      {{ formatDate(item.columns.air_date) }}
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      {{

      }}
      <v-btn-group>
        <v-card
          v-for="(provider, index) in item.raw.providers"
          :key="index"
          class="d-flex justify-center align-center flex-row"
          elevation="0"

        >
          <v-btn
            class="ma-1"
            density="compact"
            icon
            small
            target="_blank"
            @click="openUrl(item, provider); updateEntry(item)"
          >
            <v-img
              :src="`/src/assets/${provider.name}_icon.svg`"
              height="24"
              width="24"
            ></v-img>
          </v-btn>
          <v-tooltip
            activator="parent"
            location="bottom"
          >Watch on {{ provider.name }}
          </v-tooltip>
        </v-card>
      </v-btn-group>
    </template>
  </v-data-table>
</template>
<script>
import {useAppStore} from "@/store/app";
import {mapActions, mapState, mapStores} from "pinia";

export default {
  data: () => ({
    sortBy: {
      "key": "season",
      "order": "asc"
    },
    headers: [
      {title: 'Serie', align: 'start', key: 'serie', width: '200px', sortable: false},
      {title: 'Season', align: 'center', key: 'season', width: '50px', sortable: false},
      {title: 'Episode', align: 'center', key: 'episode', width: '50px', sortable: false},
      {title: 'Episode Name', align: 'start', key: 'title', sortable: false},
      {title: 'Aired', align: 'start', key: 'air_date', width: '150px'},
      {title: 'Seen', align: 'center', key: 'watched', width: '50px', sortable: false},
      {title: 'Watch Now', align: 'start', key: 'actions', width: '150px', sortable: false},
    ],
    activeFilters: {
      series: [],
      watched: null,
      itemsPerPage: 10
    }
  }),
  methods: {
    ...mapActions(useAppStore, ['updateWatchedState', 'getProviderList', 'getProviderUrl']),
    formatDate(date, showTime = false) {
      const fDate = new Date(date);
      const options = {day: '2-digit', month: '2-digit', year: 'numeric'};

      if (showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }

      return fDate.toLocaleDateString("de-DE", options);
    },
    updateEntry(item) {
      this.updateWatchedState(item)
    },
    getWatchedState(item) {
      const episode = this.watchlist.find((ep) => {
        return ep.id === item.id
      })
      return episode

    },
    openUrl(item, provider) {
      console.log(item.raw, provider)
      const providerUrl = this.getProviderUrl({
        id: item.raw.id,
        name: item.raw.serie,
        season: item.raw.season,
        episode: item.raw.episode
      }, provider.name)
      console.log(providerUrl)

      // window.open(providerUrl, '_blank')
    }
  },
  computed: {
    ...mapStores(useAppStore, useAppStore),
    ...mapState(useAppStore, {
      episodes: 'getEpisodes',
      watchlist: 'getWatchlist'
    }),
    filters() {
      return {
        series: this.uniqueSeries,
        watched: [
          {name: "Seen", value: true},
          {name: "Unseen", value: false}
        ]
      }
    },
    filtered() {
      let filteredItems = this.episodes

      filteredItems.map((ep) => {
        const watchState = this.getWatchedState(ep)
        ep.watched = !!watchState
        ep.seenAt = watchState?.seenAt
        ep.providers = this.getProviderList(`${ep.id}-${ep.season}-${ep.episode}`)
        return ep
      })

      if (this.activeFilters.series.length > 0) {
        filteredItems = filteredItems.filter((ep) => {
          return this.activeFilters.series.includes(ep.serie)
        })
      }
      if (this.activeFilters.watched !== null) {
        filteredItems = filteredItems.filter((ep) => {
          return this.activeFilters.watched === ep.watched
        })
      }
      return filteredItems

    },
    uniqueSeries() {
      const uniques = new Set();
      this.episodes.forEach((ep) => {
        uniques.add(ep.serie)
      })
      return Array.from(uniques)
    }
  },
}
</script>
