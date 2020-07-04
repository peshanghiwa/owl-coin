<template>
  <div v-if="ready" class="container">
    <div class="alert">{{ error }}</div>
    <div class="brand-container">
      <logo fill="#FFCEA2" height="180"></logo>
      <h1 class="brand-name">OWL COIN</h1>
    </div>
    <div class="login-container">
      <div class="form-container">
        <form ref="form">
          <div class="form-input-container">
            <face class="form-input-image" fill="#FFCEA2" height="20"></face>
            <input v-model="fullName" class="form-input" type="text" placeholder="Full Name" />
          </div>
          <div class="form-input-container">
            <email class="form-input-image" fill="#FFCEA2" height="20"></email>
            <input v-model="email" class="form-input" type="email" placeholder="Email" />
          </div>
          <div class="form-input-container">
            <password class="form-input-image" fill="#FFCEA2" height="20"></password>
            <input v-model="password" class="form-input" type="password" placeholder="Password" />
          </div>
          <div class="form-input-container">
            <button
              @click.prevent="signUp"
              :disabled="buttonDisabled"
              class="form-button"
            >{{ signupButton }}</button>
          </div>
        </form>
        <nuxt-link class="form-question" to="/login">Already have account? Log in</nuxt-link>
      </div>
    </div>
    <div class="copyrights-container">
      <h6 class="copyrights-text">Copyrights &copy; 2020 all reserved to Owl Coin Team.</h6>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttonDisabled: false,
      signupButton: "Sign Up",
      ready: false,
      fullName: "",
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    alertMessage(data) {
      this.error = data;
      const alert = document.querySelector(".alert");
      alert.classList.add("alert-active");
      setTimeout(() => {
        alert.classList.remove("alert-active");
        this.error = "";
      }, 4000);
    },
    async signUp() {
      if (this.email == "" || this.password == "" || this.fullName == "") {
        return this.alertMessage("Please fill all the fields to log in!");
      }
      try {
        this.buttonDisabled = true;
        this.signupButton = "Signing Up...";
        const data = {
          fullName: this.fullName,
          email: this.email,
          password: this.password
        };
        await this.$axios.$post(
          "https://us-central1-owl-coin-21e72.cloudfunctions.net/app/api/auth/signup",
          data
        );
        await this.$fireAuth.signInWithEmailAndPassword(
          this.email,
          this.password
        );
        this.buttonDisabled = false;
        this.signupButton = "Sign Up";
        return this.$router.push("/");
      } catch (err) {
        this.buttonDisabled = false;
        this.signupButton = "Sign Up";
        return this.alertMessage(err.message);
      }
    }
  },
  mounted() {
    $nuxt.$emit("loading", false);
  },
  async fetch() {
    this.$fireAuth.onAuthStateChanged(user => {
      if (user) {
        this.$router.push("/");
      } else {
        this.ready = true;
      }
    });
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #445d5b;
}
.brand-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.brand-name {
  font-weight: 700;
  text-align: center;
  color: #ffcea2;
  font-size: 25px;
  margin-top: 15px;
}

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}
.form-input-container {
  position: relative;
  width: 65vw;
  margin: 0 0 20px 0;
}
.form-input-image {
  position: absolute;
  left: 0;
  top: 2px;
}
.form-input {
  width: 100%;
  padding-left: 25px;
  padding-bottom: 5px;
  background-color: transparent;
  border-width: 0;
  font-size: 17px;
  border-bottom-width: 1.5px;
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffcea2;
  transition: all 0.2s ease;
}
.form-input::placeholder {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.4);
}
.form-input:focus {
  border-bottom-width: 3px;
}
.form-button {
  width: 100%;
  background-color: #ffcea2;
  color: #445d5b;
  letter-spacing: 0.7px;
  font-weight: 900;
  border: none;
  border-radius: 15px;
  height: 40px;
  transition: all 0.2s ease;
  margin-bottom: -10px;
  transition: all 0.3s ease;
}
.form-button:hover,
.form-button:active {
  cursor: pointer;
  background-color: #ffffff;
}

.copyrights-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 55vw;
  color: #ffcea2;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}
.form-question {
  text-decoration: none;
  color: #ffcea2;
}
.copyrights-text {
  text-align: center;
}

@media screen and (min-width: 900px) {
  .form-input-container {
    position: relative;
    width: 30vw;
    margin: 0 0 20px 0;
  }
}
</style>
