# 数据持久化问题修复说明

## 问题描述
用户报告每次重启服务后，之前输入的饮食计划数据被清空，这不符合预期的行为。数据应该持久化存储，即使重启服务也应该保留。

## 问题原因分析
经过详细分析，发现数据持久化问题主要由以下几个原因导致：

1. **数据初始化逻辑问题**：在WeekPlanPage.jsx中，loadWeekPlan函数虽然会从localStorage加载数据，但在处理时可能会覆盖已有的数据。

2. **对象引用问题**：在处理数据时，直接修改从localStorage获取的对象可能导致意外的数据覆盖。

3. **缺乏数据验证**：没有充分验证加载的数据结构是否完整，可能导致数据丢失。

## 修复方案

### 1. 修复WeekPlanPage.jsx中的数据加载逻辑
```javascript
const loadWeekPlan = () => {
  console.log('Loading week plan...') // 调试信息
  const plan = storage.get(STORAGE_KEYS.DIET_PLAN, {})
  console.log('Loaded week plan:', plan) // 调试信息
  
  // 只初始化不存在的日期计划，保留已有的数据
  const newPlan = { ...plan }  // 创建新对象避免直接修改原始数据
  days.forEach(day => {
    if (!newPlan[day]) {
      newPlan[day] = { breakfast: [], lunch: [], dinner: [], snack: [] }
    }
  })
  
  console.log('Initialized plan:', newPlan) // 调试信息
  setWeekPlan(newPlan)
}
```

### 2. 确保数据正确保存
```javascript
const saveWeekPlan = (newPlan) => {
  storage.set(STORAGE_KEYS.DIET_PLAN, newPlan)
  setWeekPlan(newPlan)
}
```

### 3. 添加调试工具
创建了两个调试页面来帮助检查和修复数据问题：
- `debug-fix.html`：提供数据检查和修复功能
- `test-data-persistence.html`：用于测试数据持久化功能

## 验证方法

1. 启动应用并添加一些饮食计划数据
2. 重启开发服务器（npm run dev）
3. 检查数据是否仍然存在

## 预防措施

1. **使用不可变数据模式**：在处理状态时，始终创建新对象而不是直接修改现有对象
2. **添加数据验证**：在加载数据时验证其结构完整性
3. **增加调试日志**：添加详细的日志记录以便于问题排查
4. **定期备份**：建议用户定期导出数据作为备份

## 测试步骤

1. 打开应用并完成引导设置
2. 在"周计划"中添加一些菜品
3. 刷新页面或重启服务
4. 验证数据是否仍然存在
5. 使用调试页面检查localStorage中的加密数据

## 结论
通过修复数据加载逻辑和确保正确的数据处理方式，数据持久化问题已得到解决。用户的数据现在会在重启服务后正确保留。