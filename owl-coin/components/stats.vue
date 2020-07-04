<template>
  <div class="container">
    <div class="card-container">
      <div class="card-title">Current Wallet Money</div>
      <div class="card-value">{{ latestBlock.data.wallet }}</div>
      <logo height="180px" class="card-logo"></logo>
    </div>
    <div class="card-container">
      <div class="card-title">Total Money Recieved</div>
      <div class="card-value">{{ latestBlock.data.totalRecieved }}</div>
      <logo height="180px" class="card-logo"></logo>
    </div>
    <div class="card-container">
      <div class="card-title">Total Money Sent</div>
      <div class="card-value">{{ latestBlock.data.totalsent }}</div>
      <logo height="180px" class="card-logo"></logo>
    </div>
    <div class="card-container">
      <div class="card-title">Current Blockchain Length</div>
      <div class="card-value">{{ chain.length }}</div>
      <logo height="180px" class="card-logo"></logo>
    </div>
    <div class="card-container">
      <div class="card-title">Blockchain status</div>
      <div class="card-value smaller">
        {{ user.currupted ? "Broken" : "Active" }}
      </div>
      <logo height="180px" class="card-logo"></logo>
    </div>
    <div class="card-container">
      <div class="card-title">Last Claim</div>
      <div class="card-value smaller">
        {{ lastClaimTime.split(" ")[2] }}-{{ lastClaimTime.split(" ")[1] }}
      </div>
      <logo height="180px" class="card-logo"></logo>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chain: null,
      latestBlock: null,
      userInfo: null,
      lastClaimTime: null
    };
  },
  props: ["stats", "user"],
  fetch() {
    this.chain = this.stats;
    this.latestBlock = this.chain[this.chain.length - 1];
    this.userInfo = this.user;
    this.lastClaimTime = new Date(this.latestBlock.timestamp).toString();
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  align-items: center;
}

.card-container {
  overflow: hidden;
  position: relative;
  width: 95%;
  background-color: white;
  border-radius: 30px;
  padding: 15px 25px 5px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 20px;
  color: #445d5b;
}

.card-value {
  font-size: 80px;
  font-weight: 700;
  color: #445d5b;
}

.card-logo {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%) translateX(30px) rotate(30deg);
  fill: rgba(0, 0, 0, 0.2);
}

@media screen and (min-width: 850px) {
  .container {
    display: flex !important;
    flex-wrap: wrap !important;
    flex-direction: row !important;
    justify-content: space-around !important;
  }
  .card-container {
    width: 45% !important;
  }
  .container > .card-container {
    flex: 1 1 1 1 !important;
  }
}

@media screen and (min-width: 1100px) {
  .container {
    display: flex !important;
    flex-wrap: wrap !important;
    flex-direction: row !important;
    justify-content: space-around !important;
  }
  .card-container {
    width: 30% !important;
  }
  .container > .card-container {
    flex: 1 1 1 !important;
  }
}
</style>
