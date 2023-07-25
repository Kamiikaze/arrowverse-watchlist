<template>
    <v-app>
        <app-bar />
        <v-main v-if="!appStore.isReady">
            <v-progress-linear
                v-model="progress.value"
                bg-color="pink-lighten-3"
                color="pink-lighten-1"
                stream
            ></v-progress-linear>
            <p class="ma-auto" style="width: fit-content">
                {{ progress.text }}
            </p>
        </v-main>
        <v-main v-else>
            <v-alert
                v-if="isLoggedIn"
                type="info"
                closable
                density="compact"
                class="my-2 mx-1"
            >
                <v-alert-text>
                    Create a <u><b>free Account</b></u
                    >, to save your Filters, open Episodes on your Streaming
                    Service, <u><b>enable Watchlist</b></u> Feature and more
                    comming soon!
                </v-alert-text>
            </v-alert>
            <user-auth />
            <series-table />
        </v-main>
        <v-footer app elevation="4">
            <v-row class="text-subtitle-2">
                <v-col>
                    <span>
                        Refreshed:
                        {{ getRelativeTime(showsUpdatedAt) }}
                    </span>
                </v-col>
                <v-col></v-col>
                <v-col class="text-right">
                    <a
                        v-if="browserLanguage === 'de-DE'"
                        href="/privacy-de.html"
                        target="_blank"
                    >
                        Datenschutzerklärung
                    </a>
                    <a v-else href="/privacy-en.html" target="_blank">
                        Privacy Policy
                    </a>
                </v-col>
                <v-col class="text-right">
                    <span>
                        Provider-Icons by
                        <a href="https://icons8.com" target="_blank">
                            Icons8
                        </a>
                    </span>
                </v-col>
            </v-row>
        </v-footer>
    </v-app>
</template>

<script setup>
import { onAuthStateChanged } from 'firebase/auth'
import { doc } from 'firebase/firestore'
import { useTheme } from 'vuetify'
import { ref } from 'vue'
import useAppStore from '@/store/app'
import useAuthStore from '@/store/auth'

import {
    docRef,
    fbAuth,
    showsCollection,
    usersCollection,
    watchlistsCollection,
} from '@/plugins/firebase.ts'
import AppBar from '@/components/appBar.vue'
import UserAuth from '@/components/userAuth/index.vue'
import SeriesTable from '@/components/seriesTable.vue'
import { getRelativeTime } from '@/lib/utils.js'

const progress = ref({ value: 0, text: 'Loading Stores..' })

const appStore = useAppStore()
const authStore = useAuthStore()

const { isLoggedIn } = authStore
let showsUpdatedAt

progress.value = { value: 20, text: 'Loading Vuetify..' }

const theme = useTheme()

progress.value = { value: 30, text: 'Defining App Language..' }

const browserLanguage = navigator.language || navigator.userLanguage
appStore.setAppLanguage(browserLanguage)
console.log('Set App Language to:', browserLanguage)

progress.value = { value: 40, text: 'Checking User Authentication..' }

docRef.shows = doc(showsCollection, 'allShows')

onAuthStateChanged(fbAuth, async (user) => {
    if (user) {
        progress.value = { value: 50, text: 'Loggin in User..' }
        authStore.user = user
        fbAuth.useDeviceLanguage()

        docRef.user = doc(usersCollection, fbAuth.currentUser.uid)
        docRef.watchlist = doc(watchlistsCollection, fbAuth.currentUser.uid)

        progress.value = { value: 55, text: 'Loading additional Userdata..' }

        await authStore.fetchAdditionalUserData()
        theme.global.name.value = authStore.user.settings.theme

        progress.value = { value: 65, text: 'Fetching Watchlist..' }

        await appStore.fetchWatchlist()

        progress.value = { value: 80, text: 'Fetching Shows and Episodes..' }

        await appStore.fetchShows()
        showsUpdatedAt = appStore.showsUpdatedAt

        progress.value = { value: 100, text: 'Ready! Starting App..' }

        appStore.isReady = true
        console.log('User logged in: ', user)
    } else {
        // User is signed out
        console.log('User not logged in.')
        authStore.user = null
        appStore.watchlist = []
        progress.value = { value: 50, text: 'Fetching Shows and Episodes..' }
        await appStore.fetchShows()
        showsUpdatedAt = appStore.showsUpdatedAt

        progress.value = { value: 100, text: 'Ready! Starting App..' }

        appStore.isReady = true
    }
})
</script>

<style lang="sass">
@import '../node_modules/@fontsource/roboto/index.css'
</style>
