const admin = require("firebase-admin");
const path = require("path");


const serviceAccountPath = path.join(__dirname, "../FIREBASE-ADMIN-SDK.json");

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
    });
    console.log("Firebase Admin Initialized");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

const db = admin.firestore();

module.exports = { db };
