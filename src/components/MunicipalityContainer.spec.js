import { mount, createLocalVue } from "@vue/test-utils";
import MunicipalityContainer from "./MunicipalityContainer.vue";
import MdAutocomplete from 'vue-material';
import MdProgress from 'vue-material';

it("mounts without crashing", () => {
  const localVue = createLocalVue();
  localVue.use(MdAutocomplete);
  localVue.use(MdProgress);
  const wrapper = mount(MunicipalityContainer, {
    localVue
  });
})