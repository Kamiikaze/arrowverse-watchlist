<template>
    <v-app>
        <app-bar />
        <v-main>
            <user-auth />
            <series-table />
            <p>
                Icons by <a href="https://icons8.com" target="_blank">Icons8</a>
            </p>
        </v-main>
    </v-app>
</template>

<script setup>
import { onAuthStateChanged } from 'firebase/auth'
import { doc } from 'firebase/firestore'
import useAppStore from '@/store/app'
import useAuthStore from '@/store/auth'

import {
    docRef,
    fbAuth,
    usersCollection,
    watchlistsCollection,
} from '@/plugins/firebase'

import SeriesTable from '@/components/seriesTable.vue'
import AppBar from '@/components/appBar.vue'
import UserAuth from '@/components/userAuth/index.vue'

const appStore = useAppStore()
const authStore = useAuthStore()

const browserLanguage = navigator.language || navigator.userLanguage
appStore.setAppLanguage(browserLanguage)
console.log('Set App Language to:', browserLanguage)

onAuthStateChanged(fbAuth, async (user) => {
    if (user) {
        fbAuth.useDeviceLanguage()
        authStore.user = user

        docRef.user = doc(usersCollection, fbAuth.currentUser.uid)
        docRef.watchlist = doc(watchlistsCollection, fbAuth.currentUser.uid)

        await appStore.fetchWatchlist()

        appStore.isReady = true
        console.log('User logged in: ', user)
    } else {
        // User is signed out
        console.log('User logged out')
        authStore.user = null
        appStore.watchlist = []
    }
})
</script>
