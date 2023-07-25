import ApiCon, { NodeCon } from '@awesomegroup/watch-con'
import admin from 'firebase-admin'
import { config } from 'dotenv'
import fs from 'fs'

// For local development
config({ path: './.env' })

// Parse the Firebase Admin SDK key JSON
const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_ADMIN_SDK_KEY, 'base64').toString('utf-8')
)

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

// Firestore reference
const db = admin.firestore()

// Function to update Firestore document
async function updateFirestoreDocument(data) {
    try {
        const docRef = db.collection('shows').doc('allShows')
        await docRef.update({
            data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        console.log('Firestore document updated successfully')
    } catch (error) {
        console.error('Error updating Firestore document:', error.message)
    }
}

// Shows List
const series = [
    { id: 1412, name: 'Arrow' },
    { id: 60735, name: 'The Flash' },
    { id: 62688, name: 'Supergirl' },
    { id: 62643, name: 'Legends of Tomorrow' },
    { id: 89247, name: 'Batwoman' },
    { id: 71663, name: 'Black Lightning' },
    { id: 80986, name: 'Stargirl' },
    { id: 95057, name: 'Superman & Lois' },
]

const api = new ApiCon({
    endpoint: process.env.API_URL,
    con: NodeCon,
})
const res = await api.connect(process.env.API_USER, process.env.API_TOKEN)

if (!res) {
    throw console.error('API_CANT_CONNECT')
} else {
    console.log('API_CONNECTED')
}

console.log('Getting all shows metadata')

const shows = []
for (const show of series) {
    console.log(`Getting show ${show.name} (${show.id})`)
    const showMet = await api.getFullShowMet(show.id)
    shows.push(showMet.data)
    console.log("Finished getting show's metadata\n")
}

console.log('Finished getting all shows metadata')

await updateFirestoreDocument(shows)

// Log to file for local development
if (process.env.VITE_IS_DEV) {
    fs.writeFile('episodes.json', JSON.stringify(shows), (err) => {
        if (err) throw err
        console.log('Data written to file')
    })
}
