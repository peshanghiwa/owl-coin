<template>
  <div class="container">
    <h1 class="main-header">Amount Of Coins</h1>
    <div class="amount-bar-container">
      <input
        autocomplete="off"
        placeholder="Enter Amount of Coins"
        type="text"
        class="amount-bar"
        name="searchbar"
        v-model="amount"
        @input="selectAmount"
      />
      <logo class="search-icon" fill="black" height="25px"></logo>
    </div>
    <div class="error-container">
      <small class="errorText">{{ errorText }}</small>
    </div>
    <div class="details-container">
      <h1 class="detail-content">Sending</h1>
      <h1 class="detail-amount">{{ amount || amountAlternate }}</h1>
      <h1 class="detail-content">to {{ user.name }}</h1>
    </div>
    <div class="next-button-container">
      <button @click="AmountSelected" class="next-button" disabled>
        {{ amount == null || "" ? "Enter Amount!" : "Next" }}
      </button>
    </div>
    <div class="next-button-container">
      <h3 @click="goBack" class="back-button">Select Different User</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorText: "",
      amount: null,
      amountAlternate: "000"
    };
  },
  props: ["user", "chain"],
  methods: {
    selectAmount() {
      const nextButton = document.querySelector(".next-button");
      if (this.amount == "" || this.amount == null) {
        nextButton.setAttribute("disabled", "");
        this.amount = null;
      } else if (this.amount.startsWith("0")) {
        this.amount = this.amount.slice(0, -1);
        this.errorText = "You can't enter 0s at first digit!";
      } else if (!/^\d+$/.test(this.amount)) {
        this.amount = this.amount.slice(0, -1);
        this.errorText = "You can't enter characters in the field!";
      } else if (this.amount.length > 3) {
        this.errorText = "You can't Send more than 999 coins at once!";
        this.amount = this.amount.slice(0, -1);
      } else if (parseInt(this.amount) > this.chain.data.wallet) {
        this.errorText = `You only have ${this.chain.data.wallet} coins in your wallet, you can't send this amount!`;
        nextButton.setAttribute("disabled", "");
      } else {
        this.errorText = "";
        nextButton.removeAttribute("disabled");
      }
    },
    AmountSelected() {
      this.$emit("amountEntered", {
        amount: parseInt(this.amount),
        chosenUser: this.user,
        chain: this.chain
      });
    },
    goBack() {
      this.$emit("goBack", "select-amount");
    }
  }
};
</script>

<style scoped>
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
  color: #ffcea2;
  margin: 30px 0 10px;
}

.amount-bar-container {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}

.amount-bar {
  width: 70%;
  border: none;
  padding: 0 20px;
  border-radius: 30px;
  height: 35px;
  color: #445d5b;
  letter-spacing: 1px;
  font-weight: 600;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 16%;
  transform: translate(-50%, -50%);
  fill: #445d5b;
}

.next-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.next-button {
  background-color: #ffcea2;
  padding: 10px 15px;
  margin-top: 35px;
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
  margin-top: 20px;
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

.error-container {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}
.errorText {
  font-size: 14px;
  text-align: center;
  color: #ff6364;
  text-shadow: #ffcea2 0.2px 0.2px;
}
.details-container {
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
  flex-direction: column;
  text-align: center;
  color: #ffcea2;
}

.detail-content {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 1px;
  margin: -10px;
}

.detail-amount {
  font-size: 75px;
  font-weight: 900;
}
</style>
