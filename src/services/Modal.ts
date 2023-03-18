import { ref } from "vue";

export default function useModal() {
  const visible = ref<boolean>(false);

  const showModal = () => {
    visible.value = true;
  };

  const closeModal = () => {
    visible.value = false;
  };

  return {
    closeModal,
    visible,
    showModal,
  };
}
