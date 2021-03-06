import "./logger-init.js";

import Vue from 'vue'
import App from './App.vue'

import MdAutocomplete from 'vue-material'
import MdProgress from 'vue-material';
import MdSnackbar from 'vue-material';
import MdButton from 'vue-material';
import MdCard from 'vue-material';
import MdTooltip from 'vue-material';
import MdMenu from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import "leaflet/dist/leaflet.css";

logger.setLevel(logger.WARN); // eslint-disable-line no-undef
logger.info("Logger har started"); // eslint-disable-line no-undef

Vue.config.productionTip = false;
Vue.use(
  MdAutocomplete, 
  MdProgress, 
  MdSnackbar,
  MdButton,
  MdCard,
  MdTooltip,
  MdMenu
);

new Vue({
  render: h => h(App),
}).$mount('#app');
