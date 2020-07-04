<template>
  <div v-if="ready" class="container">
    <div class="alert">{{ error }}</div>
    <div class="header-container">
      <avatar class="avatar"></avatar>
      <h3 class="name">Peshang Hiwa</h3>
      <button @click="logOut" class="logout">Log out</button>
    </div>
    <div class="img-container">
      <img src="../static/images/mrcrab.png" class="mrcrab" alt />
    </div>
    <div class="components-container">
      <reciever
        v-if="showReciever"
        :userId="userId"
        @userChoosed="sendChosenUser"
        @showError="alertError"
      ></reciever>
      <select-amount
        :chain="chain[chain.length - 1]"
        v-if="showSelectAmount"
        :user="chosenUser"
        @amountEntered="sendMoney"
        @goBack="goBack"
      ></select-amount>
      <confirm
        v-if="showconfirmation"
        :data="finalDataToSend"
        :token="userToken"
        @goBack="goBack"
        @showError="alertError"
      ></confirm>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: "",
      ready: false,
      progressBarKey: 0,
      userToken: null,
      user: null,
      userId: null,
      chain: null,

      chosenUser: { id: null, name: null },
      showReciever: true,
      showSelectAmount: false,

      finalDataToSend: null,
      showconfirmation: false
    };
  },
  methods: {
    alertError(message) {
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
    goBack(comp) {
      if (comp == "confirm") {
        this.showconfirmation = false;
        this.showSelectAmount = true;
      }
      if (comp == "select-amount") {
        this.showSelectAmount = false;
        this.showReciever = true;
      }
    },
    async logOut() {
      await this.$fireAuth.signOut();
      this.$router.push("/login");
    },
    sendChosenUser(user) {
      this.chosenUser.id = user.userId;
      this.chosenUser.name = user.name;
      this.showReciever = false;
      this.showSelectAmount = true;
    },
    sendMoney(data) {
      this.finalDataToSend = { ...data, sender: this.user.fullName };
      this.showSelectAmount = false;
      this.showconfirmation = true;
    }
  },
  mounted() {
    $nuxt.$emit("loading", false);
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
          console.log(this.userToken);
          const currentUser = await this.$fireStore
            .collection("users")
            .doc(user.uid)
            .get();
          this.user = currentUser.data();
          this.userId = user.uid;
          this.chain = currentUser.data().chain;
          $nuxt.$emit("loading", false);

          this.ready = true;
        } catch (err) {
          $nuxt.$emit("loading", false);
          return this.alertMessage(err.message);
        }
      }
    });
  },
  fetchOnServer: true
};
</script>

<style scoped>
.container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.img-container {
  display: flex;
  justify-content: center;
}

.mrcrab {
  max-height: 60%;
  max-width: 60%;
  margin: 10px 0;
}

@media screen and (min-width: 500px) {
  .mrcrab {
    max-height: 50%;
    max-width: 50%;
  }
}

@media screen and (min-width: 700px) {
  .mrcrab {
    max-height: 40%;
    max-width: 40%;
  }
}
@media screen and (min-width: 900px) {
  .mrcrab {
    max-height: 30%;
    max-width: 30%;
  }
}
@media screen and (min-width: 1100px) {
  .mrcrab {
    max-height: 20%;
    max-width: 20%;
  }
}

.components-container {
  display: flex;
  justify-content: center;
}
</style>
