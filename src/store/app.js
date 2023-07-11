// Utilities
import {defineStore} from 'pinia'

import importedEpisodes from "@/assets/episodes.json";

export const useAppStore = defineStore('app', {
  state: () => ({
    watchlist: [{"id": "1412-1-1", "seenAt": 1689010084429}],
    user: null,
    loginDialog: false,
    providerIDs: [
      {
        1412: [{
          name: "Amazon",
          id: "B00J9KCA5K",
        }, {
          name: "Netflix",
          id: "70242081",
        }, {
          name: "Sto",
          id: "arrow",
        }
        ],
        62643: [{
          name: "Amazon",
          id: "B00J9KCA5K",
        }, {
          name: "Sto",
          id: "arrow",
        }
        ]
      }
    ]

  }),

  actions: {
    updateWatchedState(item) {
      const watchedItem = {
        id: item.raw.id,
        seenAt: Date.now(),
      }
      console.log(watchedItem)

      if (this.findItemInWatchlist(watchedItem) === undefined) {
        this.watchlist.push(watchedItem)
      } else {
        this.removeItemFromWatchlist(watchedItem)
      }
    },
    findItemInWatchlist(item) {
      return this.watchlist.find((wli) =>
        wli.id === item.id
      )
    },
    removeItemFromWatchlist(item) {
      const index = this.watchlist.findIndex((wli) =>
        wli.id === item.id
      )
      this.watchlist.splice(index, 1)
    },
    openDialog() {
      this.loginDialog = true
    },
    getProviderList(id) {
      const parsedId = id.split("-")[0];

      const providerList = this.providerIDs.find((series) => {
        return series[parsedId] !== undefined;
      });

      if (providerList) {
        return providerList[parsedId];
      } else {
        return [];
      }
    },
    getProviderUrl({id, name, season, episode}, provider) {
      const parsedId = id.split("-")[0]
      const stoName = name.replace(/ /g, "-").replace(/:/g, "").replace(/,/g, "").replace(/!/g, "").replace(/'/g, "").replace(/&/g, "").replace(/ö/g, "oe").replace(/ä/g, "ae").replace(/ü/g, "ue").replace(/ß/g, "ss").toLowerCase()
      console.log(parsedId, name, season, episode, provider)

      switch (provider) {
        case "Amazon":
          return `https://www.amazon.de/gp/video/detail/${id}/ref=atv_dp_season_select_s${season}`
        case "Netflix":
          return `https://www.netflix.com/title/${parsedId}`
        case "Sto":
          return `https://www.s.to/serie/stream/${stoName}/staffel-${season}/episode-${episode}`
        default:
          return null
      }
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.user !== null
    },
    getUser(state) {
      return state.user
    },
    getWatchlist(state) {
      return state.watchlist
    },
    getEpisodes() {
      return importedEpisodes
    },
    getProviderIDs(state) {
      return state.providerIDs
    },
  },
})
