<template>
    <v-dialog
        v-model="showLoginDialog"
        :persistent="false"
        max-width="50%"
        min-width="25%"
        width="500px"
    >
        <v-card>
            <v-tabs v-model="tab" bg-color="primary" grow>
                <v-tab value="login">Login</v-tab>
                <v-tab value="register">Register</v-tab>
            </v-tabs>

            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="login"> </v-window-item>

                    <v-window-item value="register"> </v-window-item>
                </v-window>

                <userForm
                    :method="tab"
                    @changeTab="(method) => (this.tab = method)"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'pinia'

import authForm from '@/components/userAuth/authForm.vue'
import useAppStore from '@/store/app'

export default {
    name: 'UserAuth',
    components: {
        userForm: authForm,
    },
    data: () => ({
        tab: 'login',
    }),
    methods: {
        //
    },
    computed: {
        ...mapState(useAppStore, ['loginDialog']),
        showLoginDialog: {
            get() {
                return this.loginDialog
            },
            set(value) {
                useAppStore().loginDialog = value
            },
        },
    },
}
</script>

<style scoped></style>
