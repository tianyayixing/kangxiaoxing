import { useState, useEffect } from 'react'
import { Button, SearchBar, Swiper, Toast } from 'antd-mobile'
import { LeftOutline, CheckOutline, AddOutline } from 'antd-mobile-icons'
import { getDishDatabase, getAllCategories, searchDishByName, filterDishByCategory } from '../data/dishDatabase'
import './DishSelectionPage.css'

function DishSelectionPage({ onBack, onConfirm, mealType, activeDay }) {
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [dishList, setDishList] = useState([])
  const [selectedDishes, setSelectedDishes] = useState([])
  
  // 根据餐次过滤的菜品分类
  const mealTypeMap = {
    breakfast: ['早餐', '饮品', '主食', '汤类'],
    lunch: ['午餐', '主食', '肉类', '蔬菜', '汤类'],
    dinner: ['晚餐', '主食', '肉类', '蔬菜', '汤类'],
    snack: ['加餐', '水果', '坚果', '饮品']
  }

  useEffect(() => {
    setDishList(getDishDatabase())
  }, [])

  const handleSearch = (text) => {
    setSearchText(text)
    if (text) {
      const results = searchDishByName(text)
      // 根据餐次过滤菜品
      if (mealType && mealTypeMap[mealType]) {
        const filteredResults = results.filter(dish => 
          mealTypeMap[mealType].includes(dish.category)
        )
        setDishList(filteredResults)
      } else {
        setDishList(results)
      }
    } else {
      loadDishList()
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (category === '全部') {
      loadDishList()
    } else {
      const results = filterDishByCategory(category)
      setDishList(results)
    }
  }

  const loadDishList = () => {
    let dishes = getDishDatabase()
    
    // 根据餐次过滤菜品
    if (mealType && mealTypeMap[mealType]) {
      dishes = dishes.filter(dish => 
        mealTypeMap[mealType].includes(dish.category)
      )
    }
    
    setDishList(dishes)
  }

  const handleDishSelect = (dish) => {
    const isSelected = selectedDishes.some(d => d.id === dish.id)
    if (isSelected) {
      // 取消选择
      setSelectedDishes(selectedDishes.filter(d => d.id !== dish.id))
    } else {
      // 添加选择
      setSelectedDishes([...selectedDishes, dish])
    }
  }

  const handleConfirm = () => {
    if (selectedDishes.length === 0) {
      Toast.show({ content: '请至少选择一个菜品' })
      return
    }
    onConfirm(selectedDishes)
    // 完成后返回上一页
    onBack()
  }

  // 跳转到菜品管理页面
  const handleNavigateToDishManage = () => {
    // 这里需要通过App组件来导航到菜品管理页面
    // 我们可以通过一个特殊的回调来实现
    window.dispatchEvent(new CustomEvent('navigateToDishManage'))
  }

  // 获取过滤后的分类列表（根据餐次）
  const getFilteredCategories = () => {
    // 获取所有唯一分类
    const allDishCategories = [...new Set(getDishDatabase().map(dish => dish.category))];
    const allCategories = ['全部', ...allDishCategories];
    
    if (mealType && mealTypeMap[mealType]) {
      return allCategories.filter(cat => 
        cat === '全部' || mealTypeMap[mealType].includes(cat)
      );
    }
    
    return allCategories;
  }

  const categories = getFilteredCategories()

  return (
    <div className="dish-selection-page">
      <div className="selection-header">
        <LeftOutline onClick={onBack} className="header-back" />
        <h2>选择菜品</h2>
        <AddOutline onClick={handleNavigateToDishManage} className="header-manage" />
      </div>
      
      <SearchBar
        placeholder="搜索菜品名称"
        value={searchText}
        onChange={handleSearch}
        style={{ '--background': '#f5f5f5' }}
      />
      
      <div className="category-tabs">
        <Swiper
          slideSize={60}
          trackOffset={10}
          stuckAtBoundary={false}
        >
          {categories.map(cat => (
            <Swiper.Item key={cat}>
              <div
                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
      
      <div className="dish-grid">
        {dishList.map(dish => {
          const isSelected = selectedDishes.some(d => d.id === dish.id)
          return (
            <div
              key={dish.id}
              className={`dish-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDishSelect(dish)}
            >
              {isSelected && (
                <div className="selection-check">
                  <CheckOutline />
                </div>
              )}
              <div className="dish-card-emoji">{dish.image}</div>
              <div className="dish-card-name">{dish.name}</div>
              <div className="dish-card-calories">{dish.calories} kcal</div>
              <div className="dish-card-category">{dish.category}</div>
            </div>
          )
        })}
      </div>
      
      {selectedDishes.length > 0 && (
        <div className="selection-footer">
          <div className="selected-count">
            已选择 {selectedDishes.length} 个菜品
          </div>
          <Button 
            color="primary" 
            onClick={handleConfirm}
            disabled={selectedDishes.length === 0}
          >
            完成
          </Button>
        </div>
      )}
    </div>
  )
}

export default DishSelectionPage