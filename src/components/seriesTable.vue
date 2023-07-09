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
            hint="Filter nach Serien"
            item-title="name"
            item-value="value"
            label="Serien"
            multiple
            persistent-hint
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="activeFilters.watched"
            :items="filters.watched"
            chips
            class="ma-2"
            hint="Filter nach (un-)gesehenen Serien"
            item-title="name"
            item-value="value"
            label="Status"
            multiple
            persistent-hint
          ></v-select>
        </v-col>
        <v-col cols="6">
          {{
            `
            Serien: ${uniqueSeries.size}
            Episoden: ${episodes.length}
            Gesehen: ${episodes.filter((ep) => ep.watched).length}
            `
          }}
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
  <!-- :sort-by="[{ key: 'published', order: 'asc' }]" -->
  <v-data-table-virtual
    :headers="headers"
    :items="filtered"
    class="elevation-1"
    height="400"
  >
    <template v-slot:[`item.watched`]="{ item, index }">
      <v-checkbox-btn
        v-model="item.columns.watched"
        @click="updateEntry(item, index)"
      ></v-checkbox-btn>
    </template>
    <template v-slot:[`item.published`]="{ item }">
      {{ formatDate(item.columns.published) }}
    </template>
  </v-data-table-virtual>
</template>
<script>
import {mapActions, mapStores} from "pinia";
import {useAppStore} from "@/store/app";

export default {
  data: () => ({
    sortBy: {
      "key": "season",
      "order": "asc"
    },
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
        serie: 'Arrow',
        season: 2,
        episode: 1,
        'episode-name': 'Left Behind',
        published: '2014-01-21',
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
    ],
    filters: {
      series: ['Arrow', 'Game of Thrones', 'Stranger Things'],
      watched: [
        {name: "Gesehen", value: true},
        {name: "Nicht Gesehen", value: false}
      ]
    },
    activeFilters: {
      series: ['Arrow', 'Game of Thrones', 'Stranger Things'],
      watched: [true, false]
    }
  }),
  computed: {
    ...mapStores(useAppStore, useAppStore),
    filtered() {
      return this.episodes.filter((ep) => {
        return this.activeFilters.series.includes(ep.serie) &&
          this.activeFilters.watched.includes(ep.watched)
      })
    },
    uniqueSeries() {
      const uniques = new Set();
      this.episodes.forEach((ep) => {
        uniques.add(ep.serie)
      })
      return uniques
    }
  },
  methods: {
    ...mapActions(useAppStore, ['updateWatchedState']),
    formatDate(date) {
      const fDate = new Date(date);
      const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
      return fDate.toLocaleDateString("de-DE", options);
    },
    updateEntry(item, index) {
      console.log(index, item, item.columns, !item.columns.watched)
      this.episodes[index].watched = !item.columns.watched
      this.updateWatchedState(item.columns)
    },
  },
}
</script>
