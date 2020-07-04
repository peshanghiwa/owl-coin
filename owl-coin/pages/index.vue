<template>
  <div v-if="ready" class="container">
    <div class="header-container">
      <avatar class="avatar"></avatar>
      <h3 class="name">Peshang Hiwa</h3>
      <button @click="logOut" class="logout">Log out</button>
    </div>
    <h1 class="mobile-page-header-title">OWL COIN</h1>
    <h2 class="mobile-page-header-title-description">
      Cryptocurrency Mining made easy!
    </h2>
    <div class="main-container">
      <!-- All the Progress bar codes are inside this component below-->
      <progress-bar
        :key="progressBarKey"
        @moneyClaimed="refresh"
        v-if="showProgress"
        :chain="chain"
        :userToken="userToken"
        @showError="showError"
      ></progress-bar>
      <div class="page-text-container">
        <h1 class="page-header-title">OWL COIN</h1>
        <h2 class="page-header-title-description">
          Cryptocurrency Mining made easy!
        </h2>
        <p class="page-header-content">
          <strong style="font-weight:700;">Owl Coin</strong> is a digital
          Cryptocurrency application where you can mine digital coins every 3
          minutes. <br />Using this web application you'll get access of doing
          cryptocurrency mining and collecting as well as doing
          <br />transactions like sending or recieving money through
          <strong style="font-weight:700;">blockchain</strong> technology, which
          is the <br />best and safest way of doing transactions through
          network.
        </p>
        <button @click="redirect" class="page-header-button">
          Github Repository of this application
        </button>
        <logo fill="#ffcea2" height="500px" class="background-logo"></logo>
      </div>
    </div>
    <button class="mobile-page-header-button">
      Github Repository of this application
    </button>
    <div class="transaction-section-container">
      <div class="transaction-content-container">
        <h2 class="transaction-section-content smaller">Send Money!</h2>
        <p class="transaction-section-paragraph">
          Owl Coin provides a very secure way of doing Transactions.
          <br />We let you Send or Recieve money to anyone whose has registred
          inside the application and has mined it's first block! <br />The
          process of doing transactions will alter the blockchain of both
          reciever and sender just like claiming money does! <br />so after each
          transaction you will have to wait for 3 minutes to be able to do
          another one!
        </p>
        <button
          @click="goToTransaction"
          class="page-header-button start-transaction-button"
        >
          Start Transaction
        </button>
      </div>
      <img
        src="../static/images/transaction.png"
        class="transaction-section-img"
        alt
      />
    </div>
    <h1 class="stats-header smaller">Statistics</h1>
    <stats class="stats" :stats="chain" :user="user" :key="statsKey"></stats>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: "",
      ready: false,
      showProgress: false,
      progressBarKey: 0,
      statsKey: 0,
      userToken: null,
      user: null,
      chain: null
    };
  },
  async fetch() {
    this.$fireAuth.onAuthStateChanged(async user => {
      if (!user) {
        this.$router.push("/login");
      } else {
        $nuxt.$emit("loading", true);
        try {
          const idToken = await user.getIdToken(true);
          this.userToken = idToken;
          const currentUser = await this.$fireStore
            .collection("users")
            .doc(user.uid)
            .get();
          this.user = currentUser.data();
          this.chain = currentUser.data().chain;
          this.showProgress = true;
          $nuxt.$emit("loading", false);
          this.ready = true;
        } catch (err) {
          $nuxt.$emit("loading", false);
          return this.alertMessage(err.message);
        }
      }
    });
  },
  fetchOnServer: true,
  methods: {
    redirect() {
      window.location.href = "https://github.com/peshanghiwa/owl-coin";
    },
    showError(message) {
      this.alertMessage(message);
    },
    alertMessage(data) {
      this.error = data;
      const alert = document.querySelector(".alert");
      alert.classList.add("alert-active");
      setTimeout(() => {
        alert.classList.remove("alert-active");
        this.error = "";
      }, 4000);
    },
    async logOut() {
      await this.$fireAuth.signOut();
      this.$router.push("/login");
    },
    goToTransaction() {
      this.$router.push("/transaction");
    },
    async refresh() {
      try {
        const user = this.$fireAuth.currentUser;
        const currentUser = await this.$fireStore
          .collection("users")
          .doc(user.uid)
          .get();
        this.user = currentUser.data();
        this.chain = currentUser.data().chain;
        this.progressBarKey += 1;
        this.statsKey += 1;
      } catch (err) {
        return this.alertMessage(err.message);
      }
    }
  }
};
</script>

<style scoped>
.container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@keyframes loading {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
  }
  /* 50% {
    transform: scale(0.7);
  } */
  100% {
    transform: translate(-50%, -50%) rotate(360deg) scale(1);
  }
}
.header-container {
  padding: 10px;
}
.avatar {
  float: left;
  height: 40px;
  margin-right: 10px;
}
.name {
  line-height: 40px;
  color: #ffcea2;
  float: left;
}
.logout {
  background-color: #ffcea2;
  color: #445d5b;
  border: none;
  border-radius: 15px;
  padding: 6px 20px;
  margin-top: 5px;
  margin-right: 5px;
  float: right;
  font-weight: 900;
  transition: all 0.2s ease;
}
.logout:hover,
.logout:active {
  cursor: pointer;
  background-color: #ffffff;
}

.page-text-container {
  position: relative;
  display: none;
  color: #ffcea2;
  margin: 0 15px;
}

.page-header-title {
  font-weight: 700;
  font-size: 70px;
  /* text-decoration: underline; */
}

.page-header-title-description {
  font-size: 30px;
  margin-top: -10px;
  margin-bottom: 20px;
}
.page-header-content {
  font-size: 12px;
  line-height: 20px;
}

.page-header-button {
  background-color: transparent;
  padding: 10px 15px;
  margin-top: 35px;
  border: 2px solid #ffcea2;
  border-radius: 30px;
  color: #ffcea2;
  cursor: pointer;
  transition: 0.3s all ease;
}

.page-header-button:hover,
.page-header-button:active {
  background-color: #ffcea2;
  color: #445d5b;
}

.background-logo {
  position: absolute;
  top: 0;
  right: 0;
  fill: rgba(0, 0, 0, 0.1);
  transform: rotate(30deg) translate(60px, -60px);
}

@media screen and (min-width: 950px) {
  .main-container {
    padding: 0 10px;
    margin-top: 80px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .page-text-container {
    display: block;
    flex-grow: 1;
  }
  .mobile-page-header-title,
  .mobile-page-header-title-description,
  .mobile-page-header-button {
    display: none;
  }

  /* .stats {
    margin-top: 80px;
  } */
}
.mobile-page-header-title {
  color: #ffcea2;
  font-size: 35px;
  margin-top: 10px;
  font-weight: 700;
  text-align: center;
}
.mobile-page-header-title-description {
  font-size: 12px;
  margin-bottom: 20px;
  margin-top: -10px;
  text-align: center;
  color: #ffcea2;
}

.mobile-page-header-button {
  background-color: transparent;
  padding: 10px 15px;
  margin: 0 40px;
  margin-top: 35px;
  border: 2px solid #ffcea2;
  border-radius: 30px;
  color: #ffcea2;
  cursor: pointer;
  transition: 0.3s all ease;
}

.mobile-page-header-button:hover,
.mobile-page-header-button:active {
  background-color: #ffcea2;
  color: #445d5b;
}

@media screen and (min-width: 700px) {
  .mobile-page-header-button {
    margin: 30px 200px 0px;
  }
}
.stats-header {
  text-align: center;
  margin-top: 80px;
  font-size: 50px;
  font-weight: 700;
  color: #ffcea2;
}
.stats {
  margin-top: 20px;
}

.transaction-section-container {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-top: 200px;
  padding: 0 50px;
  /* background-color: red; */
}

.transaction-section-img {
  height: 30vw;
}

.transaction-content-container {
  padding: 0 20px;
  padding-top: 30px;
}

.transaction-section-content {
  color: #ffcea2;
  font-weight: 900;
  letter-spacing: 1px;
  font-size: 45px;
  line-height: 40px;
  margin-bottom: 20px;
}

.transaction-section-paragraph {
  color: #ffcea2;
  font-size: 15px;
}

.start-transaction-button {
  font-weight: 900;
  letter-spacing: 1px;
}
@media screen and (min-width: 1200px) {
  .transaction-content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-top: 70px;
    padding-bottom: 70px;
  }

  .start-transaction-button {
    width: 220px;
  }
}

@media screen and (max-width: 1100px) {
  .transaction-section-paragraph {
    color: #ffcea2;
    font-size: 12px;
  }
}

@media screen and (max-width: 948px) {
  .transaction-section-container {
    flex-direction: column-reverse;
    align-items: center;
    margin-top: 150px;
  }

  .transaction-section-img {
    height: 350px;
    width: 500px;
    margin-bottom: 60px;
  }

  .transaction-content-container {
    text-align: center;
    padding: 0 0px;
  }
}

@media screen and (max-width: 600px) {
  .transaction-section-container {
    padding: 0 10px;
  }

  .transaction-content-container {
    text-align: center;
    padding: 0 0px;
  }
  .transaction-section-img {
    height: 230px;
    width: 350px;
    margin-top: 50px;
    margin-bottom: 20px;
  }
  .smaller {
    font-size: 30px;
  }
}
</style>
