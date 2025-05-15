/*!

=========================================================
* Vue Argon Design System - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.use(Argon);

router.afterEach((to) => {
  console.log("object, to", to);
  // Check if the route is '/home'
  // if (to.fullPath === "/home") {
  // Create a new <script> element to load an external JavaScript file
  const script = document.createElement("script");
  script.src = "/js/waiting.js"; // Path to the script file
  script.type = "text/javascript"; // Set the type attribute to JavaScript
  script.async = true; // Allow the script to load asynchronously

  // Check if the script has already been added to the DOM to avoid duplicate additions
  if (!document.querySelector(`script[src="${script.src}"]`)) {
    document.body.appendChild(script); // Append the script to the body
  }
  // }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
