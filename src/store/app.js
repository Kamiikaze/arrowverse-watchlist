// Utilities
import {defineStore} from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    watchlist: [],
    user: {
      name: "",
      email: ""
    }
  }),

  actions: {
    updateWatchedState(item) {
      const watchedItem = {
        serie: item.serie,
        season: item.season,
        episode: item.episode
      }

      if (!item.watched) {
        this.watchlist.push(item)
      } else {
        this.removeItemFromWatchlist(watchedItem)
      }

    },
    findItemInWatchlist(item) {
      return this.watchlist.find((wli) =>
        wli.serie === item.serie &&
        wli.season === item.season &&
        wli.episode === item.episode
      )
    },
    removeItemFromWatchlist(item) {
      const index = this.watchlist.findIndex((wli) =>
        wli.serie === item.serie &&
        wli.season === item.season &&
        wli.episode === item.episode
      );

      if (index !== -1) {
        this.watchlist.splice(index, 1);
      }
    }
  },
  getters: {
    getUser(state) {
      return state.user
    }
  }
})
