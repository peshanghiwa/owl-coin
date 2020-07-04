const blockchainFunctions = require("../utils/Blockchain");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = admin.firestore();

exports.addBlock = async (req, res) => {
  try {
    const chain = req.chain;
    const latestBlock = blockchainFunctions.getLatestBlock(chain);

    if (latestBlock.data.nextClaim > Date.now()) {
      let waitTime = latestBlock.data.nextClaim - Date.now();
      throw new functions.https.HttpsError(
        "aborted",
        `Sorry You have to wait ${
          waitTime / 1000
        } seconds to claim your next coin!`
      );
    }

    if (!blockchainFunctions.checkBlockchainValidation(chain)) {
      await db.collection("users").doc(req.freshUser.uid).update({
        currupted: true,
      });
      throw new functions.https.HttpsError(
        "aborted",
        `Your blockchain seems to be broken, we'll have to lock your account to review it please report us if you think this is wrong!`
      );
    }
    //-> below you set the next claiming time
    const newBlock = blockchainFunctions.Block(
      {
        wallet: latestBlock.data.wallet + 5,
        totalsent: latestBlock.data.totalsent,
        totalRecieved: latestBlock.data.totalRecieved,
        nextClaim: Date.now() + 180000,
      },
      Date.now(),
      latestBlock.hash
    );
    chain.push(newBlock);
    await db.collection("users").doc(req.freshUser.uid).update({
      chain,
    });

    res.status(200).json({
      status: "success",
      chain,
      message: blockchainFunctions.checkBlockchainValidation(chain),
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.transation = async (req, res) => {
  try {
    //-> we check the fields
    if (!req.body.reciever || !req.body.amount) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Please provide all the necessary informations."
      );
    }

    //-> Check if first letter is 0
    if (req.body.amount.toString().startsWith("0")) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You can't enter 0s at first digit!."
      );
    }

    //->Check if there's characters inside the amount
    if (!/^\d+$/.test(req.body.amount.toString())) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Characters or fractional numbers aren't allowed!"
      );
    }

    //->Check if Amount is more than 3 digits length long
    if (req.body.amount.toString().length > 3) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You can't send more than 999 at once!"
      );
    }

    //-> get reciever's informations
    const reciever = await db.collection("users").doc(req.body.reciever).get();

    //-> check if the reciever exists
    if (reciever.empty) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No user found for the entered Information!"
      );
    }

    //->Check if reciever is me
    if (reciever.id == req.freshUser.uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Entered User ID belongs to yourself!"
      );
    }

    //-> declare variable for both sender and reciever's chains
    const senderChain = req.chain;
    let recieverUID = reciever.id;
    let recieverChain = reciever.data().chain;

    //-> Declare array variable for both sender and reciever's latest block
    const latestSenderBlock = blockchainFunctions.getLatestBlock(senderChain);
    const latestRecieverBlock = blockchainFunctions.getLatestBlock(
      recieverChain
    );
    const latestBlocks = [latestSenderBlock, latestRecieverBlock];

    //-> we check for blockchain validations
    for (let i = 0; i < latestBlocks.length; i++) {
      //-> check blockchain validation
      if (!blockchainFunctions.checkBlockchainValidation(latestBlocks[i])) {
        let coruuptedOne;
        if (i == 0) {
          await db.collection("users").doc(req.freshUser.uid).update({
            currupted: true,
          });
          coruuptedOne = "Your Blockchain";
        } else if (i == 1) {
          await db.collection("users").doc(recieverUID).update({
            currupted: true,
          });
          coruuptedOne = "Reciever's Blockchain";
        }

        throw new functions.https.HttpsError(
          "aborted",
          `${coruuptedOne} seems to be broken, we'll have to lock the account to review it!`
        );
      }
    }

    //-> check if the sender has enough money
    if (latestSenderBlock.data.wallet < req.body.amount) {
      throw new functions.https.HttpsError(
        "unavailable",
        "The Amount you are trying to send is more than what you have on your wallet."
      );
    }

    req.body.amount = Math.floor(req.body.amount);

    //-> new Block for the Sender and adding it to the chain
    const newSenderBlock = blockchainFunctions.Block(
      {
        wallet: latestSenderBlock.data.wallet - req.body.amount,
        totalsent: latestSenderBlock.data.totalsent + req.body.amount,
        totalRecieved: latestSenderBlock.data.totalRecieved,
        nextClaim: latestSenderBlock.data.nextClaim,
      },
      Date.now(),
      latestSenderBlock.hash
    );
    senderChain.push(newSenderBlock);
    await db.collection("users").doc(req.freshUser.uid).update({
      chain: senderChain,
    });

    //-> new Block for the Reciever and adding it to the chain
    const newRecieverBlock = blockchainFunctions.Block(
      {
        wallet: latestRecieverBlock.data.wallet + req.body.amount,
        totalsent: latestRecieverBlock.data.totalsent,
        totalRecieved: latestRecieverBlock.data.totalRecieved + req.body.amount,
        nextClaim: latestRecieverBlock.data.nextClaim,
      },
      Date.now(),
      latestRecieverBlock.hash
    );
    recieverChain.push(newRecieverBlock);
    await db.collection("users").doc(recieverUID).update({
      chain: recieverChain,
    });

    res.status(200).json({
      status: "success",
      message: "Transaction Successfull",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
