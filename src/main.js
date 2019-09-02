import Vue from 'vue'
import App from './App.vue'

import MdAutocomplete from 'vue-material'
import MdProgress from 'vue-material';
import MdSnackbar from 'vue-material';
import MdButton from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';


Vue.config.productionTip = false;
Vue.use(MdAutocomplete);
Vue.use(MdProgress);
Vue.use(MdSnackbar);
Vue.use(MdButton);

new Vue({
  render: h => h(App),
}).$mount('#app');
