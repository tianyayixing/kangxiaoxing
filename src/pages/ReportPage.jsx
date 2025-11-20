import { useState, useEffect, useRef } from 'react'
import { Card, Button } from 'antd-mobile'
import * as echarts from 'echarts'
import { storage, STORAGE_KEYS } from '../utils/storage'
import { NutritionAnalyzer } from '../services/nutritionService'
import './ReportPage.css'

function ReportPage() {
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [userSettings, setUserSettings] = useState(null)
  const caloriesChartRef = useRef(null)
  const macrosChartRef = useRef(null)
  const scoreChartRef = useRef(null)

  useEffect(() => {
    loadUserSettings()
  }, [])

  useEffect(() => {
    generateReport()
  }, [userSettings])

  useEffect(() => {
    if (weeklyReport) {
      // 确保DOM已经渲染后再渲染图表
      setTimeout(() => {
        renderCharts()
      }, 100)
    }
  }, [weeklyReport])

  // 监听窗口大小变化，重新调整图表大小
  useEffect(() => {
    const handleResize = () => {
      if (caloriesChartRef.current) {
        echarts.getInstanceByDom(caloriesChartRef.current)?.resize()
      }
      if (macrosChartRef.current) {
        echarts.getInstanceByDom(macrosChartRef.current)?.resize()
      }
      if (scoreChartRef.current) {
        echarts.getInstanceByDom(scoreChartRef.current)?.resize()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      
      // 组件卸载时销毁所有图表实例
      if (caloriesChartRef.current) {
        echarts.getInstanceByDom(caloriesChartRef.current)?.dispose()
      }
      if (macrosChartRef.current) {
        echarts.getInstanceByDom(macrosChartRef.current)?.dispose()
      }
      if (scoreChartRef.current) {
        echarts.getInstanceByDom(scoreChartRef.current)?.dispose()
      }
    }
  }, [])

  const loadUserSettings = () => {
    const settings = storage.get(STORAGE_KEYS.USER_SETTINGS, {})
    setUserSettings(settings)
  }

  const generateReport = () => {
    // 确保userSettings已加载
    if (!userSettings) return;
    
    console.log('开始生成报告，userSettings:', userSettings);
    
    const weekPlan = storage.get(STORAGE_KEYS.DIET_PLAN, {})
    console.log('获取到的周计划:', weekPlan);
    
    const analysis = NutritionAnalyzer.analyzeWeeklyNutrition(weekPlan, userSettings)
    console.log('分析结果:', analysis);
    
    setWeeklyReport(analysis)
    
    // 保存报告
    const reports = storage.get(STORAGE_KEYS.WEEKLY_REPORTS, [])
    const newReport = {
      date: new Date().toLocaleDateString('zh-CN'),
      ...analysis
    }
    reports.unshift(newReport)
    if (reports.length > 10) reports.pop() // 只保留最近10周
    storage.set(STORAGE_KEYS.WEEKLY_REPORTS, reports)
  }

  const renderCharts = () => {
    console.log('开始渲染图表，weeklyReport:', weeklyReport);
    renderCaloriesChart()
    renderMacrosChart()
    renderScoreChart()
  }

  const renderCaloriesChart = () => {
    if (!caloriesChartRef.current) return
    
    try {
      // 清除旧的图表实例
      const existingChart = echarts.getInstanceByDom(caloriesChartRef.current)
      if (existingChart) {
        existingChart.dispose()
      }
      
      const chart = echarts.init(caloriesChartRef.current)
      
      const days = weeklyReport.dailyAnalysis.map(d => d.day)
      const calories = weeklyReport.dailyAnalysis.map(d => d.totalCalories)
      
      const option = {
        title: { text: '每日热量摄入', left: 'center', textStyle: { fontSize: 16 } },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: days },
        yAxis: { type: 'value', name: 'kcal' },
        series: [{
          data: calories,
          type: 'line',
          smooth: true,
          areaStyle: { color: 'rgba(0, 181, 120, 0.1)' },
          itemStyle: { color: '#00b578' },
          lineStyle: { width: 3 }
        }],
        grid: { left: 50, right: 20, top: 60, bottom: 30 }
      }
      
      chart.setOption(option)
    } catch (error) {
      console.error('渲染热量图表时出错:', error)
    }
  }

  const renderMacrosChart = () => {
    if (!macrosChartRef.current) return
    
    try {
      // 清除旧的图表实例
      const existingChart = echarts.getInstanceByDom(macrosChartRef.current)
      if (existingChart) {
        existingChart.dispose()
      }
      
      const chart = echarts.init(macrosChartRef.current)
      
      // 计算每周平均营养素比例
      const avgProtein = weeklyReport.dailyAnalysis.reduce((sum, d) => sum + d.proteinRatio, 0) / 7
      const avgFat = weeklyReport.dailyAnalysis.reduce((sum, d) => sum + d.fatRatio, 0) / 7
      const avgCarbs = weeklyReport.dailyAnalysis.reduce((sum, d) => sum + d.carbsRatio, 0) / 7
      
      const option = {
        title: { text: '营养素比例', left: 'center', textStyle: { fontSize: 16 } },
        tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, formatter: '{b}\n{c}%' },
          data: [
            { value: Math.round(avgProtein), name: '蛋白质', itemStyle: { color: '#00b578' } },
            { value: Math.round(avgFat), name: '脂肪', itemStyle: { color: '#ff8f1f' } },
            { value: Math.round(avgCarbs), name: '碳水', itemStyle: { color: '#1677ff' } }
          ]
        }],
        grid: { top: 60, bottom: 30 }
      }
      
      chart.setOption(option)
    } catch (error) {
      console.error('渲染营养素比例图表时出错:', error)
    }
  }

  const renderScoreChart = () => {
    if (!scoreChartRef.current) return
    
    try {
      // 清除旧的图表实例
      const existingChart = echarts.getInstanceByDom(scoreChartRef.current)
      if (existingChart) {
        existingChart.dispose()
      }
      
      const chart = echarts.init(scoreChartRef.current)
      
      const days = weeklyReport.dailyAnalysis.map(d => d.day)
      const scores = weeklyReport.dailyAnalysis.map(d => d.score)
      
      const option = {
        title: { text: '每日健康评分', left: 'center', textStyle: { fontSize: 16 } },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: days },
        yAxis: { type: 'value', min: 0, max: 100, name: '分' },
        series: [{
          data: scores,
          type: 'bar',
          itemStyle: {
            color: (params) => {
              const score = params.value
              if (score >= 90) return '#00b578'
              if (score >= 80) return '#52c41a'
              if (score >= 70) return '#faad14'
              if (score >= 60) return '#ff8f1f'
              return '#ff3141'
            },
            borderRadius: [8, 8, 0, 0]
          },
          barWidth: '60%'
        }],
        grid: { left: 50, right: 20, top: 60, bottom: 30 }
      }
      
      chart.setOption(option)
    } catch (error) {
      console.error('渲染健康评分图表时出错:', error)
    }
  }

  if (!weeklyReport) {
    return (
      <div className="report-page">
        <div className="report-header">
          <h1>营养报告</h1>
        </div>
        <div className="loading">加载中...</div>
      </div>
    )
  }

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>本周营养报告</h1>
        <p>{new Date().toLocaleDateString('zh-CN')}</p>
      </div>

      <Card className="summary-card">
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-icon">⭐</div>
            <div className="summary-label">平均评分</div>
            <div className="summary-value">{weeklyReport.avgScore}</div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">🔥</div>
            <div className="summary-label">日均热量</div>
            <div className="summary-value">{weeklyReport.avgCalories}</div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">💪</div>
            <div className="summary-label">日均蛋白</div>
            <div className="summary-value">{weeklyReport.avgProtein}g</div>
          </div>
        </div>
        <div className="summary-evaluation">
          <p>{weeklyReport.weeklyEvaluation}</p>
        </div>
      </Card>

      <Card className="chart-card">
        <div ref={caloriesChartRef} style={{ width: '100%', height: '250px' }}></div>
      </Card>

      <Card className="chart-card">
        <div ref={macrosChartRef} style={{ width: '100%', height: '250px' }}></div>
      </Card>

      <Card className="chart-card">
        <div ref={scoreChartRef} style={{ width: '100%', height: '250px' }}></div>
      </Card>

      <Card className="daily-details">
        <h3>每日详情</h3>
        {weeklyReport.dailyAnalysis.map(day => (
          <div key={day.day} className="daily-item">
            <div className="daily-day">{day.day}</div>
            <div className="daily-stats">
              <span>评分: {day.score}</span>
              <span>热量: {day.totalCalories} kcal</span>
              <span>蛋白质: {day.totalProtein}g</span>
            </div>
          </div>
        ))}
      </Card>

      <div className="report-actions">
        <Button color="primary" block onClick={generateReport}>
          刷新报告
        </Button>
      </div>
    </div>
  )
}

export default ReportPage
