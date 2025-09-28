import {computed, ref, watch} from "vue"
import _ from "lodash"
import comicsAPI from "@/api/comics.js"
import {useR18ModeStore} from "../stores/r18ModeStore.js"

/**
 * @description A composable function to manage comic data, including fetching, filtering, and sorting.
 */
export function useComics() {
  // Store
  const r18ModeStore = useR18ModeStore()
  const isR18 = computed(() => r18ModeStore.isR18)

  // State
  const comicCardsData = ref([])

  const SORT_KEY = "comics-sort-field"
  const ORDER_KEY = "comics-sort-order"

  const currentSort = ref(localStorage.getItem(SORT_KEY) || "name")
  const currentOrder = ref(localStorage.getItem(ORDER_KEY) || "asc")
  const fetchError = ref(null)

  // Computed Properties
  const filteredComicCardsData = computed(() => {
    if (!isR18.value) {
      return _.filter(comicCardsData.value, (card) => !card.is_r18)
    }
    return comicCardsData.value
  })

  const sortedComicCards = computed(() => {
    if (filteredComicCardsData.value.length > 0) {
      const sortKey = currentSort.value === "name" ? "name" : "add_date"
      const sortData = _.sortBy(filteredComicCardsData.value, sortKey)
      return currentOrder.value === "asc" ? sortData : sortData.reverse()
    }
    return []
  })

  const comicNumber = computed(() => filteredComicCardsData.value.length)

  // Watchers for localStorage persistence
  watch(currentSort, (value) => {
    localStorage.setItem(SORT_KEY, value)
  })

  watch(currentOrder, (value) => {
    localStorage.setItem(ORDER_KEY, value)
  })

  // Methods
  async function fetchComics(params) {
    fetchError.value = null
    try {
      comicCardsData.value = await comicsAPI.getComics(params)
      console.log(comicCardsData.value)
    } catch (error) {
      console.error("Failed to fetch comic data:", error)
      fetchError.value = error
      comicCardsData.value = []
    }
  }

  function changeSort(command) {
    if (["asc", "desc"].includes(command)) {
      currentOrder.value = command
    } else {
      currentSort.value = command
    }
  }

  return {
    // State
    currentSort,
    currentOrder,
    fetchError,
    // Computed
    sortedComicCards,
    comicNumber,
    // Methods
    fetchComics,
    changeSort,
  }
}
