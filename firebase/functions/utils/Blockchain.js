const SHA256 = require("crypto-js/sha256");

const calculateHash = (data) => {
  let hash = SHA256(JSON.stringify(data)).toString();
  return hash;
};

const mineBlock = (detail, difficulty) => {
  let { data, timestamp, previousHash } = detail;
  let nonce = 0;
  let hash = calculateHash({ data, timestamp, previousHash, nonce });
  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    nonce++;
    hash = calculateHash({ data, timestamp, previousHash, nonce });
  }

  return { hash, nonce };
};

exports.Block = (data, timestamp, previousHash) => {
  let { hash, nonce } = mineBlock({ data, timestamp, previousHash }, 4);
  return {
    data,
    timestamp,
    previousHash,
    hash,
    nonce,
  };
};

exports.getLatestBlock = (chain) => {
  return chain[chain.length - 1];
};

const addBlockToChain = (chain, block) => {
  chain.push(block);
  return chain;
};

exports.checkBlockchainValidation = (chain) => {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }
    if (
      currentBlock.hash !==
      calculateHash({
        data: {
          wallet: currentBlock.data.wallet,
          totalsent: currentBlock.data.totalsent,
          totalRecieved: currentBlock.data.totalRecieved,
          nextClaim: currentBlock.data.nextClaim,
        },
        timestamp: currentBlock.timestamp,
        previousHash: currentBlock.previousHash,
        nonce: currentBlock.nonce,
      })
    ) {
      return false;
    }
  }
  return true;
};
