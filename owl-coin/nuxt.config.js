export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap"
      }
      // {
      //   rel: "stylesheet",
      //   type: "text/css",
      //   href:
      //     "https://raw.githubusercontent.com/loadingio/loading-bar/master/dist/loading-bar.css"
      // }
    ],
    script: [
      {
        type: "text/javascript",
        src:
          "https://raw.githubusercontent.com/kimmobrunfeldt/progressbar.js/master/dist/progressbar.min.js",
        defer: true,
        hid: "stripe"
      }
    ]
  },

  /*
   ** Global CSS
   */
  css: ["@/assets/global.css"],
  /*
   ** Loading bar Customization
   */
  loading: {
    color: "#ffcea2"
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ["@/plugins/components.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/firebase"
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Firebase module configuration
   */
  firebase: {
    config: {
      apiKey: "AIzaSyBgjS6_BbxaswHhbN5L2oLW6YzQGa7_I00",
      authDomain: "owl-coin-21e72.firebaseapp.com",
      databaseURL: "https://owl-coin-21e72.firebaseio.com",
      projectId: "owl-coin-21e72",
      storageBucket: "owl-coin-21e72.appspot.com",
      messagingSenderId: "906249714721",
      appId: "1:906249714721:web:30b7aac710bc4323ea3760",
      measurementId: "G-V4MQ6RQL1P"
    },
    services: {
      auth: true,
      firestore: true,
      functions: true
    }
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {}
};
