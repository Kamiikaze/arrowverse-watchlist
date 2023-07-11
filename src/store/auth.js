import {defineStore} from 'pinia'
import {auth} from "@/plugins/firebase";
import {createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword} from "firebase/auth";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    alert: null,
  }),

  actions: {
    pushAlert(type, message, code) {
      this.alert = {
        type: type,
        message: message,
        code: code
      }
    },
    registerUser(email, password) {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("User registered successfully", userCredential.user)
          // Check if email is verified
          if (!userCredential.user.emailVerified) {
            // Send verification email
            this.sendVerificationEmail(userCredential.user)
              .then((res) => {
                // Email sent
                console.log("Verification email sent", res)
                this.pushAlert("success", "Account created successfully. Please verify your email address.")
              })
          }
        })
        .catch((error) => {
          this.pushAlert("error", error.message, error.code)
        });
    },
    sendVerificationEmail() {
      console.log("Sending verification email to", auth.currentUser)
      this.logoutUser()
      return sendEmailVerification(auth.currentUser)
    },
    loginUser(email, password) {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Temporary save user
          const fbUser = userCredential.user;
          auth.currentUser = fbUser

          // Check if email is verified
          if (!userCredential.user.emailVerified) {
            this.pushAlert("warning", "Please verify your email address.", "auth/email-not-verified")
            this.logoutUser()
            return false
          } else {
            // Signed in
            this.user = fbUser
            console.log("User logged in successfully")
            return true
          }
        })
        .catch((error) => {
          this.pushAlert("error", error.message, error.code)
          return false
        });
    },
    logoutUser() {
      auth.signOut()
        .then(() => {
          // Sign-out successful.
          this.user = null
        })
        .catch((error) => {
          // An error happened.
          console.log(error)
        });
    }
  },

  getters: {
    isLoggedIn(state) {
      return state.user !== null
    },
    getUser(state) {
      return state.user
    },
  }
})
