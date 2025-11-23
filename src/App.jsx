import { useState, useEffect } from 'react'
import { TabBar, NavBar } from 'antd-mobile'
import { AppOutline, FileOutline, UserOutline, PieOutline } from 'antd-mobile-icons'
import HomePage from './pages/HomePage'
import WeekPlanPage from './pages/WeekPlanPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'
import DishManagePage from './pages/DishManagePage'
import OnboardingPage from './pages/OnboardingPage'
import { storage, STORAGE_KEYS } from './utils/storage'
import DishSelectionPage from './pages/DishSelectionPage'
import './App.css'

// 添加一个明显的标识来确认这个文件正在被使用
console.log('=== App.jsx 文件已加载 ===')

function App() {
  const [activeKey, setActiveKey] = useState('home')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showDishManage, setShowDishManage] = useState(false)
  const [showDishSelection, setShowDishSelection] = useState(false)
  const [dishSelectionConfig, setDishSelectionConfig] = useState({ mealType: '', onConfirm: () => {}, activeDay: '周一' })
  const [weekPlanPageActiveDay, setWeekPlanPageActiveDay] = useState('周一')
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('App组件加载')
    // 添加一个明显的调试信息
    console.log('=== 康小星健康管理应用启动 ===')
    try {
      // 检查是否首次启动
      const firstLaunch = storage.get(STORAGE_KEYS.FIRST_LAUNCH, true)
      console.log('首次启动状态:', firstLaunch)
      setShowOnboarding(firstLaunch)
      
      // 监听从菜品选择页面到菜品管理页面的导航事件
      const handleNavigateToDishManage = () => {
        setShowDishSelection(false)
        setShowDishManage(true)
      }
      
      window.addEventListener('navigateToDishManage', handleNavigateToDishManage)
      
      return () => {
        window.removeEventListener('navigateToDishManage', handleNavigateToDishManage)
      }
    } catch (err) {
      console.error('App初始化错误:', err)
      setError('应用初始化失败')
    }
  }, [])

  const handleOnboardingComplete = () => {
    try {
      storage.set(STORAGE_KEYS.FIRST_LAUNCH, false)
      setShowOnboarding(false)
    } catch (err) {
      console.error('完成引导页面错误:', err)
      setError('保存设置失败')
    }
  }

  console.log('App渲染状态:', { showOnboarding, showDishSelection, showDishManage, activeKey })

  if (error) {
    return (
      <div className="app-error">
        <h2>应用错误</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>重新加载</button>
      </div>
    )
  }

  if (showOnboarding) {
    console.log('显示引导页面')
    return <OnboardingPage onComplete={handleOnboardingComplete} />
  }

  if (showDishSelection) {
    console.log('显示菜品选择页面')
    return (
      <div className="app">
        <DishSelectionPage 
          onBack={() => setShowDishSelection(false)}
          onConfirm={dishSelectionConfig.onConfirm}
          mealType={dishSelectionConfig.mealType}
          activeDay={dishSelectionConfig.activeDay}
        />
      </div>
    )
  }

  if (showDishManage) {
    console.log('显示菜品管理页面')
    return (
      <div className="app">
        <DishManagePage onBack={() => {
          setShowDishManage(false)
          // 如果之前是从菜品选择页面进入的，返回到菜品选择页面
          if (dishSelectionConfig.mealType) {
            setShowDishSelection(true)
          }
        }} />
      </div>
    )
  }

  const tabs = [
    {
      key: 'home',
      title: '首页',
      icon: <AppOutline />,
      navTitle: '康小星',
    },
    {
      key: 'plan',
      title: '周计划',
      icon: <FileOutline />,
      navTitle: '计划',
    },
    {
      key: 'report',
      title: '报告',
      icon: <PieOutline />,
      navTitle: '报告',
    },
    {
      key: 'settings',
      title: '设置',
      icon: <UserOutline />,
      navTitle: '设置',
    },
  ]

  const renderContent = () => {
    console.log('渲染内容，当前activeKey:', activeKey)
    switch (activeKey) {
      case 'home':
        return <HomePage onNavigate={setActiveKey} />
      case 'plan':
        return <WeekPlanPage 
          onNavigateToDishSelection={(mealType, onConfirm, activeDay) => {
            setDishSelectionConfig({ mealType, onConfirm, activeDay })
            setShowDishSelection(true)
          }}
          onActiveDayChange={setWeekPlanPageActiveDay}
          activeDay={weekPlanPageActiveDay}
        />
      case 'report':
        return <ReportPage />
      case 'settings':
        return <SettingsPage onNavigateToDishManage={() => setShowDishManage(true)} />
      default:
        return <HomePage onNavigate={setActiveKey} />
    }
  }

  const getCurrentNavTitle = () => {
    const currentTab = tabs.find(tab => tab.key === activeKey)
    return currentTab ? currentTab.navTitle : '康小星'
  }

  console.log('显示主应用界面')
  return (
    <div className="app">
      <NavBar className="app-navbar" backArrow={false}>{getCurrentNavTitle()}</NavBar>
      <div className="app-content">
        {renderContent()}
      </div>
      <TabBar activeKey={activeKey} onChange={setActiveKey} className="app-tabbar">
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  )
}

export default App