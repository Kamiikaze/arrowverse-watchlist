<template>
    <v-sheet class="ma-4 pa-2" color="transparent">
        <v-expansion-panels>
            <v-expansion-panel elevation="2">
                <v-expansion-panel-title>Stats</v-expansion-panel-title>
                <v-expansion-panel-text class="py-4">
                    <v-row class="mt-n4">
                        <v-col cols="4 text-center font-weight-bold"
                            >Series Stats</v-col
                        >

                        <v-col cols="4 text-center font-weight-bold"
                            >Watchtime</v-col
                        >
                    </v-row>
                    <v-row class="mt-n4">
                        <v-col cols="2">Series</v-col>
                        <v-col cols="2 text-right">{{
                            uniqueSeries.length
                        }}</v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="2">Avg.</v-col>
                        <v-col cols="2 text-right">{{ '42 m' }}</v-col>
                    </v-row>
                    <v-row class="mt-n4">
                        <v-col cols="2">Episodes</v-col>
                        <v-col cols="2 text-right">{{ episodes.length }}</v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="2">Total</v-col>
                        <v-col cols="2 text-right">{{
                            (episodes.length * 42) / 60 + ' h'
                        }}</v-col>
                    </v-row>
                    <v-row class="mt-n4">
                        <v-col cols="2">Watched</v-col>
                        <v-col cols="2 text-right">{{
                            watchlist.length
                        }}</v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="2">Seen</v-col>
                        <v-col cols="2 text-right">{{
                            (watchlist.length * 42) / 60 + ' h'
                        }}</v-col>
                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-card
            class="v-col-7 d-flex flex-wrap flex-row align-start justify-space-evenly my-4 mx-auto px-0 py-2"
            elevation="2"
        >
            <v-select
                v-model="activeFilters.series"
                :items="filterValues.series"
                chips
                class="v-col-5"
                hint="Select Series to show"
                item-title="name"
                item-value="value"
                label="Series"
                multiple
                persistent-hint
                variant="outlined"
                @update:modelValue="updateFilters"
            ></v-select>
            <v-select
                v-model="activeFilters.watched"
                :items="filterValues.watched"
                class="v-col-3"
                clearable
                hint="Filter by Seen-State"
                item-title="name"
                item-value="value"
                label="Status"
                persistent-hint
                variant="outlined"
                @update:modelValue="updateFilters"
            ></v-select>
            <v-combobox
                v-model="activeFilters.itemsPerPage"
                :items="[10, 25, 50, 100, 'All']"
                class="v-col-3"
                hint="Episodes per Page"
                label="Episodes per Page"
                persistent-hint
                variant="outlined"
                @update:modelValue="updateFilters"
            ></v-combobox>
        </v-card>
        <v-data-table
            :headers="headers"
            :items="filteredItems"
            :items-per-page="activeFilters.itemsPerPage"
            :loading="waitForData"
            :sort-by="[{ key: 'air_date', order: 'asc' }]"
            class="rounded"
            elevation="2"
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
                            @click="openUrl(item, provider), updateEntry(item)"
                        >
                            <v-img
                                :src="`/src/assets/${provider.name}_icon.svg`"
                                height="24"
                                width="24"
                            ></v-img>
                        </v-btn>
                        <v-tooltip activator="parent" location="bottom"
                            >Watch on {{ provider.name }}
                        </v-tooltip>
                    </v-card>
                </v-btn-group>
            </template>
        </v-data-table>
    </v-sheet>
</template>
<script>
import { mapActions, mapState, mapStores } from 'pinia'
import useAppStore from '@/store/app'

export default {
    data: () => ({
        sortBy: {
            key: 'season',
            order: 'asc',
        },
        headers: [
            {
                title: 'Serie',
                align: 'start',
                key: 'serie',
                width: '200px',
                sortable: false,
            },
            {
                title: 'Season',
                align: 'center',
                key: 'season',
                width: '50px',
                sortable: false,
            },
            {
                title: 'Episode',
                align: 'center',
                key: 'episode',
                width: '50px',
                sortable: false,
            },
            {
                title: 'Episode Name',
                align: 'start',
                key: 'title',
                sortable: false,
            },
            { title: 'Aired', align: 'start', key: 'air_date', width: '150px' },
            {
                title: 'Seen',
                align: 'center',
                key: 'watched',
                width: '50px',
                sortable: false,
            },
            {
                title: 'Watch Now',
                align: 'start',
                key: 'actions',
                width: '150px',
                sortable: false,
            },
        ],
    }),
    methods: {
        ...mapActions(useAppStore, [
            'updateWatchedState',
            'getProviderList',
            'getProviderUrl',
            'updateWatchlistFilters',
        ]),
        formatDate(date, showTime = false) {
            const fDate = new Date(date)
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }

            if (showTime) {
                options.hour = '2-digit'
                options.minute = '2-digit'
            }

            return fDate.toLocaleDateString('de-DE', options)
        },
        updateFilters() {
            this.updateWatchlistFilters(this.activeFilters)
        },
        updateEntry(item) {
            this.updateWatchedState(item, this.activeFilters)
        },
        openUrl(item, provider) {
            console.log(item.raw, provider)
            const providerUrl = this.getProviderUrl(
                {
                    id: item.raw.id,
                    name: item.raw.serie,
                    season: item.raw.season,
                    episode: item.raw.episode,
                },
                provider.name
            )
            console.log(providerUrl)

            window.open(providerUrl, '_blank')
        },
    },
    computed: {
        ...mapStores(useAppStore, useAppStore),
        ...mapState(useAppStore, {
            episodes: 'getEpisodes',
            watchlist: 'getWatchlist',
            isReady: 'isReady',
            filters: 'getFilters',
        }),
        waitForData() {
            return !this.isReady
        },
        activeFilters: {
            get() {
                return this.filters
            },
            set(value) {
                this.updateFilters(value)
            },
        },
        filterValues() {
            return {
                series: this.uniqueSeries,
                watched: [
                    { name: 'Seen', value: true },
                    { name: 'Unseen', value: false },
                ],
            }
        },
        filteredItems() {
            if (!this.isReady) return []

            let filteredItems = this.episodes

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
            const uniques = new Set()
            this.episodes.forEach((ep) => {
                uniques.add(ep.serie)
            })
            return Array.from(uniques)
        },
    },
}
</script>
