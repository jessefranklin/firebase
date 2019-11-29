import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const accountBalance = functions.database
  .ref("accounts/{userId}/transactions/{transId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot;
    const userId = context.params.userId;

    const account = await admin
      .database()
      .ref(`accounts/${userId}/`)
      .once("value");

    console.log("new account total");

    const newTotal = account.val().balance
      ? account.val().balance + data.val().total
      : data.val().total;

    console.log(newTotal);

    await admin
      .database()
      .ref(`profiles/${userId}/account`)
      .update({
        balance: newTotal
      });

    return admin
      .database()
      .ref(`accounts/${userId}/`)
      .update({
        balance: newTotal
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  });
