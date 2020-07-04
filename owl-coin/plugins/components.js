import Vue from "vue";

//-> SVG components
import logoComponent from "@/components/SVGs/logo.vue";
import emailComponent from "@/components/SVGs/email.vue";
import passwordComponent from "@/components/SVGs/password.vue";
import faceComponent from "@/components/SVGs/face.vue";
import avatarComponent from "@/components/SVGs/avatar.vue";
import doneComponent from "@/components/SVGs/done.vue";
import searchComponent from "@/components/SVGs/search.vue";

Vue.component("logo", logoComponent);
Vue.component("email", emailComponent);
Vue.component("password", passwordComponent);
Vue.component("face", faceComponent);
Vue.component("avatar", avatarComponent);
Vue.component("search", searchComponent);
Vue.component("done", doneComponent);

//-> Page components
import progressBarComponent from "@/components/progressbar.vue";
import statsComponent from "@/components/stats.vue";
import recieverComponent from "@/components/reciever.vue";
import selectAmountComponent from "@/components/select-amount.vue";
import confirmComponent from "@/components/confirm.vue";

Vue.component("progress-bar", progressBarComponent);
Vue.component("stats", statsComponent);
Vue.component("reciever", recieverComponent);
Vue.component("select-amount", selectAmountComponent);
Vue.component("confirm", confirmComponent);
