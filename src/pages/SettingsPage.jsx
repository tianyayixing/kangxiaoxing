import { useState, useEffect } from 'react'
import { List, Switch, Toast, Dialog, Popup, Form, Input, Checkbox, Selector, Button } from 'antd-mobile'
import { storage, STORAGE_KEYS } from '../utils/storage'
import './SettingsPage.css'

function SettingsPage({ onNavigateToDishManage }) {
  const [userSettings, setUserSettings] = useState(null)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [showAllergyEdit, setShowAllergyEdit] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [notification, setNotification] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [form] = Form.useForm()
  const [goalForm] = Form.useForm()
  const [allergyForm] = Form.useForm()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const settings = storage.get(STORAGE_KEYS.USER_SETTINGS, {})
    setUserSettings(settings)
  }
  
  const handleResetData = async () => {
    const result = await Dialog.confirm({
      content: '确定要清空所有数据吗？此操作不可恢复。',
      confirmText: '确定清空',
      cancelText: '取消'
    })
    
    if (result) {
      storage.clear()
      Toast.show({ icon: 'success', content: '数据已清空' })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  const handleEditProfile = () => {
    const settings = userSettings || {}
    form.setFieldsValue({
      name: settings.name || '',
      age: settings.age || '',
      weight: settings.weight || '',
      height: settings.height || '',
    })
    setShowProfileEdit(true)
  }

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields()
      const newSettings = { ...userSettings, ...values }
      storage.set(STORAGE_KEYS.USER_SETTINGS, newSettings)
      setUserSettings(newSettings)
      setShowProfileEdit(false)
      Toast.show({ icon: 'success', content: '保存成功' })
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  const handleEditGoal = () => {
    const settings = userSettings || {}
    goalForm.setFieldsValue({
      dietGoal: settings.dietGoal || '',
      dietPreference: settings.dietPreference || [],
    })
    setShowGoalEdit(true)
  }

  const handleSaveGoal = async () => {
    try {
      const values = await goalForm.validateFields()
      const newSettings = { ...userSettings, ...values }
      storage.set(STORAGE_KEYS.USER_SETTINGS, newSettings)
      setUserSettings(newSettings)
      setShowGoalEdit(false)
      Toast.show({ icon: 'success', content: '保存成功' })
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  const handleEditAllergy = () => {
    const settings = userSettings || {}
    allergyForm.setFieldsValue({
      allergies: settings.allergies || [],
      customAllergy: settings.customAllergy || '',
    })
    setShowAllergyEdit(true)
  }

  const handleSaveAllergy = async () => {
    try {
      const values = await allergyForm.validateFields()
      const newSettings = { ...userSettings, ...values }
      storage.set(STORAGE_KEYS.USER_SETTINGS, newSettings)
      setUserSettings(newSettings)
      setShowAllergyEdit(false)
      Toast.show({ icon: 'success', content: '保存成功' })
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  const handleExportData = () => {
    try {
      const data = {
        userSettings: storage.get(STORAGE_KEYS.USER_SETTINGS),
        dietPlan: storage.get(STORAGE_KEYS.DIET_PLAN),
        weeklyReports: storage.get(STORAGE_KEYS.WEEKLY_REPORTS),
      }
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `diet-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      Toast.show({ icon: 'success', content: '数据导出成功' })
    } catch (error) {
      Toast.show({ icon: 'fail', content: '导出失败' })
    }
  }

  const handleAbout = () => {
    Dialog.alert({
      title: '关于应用',
      content: (
        <div style={{ lineHeight: '1.6' }}>
          <p><strong>康小星</strong></p>
          <p>版本: 1.0.0</p>
          <p>帮助您科学管理饮食，实现健康生活目标</p>
          <br />
          <p style={{ fontSize: '12px', color: '#999' }}>
            本应用数据存储在本地，不会上传到服务器
          </p>
        </div>
      ),
      confirmText: '知道了'
    })
  }

  return (
    <div className="settings-page">

      <List header="个人信息">
        <List.Item
          prefix="👤"
          onClick={handleEditProfile}
          description={userSettings?.name || '未设置'}
          clickable
        >
          编辑个人信息
        </List.Item>
        <List.Item
          prefix="🎯"
          onClick={handleEditGoal}
          description={userSettings?.dietGoal ? getDietGoalLabel(userSettings.dietGoal) : '未设置'}
          clickable
        >
          饮食目标
        </List.Item>
        <List.Item
          prefix="🚫"
          onClick={handleEditAllergy}
          description={userSettings?.allergies?.length > 0 ? `${userSettings.allergies.length}项` : '未设置'}
          clickable
        >
          忌口管理
        </List.Item>
      </List>

      <List header="应用设置">
        <List.Item
          prefix="🔔"
          extra={
            <Switch 
              checked={notification} 
              onChange={checked => {
                setNotification(checked)
                Toast.show({ content: checked ? '已开启通知' : '已关闭通知' })
              }}
            />}
        >
          推送通知
        </List.Item>
        <List.Item
          prefix="🌙"
          extra={
            <Switch 
              checked={darkMode} 
              onChange={checked => {
                setDarkMode(checked)
                Toast.show({ content: '深色模式功能开发中' })
              }}
            />}
        >
          深色模式
        </List.Item>
      </List>

      <List header="数据管理">
        <List.Item
          prefix="📊"
          onClick={handleExportData}
          clickable
        >
          导出数据
        </List.Item>
        <List.Item
          prefix="🍽️"
          onClick={onNavigateToDishManage}
          clickable
        >
          菜品管理
        </List.Item>
        <List.Item
          prefix="🗑️"
          onClick={handleResetData}
          clickable
        >
          <span style={{ color: 'var(--error-color)' }}>清空所有数据</span>
        </List.Item>
      </List>

      <List header="其他">
        <List.Item
          prefix="ℹ️"
          onClick={handleAbout}
          clickable
        >
          关于应用
        </List.Item>
        <List.Item
          prefix="📝"
          onClick={() => setShowHelp(true)}
          clickable
        >
          使用帮助
        </List.Item>
        <List.Item
          prefix="⭐"
          onClick={() => Toast.show({ content: '感谢您的支持！' })}
          clickable
        >
          给我们评分
        </List.Item>
      </List>

     <div className="app-version">
        <p>康小星</p>
        <p>© 2024 All Rights Reserved</p>
      </div>

      {/* 编辑个人信息弹窗 */}
      <Popup
        visible={showProfileEdit}
        onMaskClick={() => setShowProfileEdit(false)}
        position="bottom"
        bodyStyle={{ height: '60vh' }}
      >
        <div className="edit-popup">
          <div className="popup-header">
            <h3>编辑个人信息</h3>
          </div>
          <Form form={form} layout="horizontal">
            <Form.Item name="name" label="姓名">
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="age" label="年龄">
              <Input type="number" placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item name="weight" label="体重(kg)">
              <Input type="number" placeholder="请输入体重" />
            </Form.Item>
            <Form.Item name="height" label="身高(cm)">
              <Input type="number" placeholder="请输入身高" />
            </Form.Item>
          </Form>
          <div className="popup-footer">
            <Button onClick={() => setShowProfileEdit(false)}>取消</Button>
            <Button color="primary" onClick={handleSaveProfile}>保存</Button>
          </div>
        </div>
      </Popup>

      {/* 编辑饮食目标弹窗 */}
      <Popup
        visible={showGoalEdit}
        onMaskClick={() => setShowGoalEdit(false)}
        position="bottom"
        bodyStyle={{ height: '60vh' }}
      >
        <div className="edit-popup">
          <div className="popup-header">
            <h3>饮食目标设置</h3>
          </div>
          <Form form={goalForm} layout="vertical">
            <Form.Item name="dietGoal" label="饮食目标">
              <Selector
                options={[
                  { label: '减脂', value: 'lose_weight' },
                  { label: '增肌', value: 'gain_muscle' },
                  { label: '维持健康', value: 'maintain' },
                  { label: '控糖', value: 'control_sugar' },
                ]}
              />
            </Form.Item>
            <Form.Item name="dietPreference" label="饮食习惯">
              <Checkbox.Group>
                <Checkbox value="vegetarian">素食</Checkbox>
                <Checkbox value="meat">肉食</Checkbox>
                <Checkbox value="omnivore">杂食</Checkbox>
                <Checkbox value="spicy">喜辣</Checkbox>
                <Checkbox value="light">清淡</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Form>
          <div className="popup-footer">
            <Button onClick={() => setShowGoalEdit(false)}>取消</Button>
            <Button color="primary" onClick={handleSaveGoal}>保存</Button>
          </div>
        </div>
      </Popup>

      {/* 编辑忌口管理弹窗 */}
      <Popup
        visible={showAllergyEdit}
        onMaskClick={() => setShowAllergyEdit(false)}
        position="bottom"
        bodyStyle={{ height: '60vh' }}
      >
        <div className="edit-popup">
          <div className="popup-header">
            <h3>忌口管理</h3>
          </div>
          <Form form={allergyForm} layout="vertical">
            <Form.Item name="allergies" label="过敏/厌恶食材">
              <Checkbox.Group>
                <Checkbox value="海鲜">海鲜</Checkbox>
                <Checkbox value="花生">花生</Checkbox>
                <Checkbox value="鸡蛋">鸡蛋</Checkbox>
                <Checkbox value="牛奶">牛奶</Checkbox>
                <Checkbox value="小麦">小麦</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item name="customAllergy" label="其他忌口">
              <Input placeholder="输入其他忌口食材（用逗号分隔）" />
            </Form.Item>
          </Form>
          <div className="popup-footer">
            <Button onClick={() => setShowAllergyEdit(false)}>取消</Button>
            <Button color="primary" onClick={handleSaveAllergy}>保存</Button>
          </div>
        </div>
      </Popup>

      {/* 使用帮助弹窗 */}
      <Popup
        visible={showHelp}
        onMaskClick={() => setShowHelp(false)}
        position="bottom"
        bodyStyle={{ height: '70vh' }}
      >
        <div className="help-popup">
          <div className="popup-header">
            <h3>使用帮助</h3>
          </div>
          <div className="help-content">
            <div className="help-section">
              <h4>📱 如何开始</h4>
              <p>1. 首次使用完成饮食习惯、目标和忌口设置</p>
              <p>2. 在"周计划"中添加每日菜品</p>
              <p>3. 查看实时营养分析和建议</p>
            </div>
            
            <div className="help-section">
              <h4>🍽️ 添加菜品</h4>
              <p>1. 切换到"周计划"标签</p>
              <p>2. 选择星期和餐次</p>
              <p>3. 点击"添加"从菜品库选择</p>
              <p>4. 支持搜索和分类筛选</p>
            </div>
            
            <div className="help-section">
              <h4>📊 查看报告</h4>
              <p>1. 点击"报告"查看本周统计</p>
              <p>2. 查看热量、营养素趋势图</p>
              <p>3. 了解每日健康评分</p>
            </div>
            
            <div className="help-section">
              <h4>💡 智能建议</h4>
              <p>系统会根据您的饮食计划：</p>
              <p>• 实时分析营养均衡性</p>
              <p>• 提供优化建议</p>
              <p>• 推荐替代菜品</p>
            </div>
            
            <div className="help-section">
              <h4>🔒 数据安全</h4>
              <p>• 所有数据加密存储在本地</p>
              <p>• 不会上传到服务器</p>
              <p>• 可随时导出备份</p>
            </div>
          </div>
          <div className="popup-footer">
            <Button block color="primary" onClick={() => setShowHelp(false)}>知道了</Button>
          </div>
        </div>
      </Popup>
    </div>
  )
}

function getDietGoalLabel(value) {
  const labels = {
    lose_weight: '减脂',
    gain_muscle: '增肌',
    maintain: '维持健康',
    control_sugar: '控糖',
  }
  return labels[value] || value
}

export default SettingsPage
