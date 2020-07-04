<template>
  <div class="progress-container">
    <div class="progress" id="progressBar"></div>
    <h1 class="timerText"></h1>
    <div class="claimText">Claim Coin</div>
    <done fill="#ffcea2" class="done"></done>
    <logo fill="#ffcea2" class="logo"></logo>
  </div>
</template>

<script>
import ProgressBar from "progressbar.js";
import Timer from "easytimer.js";
export default {
  data() {
    return {
      timestamp: null,
      claimOnProgress: false
    };
  },
  props: ["chain", "userToken"],
  methods: {
    timeOrganizer(claimTimeRemaining) {
      const timerContent = document.querySelector(".timerText");
      const cliamContent = document.querySelector(".claimText");
      if (claimTimeRemaining < Date.now()) {
        return;
      }
      const timer = new Timer();
      timer.start({
        countdown: true,
        startValues: { seconds: (claimTimeRemaining - Date.now()) / 1000 }
      });
      timer.addEventListener("secondsUpdated", e => {
        timerContent.textContent = timer
          .getTimeValues()
          .toString()
          .slice(3, 9);
      });
    },

    progressBarHandler(claimTimeRemaining) {
      var progressBar = new ProgressBar.Circle("#progressBar", {
        strokeWidth: 10,
        color: "#ffcea2",
        trailWidth: 6,
        trailColor: "#2d3436"
      });
      progressBar.animate(
        1,
        {
          duration:
            claimTimeRemaining > Date.now()
              ? claimTimeRemaining - Date.now()
              : 0
        },
        () => {
          const timerContent = document.querySelector(".timerText");
          const cliamContent = document.querySelector(".claimText");
          const progress = document.querySelector(".progress");
          const done = document.querySelector(".done");
          const logo = document.querySelector(".logo");
          timerContent.style.opacity = "0";
          timerContent.style.fontSize = "0";
          cliamContent.style.opacity = "1";
          cliamContent.style.fontSize = "30px";
          cliamContent.style.cursor = "pointer";
          progress.style.cursor = "pointer";
          progress.addEventListener("click", async () => {
            if (!this.claimOnProgress) {
              this.claimOnProgress = !this.claimOnProgress;
              cliamContent.style.opacity = "0";
              cliamContent.style.fontSize = "0";
              try {
                if (window.matchMedia("(min-width: 900px)")) {
                  logo.style.height = "130px";
                  logo.style.width = "130px";
                } else {
                  logo.style.height = "100px";
                  logo.style.width = "100px";
                }
                await this.$axios.$post(
                  "https://us-central1-owl-coin-21e72.cloudfunctions.net/app/api/blockchain/addblock",
                  { token: this.userToken }
                );
                logo.style.height = "0px";
                logo.style.width = "0px";
              } catch (err) {
                logo.style.height = "0px";
                logo.style.width = "0px";
                this.$emit("showError", err.message);
              }

              if (window.matchMedia("(min-width: 900px)")) {
                done.style.height = "150px";
                done.style.width = "150px";
              } else {
                done.style.height = "100px";
                done.style.width = "100px";
              }
              done.style.opacity = "1";
              setTimeout(() => {
                this.claimOnProgress = !this.claimOnProgress;
                this.$emit("moneyClaimed");
              }, 1000);
            }
          });
        }
      );
    }
  },
  mounted() {
    this.timestamp = this.chain[this.chain.length - 1].data.nextClaim;
    this.timeOrganizer(this.timestamp);
    this.progressBarHandler(this.timestamp);
  }
};
</script>

<style>
.progress-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  position: relative;
}

.progress {
  height: 300px;
  width: 300px;
  z-index: 100;
}

.timerText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffcea2;
  font-weight: 600;
  font-size: 50px;
  transition: all 0.6s ease;
}

.claimText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  font-size: 0px;
  transition: all 0.6s ease;
  color: #ffcea2;
  font-weight: 700;
}

.done {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 0px;
  width: 0px;
  opacity: 0;
  transition: all 0.6s ease;
}
.logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 0px;
  width: 0px;
  transition: all 0.6s ease;
  animation: loading 1s ease infinite;
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
@media screen and (min-width: 900px) {
  .progress-container {
    flex-grow: 1;
  }

  .progress {
    height: 350px;
    width: 350px;
  }
}
</style>
