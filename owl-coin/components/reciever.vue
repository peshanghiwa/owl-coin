<template>
  <div class="container">
    <h1 class="main-header">Choose Receiver</h1>
    <div class="search-bar-container">
      <input
        autocomplete="off"
        placeholder="Search for Users"
        type="text"
        class="search-bar"
        name="searchbar"
        v-model="search"
        @input="searchUsers"
      />
      <search class="search-icon" fill="black" height="33px"></search>
    </div>
    <div class="users-main-container">
      <div class="users-container">
        <h3
          class="user"
          v-for="(user, index) in users"
          :key="index"
          @click="selectUser(index)"
        >{{user}}</h3>
      </div>
    </div>
    <div class="next-button-container">
      <button
        @click="chooseUser"
        class="next-button"
        disabled
      >{{choosedUser == null || "" ? "Choose User!": "Next"}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      docIds: [],
      users: [],
      alternateUsers: [],
      choosedUser: null,
      buttonText: "Select Reciever!"
    };
  },
  props: ["userId"],
  async fetch() {
    try {
      const usersQuery = await this.$fireStore.collection("users").get();
      usersQuery.forEach(doc => {
        if (doc.data().currupted == false && this.userId != doc.id) {
          this.docIds.push(doc.id);
          this.users.push(doc.data().fullName);
          this.alternateUsers.push(doc.data().fullName);
        }
      });
    } catch (err) {
      this.$emit("showError", err.message);
    }
  },
  methods: {
    selectUser(index) {
      const userDocuments = document.querySelectorAll(".user");
      const button = document.querySelector(".next-button");
      button.removeAttribute("disabled");
      userDocuments.forEach(user => {
        user.classList.remove("selected");
      });
      userDocuments[index].classList.add("selected");
      this.choosedUser = this.users[index];
    },
    deselectUser() {
      const button = document.querySelector(".next-button");
      button.setAttribute("disabled", "");
      const userDocuments = document.querySelectorAll(".user");
      userDocuments.forEach(user => {
        user.classList.remove("selected");
      });
      this.choosedUser = null;
    },
    searchUsers() {
      this.deselectUser();
      const regex = new RegExp(this.search, "gi");
      if (this.search == "") {
        // this.buttonText = "Select Reciever!";
        this.users = this.alternateUsers;
      } else {
        // this.buttonText = "Next";
        this.users = this.alternateUsers.filter(
          user => user.search(regex) !== -1
        );
      }
    },
    chooseUser() {
      const userId = this.docIds[this.users.indexOf(this.choosedUser)];
      this.$emit("userChoosed", { userId, name: this.choosedUser });
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

.search-bar-container {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}

.search-bar {
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
  right: 14%;
  transform: translate(-50%, -50%);
  fill: #445d5b;
}

.users-main-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
}

.users-container {
  width: 70%;
}

.user {
  color: #445d5b;
  display: inline-block;
  background-color: white;
  border-radius: 30px;
  padding: 5px 10px;
  margin: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.users-container .user:hover,
.users-container .user:active {
  background-color: #ffcea2;
}

.selected {
  background-color: #ff6364;
  color: white;
  font-weight: 600;
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
</style>