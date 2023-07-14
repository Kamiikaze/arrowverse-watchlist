<template>
    <v-app-bar>
        <v-app-bar-title>Arrowverse-Watchlist</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-menu :open-on-click="isLoggedIn">
            <template v-slot:activator="{ props }">
                <v-btn v-if="isLoggedIn" v-bind="props">
                    {{ getUser.displayName || getUser.email.split('@')[0] }}
                    <v-icon class="ml-2" size="24">mdi-account</v-icon>
                </v-btn>
                <v-btn v-else @click="toggleDialog">
                    {{ 'Login' }}
                    <v-icon class="ml-2" size="24">mdi-account</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item value="#">
                    <template v-slot:prepend>
                        <v-icon class="mr-4" icon="mdi-cog"></v-icon>
                    </template>
                    <v-list-item-title>{{ 'Account' }}</v-list-item-title>
                </v-list-item>

                <v-list-item link @click="logoutUser">
                    <template v-slot:prepend>
                        <v-icon class="mr-4" icon="mdi-logout"></v-icon>
                    </template>
                    <v-list-item-title>{{ 'Logout' }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-btn icon @click="toggleTheme">
            <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import useAppStore from '@/store/app'
import useAuthStore from '@/store/auth'

export default {
    data: () => ({
        headers: [
            { title: 'Serie', align: 'start', key: 'serie' },
            { title: 'Staffel', align: 'start', key: 'season' },
            { title: 'Episode', align: 'start', key: 'episode' },
            { title: 'Episode Name', align: 'start', key: 'episode-name' },
            { title: 'Veröffentlicht', align: 'start', key: 'published' },
            { title: 'Gesehen', key: 'watched' },
        ],
    }),
    methods: {
        ...mapActions(useAppStore, ['toggleDialog']),
        ...mapActions(useAuthStore, ['logoutUser']),
        toggleTheme() {
            this.$vuetify.theme.global.name = this.$vuetify.theme.global.current
                .dark
                ? 'light'
                : 'dark'
        },
    },
    computed: {
        ...mapState(useAuthStore, ['getUser', 'isLoggedIn']),
    },
}
</script>
