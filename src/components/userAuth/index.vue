<template>
  <v-dialog
    v-model="dialog"
    :persistent="false"
    max-width="50%"
    min-width="25%"
    width="500px"
  >
    <v-card>
      <v-tabs
        v-model="tab"
        bg-color="primary"
        grow
      >
        <v-tab value="login">Login</v-tab>
        <v-tab value="register">Register</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="login">
          </v-window-item>

          <v-window-item value="register">
          </v-window-item>
        </v-window>

        <userForm :method="tab"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import authForm from "@/components/userAuth/authForm.vue";

export default {
  name: "UserAuth",
  components: {
    userForm: authForm
  },
  data: () => ({
    dialog: true,
    tab: null,
  }),
  methods: {
    //
  },
  computed: {
    //
  }
}
</script>

<style scoped>

</style>
