import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const fetchPosts = functions.https.onRequest(async (req, res) => {
  const geocode = req.body.geocode;

  const promise1 = await admin
    .database()
    .ref("posts/published")
    .orderByChild("geocode")
    .equalTo(geocode)
    .once("value");

  Promise.all([promise1])
    .then(() => {
      res.status(200).send(promise1);
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send("error");
    });
});

export const fetchPostsWithOffers = functions.https.onRequest(
  async (req, res) => {
    const geocode = req.body.geocode;

    const promise1 = await admin
      .database()
      .ref("posts")
      .orderByChild("geocode")
      .equalTo(geocode)
      .once("value");

    Promise.all([promise1])
      .then(() => {
        res.status(200).send(promise1);
      })
      .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
      });
  }
);

export const profileWithOffers = functions.https.onRequest(async (req, res) => {
  const offer = req.body.offer;

  const promise1 = admin
    .database()
    .ref(`posts/${offer.id}`)
    .update({
      status: "rateProvider"
    });

  Promise.all([promise1])
    .then(() => {
      res.status(200).send("ok");
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send("error");
    });
});

export const profileWithPosts = functions.https.onRequest(async (req, res) => {
  const offer = req.body.offer;

  const promise1 = admin
    .database()
    .ref(`posts/${offer.id}`)
    .update({
      status: "rateProvider"
    });

  Promise.all([promise1])
    .then(() => {
      res.status(200).send("ok");
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send("error");
    });
});

export const postsWithOffers = functions.https.onRequest(async (req, res) => {
  const offer = req.body.offer;

  const promise1 = admin
    .database()
    .ref(`posts/${offer.id}`)
    .update({
      status: "rateProvider"
    });

  Promise.all([promise1])
    .then(() => {
      res.status(200).send("ok");
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send("error");
    });
});
