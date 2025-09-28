import { ref, computed, watch } from 'vue';
import _ from 'lodash';
import imageSetsAPI from '@/api/imageSets.js';
import { useR18ModeStore } from '../stores/r18ModeStore.js';

/**
 * @description A composable function to manage image set data, including fetching, filtering, and sorting.
 */
export function useImageSets() {
  // Store
  const r18ModeStore = useR18ModeStore();
  const isR18 = computed(() => r18ModeStore.isR18);

  // State
  const imageSetsData = ref([]);

  const SORT_KEY = 'image-sets-sort-field';
  const ORDER_KEY = 'image-sets-sort-order';

  const currentSort = ref(localStorage.getItem(SORT_KEY) || 'name');
  const currentOrder = ref(localStorage.getItem(ORDER_KEY) || 'asc');
  const fetchError = ref(null);

  // Computed Properties
  const filteredImageSetsData = computed(() => {
    if (!isR18.value) {
      return _.filter(imageSetsData.value, (card) => !card.is_r18);
    }
    return imageSetsData.value;
  });

  const sortedImageSets = computed(() => {
    if (filteredImageSetsData.value.length > 0) {
      const sortKey = currentSort.value === 'name' ? 'name' : 'add_date';
      const sortData = _.sortBy(filteredImageSetsData.value, sortKey);
      return currentOrder.value === 'asc' ? sortData : sortData.reverse();
    }
    return [];
  });

  const imageSetNumber = computed(() => filteredImageSetsData.value.length);

  // Watchers for localStorage persistence
  watch(currentSort, (value) => {
    localStorage.setItem(SORT_KEY, value);
  });

  watch(currentOrder, (value) => {
    localStorage.setItem(ORDER_KEY, value);
  });

  // Methods
  async function fetchImageSets(params) {
    fetchError.value = null;
    try {
      imageSetsData.value = await imageSetsAPI.getImageSets(params);
    } catch (error) {
      console.error("Failed to fetch image set data:", error);
      fetchError.value = error;
      imageSetsData.value = [];
    }
  }

  function changeSort(command) {
    if (['asc', 'desc'].includes(command)) {
      currentOrder.value = command;
    } else {
      currentSort.value = command;
    }
  }

  return {
    // State
    currentSort,
    currentOrder,
    fetchError,
    // Computed
    sortedImageSets,
    imageSetNumber,
    // Methods
    fetchImageSets,
    changeSort,
  };
}
