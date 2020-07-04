const Blockchain = require("../utils/Blockchain");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("../admin-permission.json");
const { HttpsError } = require("firebase-functions/lib/providers/https");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://owl-coin-21e72.firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();

exports.signUp = async (req, res) => {
  try {
    //-> Check all the fields
    if (!req.body.fullName || !req.body.email || !req.body.password) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "please provide all the given fields to sign!"
      );
    }

    //->Check if the email is valid or not
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(String(req.body.email).toLowerCase())) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Email Address is badly formatted!"
      );
    }

    if (req.body.password.length < 6) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Password length should be more than 6 characters!"
      );
    }
    const newUser = await auth.createUser({
      email: req.body.email,
      password: req.body.password,
    });

    await db
      .collection("users")
      .doc(newUser.uid)
      .create({
        fullName: req.body.fullName,
        email: req.body.email,
        chain: [
          Blockchain.Block(
            { wallet: 0, totalRecieved: 0, totalsent: 0, nextClaim: 0 },
            Date.now(),
            "0"
          ),
        ],
        currupted: false,
      });

    res.status(200).json({
      status: "Success",
      newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.check = async (req, res, next) => {
  try {
    const uid = await auth.verifyIdToken(req.body.token);
    if (!uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Sorry you can't perform this action since you aren't authenticated!"
      );
    }
    req.freshUser = uid;

    const userdb = await db.collection("users").doc(req.freshUser.uid).get();
    if (userdb.data().currupted) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Sorry your account is currupted, if you think this is a mistake please inform us!"
      );
    }
    req.chain = userdb.data().chain;
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
