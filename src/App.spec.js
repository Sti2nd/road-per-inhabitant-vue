import { mount, createLocalVue } from "@vue/test-utils";
import MdSnackbar from 'vue-material';
import MdButton from 'vue-material';
import App from "./App.vue";

it("mounts without crashing", () => {
  const localVue = createLocalVue();
  localVue.use(MdSnackbar);
  localVue.use(MdButton);
  const wrapper = mount(App, {
    localVue
  });
});