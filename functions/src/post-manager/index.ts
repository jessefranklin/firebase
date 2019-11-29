import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const fetchPostsWithOffers = functions.https.onRequest(
  async (req, res) => {
    const id = req.body.id;

    const profilePosts = await admin
      .database()
      .ref(`profilePosts/${id}`)
      .once("value");

    var pp = profilePosts.val();

    const addOffers = await Object.keys(pp).map((key, value) => {
      return admin
        .database()
        .ref(`offers/${key}`)
        .once("value", snap => {
          const ox = snap.val();
          return (pp[key].offers = [ox]);
        });
    });

    console.log(addOffers);

    Promise.all([profilePosts, addOffers])
      .then(() => {
        res.status(200).send(addOffers);
      })
      .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
      });
  }
);
