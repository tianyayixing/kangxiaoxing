/**
 * 营养信息API服务
 * 用于获取菜品的营养信息
 */

/**
 * 从网络获取菜品营养信息
 * 这里使用模拟数据，实际项目中可以对接真实的营养数据库API
 */
export async function fetchNutritionInfo(dishName) {
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里可以对接真实的API，例如：
    // - USDA FoodData Central API
    // - Nutritionix API
    // - Edamam Nutrition API
    // const response = await fetch(`https://api.nutritionix.com/v1_1/search/${dishName}?...`)
    
    // 目前使用智能估算返回模拟数据
    return estimateNutrition(dishName)
  } catch (error) {
    console.error('获取营养信息失败:', error)
    return null
  }
}

/**
 * 智能估算营养信息（基于菜品名称和常见规律）
 */
function estimateNutrition(dishName) {
  // 基础营养值
  let nutrition = {
    calories: 100,
    protein: 5,
    fat: 3,
    carbs: 15,
    fiber: 2,
    vitaminC: 5,
    vitaminB: 8,
  }
  
  // 根据菜品名称关键词调整营养值
  const name = dishName.toLowerCase()
  
  // 肉类关键词
  if (/肉|鸡|鸭|牛|猪|羊|排骨/.test(name)) {
    nutrition.calories += 100
    nutrition.protein += 15
    nutrition.fat += 10
  }
  
  // 鱼虾海鲜
  if (/鱼|虾|蟹|贝|海鲜/.test(name)) {
    nutrition.calories += 50
    nutrition.protein += 18
    nutrition.fat += 3
  }
  
  // 蔬菜类
  if (/菜|菠菜|白菜|芹菜|青菜|生菜|油菜/.test(name)) {
    nutrition.calories = 25
    nutrition.protein = 2
    nutrition.fat = 0.5
    nutrition.carbs = 5
    nutrition.fiber = 2.5
    nutrition.vitaminC = 30
  }
  
  // 豆制品
  if (/豆腐|豆干|豆皮|豆浆/.test(name)) {
    nutrition.calories = 80
    nutrition.protein = 10
    nutrition.fat = 4
    nutrition.carbs = 5
  }
  
  // 主食类
  if (/饭|面|馒头|包子|饺子|粥/.test(name)) {
    nutrition.calories = 150
    nutrition.protein = 4
    nutrition.fat = 1
    nutrition.carbs = 32
    nutrition.fiber = 1
  }
  
  // 油炸食品
  if (/炸|煎|烤/.test(name)) {
    nutrition.calories += 80
    nutrition.fat += 8
  }
  
  // 清淡烹饪
  if (/蒸|煮|炖|清/.test(name)) {
    nutrition.fat = Math.max(2, nutrition.fat - 3)
  }
  
  // 水果类
  if (/果|苹果|香蕉|橙|梨|葡萄/.test(name)) {
    nutrition.calories = 60
    nutrition.protein = 0.5
    nutrition.fat = 0.2
    nutrition.carbs = 15
    nutrition.fiber = 2
    nutrition.vitaminC = 25
  }
  
  // 坚果类
  if (/核桃|杏仁|花生|坚果/.test(name)) {
    nutrition.calories = 600
    nutrition.protein = 20
    nutrition.fat = 50
    nutrition.carbs = 18
  }
  
  return nutrition
}

/**
 * 根据菜品名称推荐分类
 */
export function suggestCategory(dishName) {
  const name = dishName.toLowerCase()
  
  if (/早餐|煎蛋|牛奶|豆浆|油条/.test(name)) return '早餐'
  if (/饭|面|馒头|包子|饺子|粥|主食/.test(name)) return '主食'
  if (/菜|菠菜|白菜|芹菜|青菜|生菜|油菜|西红柿|黄瓜|茄子|豆角/.test(name)) return '蔬菜'
  if (/肉|鸡|鸭|牛|猪|羊|排骨/.test(name)) return '肉类'
  if (/鱼|虾|蟹|贝|海鲜|带鱼|鲍鱼/.test(name)) return '海鲜'
  if (/豆腐|豆干|豆皮|豆浆/.test(name)) return '豆制品'
  if (/果|苹果|香蕉|橙|梨|葡萄/.test(name)) return '水果'
  if (/汤|炖|煲/.test(name)) return '汤类'
  if (/粥/.test(name)) return '粥'
  if (/菌|菇|木耳/.test(name)) return '菌菇'
  if (/核桃|杏仁|花生|坚果/.test(name)) return '坚果'
  if (/沙拉/.test(name)) return '沙拉'
  
  return '家常菜'
}

/**
 * 推荐菜品图标
 */
export function suggestEmoji(dishName, category) {
  const name = dishName.toLowerCase()
  
  // 根据名称匹配
  if (/蛋/.test(name)) return '🍳'
  if (/牛奶|豆浆/.test(name)) return '🥛'
  if (/面包/.test(name)) return '🍞'
  if (/粥/.test(name)) return '🥣'
  if (/饭/.test(name)) return '🍚'
  if (/面/.test(name)) return '🍜'
  if (/鸡/.test(name)) return '🍗'
  if (/牛肉|牛排/.test(name)) return '🥩'
  if (/猪肉|排骨/.test(name)) return '🥓'
  if (/鱼/.test(name)) return '🐟'
  if (/虾/.test(name)) return '🦐'
  if (/西红柿|番茄/.test(name)) return '🍅'
  if (/黄瓜/.test(name)) return '🥒'
  if (/胡萝卜/.test(name)) return '🥕'
  if (/茄子/.test(name)) return '🍆'
  if (/玉米/.test(name)) return '🌽'
  if (/土豆/.test(name)) return '🥔'
  if (/菌|菇/.test(name)) return '🍄'
  if (/苹果/.test(name)) return '🍎'
  if (/香蕉/.test(name)) return '🍌'
  if (/橙/.test(name)) return '🍊'
  if (/葡萄/.test(name)) return '🍇'
  if (/柠檬/.test(name)) return '🍋'
  if (/南瓜/.test(name)) return '🎃'
  
  // 根据分类匹配
  switch (category) {
    case '蔬菜': return '🥬'
    case '肉类': return '🍖'
    case '海鲜': return '🐟'
    case '水果': return '🍎'
    case '汤类': return '🥣'
    case '豆制品': return '🧊'
    case '主食': return '🍚'
    case '坚果': return '🌰'
    case '沙拉': return '🥗'
    default: return '🍽️'
  }
}
