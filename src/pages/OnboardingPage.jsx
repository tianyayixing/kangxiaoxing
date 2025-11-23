import { useState } from 'react'
import { Button, Stepper, Checkbox, Input, Toast } from 'antd-mobile'
import { storage, STORAGE_KEYS } from '../utils/storage'
import './OnboardingPage.css'

function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0)
  const [settings, setSettings] = useState({
    dietPreference: [],
    dietGoal: '',
    healthStatus: '',
    allergies: [],
    customAllergy: ''
  })

  const dietPreferences = [
    { label: '素食', value: 'vegetarian' },
    { label: '肉食', value: 'meat' },
    { label: '杂食', value: 'omnivore' },
    { label: '喜辣', value: 'spicy' },
    { label: '清淡', value: 'light' }
  ]

  const dietGoals = [
    { label: '减脂', value: 'lose_weight' },
    { label: '增肌', value: 'gain_muscle' },
    { label: '维持健康', value: 'maintain' },
    { label: '控糖', value: 'control_sugar' }
  ]

  const healthStatuses = [
    { label: '正常', value: 'normal' },
    { label: '糖尿病', value: 'diabetes' },
    { label: '高血压', value: 'hypertension' },
    { label: '肠胃不适', value: 'digestive' }
  ]

  const commonAllergies = [
    { label: '海鲜', value: '海鲜' },
    { label: '花生', value: '花生' },
    { label: '鸡蛋', value: '鸡蛋' },
    { label: '牛奶', value: '牛奶' },
    { label: '小麦', value: '小麦' }
  ]

  const handleNext = () => {
    if (step === 1 && !settings.dietGoal) {
      Toast.show({ content: '请选择您的饮食目标' })
      return
    }
    if (step === 2 && !settings.healthStatus) {
      Toast.show({ content: '请选择您的健康状况' })
      return
    }
    
    if (step < 2) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    // 保存设置
    storage.set(STORAGE_KEYS.USER_SETTINGS, settings)
    Toast.show({ icon: 'success', content: '设置完成！' })
    onComplete()
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="onboarding-step">
            <h2 className="step-title">选择您的饮食习惯</h2>
            <p className="step-desc">帮助我们为您推荐合适的菜品</p>
            <Checkbox.Group
              value={settings.dietPreference}
              onChange={val => setSettings({ ...settings, dietPreference: val })}
            >
              {dietPreferences.map(item => (
                <div key={item.value} className="checkbox-item">
                  <Checkbox value={item.value}>{item.label}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        )
      
      case 1:
        return (
          <div className="onboarding-step">
            <h2 className="step-title">您的饮食目标</h2>
            <p className="step-desc">我们将根据您的目标调整推荐</p>
            <div className="goal-options">
              {dietGoals.map(item => (
                <div
                  key={item.value}
                  className={`goal-card ${settings.dietGoal === item.value ? 'active' : ''}`}
                  onClick={() => setSettings({ ...settings, dietGoal: item.value })}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="onboarding-step">
            <h2 className="step-title">健康状况与忌口</h2>
            <p className="step-desc">帮助我们排除不适合您的食材</p>
            
            <div className="section">
              <h3>健康状况</h3>
              <div className="health-options">
                {healthStatuses.map(item => (
                  <div
                    key={item.value}
                    className={`health-card ${settings.healthStatus === item.value ? 'active' : ''}`}
                    onClick={() => setSettings({ ...settings, healthStatus: item.value })}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="section">
              <h3>过敏/厌恶食材</h3>
              <Checkbox.Group
                value={settings.allergies}
                onChange={val => setSettings({ ...settings, allergies: val })}
              >
                {commonAllergies.map(item => (
                  <div key={item.value} className="checkbox-item">
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
              
              <Input
                placeholder="输入其他忌口食材（用逗号分隔）"
                value={settings.customAllergy}
                onChange={val => setSettings({ ...settings, customAllergy: val })}
                style={{ marginTop: '10px' }}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1>欢迎使用康小星</h1>
        <div className="step-indicator">
          {[0, 1, 2].map((index) => (
            <span 
              key={index} 
              className={`step-dot ${step === index ? 'active' : ''}`}
            />
          ))}
        </div>
        <div className="step-text">
          {step === 0 && '饮食习惯'}
          {step === 1 && '饮食目标'}
          {step === 2 && '健康状况'}
        </div>
      </div>
      
      <div className="onboarding-content">
        {renderStep()}
      </div>
      
      <div className="onboarding-footer">
        {step > 0 && (
          <Button
            onClick={() => setStep(step - 1)}
            style={{ marginRight: '10px' }}
          >
            上一步
          </Button>
        )}
        <Button
          color="primary"
          onClick={handleNext}
          style={{ flex: 1 }}
        >
          {step === 2 ? '完成设置' : '下一步'}
        </Button>
      </div>
    </div>
  )
}

export default OnboardingPage