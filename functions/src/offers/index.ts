import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const makeOffer = functions.https.onRequest(async (req, res) => {
  const offer = req.body.offer;
  const post = req.body.post;
  const user = req.body.user;

  const offerProfile = {
    postId: post.id,
    applicant: user.id,
    name: user.name,
    photoUrl: user.photoUrl,
    rating: user.rating || 5,
    ...offer
  };

  const postOffer = {
    ...offerProfile,
    category: post.meta.serviceCategory,
    title: post.meta.title
  };

  const promise1 = admin
    .database()
    .ref(`offers/${post.id}/${user.id}`)
    .set(postOffer);

  const promise2 = admin
    .database()
    .ref(`posts/published/${post.id}/offers/${user.id}`)
    .update(offerProfile);

  const promise3 = admin
    .database()
    // .ref(`profiles/${user.id}/offers/${post.id}`)
    .ref(`profileOffers/${user.id}/${post.id}`)
    .update(postOffer);

  Promise.all([promise1, promise2, promise3])
    .then(() => {
      res.status(200).send("ok");
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send("error");
    });
});

export const approveOffer = functions.https.onRequest(async (req, res) => {
  const offer = req.body.offer;

  //   Update post to approved and save approved offer
  const promise1 = admin
    .database()
    .ref(`offers/${offer.postId}/${offer.applicant}`)
    .update({
      status: "approved"
    });

  // Notify other applicants of offers being
  const promise2 = await admin
    .database()
    .ref(`posts/published/${offer.postId}/offers`)
    .once("value", function(snapshot) {
      Object.keys(snapshot.val()).map((key, value) => {
        if (key !== offer.applicant) {
          return (
            admin
              .database()
              // .ref(`profiles/${key}/offers/${offer.postId}`)
              .ref(`profileOffers/${key}/${offer.postId}`)
              .update({
                status: "approvedOther"
              })
          );
        } else {
          return (
            admin
              .database()
              // .ref(`profiles/${key}/offers/${offer.postId}`)
              .ref(`profileOffers/${key}/${offer.postId}`)
              .update({
                status: "approved"
              })
          );
        }
      });
    });

  const post = await admin
    .database()
    .ref(`posts/published/${offer.postId}`)
    .once("value");

  const postObj = {
    ...post.val(),
    postStatus: "offerApproved",
    status: "inprogress",
    approvedOffer: {
      provider: offer.applicant
    }
  };

  const promise3 = admin
    .database()
    .ref(`posts/inprogress/${offer.postId}`)
    .set(postObj);

  const promise4 = admin
    .database()
    .ref(`posts/published/${offer.postId}`)
    .set(null);

  //neccessary ?
  const promise5 = admin
    .database()
    .ref(`posts/inprogress/${offer.postId}/offers/${offer.applicant}`)
    .update({
      status: "approved"
    });

  // notify applicant of offer being approved
  const promise6 = admin
    .database()
    // .ref(`profiles/${offer.applicant}/offers/${offer.postId}`)
    .ref(`profileOffers/${offer.applicant}/${offer.postId}`)
    .update({
      status: "approved"
    });

  const promise7 = admin
    .database()
    // .ref(`profiles/${post.val().author}/posts/${offer.postId}`)
    .ref(`profilePosts/${post.val().author}/${offer.postId}`)
    .update({
      status: "inprogress"
    });

  Promise.all([
    promise1,
    promise2,
    promise3,
    promise4,
    promise5,
    promise6,
    promise7
  ])
    .then(() => {
      res.status(200).send("ok");
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send("error");
    });
});

export const providerOfferCompleted = functions.https.onRequest(
  async (req, res) => {
    const offer = req.body.offer;

    const promise1 = admin
      .database()
      .ref(`posts/inprogress/${offer.postId}`)
      .update({
        status: "complete"
      });

    const promise2 = admin
      .database()
      // .ref(`profiles/${offer.applicant}/offers/${offer.postId}`)
      .ref(`profileOffers/${offer.applicant}/${offer.postId}`)
      .update({
        status: "complete"
      });

    const promise3 = admin
      .database()
      .ref(`offers/${offer.postId}/${offer.applicant}`)
      .update({
        status: "complete"
      });

    Promise.all([promise1, promise2, promise3])
      .then(() => {
        res.status(200).send("ok");
      })
      .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
      });
  }
);

export const clientOfferCompletedApproval = functions.https.onRequest(
  async (req, res) => {
    const offer = req.body.offer;

    const promise1 = admin
      .database()
      .ref(`posts/inprogress/${offer.id}`)
      .update({
        status: "rateProvider"
      });

    const offerObj = await admin
      .database()
      .ref(`offers/${offer.id}/${offer.approvedOffer.provider}`)
      .once("value");

    const promise2 = admin
      .database()
      // .ref(`profiles/${offer.approvedOffer.provider}/offers/${offer.id}`)
      .ref(`profileOffers/${offer.approvedOffer.provider}/${offer.id}`)
      .update({
        status: "rateClient"
      });

    const promise3 = admin
      .database()
      .ref(`offers/${offer.id}/${offer.approvedOffer.provider}`)
      .update({
        status: "rate"
      });

    // Send $
    const promise4 = admin
      .database()
      .ref(`accounts/${offer.approvedOffer.provider}/transactions/${offer.id}`)
      .update({
        total: offerObj.val().offer,
        type: "deposit",
        post: offerObj.val().postId,
        createdAt: new Date().toLocaleString()
      });

    Promise.all([promise1, promise2, promise3, promise4])
      .then(() => {
        res.status(200).send("ok");
      })
      .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
      });
  }
);

export const closeOffer = functions.database
  .ref("offers/{postId}/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after;
    // const userId = context.params.userId;
    // const postId = context.params.postId;

    if (data.val().status === "closed") {
      console.log("closed", data.val().status);
      return;
      // return admin
      //   .database()
      //   .ref(`profile/${userId}/offers/${postId}`)
      // await admin
      //   .database()
      //   .ref(`offerHistory/${userId}/${postId}`)
      //   .set(offer);
      // return admin
      //   .database()
      //   .ref(`profile/${userId}/offers/${postId}`)
      //   .set(null)
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
    return;
  });
