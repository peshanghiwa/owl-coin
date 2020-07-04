<template>
  <div class="container">
    <h1 class="main-header">Confirm Transaction</h1>
    <div class="final-stats-container">
      <div class="final-stats">
        <div
          v-for="(stat, index) in domData"
          :key="index"
          class="stat-value-container"
        >
          <h4 class="stat-name">{{ stat.statName }}</h4>
          <h4 class="stat-value">{{ stat.statValue }}</h4>
        </div>
      </div>
    </div>
    <div class="next-button-container">
      <button @click="sendMoney" class="next-button">{{ buttonText }}</button>
    </div>
    <div class="next-button-container">
      <h3 @click="goBack" class="back-button">Enter Different Amount</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      domData: [],
      buttonText: "Start Sending"
    };
  },
  props: ["data", "token"],
  fetch() {
    this.domData.push({ statName: "Sender:", statValue: this.data.sender });
    this.domData.push({
      statName: "Receiver:",
      statValue: this.data.chosenUser.name
    });
    this.domData.push({ statName: "Amount:", statValue: this.data.amount });
    this.domData.push({
      statName: "Current Wallet:",
      statValue: this.data.chain.data.wallet
    });
    this.domData.push({
      statName: "Wallet After Transaction:",
      statValue: this.data.chain.data.wallet - this.data.amount
    });
    this.domData.push({
      statName: "Transaction Date:",
      statValue: new Date().toISOString().split("T")[0]
    });
  },
  methods: {
    async sendMoney() {
      const button = document.querySelector(".next-button");
      button.setAttribute("disabled", "");
      this.buttonText = "Processing Transaction...";
      try {
        await this.$axios.$post(
          "https://us-central1-owl-coin-21e72.cloudfunctions.net/app/api/blockchain/transaction",
          {
            reciever: this.data.chosenUser.id,
            amount: this.data.amount,
            token: this.token
          }
        );
      } catch (err) {
        this.$emit("showError", err.message);
        console.log(err);
      }
      button.removeAttribute("disabled");
      this.buttonText = "Start Sending";
      $nuxt.$emit("animation-play");
    },
    goBack() {
      this.$emit("goBack", "confirm");
    }
  }
};
</script>

<style scoped>
.final-stats-container {
  margin: 5px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.final-stats {
  width: 70%;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 12px;
}

.stat-value-container {
  display: flex;
  justify-content: space-between;
}

.stat-value-container h4 {
  font-size: 14px;
  margin: 4px 0;
  color: #445d5b;
}

.stat-name {
  font-weight: 900;
}

.container {
  width: 40%;
}

.img-container {
  display: flex;
  justify-content: center;
}

@media screen and (max-width: 1100px) {
  .container {
    width: 50%;
  }
}
@media screen and (max-width: 900px) {
  .container {
    width: 70%;
  }
}
@media screen and (max-width: 650px) {
  .container {
    width: 95%;
  }
}

.main-header {
  text-align: center;
  font-weight: 900;
  font-size: 25px;
  color: #ffcea2;
  margin: 30px 0 10px;
}

.next-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.next-button {
  background-color: #ffcea2;
  padding: 10px 15px;
  margin-top: 25px;
  border: none;
  font-weight: 700;
  font-size: 14px;
  width: 65%;
  border-radius: 30px;
  color: #445d5b;
  cursor: pointer;
  transition: 0.3s all ease;
}

.next-button:hover,
.next-button:active {
  background-color: #ffffff;
}

.back-button {
  margin-top: 15px;
  font-weight: 700;
  font-size: 14px;
  color: #ff6364;
  text-align: center;
  cursor: pointer;
  transition: 0.3s all ease;
}

.back-button:hover,
.back-button:active {
  color: #ffffff;
}
</style>
