import { ref } from 'vue';

const HISTORY_STORAGE_KEY = 'pvo-browsing-history';
const MAX_HISTORY_ITEMS = 20; // 设置一个最大存储上限

/**
 * 一个用于管理浏览历史的组合式函数
 * @returns {{getHistory: (function(*): *[]), addItemToHistory: (function(*): void)}}
 */
export function useHistory() {
  const history = ref(getHistoryFromStorage());

  /**
   * 从 localStorage 获取历史记录
   * @returns {*[]}
   */
  function getHistoryFromStorage() {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Error reading history from localStorage:', error);
      return [];
    }
  }

  /**
   * 将历史记录保存到 localStorage
   * @param {Array} historyItems
   */
  function saveHistoryToStorage(historyItems) {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyItems));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }

  /**
   * 添加一个项目到历史记录中
   * 如果项目已存在，则将其移动到最前面
   * @param {object} newItem - 包含 id 和 type 的项目对象
   */
  function addItemToHistory(newItem) {
    if (!newItem || !newItem.id || !newItem.type) {
      console.error('History item must have an id and type.', newItem);
      return;
    }

    // 移除已存在的相同项目
    const filteredHistory = history.value.filter(
      (item) => !(item.id === newItem.id && item.type === newItem.type)
    );

    // 将新项目添加到最前面
    const newHistory = [newItem, ...filteredHistory];

    // 限制历史记录的数量
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory.splice(MAX_HISTORY_ITEMS);
    }

    history.value = newHistory;
    saveHistoryToStorage(newHistory);
  }

  /**
   * 获取指定数量的历史记录
   * @param {number} limit - 需要获取的数量
   * @returns {*[]}
   */
  function getHistory(limit = 10) {
    return history.value.slice(0, limit);
  }

  /**
   * 清除所有历史记录
   */
  function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      history.value = [];
    } catch (error) {
      console.error('Error clearing history from localStorage:', error);
    }
  }

  return {
    addItemToHistory,
    getHistory,
    clearHistory,
  };
}
