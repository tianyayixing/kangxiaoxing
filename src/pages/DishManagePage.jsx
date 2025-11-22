import { useState, useEffect } from 'react'
import { List, Button, SearchBar, Dialog, Form, Input, Selector, Toast, Popup, Card, SpinLoading, FloatingBubble, NavBar, Tabs } from 'antd-mobile'
import { AddOutline, DeleteOutline, EditSOutline } from 'antd-mobile-icons'
import { storage, STORAGE_KEYS } from '../utils/storage'
import { initialDishDatabase } from '../data/dishDatabase'
import { fetchNutritionInfo, suggestCategory, suggestEmoji } from '../services/nutritionAPI'
import DishDetailModal from '../components/DishDetailModal'
import './DishManagePage.css'

function DishManagePage({ onBack }) {
  const [activeTab, setActiveTab] = useState('dishes')
  const [dishes, setDishes] = useState([])
  const [filteredDishes, setFilteredDishes] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [showAddDish, setShowAddDish] = useState(false)
  const [showEditDish, setShowEditDish] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  const [showDishDetail, setShowDishDetail] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadDishes()
  }, [])

  useEffect(() => {
    filterDishes()
  }, [dishes, searchKey, selectedCategory])

  const loadDishes = () => {
    const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, [])
    const deletedSystemDishes = storage.get(STORAGE_KEYS.DELETED_SYSTEM_DISHES, [])
    const modifiedSystemDishes = storage.get(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, {})
    
    const filteredSystemDishes = initialDishDatabase
      .filter(dish => !deletedSystemDishes.includes(dish.id))
      .map(dish => {
        if (modifiedSystemDishes[dish.id]) {
          return modifiedSystemDishes[dish.id]
        }
        return dish
      })
    
    const allDishes = [...filteredSystemDishes, ...customDishes]
    setDishes(allDishes)
  }

  const filterDishes = () => {
    let result = dishes

    if (selectedCategory !== '全部') {
      result = result.filter(dish => dish.category === selectedCategory)
    }

    if (searchKey) {
      result = result.filter(dish => 
        dish.name.toLowerCase().includes(searchKey.toLowerCase())
      )
    }

    setFilteredDishes(result)
  }

  const categories = ['全部', '早餐', '主食', '蔬菜', '肉类', '海鲜', '豆制品', '水果', '汤类', '粥', '菌菇', '坚果', '家常菜', '沙拉', '凉菜', '炖菜', '饮品', '甜品']

  const handleDishClick = (dish) => {
    setSelectedDish(dish)
    setShowDishDetail(true)
  }

  const handleAddDish = () => {
    form.resetFields()
    setShowAddDish(true)
  }

  const handleEditDish = (dish) => {
    setEditingDish(dish)
    form.setFieldsValue({
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
    })
    setShowEditDish(true)
  }

  const handleDeleteDish = async (dish) => {
    const result = await Dialog.confirm({
      content: `确定要删除"${dish.name}"吗？`,
      confirmText: '删除',
      cancelText: '取消'
    })

    if (result) {
      if (dish.id <= 100) {
        const deletedSystemDishes = storage.get(STORAGE_KEYS.DELETED_SYSTEM_DISHES, [])
        if (!deletedSystemDishes.includes(dish.id)) {
          deletedSystemDishes.push(dish.id)
          storage.set(STORAGE_KEYS.DELETED_SYSTEM_DISHES, deletedSystemDishes)
        }
      } else {
        const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, [])
        const newCustomDishes = customDishes.filter(d => d.id !== dish.id)
        storage.set(STORAGE_KEYS.CUSTOM_DISHES, newCustomDishes)
      }
      
      loadDishes()
      Toast.show({ icon: 'success', content: '删除成功' })
    }
  }

  const handleAutoFetch = async () => {
    const dishName = form.getFieldValue('name')
    if (!dishName) {
      Toast.show({ content: '请先输入菜品名称', icon: 'fail' })
      return
    }

    setLoading(true)
    Toast.show({ icon: 'loading', content: '正在获取营养信息...', duration: 0 })

    try {
      const nutrition = await fetchNutritionInfo(dishName)
      const category = suggestCategory(dishName)
      const emoji = suggestEmoji(dishName, category)

      if (nutrition) {
        form.setFieldsValue({
          category: category,
          calories: Math.round(nutrition.calories),
          protein: Math.round(nutrition.protein * 10) / 10,
          fat: Math.round(nutrition.fat * 10) / 10,
          carbs: Math.round(nutrition.carbs * 10) / 10,
          fiber: Math.round(nutrition.fiber * 10) / 10,
          vitaminC: Math.round(nutrition.vitaminC),
          vitaminB: Math.round(nutrition.vitaminB),
          image: emoji,
          // 为新菜品提供默认的烹饪方法和步骤模板
          cookingMethod: getDefaultCookingMethod(category),
          steps: getDefaultSteps(category),
          tips: getDefaultTips(category)
        })
        Toast.clear()
        Toast.show({ icon: 'success', content: '营养信息获取成功' })
      }
    } catch (error) {
      Toast.clear()
      Toast.show({ icon: 'fail', content: '获取失败，请手动填写' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDish = async () => {
    try {
      const values = await form.validateFields()
      
      // 处理步骤信息
      const dishData = { ...values };
      if (dishData.steps) {
        dishData.steps = dishData.steps.split('\n').filter(step => step.trim() !== '');
      }
      
      if (showEditDish && editingDish) {
        if (editingDish.id <= 100) {
          const modifiedSystemDishes = storage.get(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, {})
          modifiedSystemDishes[editingDish.id] = { ...editingDish, ...dishData }
          storage.set(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, modifiedSystemDishes)
        } else {
          const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, [])
          const index = customDishes.findIndex(d => d.id === editingDish.id)
          if (index !== -1) {
            customDishes[index] = { ...editingDish, ...dishData }
            storage.set(STORAGE_KEYS.CUSTOM_DISHES, customDishes)
          }
        }
        setShowEditDish(false)
        setEditingDish(null)
        Toast.show({ icon: 'success', content: '修改成功' })
      } else {
        const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, [])
        const newId = Math.max(...customDishes.map(d => d.id), 100) + 1
        
        const newDish = {
          id: newId,
          ...dishData,
        }
        
        customDishes.push(newDish)
        storage.set(STORAGE_KEYS.CUSTOM_DISHES, customDishes)
        setShowAddDish(false)
        Toast.show({ icon: 'success', content: '添加成功' })
      }
      
      loadDishes()
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  // 根据分类获取默认烹饪方法
  const getDefaultCookingMethod = (category) => {
    const methods = {
      '家常菜': '炒制',
      '蔬菜': '快炒',
      '肉类': '炒制',
      '海鲜': '蒸煮',
      '汤类': '炖煮',
      '粥': '煮制',
      '主食': '蒸煮',
      '凉菜': '凉拌',
      '沙拉': '拌制',
      '水果': '直接食用',
      '饮品': '冲泡',
      '甜品': '制作',
      '坚果': '直接食用',
      '菌菇': '炒制',
      '豆制品': '炒制'
    }
    return methods[category] || '制作'
  }

  // 根据分类获取默认步骤
  const getDefaultSteps = (category) => {
    const steps = {
      '家常菜': '1. 准备食材\n2. 清洗处理\n3. 切配食材\n4. 调料准备\n5. 烹饪制作\n6. 装盘完成',
      '蔬菜': '1. 蔬菜清洗\n2. 切配处理\n3. 热锅下油\n4. 快速翻炒\n5. 调味出锅',
      '肉类': '1. 肉类处理\n2. 腌制入味\n3. 热锅烹饪\n4. 调味收汁\n5. 装盘完成',
      '海鲜': '1. 海鲜处理\n2. 腌制去腥\n3. 蒸煮烹饪\n4. 调味装盘',
      '汤类': '1. 食材准备\n2. 焯水处理\n3. 加水炖煮\n4. 调味完成',
      '粥': '1. 米粒清洗\n2. 加水煮制\n3. 小火慢煮\n4. 调味完成',
      '主食': '1. 食材准备\n2. 蒸煮制作\n3. 调味完成',
      '凉菜': '1. 食材处理\n2. 调料准备\n3. 拌制均匀\n4. 装盘完成',
      '沙拉': '1. 食材清洗\n2. 切配处理\n3. 调料拌制\n4. 装盘完成',
      '水果': '1. 水果清洗\n2. 去皮切块\n3. 装盘食用',
      '饮品': '1. 食材准备\n2. 冲泡制作\n3. 调味完成',
      '甜品': '1. 食材准备\n2. 制作处理\n3. 装盘完成',
      '坚果': '直接食用',
      '菌菇': '1. 菌菇处理\n2. 热锅炒制\n3. 调味出锅',
      '豆制品': '1. 豆制品处理\n2. 热锅炒制\n3. 调味出锅'
    }
    return steps[category] || '1. 准备食材\n2. 烹饪制作\n3. 装盘完成'
  }

  // 根据分类获取默认小贴士
  const getDefaultTips = (category) => {
    const tips = {
      '家常菜': '注意火候控制，保持食材营养',
      '蔬菜': '大火快炒，保持蔬菜脆嫩',
      '肉类': '腌制入味，掌握火候',
      '海鲜': '去腥提鲜，保持原味',
      '汤类': '小火慢炖，汤鲜味美',
      '粥': '米水比例，小火慢煮',
      '主食': '掌握时间，口感软糯',
      '凉菜': '卫生处理，调味适中',
      '沙拉': '食材新鲜，搭配均衡',
      '水果': '选择时令，营养丰富',
      '饮品': '温度适宜，口感清香',
      '甜品': '甜度适中，不宜过量',
      '坚果': '适量食用，营养丰富',
      '菌菇': '充分清洗，去除杂质',
      '豆制品': '新鲜制作，口感嫩滑'
    }
    return tips[category] || '注意食材搭配，营养均衡'
  }

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
              value={searchKey}
              onChange={setSearchKey}
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
            {filteredDishes.map(dish => (
              <Card key={dish.id} className="dish-card">
                <div className="dish-content">
                  <div className="dish-icon">{dish.image}</div>
                  <div className="dish-info">
                    <div className="dish-name">{dish.name}</div>
                    <div className="dish-category">{dish.category}</div>
                    <div className="dish-nutrition">
                      <span>热量: {dish.calories}kcal</span>
                      <span>蛋白质: {dish.protein}g</span>
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
            ))}

            {filteredDishes.length === 0 && (
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
          </div>

          <div className="recipe-list">
            {dishes.filter(d => d.category === '家常菜').map(dish => (
              <Card key={dish.id} className="recipe-card" onClick={() => handleDishClick(dish)}>
                <div className="recipe-content">
                  <div className="recipe-icon">{dish.image}</div>
                  <div className="recipe-info">
                    <div className="recipe-name">{dish.name}</div>
                    <div className="recipe-effect">
                      <span className="effect-icon">✨</span>
                      {dish.effect || '营养均衡，美味可口'}
                    </div>
                    <div className="recipe-nutrition">
                      <span>🔥 {dish.calories}kcal</span>
                      <span>🥩 {dish.protein}g蛋白</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {dishes.filter(d => d.category === '家常菜').length === 0 && (
              <div className="empty-recipes">
                <p>🍳 暂无家常菜谱</p>
                <p className="empty-tip">可以在菜品列表中添加家常菜分类的菜品</p>
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
        <AddOutline fontSize={32} color="white" />
      </FloatingBubble>

      <Popup
        visible={showAddDish}
        onMaskClick={() => setShowAddDish(false)}
        position="right"
        bodyStyle={{ width: '85vw', height: '100vh' }}
      >
        <div className="dish-form-popup">
          <div className="popup-header">
            <h3>添加菜品</h3>
            <Button size="small" onClick={handleAutoFetch} loading={loading}>
              {loading ? '获取中...' : '🤖 自动获取'}
            </Button>
          </div>
          
          <Form form={form} layout="horizontal" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
            <Form.Item name="name" label="菜品名称" rules={[{ required: true }]}>
              <Input placeholder="请输入菜品名称" />
            </Form.Item>
            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
              <Selector
                options={categories.filter(c => c !== '全部').map(c => ({ label: c, value: c }))}
                columns={3}
              />
            </Form.Item>
            <Form.Item name="image" label="图标">
              <Input placeholder="输入Emoji图标，如🍅" />
            </Form.Item>
            <Form.Item name="calories" label="热量(kcal)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入热量" />
            </Form.Item>
            <Form.Item name="protein" label="蛋白质(g)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入蛋白质含量" />
            </Form.Item>
            <Form.Item name="fat" label="脂肪(g)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入脂肪含量" />
            </Form.Item>
            <Form.Item name="carbs" label="碳水(g)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入碳水化合物含量" />
            </Form.Item>
            <Form.Item name="fiber" label="膳食纤维(g)">
              <Input type="number" placeholder="请输入膳食纤维含量" />
            </Form.Item>
            <Form.Item name="vitaminC" label="维生素C(mg)">
              <Input type="number" placeholder="请输入维生素C含量" />
            </Form.Item>
            <Form.Item name="vitaminB" label="维生素B(%)">
              <Input type="number" placeholder="请输入维生素B含量" />
            </Form.Item>
            <Form.Item name="cookingMethod" label="烹饪方法">
              <Input placeholder="例如：清蒸、快炒等" />
            </Form.Item>
            <Form.Item name="effect" label="功效">
              <Input placeholder="例如：补钙、促进消化等" />
            </Form.Item>
            <Form.Item name="steps" label="制作步骤">
              <Input.TextArea placeholder="请输入制作步骤，每行一个步骤" autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
            <Form.Item name="tips" label="小贴士">
              <Input placeholder="例如：烹饪技巧、注意事项等" />
            </Form.Item>
          </Form>

          <div className="popup-footer">
            <Button onClick={() => setShowAddDish(false)}>取消</Button>
            <Button color="primary" onClick={handleSaveDish}>保存</Button>
          </div>
        </div>
      </Popup>

      <Popup
        visible={showEditDish}
        onMaskClick={() => setShowEditDish(false)}
        position="right"
        bodyStyle={{ width: '85vw', height: '100vh' }}
      >
        <div className="dish-form-popup">
          <div className="popup-header">
            <h3>编辑菜品</h3>
          </div>
          
          <Form form={form} layout="horizontal" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
            <Form.Item name="name" label="菜品名称" rules={[{ required: true }]}>
              <Input placeholder="请输入菜品名称" />
            </Form.Item>
            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
              <Selector
                options={categories.filter(c => c !== '全部').map(c => ({ label: c, value: c }))}
                columns={3}
              />
            </Form.Item>
            <Form.Item name="image" label="图标">
              <Input placeholder="输入Emoji图标" />
            </Form.Item>
            <Form.Item name="calories" label="热量(kcal)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入热量" />
            </Form.Item>
            <Form.Item name="protein" label="蛋白质(g)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入蛋白质含量" />
            </Form.Item>
            <Form.Item name="fat" label="脂肪(g)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入脂肪含量" />
            </Form.Item>
            <Form.Item name="carbs" label="碳水(g)" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入碳水化合物含量" />
            </Form.Item>
            <Form.Item name="fiber" label="膳食纤维(g)">
              <Input type="number" placeholder="请输入膳食纤维含量" />
            </Form.Item>
            <Form.Item name="vitaminC" label="维生素C(mg)">
              <Input type="number" placeholder="请输入维生素C含量" />
            </Form.Item>
            <Form.Item name="vitaminB" label="维生素B(%)">
              <Input type="number" placeholder="请输入维生素B含量" />
            </Form.Item>
            <Form.Item name="cookingMethod" label="烹饪方法">
              <Input placeholder="例如：清蒸、快炒等" />
            </Form.Item>
            <Form.Item name="effect" label="功效">
              <Input placeholder="例如：补钙、促进消化等" />
            </Form.Item>
            <Form.Item name="steps" label="制作步骤">
              <Input.TextArea placeholder="请输入制作步骤，每行一个步骤" autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
            <Form.Item name="tips" label="小贴士">
              <Input placeholder="例如：烹饪技巧、注意事项等" />
            </Form.Item>
          </Form>

          <div className="popup-footer">
            <Button onClick={() => setShowEditDish(false)}>取消</Button>
            <Button color="primary" onClick={handleSaveDish}>保存</Button>
          </div>
        </div>
      </Popup>

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

export default DishManagePage
