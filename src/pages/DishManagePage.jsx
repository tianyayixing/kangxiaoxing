import { useState, useEffect } from 'react'
import { 
  NavBar, 
  Tabs, 
  SearchBar, 
  Card, 
  Button, 
  Toast,
  Popup,
  Form,
  FloatingBubble,
  Selector
} from 'antd-mobile'
import { 
  EditSOutline, 
  DeleteOutline 
} from 'antd-mobile-icons'
import { storage, STORAGE_KEYS } from '../utils/storage'
import './DishManagePage.css'

// 模拟营养信息获取函数
const fetchNutritionInfo = (dishName) => {
  // 模拟API调用延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据菜品名称返回模拟的营养信息
      const nutritionData = {
        calories: Math.floor(Math.random() * 200) + 100,
        protein: (Math.random() * 20 + 5).toFixed(1),
        fat: (Math.random() * 15 + 2).toFixed(1),
        carbs: (Math.random() * 30 + 10).toFixed(1),
        fiber: (Math.random() * 5 + 1).toFixed(1),
        vitaminC: Math.floor(Math.random() * 50),
        vitaminB: Math.floor(Math.random() * 20),
        // 添加制作步骤和小贴士
        steps: generateCookingSteps(dishName),
        tips: generateCookingTips(dishName)
      };
      resolve(nutritionData);
    }, 1000);
  });
};

// 生成制作步骤
const generateCookingSteps = (dishName) => {
  const baseSteps = [
    `准备${dishName}所需的主要食材`,
    '清洗并处理食材',
    '根据需要切配食材',
    '热锅下油，调整火力',
    '按顺序下入食材进行烹饪',
    '加入调味料调整口味',
    '继续烹饪至食材熟透',
    '装盘并进行最后装饰'
  ];
  
  // 根据不同菜品类型调整步骤
  if (dishName.includes('汤')) {
    baseSteps.splice(4, 0, '加入适量清水或高汤');
    baseSteps.splice(6, 0, '小火慢炖至食材软烂');
    baseSteps[7] = '调味后继续煮制2-3分钟';
  } else if (dishName.includes('炒')) {
    baseSteps[4] = '热锅下油，油温六成热时下入主料';
    baseSteps[5] = '大火快炒至断生';
    baseSteps.splice(6, 0, '加入配料继续翻炒');
  } else if (dishName.includes('蒸')) {
    baseSteps[4] = '将处理好的食材摆放在蒸盘中';
    baseSteps[5] = '水开后上锅蒸制';
    baseSteps[6] = '根据食材大小调整蒸制时间';
  } else if (dishName.includes('炖')) {
    baseSteps[4] = '热锅下油，爆香调料';
    baseSteps.splice(5, 0, '下入主料翻炒均匀');
    baseSteps.splice(6, 0, '加入足量汤汁或水');
    baseSteps[7] = '转小火慢炖至入味';
  }
  
  return baseSteps;
};

// 生成烹饪小贴士
const generateCookingTips = (dishName) => {
  const tips = [
    '食材新鲜是美味的基础',
    '火候掌握是关键，不同食材需要不同的火力',
    '调味要适量，可先少加再逐步调整',
    '出锅前尝味，确保口感适宜'
  ];
  
  // 根据不同菜品类型添加特定提示
  if (dishName.includes('汤')) {
    tips.push('煲汤时冷水下锅，能更好地释放食材营养');
    tips.push('盐最后放，避免食材变老');
  } else if (dishName.includes('炒')) {
    tips.push('炒菜要大火快炒，保持食材脆嫩');
    tips.push('提前将所有食材和调料准备好，避免手忙脚乱');
  } else if (dishName.includes('蒸')) {
    tips.push('蒸菜能最大程度保留食材营养');
    tips.push('水开后再上锅，保持蒸汽充足');
  } else if (dishName.includes('炖')) {
    tips.push('炖菜时间要充足，让食材充分入味');
    tips.push('一次性加足水量，避免中途加水影响口感');
  }
  
  return tips.join('；');
};

// 根据菜品名称建议分类
const suggestCategory = (dishName) => {
  const categoryKeywords = {
    '早餐': ['粥', '豆浆', '牛奶', '面包', '煎蛋', '燕麦', '馒头', '包子', '花卷', '油条', '烧饼', '鸡蛋', '煎饼', '茶叶', '玉米粥'],
    '主食': ['米饭', '面条', '馒头', '玉米', '红薯', '土豆', '山药', '紫薯', '意面', '荞麦', '糯米', '薏米', '小米', '黑米', '燕麦'],
    '蔬菜': ['西蓝花', '菠菜', '胡萝卜', '西红柿', '黄瓜', '白菜', '芹菜', '茄子', '豆角', '生菜', '油菜', '香菇', '金针菇', '平菇', '海带', '冬瓜', '丝瓜', '苦瓜', '洋葱', '韭菜', '芦笋', '莲藕', '萝卜', '莴笋', '茭白', '竹笋', '南瓜', '秋葵', '西葫芦'],
    '肉类': ['鸡胸肉', '牛肉', '猪肉', '鱼肉', '虾', '鸡蛋', '羊肉', '鸭肉', '鹅肉', '兔肉', '鹌鹑', '鸽子', '火鸡', '鹿肉', '鸵鸟', '鳄鱼'],
    '豆制品': ['豆腐', '豆腐干', '豆浆', '腐竹', '千张', '素鸡', '豆皮', '豆腐脑', '臭豆腐', '纳豆'],
    '水果': ['苹果', '香蕉', '橙子', '葡萄', '草莓', '西瓜', '梨', '桃子', '猕猴桃', '柠檬'],
    '汤类': ['汤', '羹', '紫菜蛋花汤', '炖鸡汤'],
    '粥': ['粥', '小米粥', '玉米粥'],
    '菌菇': ['香菇', '金针菇', '平菇', '木耳', '蘑菇'],
    '坚果': ['核桃', '杏仁', '花生', '瓜子', '腰果', '松子'],
    '家常菜': ['炒', '红烧', '蒸', '炖', '煮', '拌', '烤', '番茄炒蛋', '青椒肉丝', '麻婆豆腐', '红烧肉', '宫保鸡丁', '鱼香肉丝', '糖醋里脊', '木须肉', '回锅肉', '蒜蓉西蓝花', '红烧茄子', '凉拌豆皮', '蒜泥白肉', '手撕包菜', '红烧排骨', '土豆炖牛肉', '清蒸鲈鱼', '蒜蓉粉丝蒸虾', '蒸南瓜', '烤鸡翅', '烤茄子', '蒜苔炒肉', '韭菜炒蛋', '糖醋排骨', '可乐鸡翅', '红烧鸡翅', '冬瓜排骨汤', '西红柿牛腩汤', '水煮鱼', '口水鸡', '夫妻肺片', '蚂蚁上树', '地三鲜', '干煸豆角', '鱼香茄子', '辣子鸡', '酸菜鱼', '毛血旺', '水煮肉片', '干锅花菜', '剁椒鱼头', '梅菜扣肉', '粉蒸肉', '东坡肉', '白切鸡', '白灼虾', '葱烧海参', '油焖大虾', '干锅牛蛙', '香辣蟹', '避风塘炒蟹', '铁板鱿鱼', '蒜蓉蒸扇贝', '豆豉蒸排骨', '梅干蒸排骨', '糖醋藕块', '干锅土豆片', '虎皮青椒', '藠头炒腊肉', '藠头炒鸡蛋', '藠头炒牛肉', '藠头炒鸡丁', '藠头炒鱿鱼', '藠头炒虾仁', '藠头炒豆腐', '藠头炒肉丝', '藠头炒鸡胗', '藠头炒腰花', '藠头炒猪肝', '藠'],
    '凉菜': ['拍黄瓜', '凉拌', '凉拌木耳'],
    '炖菜': ['炖', '红烧排骨', '土豆炖牛肉'],
    '海鲜': ['鱼', '虾', '蟹', '贝', '海带', '紫菜'],
    '饮品': ['豆浆', '牛奶', '茶', '咖啡', '果汁'],
    '甜品': ['蛋糕', '布丁', '冰淇淋', '酸奶']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => dishName.includes(keyword))) {
      return category;
    }
  }
  
  return '家常菜'; // 默认分类
};

// 根据菜品名称和分类建议Emoji图标
const suggestEmoji = (dishName, category) => {
  const emojiMap = {
    '早餐': '🍳',
    '主食': '🍚',
    '蔬菜': '🥦',
    '肉类': '🍗',
    '海鲜': '🐟',
    '豆制品': '🧊',
    '水果': '🍎',
    '汤类': '🥣',
    '粥': '🥣',
    '菌菇': '🍄',
    '坚果': '🥜',
    '家常菜': '🍽️',
    '饮品': '🥤',
    '甜品': '🍰',
    '凉菜': '🥗',
    '炖菜': '🍲'
  };
  
  // 根据名称关键词进一步细化
  if (dishName.includes('蛋')) return '🥚';
  if (dishName.includes('奶')) return '🥛';
  if (dishName.includes('鱼')) return '🐟';
  if (dishName.includes('虾')) return '🦐';
  if (dishName.includes('肉')) return '🥩';
  if (dishName.includes('菜')) return '🥬';
  if (dishName.includes('果')) return '🍇';
  if (dishName.includes('汤')) return '🥣';
  if (dishName.includes('粥')) return '🥣';
  if (dishName.includes('鸡')) return '🐔';
  if (dishName.includes('牛')) return '🐮';
  if (dishName.includes('猪')) return '🐷';
  if (dishName.includes('羊')) return '🐑';
  if (dishName.includes('鸭')) return '🦆';
  if (dishName.includes('鹅')) return '🦢';
  if (dishName.includes('藠')) return '藠';
  
  return emojiMap[category] || '🍽️';
};

// 解析步骤内容，提取时间、选材、调料等信息
const parseStepContent = (step) => {
  // 如果步骤是对象格式，直接返回
  if (typeof step === 'object' && step !== null) {
    return {
      main: step.description || step.main || '',
      materials: step.materials || '',
      seasoning: step.seasoning || '',
      time: step.time || '',
      tips: step.tips || ''
    };
  }
  
  // 如果是字符串格式，尝试解析其中的信息
  const stepStr = step.toString();
  
  // 对于现有的数据格式，我们尝试提取一些基本信息
  // 检查是否包含时间信息
  const timeMatch = stepStr.match(/(\d+分钟|\d+秒|\d+小时|\d+分)/);
  const time = timeMatch ? timeMatch[1] : '';
  
  // 检查是否包含温度信息
  const tempMatch = stepStr.match(/(\d+度|\d+℃)/);
  const temperature = tempMatch ? tempMatch[1] : '';
  
  // 检查是否包含火候信息
  const fireMatch = stepStr.match(/(大火|中火|小火|文火|旺火)/);
  const fire = fireMatch ? fireMatch[1] : '';
  
  // 检查是否包含操作提示
  const tipMatch = stepStr.match(/(注意|避免|确保|保持|建议|可以|最好)/);
  const tips = tipMatch ? tipMatch[1] : '';
  
  return {
    main: stepStr,
    materials: '',
    seasoning: '',
    time: time || '',
    temperature: temperature || '',
    fire: fire || '',
    tips: tips || ''
  };
};

function DishManagePage({ onBack }) {
  const [activeTab, setActiveTab] = useState('dishes')
  const [dishes, setDishes] = useState([])
  const [filteredDishes, setFilteredDishes] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [loading, setLoading] = useState(false)
  const [showAddDish, setShowAddDish] = useState(false)
  const [showEditDish, setShowEditDish] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [autoFetching, setAutoFetching] = useState(false)
  const [showDishDetail, setShowDishDetail] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  
  // 为添加菜品弹窗添加本地状态
  const [addDishData, setAddDishData] = useState({
    name: '',
    category: '',
    image: '',
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
    fiber: '',
    vitaminC: '',
    vitaminB: '',
    cookingMethod: '',
    effect: '',
    steps: '',
    tips: ''
  })

  // 初始化存储键
  useEffect(() => {
    // 初始化自定义菜品
    const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, null)
    if (customDishes === null) {
      storage.set(STORAGE_KEYS.CUSTOM_DISHES, [])
    }
    
    // 初始化已删除系统菜品
    const deletedSystemDishes = storage.get(STORAGE_KEYS.DELETED_SYSTEM_DISHES, null)
    if (deletedSystemDishes === null) {
      storage.set(STORAGE_KEYS.DELETED_SYSTEM_DISHES, [])
    }
    
    // 初始化修改过的系统菜品
    const modifiedSystemDishes = storage.get(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, null)
    if (modifiedSystemDishes === null) {
      storage.set(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, {})
    }
    
    // 初始化系统菜品（如果不存在）
    const systemDishes = storage.get(STORAGE_KEYS.SYSTEM_DISHES, null)
    if (systemDishes === null) {
      // 使用扩展的系统菜品数据，增加到100种
      const defaultSystemDishes = [
        // 早餐类 (20种)
        { id: 1, name: '煎蛋', category: '早餐', calories: 155, protein: 13, fat: 11, carbs: 1, fiber: 0, vitaminC: 0, vitaminB: 8, image: '🍳', cookingMethod: '热锅加油，打入鸡蛋，煎至两面金黄', effect: '富含蛋白质，提供能量' },
        { id: 2, name: '牛奶', category: '早餐', calories: 150, protein: 8, fat: 8, carbs: 12, fiber: 0, vitaminC: 2, vitaminB: 15, image: '🥛', cookingMethod: '直接饮用或加热', effect: '补钙，促进骨骼健康' },
        { id: 3, name: '全麦面包', category: '早餐', calories: 247, protein: 13, fat: 4, carbs: 41, fiber: 7, vitaminC: 0, vitaminB: 25, image: '🍞', cookingMethod: '烘烤或直接食用', effect: '富含膳食纤维，促进消化' },
        { id: 4, name: '燕麦粥', category: '早餐', calories: 389, protein: 17, fat: 7, carbs: 66, fiber: 10, vitaminC: 0, vitaminB: 30, image: '🥣', cookingMethod: '加水或牛奶煮制', effect: '降低胆固醇，稳定血糖' },
        { id: 5, name: '豆浆', category: '早餐', calories: 54, protein: 3.3, fat: 1.8, carbs: 4.5, fiber: 1.1, vitaminC: 0, vitaminB: 12, image: '🥛', cookingMethod: '直接饮用或加热', effect: '植物蛋白，易吸收' },
        { id: 6, name: '小米粥', category: '早餐', calories: 46, protein: 1.5, fat: 0.4, carbs: 9, fiber: 0.7, vitaminC: 0, vitaminB: 12, image: '🥣', cookingMethod: '慢煮至黏稠', effect: '养胃，补充B族维生素' },
        { id: 7, name: '鸡蛋灌饼', category: '早餐', calories: 280, protein: 12, fat: 12, carbs: 30, fiber: 2, vitaminC: 1, vitaminB: 10, image: '🥞', cookingMethod: '面粉调糊，摊饼后灌入鸡蛋液', effect: '营养丰富，提供充足能量' },
        { id: 8, name: '包子', category: '早餐', calories: 180, protein: 7, fat: 5, carbs: 28, fiber: 1.2, vitaminC: 2, vitaminB: 10, image: '🥟', cookingMethod: '蒸制', effect: '易消化，饱腹' },
        { id: 9, name: '花卷', category: '早餐', calories: 195, protein: 6, fat: 3, carbs: 36, fiber: 1.5, vitaminC: 0, vitaminB: 8, image: '🥐', cookingMethod: '蒸制', effect: '松软可口' },
        { id: 10, name: '煎饼果子', category: '早餐', calories: 320, protein: 10, fat: 15, carbs: 35, fiber: 3, vitaminC: 4, vitaminB: 12, image: '🥞', cookingMethod: '面糊摊饼，加入鸡蛋和薄脆', effect: '方便快捷，营养均衡' },
        { id: 11, name: '茶叶蛋', category: '早餐', calories: 180, protein: 14, fat: 12, carbs: 1, fiber: 0, vitaminC: 0, vitaminB: 18, image: '🥚', cookingMethod: '鸡蛋煮熟后敲裂，用茶叶汤浸泡', effect: '高蛋白，补充营养' },
        { id: 12, name: '玉米粥', category: '早餐', calories: 96, protein: 3.4, fat: 1.5, carbs: 19, fiber: 2.7, vitaminC: 7, vitaminB: 18, image: '🌽', cookingMethod: '煮或蒸', effect: '富含叶黄素，保护视力' },
        { id: 13, name: '蒸蛋羹', category: '早餐', calories: 80, protein: 7, fat: 5, carbs: 2, fiber: 0, vitaminC: 0, vitaminB: 8, image: '🥚', cookingMethod: '蒸制', effect: '易消化，适合老人小孩' },
        { id: 14, name: '油条', category: '早餐', calories: 395, protein: 7, fat: 22, carbs: 43, fiber: 1.5, vitaminC: 0, vitaminB: 5, image: '🥖', cookingMethod: '面粉发酵后油炸', effect: '口感酥脆，提供能量' },
        { id: 15, name: '烧饼', category: '早餐', calories: 320, protein: 10, fat: 12, carbs: 40, fiber: 2.5, vitaminC: 1, vitaminB: 8, image: '🍪', cookingMethod: '面粉调制后烤制', effect: '香脆可口，饱腹感强' },
        { id: 16, name: '葱油饼', category: '早餐', calories: 260, protein: 7, fat: 12, carbs: 30, fiber: 1.8, vitaminC: 2, vitaminB: 6, image: '🥞', cookingMethod: '面粉调制后烙制', effect: '香脆可口，提供能量' },
        { id: 17, name: '小笼包', category: '早餐', calories: 230, protein: 9, fat: 8, carbs: 28, fiber: 1.5, vitaminC: 3, vitaminB: 9, image: '🥟', cookingMethod: '蒸制', effect: '鲜美多汁，营养丰富' },
        { id: 18, name: '韭菜盒子', category: '早餐', calories: 240, protein: 8, fat: 10, carbs: 28, fiber: 2.2, vitaminC: 24, vitaminB: 12, image: '🥬', cookingMethod: '面粉调制后烙制', effect: '补肾助阳，促进消化' },
        { id: 19, name: '鸡蛋三明治', category: '早餐', calories: 280, protein: 14, fat: 15, carbs: 22, fiber: 2.5, vitaminC: 3, vitaminB: 15, image: '🥪', cookingMethod: '面包夹鸡蛋和蔬菜', effect: '营养均衡，方便携带' },
        { id: 20, name: '皮蛋瘦肉粥', category: '早餐', calories: 85, protein: 6.5, fat: 2.8, carbs: 10, fiber: 0.8, vitaminC: 1, vitaminB: 18, image: '🥣', cookingMethod: '慢煮至黏稠', effect: '养胃，补充蛋白质' },
        
        // 主食类 (20种)
        { id: 21, name: '米饭', category: '主食', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, fiber: 0.4, vitaminC: 0, vitaminB: 5, image: '🍚', cookingMethod: '电饭煲蒸煮', effect: '提供碳水化合物，快速补充能量' },
        { id: 22, name: '馒头', category: '主食', calories: 221, protein: 7, fat: 1, carbs: 47, fiber: 1.3, vitaminC: 0, vitaminB: 8, image: '🥟', cookingMethod: '蒸制15-20分钟', effect: '易消化，适合肠胃不适者' },
        { id: 23, name: '面条', category: '主食', calories: 137, protein: 4.5, fat: 0.5, carbs: 28, fiber: 1.2, vitaminC: 0, vitaminB: 6, image: '🍜', cookingMethod: '煮沸后加调料', effect: '快速饱腹，提供能量' },
        { id: 24, name: '红薯', category: '主食', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, fiber: 3, vitaminC: 20, vitaminB: 15, image: '🍠', cookingMethod: '蒸、烤或煮', effect: '富含膳食纤维，促进肠道健康' },
        { id: 25, name: '玉米', category: '主食', calories: 96, protein: 3.4, fat: 1.5, carbs: 19, fiber: 2.7, vitaminC: 7, vitaminB: 18, image: '🌽', cookingMethod: '煮或蒸', effect: '富含叶黄素，保护视力' },
        { id: 26, name: '土豆', category: '主食', calories: 77, protein: 2, fat: 0.1, carbs: 17, fiber: 2.2, vitaminC: 19, vitaminB: 12, image: '🥔', cookingMethod: '蒸、煮或烤', effect: '低热量，饱腹感强' },
        { id: 27, name: '山药', category: '主食', calories: 57, protein: 1.9, fat: 0.2, carbs: 12, fiber: 1.1, vitaminC: 5, vitaminB: 8, image: '🍠', cookingMethod: '蒸、煮或炒', effect: '健脾养胃，增强免疫' },
        { id: 28, name: '紫薯', category: '主食', calories: 90, protein: 2, fat: 0.2, carbs: 21, fiber: 3, vitaminC: 15, vitaminB: 10, image: '🍠', cookingMethod: '蒸或烤', effect: '富含花青素，抗氧化' },
        { id: 29, name: '意面', category: '主食', calories: 131, protein: 5, fat: 1.3, carbs: 25, fiber: 2.5, vitaminC: 0, vitaminB: 12, image: '🍝', cookingMethod: '煮制后拌酱', effect: '提供能量，口感丰富' },
        { id: 30, name: '荞麦面', category: '主食', calories: 111, protein: 4.4, fat: 1, carbs: 22, fiber: 3.3, vitaminC: 0, vitaminB: 15, image: '🍜', cookingMethod: '煮制', effect: '降血糖，适合三高人群' },
        { id: 31, name: '糯米', category: '主食', calories: 350, protein: 6.5, fat: 1.3, carbs: 75, fiber: 0.8, vitaminC: 0, vitaminB: 8, image: '🍚', cookingMethod: '蒸煮', effect: '补中益气，温暖脾胃' },
        { id: 32, name: '薏米', category: '主食', calories: 361, protein: 12, fat: 3.3, carbs: 71, fiber: 12, vitaminC: 0, vitaminB: 20, image: '🍚', cookingMethod: '煮粥或煮汤', effect: '祛湿健脾，美容养颜' },
        { id: 33, name: '小米', category: '主食', calories: 378, protein: 11, fat: 4.3, carbs: 67, fiber: 8.5, vitaminC: 0, vitaminB: 25, image: '🍚', cookingMethod: '煮粥', effect: '养胃安神，滋阴养血' },
        { id: 34, name: '黑米', category: '主食', calories: 333, protein: 9.4, fat: 3.1, carbs: 67, fiber: 3.9, vitaminC: 0, vitaminB: 18, image: '🍚', cookingMethod: '煮粥或蒸饭', effect: '滋阴补肾，健脾暖肝' },
        { id: 35, name: '燕麦', category: '主食', calories: 389, protein: 16.9, fat: 6.9, carbs: 66.3, fiber: 10.6, vitaminC: 0, vitaminB: 30, image: '🥣', cookingMethod: '煮粥或冲泡', effect: '降胆固醇，控制血糖' },
        { id: 36, name: '藜麦', category: '主食', calories: 368, protein: 14.1, fat: 6.1, carbs: 64.2, fiber: 7, vitaminC: 0, vitaminB: 28, image: '🍚', cookingMethod: '煮制', effect: '全营养食品，高蛋白' },
        { id: 37, name: '糙米', category: '主食', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, fiber: 1.8, vitaminC: 0, vitaminB: 12, image: '🍚', cookingMethod: '煮制', effect: '富含膳食纤维，有助减肥' },
        { id: 38, name: '意大利面', category: '主食', calories: 131, protein: 5, fat: 1.3, carbs: 25, fiber: 2.5, vitaminC: 0, vitaminB: 12, image: '🍝', cookingMethod: '煮制后拌酱', effect: '提供能量，口感丰富' },
        { id: 39, name: '乌冬面', category: '主食', calories: 103, protein: 3.5, fat: 0.5, carbs: 22, fiber: 1.2, vitaminC: 0, vitaminB: 8, image: '🍜', cookingMethod: '煮制后加汤料', effect: '易消化，口感爽滑' },
        { id: 40, name: '拉面', category: '主食', calories: 140, protein: 4.8, fat: 1.2, carbs: 28, fiber: 1.5, vitaminC: 0, vitaminB: 9, image: '🍜', cookingMethod: '煮制后加汤料', effect: '筋道有嚼劲，提供能量' },
        
        // 蔬菜类 (20种)
        { id: 41, name: '西蓝花', category: '蔬菜', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, fiber: 2.6, vitaminC: 89, vitaminB: 12, image: '🥦', cookingMethod: '焯水后炒制', effect: '抗氧化，增强免疫力' },
        { id: 42, name: '菠菜', category: '蔬菜', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, vitaminC: 28, vitaminB: 20, image: '🥬', cookingMethod: '炒或做汤', effect: '补铁，预防贫血' },
        { id: 43, name: '胡萝卜', category: '蔬菜', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, fiber: 2.8, vitaminC: 6, vitaminB: 10, image: '🥕', cookingMethod: '炒、煮或生食', effect: '富含胡萝卜素，保护视力' },
        { id: 44, name: '西红柿', category: '蔬菜', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, vitaminC: 14, vitaminB: 8, image: '🍅', cookingMethod: '生食或炒制', effect: '富含番茄红素，抗氧化' },
        { id: 45, name: '黄瓜', category: '蔬菜', calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5, vitaminC: 3, vitaminB: 4, image: '🥒', cookingMethod: '凉拌或生食', effect: '补水，清热解毒' },
        { id: 46, name: '白菜', category: '蔬菜', calories: 13, protein: 1.5, fat: 0.2, carbs: 2.2, fiber: 1, vitaminC: 45, vitaminB: 6, image: '🥬', cookingMethod: '炒或煮汤', effect: '促进消化，清热解毒' },
        { id: 47, name: '芹菜', category: '蔬菜', calories: 16, protein: 0.7, fat: 0.2, carbs: 3, fiber: 1.6, vitaminC: 3, vitaminB: 5, image: '🌿', cookingMethod: '炒或凉拌', effect: '降血压，利尿' },
        { id: 48, name: '茄子', category: '蔬菜', calories: 25, protein: 1.2, fat: 0.2, carbs: 5.9, fiber: 3, vitaminC: 2, vitaminB: 7, image: '🍆', cookingMethod: '炒、蒸或烤', effect: '降低胆固醇' },
        { id: 49, name: '油菜', category: '蔬菜', calories: 15, protein: 1.5, fat: 0.3, carbs: 2.7, fiber: 1.1, vitaminC: 36, vitaminB: 8, image: '🥬', cookingMethod: '快炒', effect: '补钙，清热解毒' },
        { id: 50, name: '生菜', category: '蔬菜', calories: 14, protein: 0.9, fat: 0.2, carbs: 2.9, fiber: 1.3, vitaminC: 4, vitaminB: 5, image: '🥗', cookingMethod: '生食或快炒', effect: '低热量，适合减肥' },
        { id: 51, name: '豆角', category: '蔬菜', calories: 31, protein: 2, fat: 0.2, carbs: 7, fiber: 3.4, vitaminC: 12, vitaminB: 10, image: '🫘', cookingMethod: '炒或焖', effect: '富含膳食纤维' },
        { id: 52, name: '冬瓜', category: '蔬菜', calories: 12, protein: 0.4, fat: 0.2, carbs: 2.6, fiber: 0.7, vitaminC: 18, vitaminB: 6, image: '🍈', cookingMethod: '煮汤或炒制', effect: '利尿消肿，清热解毒' },
        { id: 53, name: '丝瓜', category: '蔬菜', calories: 20, protein: 1.5, fat: 0.2, carbs: 4.2, fiber: 1.1, vitaminC: 8, vitaminB: 7, image: '🥒', cookingMethod: '炒或煮汤', effect: '清热化痰，润肤美容' },
        { id: 54, name: '苦瓜', category: '蔬菜', calories: 19, protein: 1, fat: 0.2, carbs: 3.7, fiber: 1.4, vitaminC: 56, vitaminB: 9, image: '🥒', cookingMethod: '炒或凉拌', effect: '清热解毒，降血糖' },
        { id: 55, name: '洋葱', category: '蔬菜', calories: 40, protein: 1.1, fat: 0.1, carbs: 9, fiber: 1.7, vitaminC: 7, vitaminB: 8, image: '🧅', cookingMethod: '炒或凉拌', effect: '抗菌消炎，降血脂' },
        { id: 56, name: '韭菜', category: '蔬菜', calories: 26, protein: 2.4, fat: 0.4, carbs: 4, fiber: 1.5, vitaminC: 24, vitaminB: 10, image: '🥬', cookingMethod: '炒或做馅', effect: '补肾助阳，促进消化' },
        { id: 57, name: '芦笋', category: '蔬菜', calories: 20, protein: 2.2, fat: 0.2, carbs: 3.9, fiber: 2, vitaminC: 45, vitaminB: 12, image: '🎍', cookingMethod: '炒或烤', effect: '防癌抗癌，增强免疫力' },
        { id: 58, name: '莲藕', category: '蔬菜', calories: 74, protein: 1.6, fat: 0.1, carbs: 17, fiber: 4.9, vitaminC: 44, vitaminB: 15, image: '🌿', cookingMethod: '炒或煮汤', effect: '清热生津，健脾开胃' },
        { id: 59, name: '萝卜', category: '蔬菜', calories: 20, protein: 0.9, fat: 0.1, carbs: 4.4, fiber: 1.4, vitaminC: 20, vitaminB: 8, image: '🥕', cookingMethod: '炒或煮汤', effect: '助消化，止咳化痰' },
        { id: 60, name: '莴笋', category: '蔬菜', calories: 15, protein: 1, fat: 0.1, carbs: 2.8, fiber: 1.2, vitaminC: 4, vitaminB: 6, image: '🥬', cookingMethod: '炒或凉拌', effect: '利尿通乳，清热解毒' },
        
        // 肉类 (20种)
        { id: 61, name: '鸡胸肉', category: '肉类', calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 25, image: '🍗', cookingMethod: '煎、煮或烤', effect: '低脂高蛋白，适合健身' },
        { id: 62, name: '牛肉', category: '肉类', calories: 250, protein: 26, fat: 15, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 35, image: '🥩', cookingMethod: '炒、炖或煎', effect: '补铁，增强体力' },
        { id: 63, name: '猪瘦肉', category: '肉类', calories: 143, protein: 20, fat: 7, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 30, image: '🥓', cookingMethod: '炒、煮或炖', effect: '提供优质蛋白质' },
        { id: 64, name: '鱼肉', category: '肉类', calories: 206, protein: 22, fat: 12, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 28, image: '🐟', cookingMethod: '蒸、煮或烤', effect: '富含Omega-3，保护心脏' },
        { id: 65, name: '虾', category: '肉类', calories: 99, protein: 24, fat: 0.3, carbs: 0.2, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🦐', cookingMethod: '煮、炒或蒸', effect: '高蛋白低脂，补钙' },
        { id: 66, name: '羊肉', category: '肉类', calories: 203, protein: 19, fat: 14, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 32, image: '🍖', cookingMethod: '烤、炖或炒', effect: '温补脾胃，补肾壮阳' },
        { id: 67, name: '鸭肉', category: '肉类', calories: 240, protein: 18, fat: 17, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 28, image: '🦆', cookingMethod: '烤、炖或炒', effect: '滋阴养胃，利水消肿' },
        { id: 68, name: '鹅肉', category: '肉类', calories: 257, protein: 20, fat: 18, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 30, image: '🦢', cookingMethod: '烤、炖或炒', effect: '补虚益气，暖胃生津' },
        { id: 69, name: '兔肉', category: '肉类', calories: 102, protein: 21, fat: 2.8, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 22, image: '🐰', cookingMethod: '烤、炖或炒', effect: '高蛋白低脂肪，适合减肥' },
        { id: 70, name: '鹌鹑', category: '肉类', calories: 180, protein: 20, fat: 11, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 25, image: '🐦', cookingMethod: '烤、炖或炒', effect: '补中益气，强筋健骨' },
        { id: 71, name: '鸽子肉', category: '肉类', calories: 190, protein: 22, fat: 9, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 28, image: '🐦', cookingMethod: '炖或烤', effect: '滋肾益气，祛风解毒' },
        { id: 72, name: '火鸡肉', category: '肉类', calories: 135, protein: 28, fat: 3.3, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 35, image: '🦃', cookingMethod: '烤、炖或炒', effect: '高蛋白低脂肪，营养丰富' },
        { id: 73, name: '鹿肉', category: '肉类', calories: 157, protein: 22, fat: 7, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 30, image: '🦌', cookingMethod: '烤、炖或炒', effect: '温肾壮阳，补脾益气' },
        { id: 74, name: '鸵鸟肉', category: '肉类', calories: 120, protein: 25, fat: 2.5, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 28, image: '鹋', cookingMethod: '烤、炖或炒', effect: '低脂高蛋白，健康肉类' },
        { id: 75, name: '鳄鱼肉', category: '肉类', calories: 143, protein: 24, fat: 6, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 25, image: '🐊', cookingMethod: '烤、炖或炒', effect: '滋心润肺，补血益气' },
        { id: 76, name: '鸡肉', category: '肉类', calories: 180, protein: 25, fat: 9, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 28, image: '🐔', cookingMethod: '烤、炖或炒', effect: '优质蛋白，增强体力' },
        { id: 77, name: '猪肉', category: '肉类', calories: 242, protein: 17, fat: 18, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 25, image: '🐷', cookingMethod: '炒、炖或烤', effect: '提供能量，补充营养' },
        { id: 78, name: '鱼片', category: '肉类', calories: 110, protein: 20, fat: 4, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 22, image: '🐟', cookingMethod: '蒸、煮或炒', effect: '低脂高蛋白，易消化' },
        { id: 79, name: '蟹肉', category: '肉类', calories: 83, protein: 18, fat: 1.2, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 18, image: '🦀', cookingMethod: '蒸、炒或煮', effect: '高蛋白低脂肪，补钙' },
        { id: 80, name: '贝类', category: '肉类', calories: 75, protein: 15, fat: 1.5, carbs: 3, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🐚', cookingMethod: '蒸、炒或煮', effect: '富含锌元素，增强免疫' },
        
        // 家常菜 (50种)
        { id: 81, name: '番茄炒蛋', category: '家常菜', calories: 120, protein: 8, fat: 7, carbs: 8, fiber: 1.5, vitaminC: 12, vitaminB: 10, image: '🍳', cookingMethod: '先炒蛋后炒番茄', effect: '营养均衡，易消化', steps: ['鸡蛋打散，加少许盐和料酒去腥', '番茄洗净切块，准备葱花和蒜末', '热锅凉油，油热后倒入蛋液，用铲子快速打散成大块', '蛋块盛出备用，键内留底油', '下番茄块翻炒，炒出汁水后加盐和白糖调味', '倒入炒好的鸡蛋，快速翻炒均匀，撒葱花出锅'], tips: '蛋液中加少许水淀粉和料酒可以让鸡蛋更嫩滑；番茄可先用开水烫一下去皮，口感更好；加少许白糖可以中和番茄的酸味。' },
        { id: 82, name: '青椒肉丝', category: '家常菜', calories: 180, protein: 15, fat: 10, carbs: 8, fiber: 2, vitaminC: 25, vitaminB: 12, image: '🫑', cookingMethod: '快炒保持脆嫩', effect: '补充蛋白质和维生素C', steps: ['猪肉切丝，加料酒、生抽、淀粉、少许油腌制15分钟', '青椒去籽去籽切丝，蒜姜切丝', '调汁：生抽1勺、老抽半勺、香醋半勺、白糖半勺、水淀粉半勺、清水三勺混合', '热锅凉油，油热后下肉丝滑烫至变色盛出', '键内留底油，爆香蒜姜，下青椒丝大火翻炒', '青椒断生后倒入肉丝，浇入调好的汁，快速翻炒均匀出锅'], tips: '肉丝一定要充分腌制，这样才会嫩滑；烫肉丝时油温不要太高，避免炮溅；全程大火快炒，保持青椒的脆嫩口感。' },
        { id: 83, name: '麻婆豆腐', category: '家常菜', calories: 160, protein: 12, fat: 9, carbs: 10, fiber: 1, vitaminC: 5, vitaminB: 8, image: '🌶️', cookingMethod: '炒制豆腐加调料', effect: '辛辣开胃，高蛋白', steps: ['豆腐切小块，入淡盐水浸泡5分钟后控干', '牛肉末加料酒、生抽腌制，葱1-2瓣切末', '豆瓣遇1勺切末，蒜姜末适量', '热锅凉油，下牛肉末炒至变色、出油', '下豆瓣酱和蒜姜炒出红油，加清水烧开', '下豆腐块，轻轻推匀，中火煮5-8分钟', '加生抽、白糖调味，水淀粉勾芍，撒花椒粉和蒜花即可'], tips: '豆腐用盐水浸泡可以去豆腥味，也不容易碎；煮的时候不要频繁翻动，避免豆腐碎掉；花椒粉一定要最后放，才能保持麻味。' },
        { id: 84, name: '红烧肉', category: '家常菜', calories: 350, protein: 18, fat: 28, carbs: 12, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🍖', cookingMethod: '炖煮入味', effect: '高热量，偶尔食用', steps: ['五花肉切块，冷水下锅焯水去腥，捞出洗净', '热锅凉油，下冰糖小火炒至焦糖色', '下肉块翻炒上色，加料酒、生抽、老抽炒匀', '加热水没过肉块，放入葱段、姜片、八角', '大火烧开后转小火炖煮40-50分钟', '加盐调味，大火收汁至浓稠即可'], tips: '炒糖色时火候要控制好，避免炒糊；炖煮时要保持小火，肉才会软烂入味；收汁时要不断翻动，避免粘锅。' },
        { id: 85, name: '清蒸鱼', category: '家常菜', calories: 120, protein: 22, fat: 3, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 20, image: '🐟', cookingMethod: '清蒸保持原味', effect: '低脂高蛋白，护心' },
        { id: 86, name: '紫菜蛋花汤', category: '汤类', calories: 45, protein: 4, fat: 2, carbs: 3, fiber: 1, vitaminC: 2, vitaminB: 6, image: '🥣', cookingMethod: '煮沸后加蛋花', effect: '补碘，清淡养胃' },
        { id: 87, name: '酸辣土豆丝', category: '家常菜', calories: 95, protein: 2, fat: 3, carbs: 16, fiber: 2.5, vitaminC: 15, vitaminB: 8, image: '🥔', cookingMethod: '快炒保持脆度', effect: '开胃，富含维生素C' },
        { id: 88, name: '拍黄瓜', category: '凉菜', calories: 35, protein: 1, fat: 1.5, carbs: 5, fiber: 1, vitaminC: 5, vitaminB: 3, image: '🥒', cookingMethod: '拍碎加调料', effect: '清爽解腻，低热量' },
        { id: 89, name: '凉拌木耳', category: '凉菜', calories: 50, protein: 2.5, fat: 2, carbs: 7, fiber: 3, vitaminC: 3, vitaminB: 10, image: '🍄', cookingMethod: '焯水后凉拌', effect: '清肠排毒，富含铁' },
        { id: 90, name: '鸡蛋羹', category: '蛋类', calories: 80, protein: 7, fat: 5, carbs: 2, fiber: 0, vitaminC: 0, vitaminB: 8, image: '🥚', cookingMethod: '蒸制', effect: '易消化，适合老人小孩' },
        { id: 91, name: '宫保鸡丁', category: '家常菜', calories: 210, protein: 20, fat: 12, carbs: 10, fiber: 2, vitaminC: 8, vitaminB: 15, image: '🌶️', cookingMethod: '炒制', effect: '营养丰富，开胃' },
        { id: 92, name: '鱼香肉丝', category: '家常菜', calories: 190, protein: 16, fat: 11, carbs: 12, fiber: 1.5, vitaminC: 6, vitaminB: 12, image: '🥢', cookingMethod: '快炒', effect: '酸甜适口，下饭' },
        { id: 93, name: '糖醋里脊', category: '家常菜', calories: 280, protein: 18, fat: 15, carbs: 22, fiber: 1, vitaminC: 5, vitaminB: 10, image: '🍖', cookingMethod: '炸后炒制', effect: '高热量，偶尔食用' },
        { id: 94, name: '木须肉', category: '家常菜', calories: 160, protein: 14, fat: 10, carbs: 8, fiber: 1.5, vitaminC: 4, vitaminB: 12, image: '🥚', cookingMethod: '炒制', effect: '营养均衡' },
        { id: 95, name: '回锅肉', category: '家常菜', calories: 320, protein: 16, fat: 26, carbs: 10, fiber: 1, vitaminC: 8, vitaminB: 12, image: '🥓', cookingMethod: '煮后炒制', effect: '高脂高热，偶尔食用' },
        { id: 96, name: '蒜蓉西蓝花', category: '蔬菜', calories: 50, protein: 3, fat: 2, carbs: 7, fiber: 2.8, vitaminC: 90, vitaminB: 12, image: '🥦', cookingMethod: '焯水后炒蒜蓉', effect: '抗癌，营养丰富' },
        { id: 97, name: '红烧茄子', category: '蔬菜', calories: 110, protein: 2, fat: 6, carbs: 14, fiber: 3.5, vitaminC: 3, vitaminB: 8, image: '🍆', cookingMethod: '炒制', effect: '降脂，软化血管' },
        { id: 98, name: '凉拌豆皮', category: '凉菜', calories: 95, protein: 10, fat: 4, carbs: 8, fiber: 1.5, vitaminC: 2, vitaminB: 10, image: '🧊', cookingMethod: '焯水后凉拌', effect: '高蛋白，清爽' },
        { id: 99, name: '蒜泥白肉', category: '凉菜', calories: 240, protein: 18, fat: 18, carbs: 4, fiber: 0.5, vitaminC: 3, vitaminB: 15, image: '🥓', cookingMethod: '煮熟切片', effect: '高蛋白高脂' },
        { id: 100, name: '手撕包菜', category: '蔬菜', calories: 40, protein: 2, fat: 1.5, carbs: 6, fiber: 2, vitaminC: 40, vitaminB: 8, image: '🥬', cookingMethod: '快炒', effect: '清热解毒，促消化' },
        // 新增家常菜谱 (85种)
        { id: 101, name: '糖醋排骨', category: '家常菜', calories: 280, protein: 20, fat: 15, carbs: 22, fiber: 0, vitaminC: 2, vitaminB: 12, image: '🍖', cookingMethod: '炸后炒制', effect: '酸甜可口，高热量' },
        { id: 102, name: '可乐鸡翅', category: '家常菜', calories: 220, protein: 18, fat: 12, carbs: 15, fiber: 0, vitaminC: 3, vitaminB: 10, image: '🍗', cookingMethod: '炖煮入味', effect: '甜咸适口，老少皆宜' },
        { id: 103, name: '红烧鸡翅', category: '家常菜', calories: 210, protein: 22, fat: 10, carbs: 10, fiber: 0, vitaminC: 2, vitaminB: 12, image: '🍗', cookingMethod: '炖煮入味', effect: '酱香浓郁，营养丰富' },
        { id: 104, name: '土豆炖牛肉', category: '家常菜', calories: 220, protein: 20, fat: 12, carbs: 15, fiber: 2.5, vitaminC: 12, vitaminB: 25, image: '🥔', cookingMethod: '慢炖', effect: '营养丰富，暖身' },
        { id: 105, name: '炖鸡汤', category: '家常菜', calories: 150, protein: 18, fat: 7, carbs: 3, fiber: 0, vitaminC: 2, vitaminB: 20, image: '🍗', cookingMethod: '慢炖2小时', effect: '滋补，增强体质' },
        { id: 106, name: '清蒸鲈鱼', category: '家常菜', calories: 115, protein: 20, fat: 3.5, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 18, image: '🐟', cookingMethod: '清蒸', effect: '低脂高蛋白，护脑' },
        { id: 107, name: '蒜蓉粉丝蒸虾', category: '家常菜', calories: 140, protein: 22, fat: 3, carbs: 10, fiber: 0.5, vitaminC: 1, vitaminB: 12, image: '🦐', cookingMethod: '蒸制', effect: '高蛋白，补钙' },
        { id: 108, name: '蒸南瓜', category: '家常菜', calories: 26, protein: 0.7, fat: 0.1, carbs: 5.5, fiber: 1.4, vitaminC: 8, vitaminB: 8, image: '🎃', cookingMethod: '蒸熟', effect: '护眼，增强免疫' },
        { id: 109, name: '烤鸡翅', category: '家常菜', calories: 290, protein: 25, fat: 20, carbs: 4, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🍗', cookingMethod: '烤箱烤制', effect: '高蛋白，偶尔食用' },
        { id: 110, name: '烤茄子', category: '家常菜', calories: 120, protein: 2, fat: 8, carbs: 12, fiber: 3, vitaminC: 2, vitaminB: 6, image: '🍆', cookingMethod: '烤制', effect: '香软可口，下饭' },
        { id: 111, name: '蒜苔炒肉', category: '家常菜', calories: 160, protein: 14, fat: 9, carbs: 8, fiber: 2, vitaminC: 18, vitaminB: 10, image: '🥬', cookingMethod: '快炒', effect: '清香爽口，营养均衡' },
        { id: 112, name: '韭菜炒蛋', category: '家常菜', calories: 140, protein: 9, fat: 9, carbs: 6, fiber: 1.5, vitaminC: 20, vitaminB: 8, image: '🥬', cookingMethod: '快炒', effect: '补肾助阳，促进消化' },
        { id: 113, name: '冬瓜排骨汤', category: '家常菜', calories: 80, protein: 6, fat: 3, carbs: 8, fiber: 1, vitaminC: 9, vitaminB: 8, image: '🍖', cookingMethod: '慢炖', effect: '清热解暑，利尿消肿' },
        { id: 114, name: '西红柿牛腩汤', category: '家常菜', calories: 120, protein: 12, fat: 5, carbs: 10, fiber: 1.5, vitaminC: 15, vitaminB: 12, image: '🍅', cookingMethod: '慢炖', effect: '酸甜开胃，营养丰富' },
        { id: 115, name: '蒸蛋羹', category: '家常菜', calories: 80, protein: 7, fat: 5, carbs: 2, fiber: 0, vitaminC: 0, vitaminB: 8, image: '🥚', cookingMethod: '蒸制', effect: '易消化，适合老人小孩' },
        { id: 116, name: '鸡蛋灌饼', category: '家常菜', calories: 280, protein: 12, fat: 12, carbs: 30, fiber: 2, vitaminC: 1, vitaminB: 10, image: '🥞', cookingMethod: '面粉调糊，摊饼后灌入鸡蛋液', effect: '营养丰富，提供充足能量' },
        { id: 117, name: '小笼包', category: '家常菜', calories: 230, protein: 9, fat: 8, carbs: 28, fiber: 1.5, vitaminC: 3, vitaminB: 9, image: '🥟', cookingMethod: '蒸制', effect: '鲜美多汁，营养丰富' },
        { id: 118, name: '韭菜盒子', category: '家常菜', calories: 240, protein: 8, fat: 10, carbs: 28, fiber: 2.2, vitaminC: 24, vitaminB: 12, image: '🥬', cookingMethod: '面粉调制后烙制', effect: '补肾助阳，促进消化' },
        { id: 119, name: '鸡蛋三明治', category: '家常菜', calories: 280, protein: 14, fat: 15, carbs: 22, fiber: 2.5, vitaminC: 3, vitaminB: 15, image: '🥪', cookingMethod: '面包夹鸡蛋和蔬菜', effect: '营养均衡，方便携带' },
        { id: 120, name: '皮蛋瘦肉粥', category: '家常菜', calories: 85, protein: 6.5, fat: 2.8, carbs: 10, fiber: 0.8, vitaminC: 1, vitaminB: 18, image: '🥣', cookingMethod: '慢煮至黏稠', effect: '养胃，补充蛋白质' },
        { id: 121, name: '小米粥', category: '家常菜', calories: 46, protein: 1.5, fat: 0.4, carbs: 9, fiber: 0.7, vitaminC: 0, vitaminB: 12, image: '🥣', cookingMethod: '慢煮至黏稠', effect: '养胃，补充B族维生素' },
        { id: 122, name: '玉米粥', category: '家常菜', calories: 96, protein: 3.4, fat: 1.5, carbs: 19, fiber: 2.7, vitaminC: 7, vitaminB: 18, image: '🌽', cookingMethod: '煮或蒸', effect: '富含叶黄素，保护视力' },
        { id: 123, name: '红豆粥', category: '家常菜', calories: 110, protein: 5, fat: 0.5, carbs: 22, fiber: 4, vitaminC: 0, vitaminB: 15, image: '🥣', cookingMethod: '煮至软烂', effect: '补血，利尿' },
        { id: 124, name: '绿豆汤', category: '家常菜', calories: 85, protein: 4, fat: 0.3, carbs: 17, fiber: 3, vitaminC: 2, vitaminB: 12, image: '🥣', cookingMethod: '煮至开花', effect: '清热解毒，消暑' },
        { id: 125, name: '银耳莲子羹', category: '家常菜', calories: 95, protein: 2, fat: 0.2, carbs: 20, fiber: 2.5, vitaminC: 1, vitaminB: 8, image: '🥣', cookingMethod: '炖煮至黏稠', effect: '养颜，润肺' },
        { id: 126, name: '炒饭', category: '家常菜', calories: 215, protein: 6, fat: 8, carbs: 30, fiber: 1, vitaminC: 5, vitaminB: 10, image: '🍚', cookingMethod: '隔夜饭炒制', effect: '快速饱腹' },
        { id: 127, name: '炒面', category: '家常菜', calories: 240, protein: 8, fat: 10, carbs: 32, fiber: 2, vitaminC: 6, vitaminB: 12, image: '🍜', cookingMethod: '煮熟后炒制', effect: '营养丰富' },
        { id: 128, name: '饺子', category: '家常菜', calories: 200, protein: 10, fat: 7, carbs: 26, fiber: 1.5, vitaminC: 3, vitaminB: 12, image: '🥟', cookingMethod: '煮或蒸', effect: '营养全面' },
        { id: 129, name: '包子', category: '家常菜', calories: 180, protein: 7, fat: 5, carbs: 28, fiber: 1.2, vitaminC: 2, vitaminB: 10, image: '🥟', cookingMethod: '蒸制', effect: '易消化，饱腹' },
        { id: 130, name: '花卷', category: '家常菜', calories: 195, protein: 6, fat: 3, carbs: 36, fiber: 1.5, vitaminC: 0, vitaminB: 8, image: '🥐', cookingMethod: '蒸制', effect: '松软可口' },
        // 继续添加更多家常菜谱 (55种)
        { id: 131, name: '红烧鱼', category: '家常菜', calories: 180, protein: 22, fat: 8, carbs: 2, fiber: 0, vitaminC: 3, vitaminB: 15, image: '🐟', cookingMethod: '红烧', effect: '鲜美可口，营养丰富' },
        { id: 132, name: '糖醋里脊', category: '家常菜', calories: 280, protein: 18, fat: 15, carbs: 22, fiber: 1, vitaminC: 5, vitaminB: 10, image: '🍖', cookingMethod: '炸后炒制', effect: '酸甜可口，老少皆宜' },
        { id: 133, name: '宫保鸡丁', category: '家常菜', calories: 210, protein: 20, fat: 12, carbs: 10, fiber: 2, vitaminC: 8, vitaminB: 15, image: '🌶️', cookingMethod: '炒制', effect: '麻辣鲜香，下饭' },
        { id: 134, name: '鱼香肉丝', category: '家常菜', calories: 190, protein: 16, fat: 11, carbs: 12, fiber: 1.5, vitaminC: 6, vitaminB: 12, image: '🥢', cookingMethod: '快炒', effect: '酸甜适口，下饭' },
        { id: 135, name: '麻婆豆腐', category: '家常菜', calories: 160, protein: 12, fat: 9, carbs: 10, fiber: 1, vitaminC: 5, vitaminB: 8, image: '🌶️', cookingMethod: '炒制豆腐加调料', effect: '麻辣鲜香，高蛋白' },
        { id: 136, name: '回锅肉', category: '家常菜', calories: 320, protein: 16, fat: 26, carbs: 10, fiber: 1, vitaminC: 8, vitaminB: 12, image: '🥓', cookingMethod: '煮后炒制', effect: '香辣下饭，高热量' },
        { id: 137, name: '木须肉', category: '家常菜', calories: 160, protein: 14, fat: 10, carbs: 8, fiber: 1.5, vitaminC: 4, vitaminB: 12, image: '🥚', cookingMethod: '炒制', effect: '营养均衡，口感丰富' },
        { id: 138, name: '蒜蓉西蓝花', category: '家常菜', calories: 50, protein: 3, fat: 2, carbs: 7, fiber: 2.8, vitaminC: 90, vitaminB: 12, image: '🥦', cookingMethod: '焯水后炒蒜蓉', effect: '抗癌，营养丰富' },
        { id: 139, name: '红烧茄子', category: '家常菜', calories: 110, protein: 2, fat: 6, carbs: 14, fiber: 3.5, vitaminC: 3, vitaminB: 8, image: '🍆', cookingMethod: '炒制', effect: '降脂，软化血管' },
        { id: 140, name: '凉拌豆皮', category: '家常菜', calories: 95, protein: 10, fat: 4, carbs: 8, fiber: 1.5, vitaminC: 2, vitaminB: 10, image: '🧊', cookingMethod: '焯水后凉拌', effect: '高蛋白，清爽' },
        { id: 141, name: '蒜泥白肉', category: '家常菜', calories: 240, protein: 18, fat: 18, carbs: 4, fiber: 0.5, vitaminC: 3, vitaminB: 15, image: '🥓', cookingMethod: '煮熟切片', effect: '高蛋白高脂' },
        { id: 142, name: '手撕包菜', category: '家常菜', calories: 40, protein: 2, fat: 1.5, carbs: 6, fiber: 2, vitaminC: 40, vitaminB: 8, image: '🥬', cookingMethod: '快炒', effect: '清热解毒，促消化' },
        { id: 143, name: '酸辣土豆丝', category: '家常菜', calories: 95, protein: 2, fat: 3, carbs: 16, fiber: 2.5, vitaminC: 15, vitaminB: 8, image: '🥔', cookingMethod: '快炒保持脆度', effect: '开胃，富含维生素C' },
        { id: 144, name: '拍黄瓜', category: '家常菜', calories: 35, protein: 1, fat: 1.5, carbs: 5, fiber: 1, vitaminC: 5, vitaminB: 3, image: '🥒', cookingMethod: '拍碎加调料', effect: '清爽解腻，低热量' },
        { id: 145, name: '凉拌木耳', category: '家常菜', calories: 50, protein: 2.5, fat: 2, carbs: 7, fiber: 3, vitaminC: 3, vitaminB: 10, image: '🍄', cookingMethod: '焯水后凉拌', effect: '清肠排毒，富含铁' },
        { id: 146, name: '番茄炒蛋', category: '家常菜', calories: 120, protein: 8, fat: 7, carbs: 8, fiber: 1.5, vitaminC: 12, vitaminB: 10, image: '🍳', cookingMethod: '先炒蛋后炒番茄', effect: '营养均衡，易消化', steps: ['鸡蛋打散，加少许盐和料酒去腥', '番茄洗净切块，准备葱花和蒜末', '热锅凉油，油热后倒入蛋液，用铲子快速打散成大块', '蛋块盛出备用，键内留底油', '下番茄块翻炒，炒出汁水后加盐和白糖调味', '倒入炒好的鸡蛋，快速翻炒均匀，撒葱花出锅'], tips: '蛋液中加少许水淀粉和料酒可以让鸡蛋更嫩滑；番茄可先用开水烫一下去皮，口感更好；加少许白糖可以中和番茄的酸味。' },
        { id: 147, name: '青椒肉丝', category: '家常菜', calories: 180, protein: 15, fat: 10, carbs: 8, fiber: 2, vitaminC: 25, vitaminB: 12, image: '🫑', cookingMethod: '快炒保持脆嫩', effect: '补充蛋白质和维生素C', steps: ['猪肉切丝，加料酒、生抽、淀粉、少许油腌制15分钟', '青椒去籽去籽切丝，蒜姜切丝', '调汁：生抽1勺、老抽半勺、香醋半勺、白糖半勺、水淀粉半勺、清水三勺混合', '热锅凉油，油热后下肉丝滑烫至变色盛出', '键内留底油，爆香蒜姜，下青椒丝大火翻炒', '青椒断生后倒入肉丝，浇入调好的汁，快速翻炒均匀出锅'], tips: '肉丝一定要充分腌制，这样才会嫩滑；烫肉丝时油温不要太高，避免炮溅；全程大火快炒，保持青椒的脆嫩口感。' },
        { id: 148, name: '红烧肉', category: '家常菜', calories: 350, protein: 18, fat: 28, carbs: 12, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🍖', cookingMethod: '炖煮入味', effect: '高热量，偶尔食用', steps: ['五花肉切块，冷水下锅焯水去腥，捞出洗净', '热锅凉油，下冰糖小火炒至焦糖色', '下肉块翻炒上色，加料酒、生抽、老抽炒匀', '加热水没过肉块，放入葱段、姜片、八角', '大火烧开后转小火炖煮40-50分钟', '加盐调味，大火收汁至浓稠即可'], tips: '炒糖色时火候要控制好，避免炒糊；炖煮时要保持小火，肉才会软烂入味；收汁时要不断翻动，避免粘锅。' },
        { id: 149, name: '水煮鱼', category: '家常菜', calories: 220, protein: 24, fat: 14, carbs: 3, fiber: 0.5, vitaminC: 8, vitaminB: 18, image: '🐟', cookingMethod: '水煮', effect: '麻辣鲜香，高蛋白' },
        { id: 150, name: '口水鸡', category: '家常菜', calories: 180, protein: 20, fat: 10, carbs: 5, fiber: 0.5, vitaminC: 4, vitaminB: 12, image: '🐔', cookingMethod: '煮制后拌调料', effect: '麻辣鲜香，高蛋白' },
        { id: 151, name: '夫妻肺片', category: '家常菜', calories: 150, protein: 18, fat: 8, carbs: 3, fiber: 0.5, vitaminC: 3, vitaminB: 10, image: '🥩', cookingMethod: '卤制后拌调料', effect: '麻辣鲜香，高蛋白' },
        { id: 152, name: '蚂蚁上树', category: '家常菜', calories: 160, protein: 10, fat: 8, carbs: 15, fiber: 2, vitaminC: 6, vitaminB: 8, image: '🍜', cookingMethod: '炒制粉丝和肉末', effect: '口感丰富，营养均衡' },
        { id: 153, name: '地三鲜', category: '家常菜', calories: 120, protein: 3, fat: 7, carbs: 12, fiber: 3.5, vitaminC: 15, vitaminB: 6, image: '🥔', cookingMethod: '油炸后炒制', effect: '东北特色，营养丰富' },
        { id: 154, name: '干煸豆角', category: '家常菜', calories: 110, protein: 2.5, fat: 6, carbs: 12, fiber: 4, vitaminC: 10, vitaminB: 7, image: '🫘', cookingMethod: '干煸', effect: '香辣下饭，富含纤维' },
        { id: 155, name: '鱼香茄子', category: '家常菜', calories: 100, protein: 2, fat: 5, carbs: 12, fiber: 3, vitaminC: 8, vitaminB: 6, image: '🍆', cookingMethod: '炒制', effect: '酸甜适口，下饭' },
        { id: 156, name: '辣子鸡', category: '家常菜', calories: 280, protein: 22, fat: 18, carbs: 8, fiber: 1, vitaminC: 5, vitaminB: 15, image: '🌶️', cookingMethod: '油炸后炒制', effect: '麻辣鲜香，高蛋白' },
        { id: 157, name: '酸菜鱼', category: '家常菜', calories: 190, protein: 20, fat: 10, carbs: 6, fiber: 1.5, vitaminC: 12, vitaminB: 14, image: '🐟', cookingMethod: '煮制', effect: '酸辣开胃，高蛋白' },
        { id: 158, name: '毛血旺', category: '家常菜', calories: 210, protein: 18, fat: 14, carbs: 5, fiber: 1, vitaminC: 8, vitaminB: 12, image: '🌶️', cookingMethod: '煮制', effect: '麻辣鲜香，营养丰富' },
        { id: 159, name: '水煮肉片', category: '家常菜', calories: 240, protein: 22, fat: 16, carbs: 4, fiber: 0.5, vitaminC: 6, vitaminB: 16, image: '🥩', cookingMethod: '水煮', effect: '麻辣鲜香，高蛋白' },
        { id: 160, name: '干锅花菜', category: '家常菜', calories: 130, protein: 4, fat: 8, carbs: 10, fiber: 3.5, vitaminC: 25, vitaminB: 8, image: '🥦', cookingMethod: '干锅炒制', effect: '香辣下饭，富含纤维' },
        { id: 161, name: '剁椒鱼头', category: '家常菜', calories: 160, protein: 18, fat: 9, carbs: 3, fiber: 0.5, vitaminC: 10, vitaminB: 12, image: '🐟', cookingMethod: '蒸制', effect: '鲜辣开胃，高蛋白' },
        { id: 162, name: '梅菜扣肉', category: '家常菜', calories: 320, protein: 16, fat: 25, carbs: 12, fiber: 1.5, vitaminC: 3, vitaminB: 10, image: '🍖', cookingMethod: '蒸制', effect: '肥而不腻，香糯可口' },
        { id: 163, name: '粉蒸肉', category: '家常菜', calories: 300, protein: 18, fat: 22, carbs: 10, fiber: 0.5, vitaminC: 2, vitaminB: 12, image: '🍖', cookingMethod: '蒸制', effect: '软糯香甜，高蛋白' },
        { id: 164, name: '东坡肉', category: '家常菜', calories: 380, protein: 15, fat: 32, carbs: 8, fiber: 0, vitaminC: 1, vitaminB: 8, image: '🍖', cookingMethod: '慢炖', effect: '肥而不腻，入口即化' },
        { id: 165, name: '白切鸡', category: '家常菜', calories: 180, protein: 24, fat: 10, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 18, image: '🐔', cookingMethod: '煮制', effect: '清淡鲜美，高蛋白' },
        { id: 166, name: '白灼虾', category: '家常菜', calories: 99, protein: 24, fat: 0.3, carbs: 0.2, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🦐', cookingMethod: '白灼', effect: '鲜美清淡，高蛋白' },
        { id: 167, name: '葱烧海参', category: '家常菜', calories: 120, protein: 18, fat: 5, carbs: 3, fiber: 0, vitaminC: 2, vitaminB: 10, image: '🌊', cookingMethod: '烧制', effect: '营养丰富，高蛋白' },
        { id: 168, name: '油焖大虾', category: '家常菜', calories: 140, protein: 22, fat: 6, carbs: 2, fiber: 0, vitaminC: 1, vitaminB: 12, image: '🦐', cookingMethod: '焖制', effect: '鲜美可口，高蛋白' },
        { id: 169, name: '干锅牛蛙', category: '家常菜', calories: 180, protein: 26, fat: 8, carbs: 3, fiber: 0, vitaminC: 4, vitaminB: 15, image: '🐸', cookingMethod: '干锅炒制', effect: '鲜香麻辣，高蛋白' },
        { id: 170, name: '香辣蟹', category: '家常菜', calories: 150, protein: 20, fat: 6, carbs: 2, fiber: 0, vitaminC: 3, vitaminB: 12, image: '🦀', cookingMethod: '炒制', effect: '鲜香麻辣，高蛋白' },
        { id: 171, name: '避风塘炒蟹', category: '家常菜', calories: 170, protein: 18, fat: 8, carbs: 4, fiber: 0, vitaminC: 2, vitaminB: 10, image: '🦀', cookingMethod: '炒制', effect: '香酥可口，高蛋白' },
        { id: 172, name: '铁板鱿鱼', category: '家常菜', calories: 130, protein: 18, fat: 5, carbs: 3, fiber: 0, vitaminC: 3, vitaminB: 8, image: '🦑', cookingMethod: '铁板炒制', effect: '鲜香可口，高蛋白' },
        { id: 173, name: '蒜蓉蒸扇贝', category: '家常菜', calories: 110, protein: 17, fat: 4, carbs: 2, fiber: 0, vitaminC: 1, vitaminB: 10, image: '🐚', cookingMethod: '蒸制', effect: '鲜美清淡，高蛋白' },
        { id: 174, name: '豆豉蒸排骨', category: '家常菜', calories: 220, protein: 18, fat: 14, carbs: 6, fiber: 0.5, vitaminC: 2, vitaminB: 12, image: '🍖', cookingMethod: '蒸制', effect: '豆香浓郁，高蛋白' },
        { id: 175, name: '梅干蒸排骨', category: '家常菜', calories: 210, protein: 18, fat: 13, carbs: 5, fiber: 0.5, vitaminC: 2, vitaminB: 12, image: '🍖', cookingMethod: '蒸制', effect: '酸甜可口，高蛋白' },
        { id: 176, name: '糖醋藕块', category: '家常菜', calories: 80, protein: 2, fat: 2, carbs: 15, fiber: 3, vitaminC: 25, vitaminB: 6, image: '🌿', cookingMethod: '炸后炒制', effect: '酸甜可口，富含纤维' },
        { id: 177, name: '干锅土豆片', category: '家常菜', calories: 110, protein: 2, fat: 6, carbs: 12, fiber: 2.5, vitaminC: 12, vitaminB: 5, image: '🥔', cookingMethod: '干锅炒制', effect: '香辣下饭，富含纤维' },
        { id: 178, name: '虎皮青椒', category: '家常菜', calories: 40, protein: 1, fat: 2, carbs: 5, fiber: 2, vitaminC: 80, vitaminB: 3, image: '🫑', cookingMethod: '煎制后炒制', effect: '香辣下饭，富含维生素C' },
        { id: 179, name: '藠头炒腊肉', category: '家常菜', calories: 180, protein: 12, fat: 12, carbs: 6, fiber: 1.5, vitaminC: 15, vitaminB: 8, image: '🥓', cookingMethod: '炒制', effect: '腊香浓郁，下饭' },
        { id: 180, name: '藠头炒鸡蛋', category: '家常菜', calories: 120, protein: 8, fat: 8, carbs: 6, fiber: 1.2, vitaminC: 20, vitaminB: 6, image: '🥚', cookingMethod: '炒制', effect: '清香可口，营养均衡' },
        { id: 181, name: '藠头炒牛肉', category: '家常菜', calories: 160, protein: 20, fat: 8, carbs: 4, fiber: 1, vitaminC: 12, vitaminB: 15, image: '🥩', cookingMethod: '炒制', effect: '鲜香可口，高蛋白' },
        { id: 182, name: '藠头炒鸡丁', category: '家常菜', calories: 150, protein: 18, fat: 7, carbs: 5, fiber: 1, vitaminC: 10, vitaminB: 12, image: '🐔', cookingMethod: '炒制', effect: '鲜香可口，高蛋白' },
        { id: 183, name: '藠头炒鱿鱼', category: '家常菜', calories: 130, protein: 16, fat: 5, carbs: 6, fiber: 1, vitaminC: 8, vitaminB: 10, image: '🦑', cookingMethod: '炒制', effect: '鲜香可口，高蛋白' },
        { id: 184, name: '藠头炒虾仁', category: '家常菜', calories: 120, protein: 18, fat: 4, carbs: 5, fiber: 1, vitaminC: 6, vitaminB: 12, image: '🦐', cookingMethod: '炒制', effect: '鲜香可口，高蛋白' },
        { id: 185, name: '藠头炒豆腐', category: '家常菜', calories: 90, protein: 8, fat: 5, carbs: 6, fiber: 1.5, vitaminC: 15, vitaminB: 6, image: '🧊', cookingMethod: '炒制', effect: '清香可口，营养均衡' },
        // 补充家常菜谱至100种
        { id: 186, name: '藠头炒肉丝', category: '家常菜', calories: 140, protein: 15, fat: 6, carbs: 8, fiber: 1.2, vitaminC: 18, vitaminB: 10, image: '🥬', cookingMethod: '炒制', effect: '清香可口，高蛋白' },
        { id: 187, name: '藠头炒鸡胗', category: '家常菜', calories: 130, protein: 20, fat: 4, carbs: 6, fiber: 1, vitaminC: 8, vitaminB: 12, image: '🐔', cookingMethod: '炒制', effect: '鲜香可口，高蛋白' },
        { id: 188, name: '藠头炒腰花', category: '家常菜', calories: 150, protein: 18, fat: 7, carbs: 5, fiber: 0.8, vitaminC: 6, vitaminB: 15, image: '🐖', cookingMethod: '炒制', effect: '鲜香可口，高蛋白' },
        { id: 189, name: '藠头炒猪肝', category: '家常菜', calories: 140, protein: 20, fat: 5, carbs: 6, fiber: 0.5, vitaminC: 12, vitaminB: 18, image: '🐖', cookingMethod: '炒制', effect: '鲜香可口，高蛋白' }
      ];
      storage.set(STORAGE_KEYS.SYSTEM_DISHES, defaultSystemDishes);
    }
  }, []);

  useEffect(() => {
    loadDishes();
  }, []);

  useEffect(() => {
    filterDishes();
  }, [dishes, searchKey, selectedCategory]);

  const loadDishes = () => {
    try {
      setLoading(true);
      // 获取所有菜品数据
      const systemDishes = storage.get(STORAGE_KEYS.SYSTEM_DISHES, []);
      const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, []);
      const deletedSystemDishes = storage.get(STORAGE_KEYS.DELETED_SYSTEM_DISHES, []);
      const modifiedSystemDishes = storage.get(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, {});
      
      // 合并系统菜品和自定义菜品
      let allDishes = [...systemDishes];
      
      // 应用修改
      Object.keys(modifiedSystemDishes).forEach(id => {
        const index = allDishes.findIndex(dish => dish.id == id);
        if (index !== -1) {
          allDishes[index] = modifiedSystemDishes[id];
        }
      });
      
      // 移除已删除的系统菜品
      allDishes = allDishes.filter(dish => !deletedSystemDishes.includes(dish.id));
      
      // 添加自定义菜品
      allDishes = [...allDishes, ...customDishes];
      
      setDishes(allDishes);
      setLoading(false);
    } catch (error) {
      console.error('加载菜品数据失败:', error);
      Toast.show({ icon: 'fail', content: '加载菜品数据失败' });
      setLoading(false);
    }
  };

  const filterDishes = () => {
    try {
      let result = dishes;
      
      // 搜索过滤
      if (searchKey) {
        result = result.filter(dish => 
          dish.name && dish.name.toLowerCase().includes(searchKey.toLowerCase())
        );
      }

      // 分类过滤
      if (selectedCategory !== '全部') {
        result = result.filter(dish => dish.category === selectedCategory);
      }

      setFilteredDishes(result);
    } catch (error) {
      console.error('过滤菜品数据失败:', error);
      setFilteredDishes([]);
    }
  };

  const categories = ['全部', '早餐', '主食', '蔬菜', '肉类', '豆制品', '水果', '家常菜', '汤类', '粥', '菌菇', '坚果', '海鲜', '凉菜', '炖菜', '饮品', '甜品'];

  const handleAddDish = () => {
    addForm.resetFields();
    // 重置本地状态
    setAddDishData({
      name: '',
      category: '',
      image: '',
      calories: '',
      protein: '',
      fat: '',
      carbs: '',
      fiber: '',
      vitaminC: '',
      vitaminB: '',
      cookingMethod: '',
      effect: '',
      steps: '',
      tips: ''
    });
    setShowAddDish(true);
  };

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    editForm.setFieldsValue({
      name: dish.name,
      category: dish.category,
      calories: dish.calories,
      protein: dish.protein,
      fat: dish.fat,
      carbs: dish.carbs,
      fiber: dish.fiber,
      vitaminC: dish.vitaminC,
      vitaminB: dish.vitaminB,
      image: dish.image,
      cookingMethod: dish.cookingMethod,
      effect: dish.effect,
      steps: dish.steps ? dish.steps.join('\n') : '',
      tips: dish.tips || '',
    });
    setShowEditDish(true);
  };

  const handleDeleteDish = async (dish) => {
    if (dish.id <= 300) { // 系统菜品ID范围扩大到300
      const deletedSystemDishes = storage.get(STORAGE_KEYS.DELETED_SYSTEM_DISHES, []);
      if (!deletedSystemDishes.includes(dish.id)) {
        deletedSystemDishes.push(dish.id);
        storage.set(STORAGE_KEYS.DELETED_SYSTEM_DISHES, deletedSystemDishes);
      }
    } else {
      const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, []);
      const newCustomDishes = customDishes.filter(d => d.id !== dish.id);
      storage.set(STORAGE_KEYS.CUSTOM_DISHES, newCustomDishes);
    }
    
    loadDishes();
    Toast.show({ icon: 'success', content: '删除成功' });
  };

  const handleAutoFetch = async () => {
    if (!addDishData.name) {
      Toast.show({ content: '请先输入菜品名称', icon: 'fail' });
      return;
    }

    setAutoFetching(true);
    Toast.show({ icon: 'loading', content: '正在获取营养信息...', duration: 0 });

    try {
      const nutrition = await fetchNutritionInfo(addDishData.name);
      const category = suggestCategory(addDishData.name);
      const emoji = suggestEmoji(addDishData.name, category);

      // 更新本地状态
      setAddDishData(prev => ({
        ...prev,
        category: category,
        calories: nutrition.calories.toString(),
        protein: nutrition.protein.toString(),
        fat: nutrition.fat.toString(),
        carbs: nutrition.carbs.toString(),
        fiber: nutrition.fiber.toString(),
        vitaminC: nutrition.vitaminC.toString(),
        vitaminB: nutrition.vitaminB.toString(),
        image: emoji,
        effect: '营养均衡，美味可口',
        // 更新制作步骤和小贴士
        steps: nutrition.steps ? nutrition.steps.join('\n') : '',
        tips: nutrition.tips || ''
      }));
      
      // 同时更新表单字段
      addForm.setFieldsValue({
        category: category,
        calories: nutrition.calories.toString(),
        protein: nutrition.protein.toString(),
        fat: nutrition.fat.toString(),
        carbs: nutrition.carbs.toString(),
        fiber: nutrition.fiber.toString(),
        vitaminC: nutrition.vitaminC.toString(),
        vitaminB: nutrition.vitaminB.toString(),
        image: emoji,
        effect: '营养均衡，美味可口',
        // 更新制作步骤和小贴士
        steps: nutrition.steps ? nutrition.steps.join('\n') : '',
        tips: nutrition.tips || ''
      });

      Toast.clear();
      Toast.show({ icon: 'success', content: '营养信息获取成功' });
    } catch (error) {
      console.error('自动获取营养信息失败:', error);
      Toast.clear();
      Toast.show({ icon: 'fail', content: '获取失败，请手动填写' });
    } finally {
      setAutoFetching(false);
    }
  };

  const handleSaveDish = async (isEdit = false) => {
    try {
      if (isEdit && editingDish) {
        const values = await editForm.validateFields();
        
        // 处理步骤信息
        const dishData = { ...values };
        if (dishData.steps) {
          dishData.steps = dishData.steps.split('\n').filter(step => step.trim() !== '');
        }
        
        if (editingDish.id <= 300) { // 系统菜品ID范围扩大到300
          const modifiedSystemDishes = storage.get(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, {});
          modifiedSystemDishes[editingDish.id] = { ...editingDish, ...dishData };
          storage.set(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, modifiedSystemDishes);
        } else {
          const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, []);
          const index = customDishes.findIndex(d => d.id === editingDish.id);
          if (index !== -1) {
            customDishes[index] = { ...editingDish, ...dishData };
            storage.set(STORAGE_KEYS.CUSTOM_DISHES, customDishes);
          }
        }
        setShowEditDish(false);
        setEditingDish(null);
        Toast.show({ icon: 'success', content: '修改成功' });
      } else {
        const values = await addForm.validateFields();
        
        // 处理步骤信息
        const dishData = { ...values };
        if (dishData.steps) {
          dishData.steps = dishData.steps.split('\n').filter(step => step.trim() !== '');
        }
        
        const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, []);
        const newId = Math.max(...customDishes.map(d => d.id), 300) + 1; // ID范围扩大到300
        
        const newDish = {
          id: newId,
          ...dishData,
        };
        
        customDishes.push(newDish);
        storage.set(STORAGE_KEYS.CUSTOM_DISHES, customDishes);
        setShowAddDish(false);
        Toast.show({ icon: 'success', content: '添加成功' });
      }
      
      loadDishes();
    } catch (error) {
      console.error('保存失败:', error);
      Toast.show({ icon: 'fail', content: '保存失败，请检查输入内容' });
    }
  };

  return (
    <div className="dish-manage-page">
      <NavBar onBack={onBack}>菜品管理</NavBar>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="manage-tabs">
        <Tabs.Tab title="菜品列表" key="dishes" />
        <Tabs.Tab title="家常菜谱" key="recipes" />
      </Tabs>

      {activeTab === 'dishes' && (
        <>
          <div className="page-header">
            <p>共 {filteredDishes.length} 个菜品</p>
          </div>

          <div className="search-section">
            <SearchBar
              placeholder="搜索菜品名称"
              value={searchKey || ''}
              onChange={(val) => {
                setSearchKey(val || '');
              }}
              style={{ '--border-radius': '20px' }}
            />
          </div>

          <div className="category-filter">
            <div className="category-scroll">
              {categories.map(cat => (
                <div
                  key={cat}
                  className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div className="dish-list">
            {loading ? (
              <div className="empty-state">
                <p>加载中...</p>
              </div>
            ) : filteredDishes && filteredDishes.length > 0 ? (
              filteredDishes.map(dish => (
                <Card key={dish.id} className="dish-card" onClick={() => {
                  setSelectedDish(dish);
                  setShowDishDetail(true);
                }}>
                  <div className="dish-content">
                    <div className="dish-icon">{dish.image || '🍽️'}</div>
                    <div className="dish-info">
                      <div className="dish-name">{dish.name || '未命名'}</div>
                      <div className="dish-category">{dish.category || '未分类'}</div>
                      <div className="dish-nutrition">
                        <span>热量: {dish.calories || 0}kcal</span>
                        <span>蛋白质: {dish.protein || 0}g</span>
                      </div>
                    </div>
                    <div className="dish-actions">
                      <Button
                        size="small"
                        fill="none"
                        onClick={() => handleEditDish(dish)}
                      >
                        <EditSOutline />
                      </Button>
                      <Button
                        size="small"
                        fill="none"
                        color="danger"
                        onClick={() => handleDeleteDish(dish)}
                      >
                        <DeleteOutline />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="empty-state">
                <p>😔 暂无菜品</p>
                <Button color="primary" onClick={handleAddDish}>添加菜品</Button>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'recipes' && (
        <div className="recipes-container">
          <div className="recipes-header">
            <div className="search-section">
              <SearchBar
                placeholder="搜索家常菜谱"
                value={searchKey || ''}
                onChange={(val) => setSearchKey(val || '')}
                style={{ '--border-radius': '20px' }}
              />
            </div>
          </div>

          <div className="recipe-list">
            {loading ? (
              <div className="empty-recipes">
                <p>加载中...</p>
              </div>
            ) : dishes && dishes.length > 0 ? (
              dishes.filter(d => d.category === '家常菜').filter(dish => {
                if (!searchKey) return true;
                return dish.name && dish.name.toLowerCase().includes(searchKey.toLowerCase());
              }).map(dish => (
                <Card key={dish.id} className="recipe-card" onClick={(e) => {
                  // 阻止点击事件冒泡到编辑和删除按钮
                  if (e.target.closest('.dish-actions')) return;
                  setSelectedDish(dish);
                  setShowDishDetail(true);
                }}>
                  <div className="recipe-content">
                    <div className="recipe-icon">{dish.image || '🍽️'}</div>
                    <div className="recipe-info">
                      <div className="recipe-name">{dish.name || '未命名'}</div>
                      <div className="recipe-effect">
                        <span className="effect-icon">✨</span>
                        {dish.effect || '营养均衡，美味可口'}
                      </div>
                      <div className="recipe-nutrition">
                        <span>🔥 {dish.calories || 0}kcal</span>
                        <span>🥩 {dish.protein || 0}g蛋白</span>
                      </div>
                    </div>
                    <div className="dish-actions">
                      <Button
                        size="small"
                        fill="none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDish(dish);
                        }}
                      >
                        <EditSOutline />
                      </Button>
                      <Button
                        size="small"
                        fill="none"
                        color="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDish(dish);
                        }}
                      >
                        <DeleteOutline />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="empty-recipes">
                <p>🍳 暂无家常菜谱</p>
                <p className="empty-tip">可以尝试添加新的家常菜</p>
              </div>
            )}

            {dishes && dishes.filter(d => d.category === '家常菜').filter(dish => {
              if (!searchKey) return true;
              return dish.name && dish.name.toLowerCase().includes(searchKey.toLowerCase());
            }).length === 0 && dishes.filter(d => d.category === '家常菜').length > 0 && (
              <div className="empty-recipes">
                <p>🍳 暂无匹配的家常菜谱</p>
                <p className="empty-tip">可以尝试其他关键词或添加新的家常菜</p>
              </div>
            )}
          </div>
        </div>
      )}

      <FloatingBubble
        style={{
          '--initial-position-bottom': '80px',
          '--initial-position-right': '20px',
          '--background': 'var(--adm-color-primary)',
        }}
        onClick={handleAddDish}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="0" y="0" width="32" height="32" fill="white" opacity="0" />
          <path 
            d="M16 6C16.5523 6 17 6.44772 17 7V15H25C25.5523 15 26 15.4477 26 16C26 16.5523 25.5523 17 25 17H17V25C17 25.5523 16.5523 26 16 26C15.4477 26 15 25.5523 15 25V17H7C6.44772 17 6 16.5523 6 16C6 15.4477 6.44772 15 7 15H15V7C15 6.44772 15.4477 6 16 6Z" 
            fill="white"
          />
        </svg>
      </FloatingBubble>

      {/* 添加菜品弹窗 */}
      <Popup
        visible={showAddDish}
        onMaskClick={() => setShowAddDish(false)}
        position="right"
        bodyStyle={{ width: '100vw', height: '100vh' }}
      >
        <div className="dish-form-popup">
          <div className="popup-header">
            <h3>添加菜品</h3>
            <Button 
              size="small" 
              color="primary" 
              onClick={handleAutoFetch}
              loading={autoFetching}
              disabled={!addDishData.name || autoFetching}
            >
              🤖 自动获取
            </Button>
          </div>
          
          <Form form={addForm} layout="horizontal" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
            <Form.Item name="name" label="菜品名称" rules={[{ required: true, message: '请输入菜品名称' }]}>
              <input 
                placeholder="请输入菜品名称" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, name: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ name: value });
                }}
              />
            </Form.Item>
            <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
              <select
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.category}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, category: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ category: value });
                }}
              >
                <option value="">请选择分类</option>
                {categories.filter(c => c !== '全部').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Form.Item>
            <Form.Item name="image" label="图标">
              <input 
                placeholder="输入Emoji图标" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.image}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, image: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ image: value });
                }}
              />
            </Form.Item>
            <Form.Item name="calories" label="热量(kcal)" rules={[{ required: true, message: '请输入热量' }]}>
              <input 
                type="number" 
                placeholder="请输入热量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.calories}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, calories: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ calories: value });
                }}
              />
            </Form.Item>
            <Form.Item name="protein" label="蛋白质(g)" rules={[{ required: true, message: '请输入蛋白质含量' }]}>
              <input 
                type="number" 
                placeholder="请输入蛋白质含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.protein}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, protein: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ protein: value });
                }}
              />
            </Form.Item>
            <Form.Item name="fat" label="脂肪(g)" rules={[{ required: true, message: '请输入脂肪含量' }]}>
              <input 
                type="number" 
                placeholder="请输入脂肪含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.fat}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, fat: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ fat: value });
                }}
              />
            </Form.Item>
            <Form.Item name="carbs" label="碳水化合物(g)" rules={[{ required: true, message: '请输入碳水化合物含量' }]}>
              <input 
                type="number" 
                placeholder="请输入碳水化合物含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.carbs}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, carbs: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ carbs: value });
                }}
              />
            </Form.Item>
            <Form.Item name="fiber" label="膳食纤维(g)" rules={[{ required: true, message: '请输入膳食纤维含量' }]}>
              <input 
                type="number" 
                placeholder="请输入膳食纤维含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.fiber}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, fiber: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ fiber: value });
                }}
              />
            </Form.Item>
            <Form.Item name="vitaminC" label="维生素C(mg)" rules={[{ required: true, message: '请输入维生素C含量' }]}>
              <input 
                type="number" 
                placeholder="请输入维生素C含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.vitaminC}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, vitaminC: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ vitaminC: value });
                }}
              />
            </Form.Item>
            <Form.Item name="vitaminB" label="维生素B(mg)" rules={[{ required: true, message: '请输入维生素B含量' }]}>
              <input 
                type="number" 
                placeholder="请输入维生素B含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={addDishData.vitaminB}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, vitaminB: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ vitaminB: value });
                }}
              />
            </Form.Item>
            <Form.Item name="effect" label="功效">
              <textarea 
                placeholder="请输入功效" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                value={addDishData.effect}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, effect: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ effect: value });
                }}
              />
            </Form.Item>
            <Form.Item name="steps" label="制作步骤">
              <textarea 
                placeholder="请输入制作步骤，每行一个步骤" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                value={addDishData.steps}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, steps: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ steps: value });
                }}
              />
            </Form.Item>
            <Form.Item name="tips" label="小贴士">
              <textarea 
                placeholder="请输入小贴士" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                value={addDishData.tips}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddDishData(prev => ({ ...prev, tips: value }));
                  // 确保表单字段也同步更新
                  addForm.setFieldsValue({ tips: value });
                }}
              />
            </Form.Item>
          </Form>
          
          <div className="popup-footer">
            <Button 
              color="primary" 
              onClick={() => handleSaveDish(false)}
              style={{ flex: 1, marginRight: '10px' }}
            >
              保存
            </Button>
            <Button 
              onClick={() => setShowAddDish(false)}
              style={{ flex: 1 }}
            >
              取消
            </Button>
          </div>
        </div>
      </Popup>

      {/* 编辑菜品弹窗 */}
      <Popup
        visible={showEditDish}
        onMaskClick={() => setShowEditDish(false)}
        position="right"
        bodyStyle={{ width: '100vw', height: '100vh' }}
      >
        <div className="dish-form-popup">
          <div className="popup-header">
            <h3>编辑菜品</h3>
          </div>
          
          <Form form={editForm} layout="horizontal" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
            <Form.Item name="name" label="菜品名称" rules={[{ required: true, message: '请输入菜品名称' }]}> 
              <input 
                placeholder="请输入菜品名称" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.name || ''}
                onChange={(e) => editForm.setFieldsValue({ name: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}> 
              <select
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.category || ''}
                onChange={(e) => editForm.setFieldsValue({ category: e.target.value })}
              >
                <option value="">请选择分类</option>
                {categories.filter(c => c !== '全部').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Form.Item>
            <Form.Item name="image" label="图标">
              <input 
                placeholder="输入Emoji图标" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.image || ''}
                onChange={(e) => editForm.setFieldsValue({ image: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="calories" label="热量(kcal)" rules={[{ required: true, message: '请输入热量' }]}> 
              <input 
                type="number" 
                placeholder="请输入热量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.calories || ''}
                onChange={(e) => editForm.setFieldsValue({ calories: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="protein" label="蛋白质(g)" rules={[{ required: true, message: '请输入蛋白质含量' }]}> 
              <input 
                type="number" 
                placeholder="请输入蛋白质含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.protein || ''}
                onChange={(e) => editForm.setFieldsValue({ protein: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="fat" label="脂肪(g)" rules={[{ required: true, message: '请输入脂肪含量' }]}> 
              <input 
                type="number" 
                placeholder="请输入脂肪含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.fat || ''}
                onChange={(e) => editForm.setFieldsValue({ fat: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="carbs" label="碳水化合物(g)" rules={[{ required: true, message: '请输入碳水化合物含量' }]}> 
              <input 
                type="number" 
                placeholder="请输入碳水化合物含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.carbs || ''}
                onChange={(e) => editForm.setFieldsValue({ carbs: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="fiber" label="膳食纤维(g)" rules={[{ required: true, message: '请输入膳食纤维含量' }]}> 
              <input 
                type="number" 
                placeholder="请输入膳食纤维含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.fiber || ''}
                onChange={(e) => editForm.setFieldsValue({ fiber: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="vitaminC" label="维生素C(mg)" rules={[{ required: true, message: '请输入维生素C含量' }]}> 
              <input 
                type="number" 
                placeholder="请输入维生素C含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.vitaminC || ''}
                onChange={(e) => editForm.setFieldsValue({ vitaminC: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="vitaminB" label="维生素B(mg)" rules={[{ required: true, message: '请输入维生素B含量' }]}> 
              <input 
                type="number" 
                placeholder="请输入维生素B含量" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                value={editingDish?.vitaminB || ''}
                onChange={(e) => editForm.setFieldsValue({ vitaminB: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="effect" label="功效">
              <textarea 
                placeholder="请输入功效" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                value={editingDish?.effect || ''}
                onChange={(e) => editForm.setFieldsValue({ effect: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="steps" label="制作步骤">
              <textarea 
                placeholder="请输入制作步骤，每行一个步骤" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                value={editingDish?.steps ? (Array.isArray(editingDish.steps) ? editingDish.steps.join('\n') : editingDish.steps) : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // 更新编辑表单字段
                  editForm.setFieldsValue({ steps: value });
                  // 同时更新本地状态
                  setEditingDish(prev => ({ ...prev, steps: value }));
                }}
              />
            </Form.Item>
            <Form.Item name="tips" label="小贴士">
              <textarea 
                placeholder="请输入小贴士" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                value={editingDish?.tips || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // 更新编辑表单字段
                  editForm.setFieldsValue({ tips: value });
                  // 同时更新本地状态
                  setEditingDish(prev => ({ ...prev, tips: value }));
                }}
              />
            </Form.Item>
          </Form>
          
          <div className="popup-footer">
            <Button 
              color="primary" 
              onClick={() => handleSaveDish(true)}
              style={{ flex: 1, marginRight: '10px' }}
            >
              保存
            </Button>
            <Button 
              onClick={() => setShowEditDish(false)}
              style={{ flex: 1 }}
            >
              取消
            </Button>
          </div>
        </div>
      </Popup>
      
      {/* 详情页面 */}
      <Popup
        visible={showDishDetail}
        onMaskClick={() => setShowDishDetail(false)}
        position="right"
        bodyStyle={{ width: '100vw', height: '100vh' }}
      >
        <div className="dish-detail-popup" style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
          <div className="popup-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
            <Button 
              size="small" 
              onClick={() => setShowDishDetail(false)}
              style={{ marginRight: '10px' }}
            >
              返回
            </Button>
            <h3 style={{ margin: 0, flex: 1, textAlign: 'center' }}>菜品详情</h3>
            <div style={{ width: '50px' }}></div> {/* 占位元素，用于保持标题居中 */}
          </div>
          
          {selectedDish && (
            <div className="dish-detail-content" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <div className="dish-detail-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div className="dish-detail-icon" style={{ fontSize: '64px', margin: '10px 0' }}>
                  {selectedDish.image || '🍽️'}
                </div>
                <h2 style={{ margin: '10px 0', fontSize: '24px' }}>{selectedDish.name}</h2>
                <div className="dish-detail-category" style={{ color: '#666', marginBottom: '10px' }}>
                  分类: {selectedDish.category}
                </div>
              </div>
              
              <div className="dish-nutrition-info" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #eee' }}>营养信息</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>热量: {selectedDish.calories || 0}kcal</div>
                  <div>蛋白质: {selectedDish.protein || 0}g</div>
                  <div>脂肪: {selectedDish.fat || 0}g</div>
                  <div>碳水化合物: {selectedDish.carbs || 0}g</div>
                  <div>膳食纤维: {selectedDish.fiber || 0}g</div>
                  <div>维生素C: {selectedDish.vitaminC || 0}mg</div>
                  <div>维生素B: {selectedDish.vitaminB || 0}mg</div>
                </div>
              </div>
              
              {selectedDish.effect && (
                <div className="dish-effect" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #eee' }}>功效</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>{selectedDish.effect}</p>
                </div>
              )}
              
              {selectedDish.steps && (
                <div className="dish-steps" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #eee' }}>制作步骤</h3>
                  <div style={{ paddingLeft: '10px' }}>
                    {Array.isArray(selectedDish.steps) 
                      ? selectedDish.steps.map((step, index) => {
                          // 解析步骤内容，提取时间、选材、调料等信息
                          const stepContent = parseStepContent(step);
                          return (
                            <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '8px', backgroundColor: '#00b578', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{index + 1}</span>
                                <span style={{ fontWeight: 'bold' }}>{stepContent.main}</span>
                              </div>
                              {stepContent.materials && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>选材：</span>{stepContent.materials}
                                </div>
                              )}
                              {stepContent.seasoning && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>调料：</span>{stepContent.seasoning}
                                </div>
                              )}
                              {stepContent.time && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>时间：</span>{stepContent.time}
                                </div>
                              )}
                              {stepContent.temperature && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>温度：</span>{stepContent.temperature}
                                </div>
                              )}
                              {stepContent.fire && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>火候：</span>{stepContent.fire}
                                </div>
                              )}
                              {stepContent.tips && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666' }}>
                                  <span style={{ fontWeight: 'bold' }}>提示：</span>{stepContent.tips}
                                </div>
                              )}
                            </div>
                          );
                        })
                      : selectedDish.steps.split('\n').map((step, index) => {
                          // 解析步骤内容，提取时间、选材、调料等信息
                          const stepContent = parseStepContent(step);
                          return (
                            <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '8px', backgroundColor: '#00b578', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{index + 1}</span>
                                <span style={{ fontWeight: 'bold' }}>{stepContent.main}</span>
                              </div>
                              {stepContent.materials && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>选材：</span>{stepContent.materials}
                                </div>
                              )}
                              {stepContent.seasoning && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>调料：</span>{stepContent.seasoning}
                                </div>
                              )}
                              {stepContent.time && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>时间：</span>{stepContent.time}
                                </div>
                              )}
                              {stepContent.temperature && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>温度：</span>{stepContent.temperature}
                                </div>
                              )}
                              {stepContent.fire && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                                  <span style={{ fontWeight: 'bold' }}>火候：</span>{stepContent.fire}
                                </div>
                              )}
                              {stepContent.tips && (
                                <div style={{ marginLeft: '28px', fontSize: '14px', color: '#666' }}>
                                  <span style={{ fontWeight: 'bold' }}>提示：</span>{stepContent.tips}
                                </div>
                              )}
                            </div>
                          );
                        })
                    }
                  </div>
                </div>
              )}
              
              {selectedDish.tips && (
                <div className="dish-tips" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #eee' }}>小贴士</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>{selectedDish.tips}</p>
                </div>
              )}
              
              <div className="dish-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Button 
                  color="primary" 
                  onClick={() => {
                    handleEditDish(selectedDish);
                    setShowDishDetail(false);
                  }}
                  style={{ flex: 1 }}
                >
                  编辑
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => {
                    handleDeleteDish(selectedDish);
                    setShowDishDetail(false);
                  }}
                  style={{ flex: 1 }}
                >
                  删除
                </Button>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </div>
  );
}

export default DishManagePage;