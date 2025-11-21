import { useState, useEffect } from 'react'
import { Card, ProgressBar, Tag, Button } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import { storage, STORAGE_KEYS } from '../utils/storage'
import { NutritionAnalyzer } from '../services/nutritionService'
import './HomePage.css'

function HomePage({ onNavigate }) {
  const [todayPlan, setTodayPlan] = useState({ breakfast: [], lunch: [], dinner: [], snack: [] })
  const [analysis, setAnalysis] = useState(null)
  const [userSettings, setUserSettings] = useState(null)
  const [currentDay, setCurrentDay] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUserSettings()
  }, [])

  useEffect(() => {
    if (userSettings !== null) {
      loadTodayPlan()
    }
  }, [userSettings])

  // 监听存储变化，当周计划更新时重新加载数据
  useEffect(() => {
    const handleStorageChange = () => {
      loadTodayPlan()
    }

    // 添加自定义事件监听器
    window.addEventListener('storageChange', handleStorageChange)
    
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('storageChange', handleStorageChange)
    }
  }, [userSettings])

  const loadUserSettings = () => {
    try {
      const settings = storage.get(STORAGE_KEYS.USER_SETTINGS, {})
      console.log('User settings:', settings) // 调试信息
      setUserSettings(settings)
    } catch (err) {
      console.error('加载用户设置失败:', err)
      setError('加载用户设置失败')
      setUserSettings({})
    }
  }

  const loadTodayPlan = () => {
    try {
      setLoading(true)
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const today = days[new Date().getDay()]
      console.log('Today:', today) // 调试信息
      setCurrentDay(today)

      const weekPlan = storage.get(STORAGE_KEYS.DIET_PLAN, {})
      console.log('Week plan from storage:', weekPlan) // 调试信息
      const plan = weekPlan[today] || { breakfast: [], lunch: [], dinner: [], snack: [] }
      console.log('Today plan:', plan) // 调试信息
      setTodayPlan(plan)

      // 分析今日营养
      const allDishes = [...plan.breakfast, ...plan.lunch, ...plan.dinner, ...plan.snack]
      console.log('All dishes:', allDishes) // 调试信息
      
      // 确保用户设置已加载
      const settings = userSettings || storage.get(STORAGE_KEYS.USER_SETTINGS, {})
      
      try {
        const result = NutritionAnalyzer.analyzeDailyNutrition(allDishes, settings)
        console.log('Analysis result:', result) // 调试信息
        setAnalysis(result)
      } catch (error) {
        console.error('营养分析失败:', error)
        // 即使分析失败也设置一个默认的分析结果
        setAnalysis({
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
    } catch (err) {
      console.error('加载今日计划失败:', err)
      setError('加载今日计划失败')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return '#00b578'
    if (score >= 80) return '#52c41a'
    if (score >= 70) return '#faad14'
    if (score >= 60) return '#ff8f1f'
    return '#ff3141'
  }

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <p>加载失败: {error}</p>
          <Button color="primary" onClick={loadTodayPlan}>重新加载</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>今日饮食</h1>
        <p>{currentDay || '加载中...'} · {new Date().toLocaleDateString('zh-CN')}</p>
      </div>

      <div className="content-section">
        <Card className="nutrition-card">
          <div className="nutrition-header">
            <h3>营养评分</h3>
            <div className="score-circle" style={{ borderColor: analysis ? getScoreColor(analysis.score) : '#cccccc' }}>
              <span className="score-value">{analysis ? analysis.score : '--'}</span>
              <span className="score-label">分</span>
            </div>
          </div>
          <p className="evaluation">{analysis ? analysis.evaluation : '正在加载数据...'}</p>
          
          <div className="nutrition-summary">
            <div className="nutrition-item">
              <div className="nutrition-icon">🔥</div>
              <div className="nutrition-info">
                <div className="nutrition-label">热量</div>
                <div className="nutrition-value">{analysis ? `${analysis.totalCalories} kcal` : '--'}</div>
              </div>
            </div>
            <div className="nutrition-item">
              <div className="nutrition-icon">💪</div>
              <div className="nutrition-info">
                <div className="nutrition-label">蛋白质</div>
                <div className="nutrition-value">{analysis ? `${analysis.totalProtein}g` : '--'}</div>
              </div>
            </div>
            <div className="nutrition-item">
              <div className="nutrition-icon">🌾</div>
              <div className="nutrition-info">
                <div className="nutrition-label">碳水</div>
                <div className="nutrition-value">{analysis ? `${analysis.totalCarbs}g` : '--'}</div>
              </div>
            </div>
          </div>

          <div className="macros-chart">
            <div className="macro-bar">
              <span className="macro-label">蛋白质 {analysis ? `${analysis.proteinRatio || 0}%` : '0%'}</span>
              <ProgressBar
                percent={analysis ? analysis.proteinRatio : 0}
                style={
                  analysis ? {
                    '--fill-color': '#00b578',
                    '--track-width': '8px',
                  } : {
                    '--fill-color': '#cccccc',
                    '--track-width': '8px',
                  }
                }
              />
            </div>
            <div className="macro-bar">
              <span className="macro-label">脂肪 {analysis ? `${analysis.fatRatio || 0}%` : '0%'}</span>
              <ProgressBar
                percent={analysis ? analysis.fatRatio : 0}
                style={
                  analysis ? {
                    '--fill-color': '#ff8f1f',
                    '--track-width': '8px',
                  } : {
                    '--fill-color': '#cccccc',
                    '--track-width': '8px',
                  }
                }
              />
            </div>
            <div className="macro-bar">
              <span className="macro-label">碳水 {analysis ? `${analysis.carbsRatio || 0}%` : '0%'}</span>
              <ProgressBar
                percent={analysis ? analysis.carbsRatio : 0}
                style={
                  analysis ? {
                    '--fill-color': '#1677ff',
                    '--track-width': '8px',
                  } : {
                    '--fill-color': '#cccccc',
                    '--track-width': '8px',
                  }
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="meals-card">
        <h3>今日餐单</h3>
        
        {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
          const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' }
          const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }
          const dishes = todayPlan[mealType] || []
          
          if (dishes.length === 0) return null
          
          return (
            <div key={mealType} className="meal-section">
              <div className="meal-header">
                <span className="meal-icon">{mealIcons[mealType]}</span>
                <span className="meal-name">{mealNames[mealType]}</span>
              </div>
              <div className="meal-dishes">
                {dishes.map((dish, index) => (
                  <span key={index} className="dish-tag">
                    {dish.image} {dish.name}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
        
        {todayPlan.breakfast.length === 0 && todayPlan.lunch.length === 0 && 
         todayPlan.dinner.length === 0 && todayPlan.snack.length === 0 && (
          <div className="empty-meals">
            <p>今日还没有安排饮食哦~</p>
            <Button color="primary" size="small" onClick={() => onNavigate('plan')}>去计划</Button>
          </div>
        )}
      </Card>

      <Card className="suggestions-card">
        <div className="suggestions-header">
          <span className="suggestions-icon">💡</span>
          <h3>营养建议</h3>
        </div>
        <div className="suggestions-list">
          {analysis && analysis.suggestions && analysis.suggestions.length > 0 ? (
            analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <span className="suggestion-dot"></span>
                <span className="suggestion-text">{suggestion}</span>
              </div>
            ))
          ) : (
            <div className="no-suggestions">
              <p>{analysis ? '🎉 营养均衡，继续保持！' : '正在加载建议...'}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default HomePage