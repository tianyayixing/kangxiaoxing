import { useState, useEffect } from 'react'
import { Tabs, Button, Card, Tag, Toast } from 'antd-mobile'
import { AddOutline, CloseOutline } from 'antd-mobile-icons'
import { storage, STORAGE_KEYS } from '../utils/storage'
import { getDishDatabase, getAllCategories, searchDishByName, filterDishByCategory } from '../data/dishDatabase'
import { NutritionAnalyzer } from '../services/nutritionService'
import DishDetailModal from '../components/DishDetailModal'
import './WeekPlanPage.css'

function WeekPlanPage({ onNavigateToDishSelection, onActiveDayChange, activeDay: propActiveDay }) {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const [activeDay, setActiveDay] = useState(propActiveDay || '周一')
  const [weekPlan, setWeekPlan] = useState({})
  const [selectedDish, setSelectedDish] = useState(null)
  const [showDishDetail, setShowDishDetail] = useState(false)
  const [dailyAnalysis, setDailyAnalysis] = useState(null)

  console.log('WeekPlanPage rendered with:', { activeDay, weekPlan, selectedDish, showDishDetail, dailyAnalysis }) // 调试信息

  useEffect(() => {
    loadWeekPlan()
  }, [])

  useEffect(() => {
    analyzeDailyPlan()
  }, [weekPlan, activeDay])

  const loadWeekPlan = () => {
    console.log('Loading week plan...') // 调试信息
    const plan = storage.get(STORAGE_KEYS.DIET_PLAN, {})
    console.log('Loaded week plan:', plan) // 调试信息
    
    // 只初始化不存在的日期计划，保留已有的数据
    const newPlan = { ...plan }
    days.forEach(day => {
      if (!newPlan[day]) {
        newPlan[day] = { breakfast: [], lunch: [], dinner: [], snack: [] }
      }
    })
    
    console.log('Initialized plan:', newPlan) // 调试信息
    setWeekPlan(newPlan)
  }

  const analyzeDailyPlan = () => {
    console.log('Analyzing daily plan for:', activeDay) // 调试信息
    console.log('Week plan:', weekPlan) // 调试信息
    if (!weekPlan[activeDay]) return
    const dayData = weekPlan[activeDay]
    console.log('Day data:', dayData) // 调试信息
    const allDishes = [
      ...dayData.breakfast,
      ...dayData.lunch,
      ...dayData.dinner,
      ...dayData.snack
    ]
    console.log('All dishes:', allDishes) // 调试信息
    try {
      const analysis = NutritionAnalyzer.analyzeDailyNutrition(allDishes)
      console.log('Analysis result:', analysis) // 调试信息
      setDailyAnalysis(analysis)
    } catch (error) {
      console.error('营养分析失败:', error)
      // 设置默认分析结果
      setDailyAnalysis({
        score: 0,
        evaluation: '暂无分析数据',
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        proteinRatio: 0,
        fatRatio: 0,
        carbsRatio: 0,
        suggestions: []
      })
    }
  }

  const saveWeekPlan = (newPlan) => {
    storage.set(STORAGE_KEYS.DIET_PLAN, newPlan)
    setWeekPlan(newPlan)
  }

  const handleAddDish = (mealType) => {
    // 跳转到菜品选择页面
    if (onNavigateToDishSelection) {
      onNavigateToDishSelection(mealType, (selectedDishes) => {
        // 处理选择的菜品
        const newPlan = { ...weekPlan }
        if (!newPlan[activeDay][mealType]) {
          newPlan[activeDay][mealType] = []
        }
        // 添加所有选择的菜品
        newPlan[activeDay][mealType] = [...newPlan[activeDay][mealType], ...selectedDishes]
        saveWeekPlan(newPlan)
        Toast.show({ icon: 'success', content: `成功添加${selectedDishes.length}个菜品` })
      }, activeDay) // 传递当前活动日
    }
  }

  const handleRemoveDish = (mealType, index) => {
    const newPlan = { ...weekPlan }
    newPlan[activeDay][mealType].splice(index, 1)
    saveWeekPlan(newPlan)
    Toast.show({ content: '已移除' })
  }

  // 移除了handleSelectDish, handleSearch, handleCategoryChange函数，因为这些功能现在在DishSelectionPage中处理

  const viewDishDetail = (dish) => {
    setSelectedDish(dish)
    setShowDishDetail(true)
  }

  const mealTypes = [
    { key: 'breakfast', name: '早餐', icon: '🌅' },
    { key: 'lunch', name: '午餐', icon: '☀️' },
    { key: 'dinner', name: '晚餐', icon: '🌙' },
    { key: 'snack', name: '加餐', icon: '🍎' }
  ]

  const categories = ['全部', ...getAllCategories()]

  return (
    <div className="week-plan-page">
      <div className="plan-header">
      </div>

      <Tabs activeKey={activeDay} onChange={(key) => {
        setActiveDay(key)
        if (onActiveDayChange) {
          onActiveDayChange(key)
        }
      }} className="day-tabs">
        {days.map(day => (
          <Tabs.Tab title={day} key={day} />
        ))}
      </Tabs>

      <div className="analysis-section">
        {(dailyAnalysis || !dailyAnalysis) && (
          <Card className="quick-analysis">
            <div className="analysis-row">
              <div className="analysis-item">
                <span className="analysis-label">评分</span>
                <span className="analysis-value" style={{ 
                  color: dailyAnalysis && dailyAnalysis.score >= 80 ? 'var(--primary-color)' : 'var(--warning-color)' 
                }}>
                  {dailyAnalysis ? dailyAnalysis.score : '--'}
                </span>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">热量</span>
                <span className="analysis-value">{dailyAnalysis ? dailyAnalysis.totalCalories : '--'}</span>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">蛋白质</span>
                <span className="analysis-value">{dailyAnalysis ? `${dailyAnalysis.totalProtein}g` : '--'}</span>
              </div>
            </div>
            {dailyAnalysis && dailyAnalysis.suggestions && dailyAnalysis.suggestions.length > 0 && (
              <div className="quick-suggestions">
                <Tag color="primary" fill="solid">
                  {dailyAnalysis.suggestions[0]}
                </Tag>
              </div>
            )}
            {!dailyAnalysis && (
              <div className="quick-suggestions">
                <Tag color="default" fill="solid">
                  正在加载分析数据...
                </Tag>
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="meals-container">
        {mealTypes.map(meal => (
          <Card key={meal.key} className="meal-card">
            <div className="meal-card-header">
              <div className="meal-title">
                <span className="meal-icon">{meal.icon}</span>
                <span>{meal.name}</span>
              </div>
              <Button
                size="small"
                color="primary"
                fill="none"
                onClick={() => handleAddDish(meal.key)}
              >
                <AddOutline /> 添加
              </Button>
            </div>
            
            <div className="dish-list">
              {weekPlan[activeDay] && weekPlan[activeDay][meal.key] ? weekPlan[activeDay][meal.key].map((dish, index) => (
                <div key={index} className="dish-item" onClick={() => viewDishDetail(dish)}>
                  <span className="dish-emoji">{dish.image}</span>
                  <div className="dish-info">
                    <div className="dish-name">{dish.name}</div>
                    <div className="dish-calories">{dish.calories} kcal</div>
                  </div>
                  <CloseOutline 
                    className="dish-remove"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveDish(meal.key, index)
                    }}
                  />
                </div>
              )) : (
                <div className="empty-dish">
                  <p>还没有添加菜品</p>
                </div>
              )}
              
              {weekPlan[activeDay] && weekPlan[activeDay][meal.key] && weekPlan[activeDay][meal.key].length === 0 && (
                <div className="empty-dish">
                  <p>还没有添加菜品</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedDish && (
        <DishDetailModal
          visible={showDishDetail}
          dish={selectedDish}
          onClose={() => setShowDishDetail(false)}
        />
      )}
    </div>
  )
}

export default WeekPlanPage