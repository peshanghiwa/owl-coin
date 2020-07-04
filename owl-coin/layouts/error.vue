<template>
  <div class="error-container">
    <div class="error-text-container">
      <div class="lottie-container">
        <div class="lottie"></div>
      </div>
      <h1 class="error-text">Sorry, This Page is not Found :(</h1>
      <button @click="goHome" class="home-button">Home Page</button>
    </div>
  </div>
</template>

<script>
import lottie from "lottie-web";
export default {
  methods: {
    goHome() {
      this.$router.push("/");
    }
  },
  mounted() {
    const lottieElement = document.querySelector(".lottie");
    lottie.loadAnimation({
      container: lottieElement, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://assets10.lottiefiles.com/packages/lf20_DVxKAW.json" // the path to the animation json
    });
  }
};
</script>

<style scoped>
.home-button {
  background-color: #ffcea2;
  color: #445d5b;
  padding: 5px 25px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 900;
  transition: all 0.3s ease;
}

.home-button:hover,
.home-button:active {
  background-color: #ffffff;
}

.error-container {
  height: 100vh;
  width: 100vw;
  background-color: #445d5b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-text {
  margin: 20px 0;
  color: #ffcea2;
}

.error-text-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #445d5b;
  z-index: 10000;
}

/* .lottie {
  height: 900px;
} */
</style>
