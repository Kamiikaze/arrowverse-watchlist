<template>
  <v-form
    v-model="form"
    class="pa-4"
    @submit.prevent
  >
    <div class="text-subtitle-1 text-medium-emphasis">Account</div>
    <v-text-field
      v-model="userAuth.email"
      :rules="[rules.required, rules.email]"
      clearable
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
    ></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
      Password
      <a
        v-if="method === 'login'"
        class="text-caption text-decoration-none text-blue"
        href="#"
        rel="noopener noreferrer"
        target="_blank"
      >Forgot login password?</a>
    </div>
    <v-text-field
      v-model="userAuth.pw"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :rules="[rules.required, rules.pwMinLength, rules.strongPw]"
      :type="visible ? 'text' : 'password'"
      clearable
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
    ></v-text-field>

    <div v-if="method === 'register'"
         class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
      Confirm Password
    </div>
    <v-text-field
      v-if="method === 'register'"
      v-model="userAuth.pwconfirm"
      :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
      :rules="[passwordMatch]"
      :type="visible2 ? 'text' : 'password'"
      clearable
      density="compact"
      placeholder="Confirm your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible2 = !visible2"
    ></v-text-field>

    <v-card
      v-if="method === 'login'"
      class="mb-12"
      color="surface-variant"
      variant="tonal"
    >
      <v-card-text class="text-medium-emphasis text-caption">
        Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If
        you must login now, you can also click "Forgot login password?" to reset the login password.
      </v-card-text>
    </v-card>

    <br>

    <v-btn
      :disabled="!form"
      block
      color="success"
      size="large"
      type="submit"
      variant="elevated"
    >
      Sign In
    </v-btn>
  </v-form>
</template>

<script>
export default {
  props: {
    method: String
  },
  data: () => ({
    form: false,
    visible: false,
    visible2: false,
    userAuth: {
      email: "",
      pw: "",
      pwconfirm: ""
    },
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      pwMinLength: value => value.length >= 8 || 'Min 8 characters',
      strongPw: value => {
        const symbolRegex = /[!@#$%^&*()\-=_+[\]{};':"\\|,.<>/?]/;
        const digitRegex = /\d/;
        const letterRegex = /[a-zA-Z]/;

        const hasSymbol = symbolRegex.test(value);
        const hasDigit = digitRegex.test(value);
        const hasLetter = letterRegex.test(value);

        return hasSymbol && hasDigit && hasLetter;
      },
      email: value => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
        return pattern.test(value) || 'Invalid e-mail.'
      },
    },
  }),
  methods: {
    //
  },
  computed: {
    passwordMatch() {
      return this.userAuth.pw === this.userAuth.pwconfirm || 'Passwords no dot match'
    }
  }
}
</script>

<style scoped>

</style>
