import { acceptHMRUpdate, defineStore } from 'pinia'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import {
    docRef,
    fbAuth,
    usersCollection,
    watchlistsCollection,
} from '@/plugins/firebase'

// eslint-disable-next-line import/prefer-default-export
const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        alert: null,
    }),

    actions: {
        pushAlert(type, message, code) {
            this.alert = {
                type,
                message,
                code,
            }
        },
        async registerUser(email, password) {
            try {
                // Register user with Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(
                    fbAuth,
                    email,
                    password
                )

                console.log('User registered successfully', userCredential.user)

                // Check if email is verified
                if (!userCredential.user.emailVerified) {
                    // Send verification email
                    const sendMail = await this.sendVerificationEmail(
                        userCredential.user
                    )
                    if (sendMail) {
                        // Email sent
                        console.log('Verification email sent', sendMail)
                        this.pushAlert(
                            'success',
                            'Account created successfully. Please verify your email address.'
                        )
                    }
                }

                console.log('docref', docRef)

                // Create user document
                await setDoc(doc(usersCollection, userCredential.user.uid), {
                    email: userCredential.user.email,
                    settings: {
                        language: 'en-US',
                        theme: 'light',
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                })
                await setDoc(
                    doc(watchlistsCollection, userCredential.user.uid),
                    {
                        list: [],
                        filters: [],
                    }
                )
                console.log('Documents successfully written!')
                this.logoutUser()

                return true
            } catch (error) {
                console.log('User registration failed')
                this.pushAlert('error', error.message, error.code)
                return false
            }
        },
        async sendVerificationEmail(user = fbAuth.currentUser) {
            console.log('Sending verification email to', user)
            try {
                await sendEmailVerification(user)
                return true
            } catch (error) {
                this.pushAlert('error', error.message, error.code)
                return false
            }
        },
        async loginUser(email, password) {
            try {
                // Login user with Firebase Authentication
                const userCredential = await signInWithEmailAndPassword(
                    fbAuth,
                    email,
                    password
                )

                // Save user data as FB currentUser
                const fbUser = userCredential.user

                // Check if email is verified
                if (!userCredential.user.emailVerified) {
                    // Email not verified
                    this.pushAlert(
                        'warning',
                        'Please verify your email address.',
                        'fbAuth/email-not-verified'
                    )
                    this.logoutUser()
                    return false
                }
                // Signed in
                this.user = fbUser
                console.log('User logged in successfully')
                return true
            } catch (error) {
                console.log('User login failed')
                this.pushAlert('error', error.message, error.code)
                return false
            }
        },
        logoutUser() {
            fbAuth
                .signOut()
                .then(() => {
                    // Sign-out successful.
                    this.user = null
                })
                .catch((error) => {
                    // An error happened.
                    console.log(error)
                })
        },
    },

    getters: {
        isLoggedIn(state) {
            return state.user !== null
        },
        getUser(state) {
            return state.user
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

export default useAuthStore
