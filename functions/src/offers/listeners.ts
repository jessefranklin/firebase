import * as functions from "firebase-functions";

export const offerListener = functions.database
  .ref("offer/{pushId}")
  .onWrite(async event => {
    console.log(event);
  });
