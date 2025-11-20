/**
 * 营养数据API服务（模拟外部API）
 * 实际应用中可接入真实的营养数据库API
 */

/**
 * 模拟调用外部API获取菜品营养信息
 * @param {string} dishName - 菜品名称
 * @returns {Promise<Object>} - 菜品营养信息
 */
export async function fetchDishNutrition(dishName) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟营养数据库（实际应接入真实API）
  const nutritionDatabase = {
    '煎蛋': { calories: 155, protein: 13, fat: 11, carbs: 1, fiber: 0, vitaminC: 0, vitaminB: 8, effect: '富含蛋白质，提供能量', cookingMethod: '热锅加油，打入鸡蛋，煎至两面金黄' },
    '牛奶': { calories: 150, protein: 8, fat: 8, carbs: 12, fiber: 0, vitaminC: 2, vitaminB: 15, effect: '补钙，促进骨骼健康', cookingMethod: '直接饮用或加热' },
    // 更多数据...
  };
  
  // 查找菜品
  if (nutritionDatabase[dishName]) {
    return {
      success: true,
      data: nutritionDatabase[dishName]
    };
  }
  
  // 如果找不到，返回默认估算值
  return {
    success: false,
    message: '未找到该菜品的营养数据',
    data: {
      calories: 100,
      protein: 5,
      fat: 3,
      carbs: 15,
      fiber: 2,
      vitaminC: 5,
      vitaminB: 8,
      effect: '营养均衡',
      cookingMethod: '根据个人喜好烹饪'
    }
  };
}

/**
 * 营养分析引擎
 */
export class NutritionAnalyzer {
  
  /**
   * 分析单日营养摄入
   * @param {Array} dishes - 菜品列表
   * @param {Object} userSettings - 用户设置
   * @returns {Object} - 营养分析结果
   */
  static analyzeDailyNutrition(dishes, userSettings = {}) {
    if (!dishes || dishes.length === 0) {
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalFiber: 0,
        totalVitaminC: 0,
        totalVitaminB: 0,
        score: 0,
        evaluation: '暂无数据',
        suggestions: []
      };
    }
    
    // 计算营养总和
    const totals = dishes.reduce((acc, dish) => ({
      calories: acc.calories + (dish.calories || 0),
      protein: acc.protein + (dish.protein || 0),
      fat: acc.fat + (dish.fat || 0),
      carbs: acc.carbs + (dish.carbs || 0),
      fiber: acc.fiber + (dish.fiber || 0),
      vitaminC: acc.vitaminC + (dish.vitaminC || 0),
      vitaminB: acc.vitaminB + (dish.vitaminB || 0),
    }), { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 0 });
    
    // 根据用户信息调整推荐摄入量
    const { age, weight, height, dietGoal } = userSettings;
    
    // 基础代谢率计算（Harris-Benedict公式）
    let bmr = 0;
    if (age && weight && height) {
      // 简化的BMR计算
      bmr = 10 * weight + 6.25 * height - 5 * age + 5; // 男性
      // bmr = 10 * weight + 6.25 * height - 5 * age - 161; // 女性
    }
    
    // 根据饮食目标调整推荐热量
    let recommendedCalories = bmr > 0 ? bmr * 1.3 : 2000; // 默认活动系数1.3
    if (dietGoal === 'lose_weight') {
      recommendedCalories -= 300; // 减脂目标减少300卡
    } else if (dietGoal === 'gain_muscle') {
      recommendedCalories += 300; // 增肌目标增加300卡
    } else if (dietGoal === 'control_sugar') {
      recommendedCalories = Math.min(recommendedCalories, 1800); // 控糖目标限制热量
    }
    
    // 计算营养素比例
    const totalMacros = totals.protein * 4 + totals.fat * 9 + totals.carbs * 4;
    const proteinRatio = totalMacros > 0 ? (totals.protein * 4 / totalMacros * 100) : 0;
    const fatRatio = totalMacros > 0 ? (totals.fat * 9 / totalMacros * 100) : 0;
    const carbsRatio = totalMacros > 0 ? (totals.carbs * 4 / totalMacros * 100) : 0;
    
    // 评分系统（满分100分）
    let score = 100;
    const suggestions = [];
    
    // 热量评估（根据个人目标）
    const calorieDiff = Math.abs(totals.calories - recommendedCalories);
    const calorieDiffPercent = recommendedCalories > 0 ? (calorieDiff / recommendedCalories * 100) : 0;
    
    if (calorieDiffPercent > 20) {
      if (totals.calories < recommendedCalories) {
        score -= 15;
        suggestions.push('热量摄入不足，建议增加主食或优质蛋白质');
      } else {
        score -= 15;
        suggestions.push('热量摄入过高，建议减少高脂肪食物');
      }
    } else if (calorieDiffPercent > 10) {
      if (totals.calories < recommendedCalories) {
        score -= 10;
        suggestions.push('热量摄入略低，可适当增加营养密度高的食物');
      } else {
        score -= 10;
        suggestions.push('热量摄入略高，注意控制份量');
      }
    }
    
    // 蛋白质评估（根据体重和目标调整）
    const recommendedProtein = weight ? (dietGoal === 'gain_muscle' ? weight * 1.6 : weight * 1.2) : 60;
    const proteinDiffPercent = recommendedProtein > 0 ? (Math.abs(totals.protein - recommendedProtein) / recommendedProtein * 100) : 0;
    
    if (proteinDiffPercent > 30) {
      if (totals.protein < recommendedProtein) {
        score -= 10;
        suggestions.push(`蛋白质摄入不足（建议${Math.round(recommendedProtein)}g），建议增加鱼肉、豆制品或鸡蛋`);
      } else {
        score -= 5;
        suggestions.push('蛋白质摄入过高，注意肾脏负担');
      }
    } else if (proteinDiffPercent > 15) {
      if (totals.protein < recommendedProtein) {
        suggestions.push(`蛋白质摄入略低（建议${Math.round(recommendedProtein)}g），可适当增加`);
      }
    }
    
    // 脂肪评估（建议20-30%）
    if (fatRatio < 15) {
      score -= 10;
      suggestions.push('脂肪摄入不足，建议适量增加坚果或鱼类');
    } else if (fatRatio > 35) {
      score -= 15;
      suggestions.push('脂肪摄入过高，建议减少油炸和肥肉');
    }
    
    // 碳水化合物评估（根据目标调整）
    let recommendedCarbsRatio = 55; // 默认55%
    if (dietGoal === 'lose_weight') {
      recommendedCarbsRatio = 40; // 减脂目标降低碳水
    } else if (dietGoal === 'control_sugar') {
      recommendedCarbsRatio = 45; // 控糖目标适中碳水
    }
    
    const carbsDiff = Math.abs(carbsRatio - recommendedCarbsRatio);
    if (carbsDiff > 10) {
      if (carbsRatio < recommendedCarbsRatio) {
        score -= 10;
        suggestions.push(`碳水化合物不足（建议${recommendedCarbsRatio}%），建议增加全谷物或薯类`);
      } else {
        score -= 10;
        suggestions.push(`碳水化合物过高（建议${recommendedCarbsRatio}%），建议用粗粮代替精米白面`);
      }
    }
    
    // 膳食纤维评估（建议25-30g）
    if (totals.fiber < 20) {
      score -= 10;
      suggestions.push('膳食纤维不足，建议增加蔬菜、水果和全谷物');
    }
    
    // 维生素C评估（建议>60mg）
    if (totals.vitaminC < 50) {
      score -= 5;
      suggestions.push('维生素C不足，建议增加新鲜蔬菜和水果');
    }
    
    // B族维生素评估
    if (totals.vitaminB < 80) {
      score -= 5;
      suggestions.push('B族维生素不足，建议增加全谷物和豆类');
    }
    
    // 忌口管理检查
    const { allergies = [], customAllergy = '' } = userSettings;
    if (allergies.length > 0 || customAllergy) {
      const allAllergies = [...allergies, customAllergy].filter(Boolean);
      const consumedAllergens = [];
      
      dishes.forEach(dish => {
        allAllergies.forEach(allergen => {
          if (dish.name.includes(allergen) || (dish.category && dish.category.includes(allergen))) {
            if (!consumedAllergens.includes(allergen)) {
              consumedAllergens.push(allergen);
            }
          }
        });
      });
      
      if (consumedAllergens.length > 0) {
        score -= 20;
        suggestions.unshift(`⚠️ 检测到可能的过敏食材：${consumedAllergens.join('、')}，请留意身体反应`);
      }
    }
    
    // 根据饮食目标提供个性化建议
    if (dietGoal) {
      const goalLabels = {
        lose_weight: '减脂',
        gain_muscle: '增肌',
        maintain: '维持健康',
        control_sugar: '控糖'
      };
      
      const goalLabel = goalLabels[dietGoal] || '健康饮食';
      
      switch (dietGoal) {
        case 'lose_weight':
          if (totals.calories > recommendedCalories) {
            suggestions.push(`💡 减脂建议：当前热量摄入偏高，建议控制在${Math.round(recommendedCalories)}kcal左右`);
          }
          if (proteinRatio < 25) {
            suggestions.push('💡 减脂建议：提高蛋白质比例有助于保持肌肉量');
          }
          break;
        case 'gain_muscle':
          if (totals.calories < recommendedCalories) {
            suggestions.push(`💡 增肌建议：当前热量摄入偏低，建议增加到${Math.round(recommendedCalories)}kcal左右`);
          }
          if (totals.protein < recommendedProtein) {
            suggestions.push(`💡 增肌建议：蛋白质摄入不足，建议增加到${Math.round(recommendedProtein)}g`);
          }
          break;
        case 'control_sugar':
          if (carbsRatio > 50) {
            suggestions.push('💡 控糖建议：碳水化合物比例偏高，建议选择低GI食物');
          }
          break;
        case 'maintain':
          suggestions.push('💡 维持健康建议：保持当前饮食结构，注意营养均衡');
          break;
      }
    }
    
    // 确保分数不低于0
    score = Math.max(0, score);
    
    // 评价
    let evaluation = '';
    if (score >= 90) {
      evaluation = '优秀！营养搭配非常均衡';
    } else if (score >= 80) {
      evaluation = '良好，营养搭配较为合理';
    } else if (score >= 70) {
      evaluation = '中等，还有改进空间';
    } else if (score >= 60) {
      evaluation = '及格，建议优化饮食结构';
    } else {
      evaluation = '需要改进，营养搭配不够均衡';
    }
    
    if (suggestions.length === 0) {
      suggestions.push('营养搭配合理，继续保持！');
    }
    
    return {
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalFat: Math.round(totals.fat * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFiber: Math.round(totals.fiber * 10) / 10,
      totalVitaminC: Math.round(totals.vitaminC),
      totalVitaminB: Math.round(totals.vitaminB),
      proteinRatio: Math.round(proteinRatio * 10) / 10,
      fatRatio: Math.round(fatRatio * 10) / 10,
      carbsRatio: Math.round(carbsRatio * 10) / 10,
      score,
      evaluation,
      suggestions
    };
  }
  
  /**
   * 分析每周营养摄入
   * @param {Object} weekPlan - 一周饮食计划
   * @param {Object} userSettings - 用户设置
   * @returns {Object} - 周营养分析
   */
  static analyzeWeeklyNutrition(weekPlan, userSettings = {}) {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const dailyAnalysis = [];
    let totalScore = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    
    days.forEach(day => {
      const dayData = weekPlan[day] || { breakfast: [], lunch: [], dinner: [], snack: [] };
      const allDishes = [
        ...dayData.breakfast,
        ...dayData.lunch,
        ...dayData.dinner,
        ...dayData.snack
      ];
      
      const analysis = this.analyzeDailyNutrition(allDishes, userSettings);
      dailyAnalysis.push({ day, ...analysis });
      totalScore += analysis.score;
      totalCalories += analysis.totalCalories;
      totalProtein += analysis.totalProtein;
    });
    
    const avgScore = Math.round(totalScore / 7);
    const avgCalories = Math.round(totalCalories / 7);
    const avgProtein = Math.round(totalProtein * 10 / 7) / 10;
    
    return {
      dailyAnalysis,
      avgScore,
      avgCalories,
      avgProtein,
      weeklyEvaluation: avgScore >= 80 ? '本周饮食整体优秀' : avgScore >= 70 ? '本周饮食较为合理' : '本周饮食需要改善'
    };
  }
  
  /**
   * 智能推荐替代菜品
   * @param {Object} currentDish - 当前菜品
   * @param {Array} dishDatabase - 菜品数据库
   * @param {Object} userSettings - 用户设置
   * @returns {Array} - 推荐菜品列表
   */
  static recommendAlternatives(currentDish, dishDatabase, userSettings = {}) {
    const { allergies = [], preferences = [] } = userSettings;
    
    // 筛选符合条件的菜品
    let candidates = dishDatabase.filter(dish => {
      // 排除过敏食材
      if (allergies.some(allergen => dish.name.includes(allergen))) {
        return false;
      }
      
      // 排除当前菜品
      if (dish.id === currentDish.id) {
        return false;
      }
      
      // 同类别优先
      if (dish.category === currentDish.category) {
        return true;
      }
      
      // 营养相似（卡路里范围±30%）
      const caloriesDiff = Math.abs(dish.calories - currentDish.calories) / currentDish.calories;
      return caloriesDiff < 0.3;
    });
    
    // 按营养相似度排序
    candidates.sort((a, b) => {
      const diffA = Math.abs(a.calories - currentDish.calories) + 
                    Math.abs(a.protein - currentDish.protein);
      const diffB = Math.abs(b.calories - currentDish.calories) + 
                    Math.abs(b.protein - currentDish.protein);
      return diffA - diffB;
    });
    
    return candidates.slice(0, 5);
  }
}
