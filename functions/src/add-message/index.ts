import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const listener = functions.https.onRequest(async (req, res) => {
  const snapshot = await admin
    .database()
    .ref("messages")
    .push({ original: req.body });

  return snapshot;
});
