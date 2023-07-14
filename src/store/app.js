import { acceptHMRUpdate, defineStore } from 'pinia'
import { arrayRemove, arrayUnion, getDoc, updateDoc } from 'firebase/firestore'
import importedEpisodes from '@/assets/episodes.json'
import { docRef } from '@/plugins/firebase'

const useAppStore = defineStore('app', {
    state: () => ({
        watchlist: [],
        filters: {
            series: [],
            watched: null,
            itemsPerPage: 10,
        },
        showsData: null,
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
                id: item.raw.id,
                seenAt: Date.now(),
            }
            console.log(watchedItem, filter)

            // Fetch the current watchlist
            const watchlistData = await this.fetchWatchlist()

            // Check if the item is already in the watchlist
            const existingItemIndex = watchlistData.findIndex(
                (wli) => wli.id === watchedItem.id
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
                this.removeItemFromWatchlist(watchedItem)
                await updateDoc(docRef.watchlist, {
                    list: arrayRemove(watchlistData[existingItemIndex]),
                    filters: filter,
                })
            }
        },
        async fetchWatchlist() {
            const userWatchlistDoc = await getDoc(docRef.watchlist)
            const watchlistData = userWatchlistDoc.data()
            this.watchlist = watchlistData.list
            this.filters = watchlistData.filters
            return watchlistData.list
        },
        findItemInWatchlist(item) {
            return this.watchlist.find((wli) => wli.id === item.id)
        },
        removeItemFromWatchlist(item) {
            const index = this.watchlist.findIndex((wli) => wli.id === item.id)
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
                    return `https://www.amazon.de/gp/video/detail/${id}/ref=atv_dp_season_select_s${season}`
                case 'Netflix':
                    return `https://www.netflix.com/title/${parsedId}`
                case 'Sto':
                    return `https://www.s.to/serie/stream/${stoName}/staffel-${season}/episode-${episode}`
                default:
                    return null
            }
        },
    },
    getters: {
        getWatchlist(state) {
            return state.watchlist
        },
        getEpisodes() {
            return importedEpisodes.map((ep) => {
                const watched = this.findItemInWatchlist(ep)
                return {
                    ...ep,
                    watched: !!watched,
                    seenAt: watched?.seenAt,
                    providers: this.getProviderList(
                        `${ep.id}-${ep.season}-${ep.episode}`
                    ),
                }
            })
        },
        getProviderIDs(state) {
            return state.providerIDs
        },
        getFilters(state) {
            return state.filters
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}

export default useAppStore
