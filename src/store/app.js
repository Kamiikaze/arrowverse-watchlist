import { defineStore } from 'pinia'
import { arrayRemove, arrayUnion, getDoc, updateDoc } from 'firebase/firestore'
import importedShows from '@/assets/episodes.json'
import { docRef } from '@/plugins/firebase.ts'

const useAppStore = defineStore('app', {
    state: () => ({
        watchlist: [],
        filters: {
            series: [],
            watched: null,
            itemsPerPage: 10,
            sortByOrder: 'asc',
        },
        isReady: false,
        loginDialog: false,
        language: 'en-US',
        // const series = [
        //     {id: 1412, name: "Arrow"},
        //     {id: 60735, name: "The Flash"},
        //     {id: 62688, name: "Supergirl"},
        //     {id: 62643, name: "Legends of Tomorrow"},
        //     {id: 89247, name: "Batwoman"},
        //     {id: 71663, name: "Black Lightning"},
        //     {id: 80986, name: "Stargirl"},
        //     {id: 95057, name: "Superman & Lois"}
        // ]
        providerIDs: [
            {
                1412: [
                    {
                        name: 'Amazon',
                        id: 'B00J9KCA5K',
                    },
                    {
                        name: 'Netflix',
                        id: '70242081',
                    },
                    {
                        name: 'Sto',
                        id: 'arrow',
                    },
                ],
                60735: [
                    {
                        name: 'Amazon',
                        id: 'B00TFWOFNC',
                    },
                    {
                        name: 'Sto',
                        id: 'the-flash',
                    },
                ],
                62688: [
                    {
                        name: 'Amazon',
                        id: 'B01D0GA24O',
                    },
                    {
                        name: 'Netflix',
                        id: '80065386',
                    },
                    {
                        name: 'Sto',
                        id: 'supergirl',
                    },
                ],
                62643: [
                    {
                        name: 'Amazon',
                        id: 'B01L2E3AOA',
                    },
                    {
                        name: 'Sto',
                        id: 'dcs-legends-of-tomorrow',
                    },
                ],
                89247: [
                    {
                        name: 'Amazon',
                        id: 'B082RQXYW1',
                    },
                    {
                        name: 'Sto',
                        id: 'batwoman',
                    },
                ],
                71663: [
                    {
                        name: 'Amazon',
                        id: 'B07STXV5SK',
                    },
                    {
                        name: 'Netflix',
                        id: '80178687',
                    },
                    {
                        name: 'Sto',
                        id: 'black-lightning',
                    },
                ],
                80986: [
                    {
                        name: 'Amazon',
                        id: 'B09237W1X7',
                    },
                    {
                        name: 'Sto',
                        id: 'stargirl',
                    },
                ],
                95057: [
                    {
                        name: 'Amazon',
                        id: 'B0B5N8RP62',
                    },
                    {
                        name: 'Sto',
                        id: 'superman-lois',
                    },
                ],
            },
        ],
        shows: [],
        episodeList: [],
        showsUpdatedAt: null,
    }),

    actions: {
        setAppLanguage(language) {
            this.language = language
        },
        updateWatchlistFilters(filters) {
            console.log('Updating filters', filters)
            updateDoc(docRef.watchlist, {
                filters,
            })
        },
        async updateWatchedState(item, filter) {
            // Create a new object with the id and the current timestamp
            const watchedItem = {
                lid: item.raw.lid,
                seenAt: Date.now(),
            }
            console.log(watchedItem, filter)

            // Fetch the current watchlist
            const watchlistData = await this.fetchWatchlist()

            // Check if the item is already in the watchlist
            const existingItemIndex = watchlistData.findIndex(
                (wli) => wli.lid === watchedItem.lid
            )

            if (existingItemIndex === -1) {
                // If the item is not found in the watchlist, add it
                this.watchlist.push(watchedItem)
                await updateDoc(docRef.watchlist, {
                    list: arrayUnion(watchedItem),
                    filters: filter,
                })
            } else {
                // If the item is found in the watchlist, remove it
                await updateDoc(docRef.watchlist, {
                    list: arrayRemove(watchlistData[existingItemIndex]),
                    filters: filter,
                }).catch((error) => {
                    console.error('Error removing document: ', error)
                })
                this.removeItemFromWatchlist(watchedItem)
            }
        },
        async fetchWatchlist() {
            const userWatchlistDoc = await getDoc(docRef.watchlist)
            const watchlistData = userWatchlistDoc.data()
            this.watchlist = watchlistData.list
            this.filters = watchlistData.filters
            return watchlistData.list
        },
        findItemInWatchlist(lid) {
            return this.watchlist.find((wli) => wli.lid === lid)
        },
        removeItemFromWatchlist(item) {
            const index = this.watchlist.findIndex(
                (wli) => wli.lid === item.lid
            )
            this.watchlist.splice(index, 1)
        },
        toggleDialog() {
            this.loginDialog = !this.loginDialog
        },
        getProviderList(id) {
            const parsedId = id.split('-')[0]

            const providerList = this.providerIDs.find((series) => {
                return series[parsedId] !== undefined
            })

            if (providerList) {
                return providerList[parsedId]
            }
            return []
        },
        getProviderUrl({ id, name, season, episode }, provider) {
            const parsedId = id.split('-')[0]
            const stoName = name
                .replace(/ /g, '-')
                .replace(/:/g, '')
                .replace(/,/g, '')
                .replace(/!/g, '')
                .replace(/'/g, '')
                .replace(/&/g, '')
                .replace(/ö/g, 'oe')
                .replace(/ä/g, 'ae')
                .replace(/ü/g, 'ue')
                .replace(/ß/g, 'ss')
                .toLowerCase()
            console.log(parsedId, name, season, episode, provider)

            switch (provider) {
                case 'Amazon':
                    return `https://amazon.de/gp/video/detail/${id}/ref=atv_dp_season_select_s${season}`
                case 'Netflix':
                    return `https://netflix.com/title/${parsedId}`
                case 'Sto':
                    return `https://s.to/serie/stream/${stoName}/staffel-${season}/episode-${episode}`
                default:
                    return null
            }
        },
        async fetchShows() {
            if (import.meta.env.DEV) {
                console.log('Running in dev mode, using mock data')
                this.shows = importedShows.data
                this.showsUpdatedAt = importedShows.updatedAt
            } else {
                console.log('Running in production mode, fetching data')
                const showsData = await getDoc(docRef.shows)
                console.log('Fetched shows data', showsData.data())
                this.shows = showsData.data().data
                this.showsUpdatedAt = new Date(
                    showsData.data().updatedAt.seconds * 1000
                )
                console.log('Fetched shows', this.shows.length)
            }
            this.fetchEpisodes()
        },
        fetchEpisodes() {
            console.log('Fetching episodes')
            const episodeList = this.shows.map((show) => {
                return show.raw.seasons.map((season) => {
                    return season.episodes.map((episode) => {
                        const lid = `${show.raw.id}-${season.season_number}-${episode.episode_number}`
                        const watched = this.findItemInWatchlist(lid)
                        return {
                            ...episode,
                            lid,
                            show: show.raw.name,
                            season_number: season.season_number,
                            watched: !!watched,
                            seenAt: watched?.seenAt,
                            providers: this.getProviderList(lid),
                        }
                    })
                })
            })

            // Array of all episodes from all seasons of all shows
            const flatEpisodeList = episodeList.flat(3)
            // Array of all episodes from all seasons of all shows, sorted by airdate
            const sortedEpisodeList = flatEpisodeList
                .filter((episode) => episode.season_number !== 0)
                .sort((a, b) => {
                    return a.air_date.localeCompare(b.air_date)
                })
            this.episodeList = sortedEpisodeList
            console.log('Fetched episodes', this.episodeList.length)
            return sortedEpisodeList
        },
    },
    getters: {
        getWatchlist(state) {
            return state.watchlist
        },
        getEpisodes(state) {
            return state.episodeList
        },
        getProviderIDs(state) {
            return state.providerIDs
        },
        getFilters(state) {
            return state.filters
        },
    },
})

export default useAppStore
