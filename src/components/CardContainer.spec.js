import { mount, createLocalVue } from "@vue/test-utils";
import CardContainer from "./CardContainer.vue";
import MdAutocomplete from 'vue-material'
import MdProgress from 'vue-material';
import MdSnackbar from 'vue-material';
import MdButton from 'vue-material';
import MdCard from 'vue-material';
import MdTooltip from 'vue-material';
import MdMenu from 'vue-material';

describe("method", () => {
  const localVue = createLocalVue();
  localVue.use(
    MdAutocomplete, 
    MdProgress, 
    MdSnackbar,
    MdButton,
    MdCard,
    MdTooltip,
    MdMenu
  );
  const wrapper = mount(CardContainer, {
    localVue
  });

  describe("addMunicipalityCard", () => {
/*     it("adds 1 if the existing numbers array is []", () => {
      wrapper.setData({
        numbers: [1]
      });
      expect(wrapper.vm.numbers).toEqual([1]);
      wrapper.vm.addMunicipalityCard();
      expect(wrapper.vm.numbers).toEqual([1, 2]);
    }); */

    it("adds 3 if the existing numbers array is [1, 2]", () => {
      wrapper.setData({
        numbers: [1, 2]
      });
      expect(wrapper.vm.numbers).toEqual([1, 2]);
      wrapper.vm.addMunicipalityCard();
      expect(wrapper.vm.numbers).toEqual([1, 2, 3]);
    });

/*     it("adds 4 if existing numbers array is [1, 3]", () => {
      wrapper.setData({
        numbers: [1, 3]
      });
      expect(wrapper.vm.numbers).toEqual([1, 3]);
    }) */
  })
})