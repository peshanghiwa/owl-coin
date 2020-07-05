<template>
  <div>
    <div class="success-container">
      <div class="success"></div>
      <h1>Transaction Successfull!</h1>
      <button @click="goBackHome" class="home-button">Home</button>
    </div>
    <logo
      v-if="loading"
      fill="#ffcea2"
      height="130px"
      class="loading-screen"
    ></logo>
    <nuxt />
  </div>
</template>

<script>
import lottie from "lottie-web";
export default {
  data() {
    return {
      loading: true,
      lottie: null
    };
  },
  methods: {
    goBackHome() {
      mainContainer.style.display = "none";
      this.lottie.stop();
      this.$router.push("/");
    }
  },
  mounted() {
    const mainContainer = document.querySelector(".success-container");
    const container = document.querySelector(".success");
    this.lottie = lottie.loadAnimation({
      container: container, // the dom element that will contain the animation
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://assets5.lottiefiles.com/temp/lf20_4Jjg2l.json" // the path to the animation json
    });

    this.$nuxt.$on("loading", state => {
      this.loading = state;
    });
    this.$nuxt.$on("animation-play", () => {
      mainContainer.style.display = "flex";
      this.lottie.play();
      setTimeout(() => {
        mainContainer.style.display = "none";
        this.lottie.stop();
        this.$router.push("/");
      }, 6000);
    });
  }
};
</script>

<style scoped>
.success-container {
  z-index: 100;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: none;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ffcea2;
  font-weight: 700;
}
.success {
  height: 40%;
}
.success-container h1 {
  margin: 20px 0;
  font-size: 14px;
}
.home-button {
  padding: 5px 30px;
  background-color: #ffcea2;
  border-radius: 30px;
  font-weight: 900;
  cursor: pointer;
  border: 0;
  transition: all 0.6 ease !important;
}
.home-button:hover,
.home-button:active {
  background-color: #ffffff;
}
.loading-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  fill: #ffcea2;
  transition: all 0.6s ease;
  animation: loading 1s ease infinite;
}
</style>
