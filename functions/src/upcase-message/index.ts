import * as functions from "firebase-functions";

export const listener = functions.database
  .ref("offer/{pushId}")
  .onWrite(async event => {
    console.log(event);
  });
