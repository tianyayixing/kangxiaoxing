import CryptoJS from 'crypto-js';

const SECRET_KEY = 'diet-manager-secret-key-2024';

/**
 * 加密数据
 */
function encrypt(data) {
  const jsonStr = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
}

/**
 * 解密数据
 */
function decrypt(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
}

/**
 * 本地存储工具类
 */
export const storage = {
  /**
   * 保存数据（加密）
   */
  set(key, value) {
    try {
      const encrypted = encrypt(value);
      localStorage.setItem(key, encrypted);
      // 触发自定义存储变化事件
      window.dispatchEvent(new CustomEvent('storageChange', { detail: { key, value } }));
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  },

  /**
   * 获取数据（解密）
   */
  get(key, defaultValue = null) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return defaultValue;
      const decrypted = decrypt(encrypted);
      return decrypted !== null ? decrypted : defaultValue;
    } catch (error) {
      console.error('获取数据失败:', error);
      return defaultValue;
    }
  },

  /**
   * 删除数据
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * 清空所有数据
   */
  clear() {
    localStorage.clear();
  }
};

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  USER_SETTINGS: 'user_settings',          // 用户设置
  DIET_PLAN: 'diet_plan',                  // 饮食计划
  DISH_HISTORY: 'dish_history',            // 历史菜品
  WEEKLY_REPORTS: 'weekly_reports',        // 周报告
  FIRST_LAUNCH: 'first_launch',            // 首次启动
  CUSTOM_DISHES: 'custom_dishes',          // 自定义菜品
  DELETED_SYSTEM_DISHES: 'deleted_system_dishes',  // 已删除的系统菜品ID列表
  MODIFIED_SYSTEM_DISHES: 'modified_system_dishes', // 修改过的系统菜品
};