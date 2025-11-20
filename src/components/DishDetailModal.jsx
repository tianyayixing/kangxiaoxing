import { Popup, Button } from 'antd-mobile'
import './DishDetailModal.css'

function DishDetailModal({ visible, dish, onClose }) {
  if (!dish) return null

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        minHeight: '60vh',
        maxHeight: '85vh',
        overflowY: 'auto'
      }}
    >
      <div className="dish-detail-modal">
        <div className="detail-header">
          <div className="detail-icon">{dish.image}</div>
          <h2>{dish.name}</h2>
          <div className="detail-category">{dish.category}</div>
        </div>

        <div className="detail-section">
          <h3>📊 营养成分</h3>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <div className="nutrition-value">{dish.calories}</div>
              <div className="nutrition-label">热量(kcal)</div>
            </div>
            <div className="nutrition-item">
              <div className="nutrition-value">{dish.protein}g</div>
              <div className="nutrition-label">蛋白质</div>
            </div>
            <div className="nutrition-item">
              <div className="nutrition-value">{dish.fat}g</div>
              <div className="nutrition-label">脂肪</div>
            </div>
            <div className="nutrition-item">
              <div className="nutrition-value">{dish.carbs}g</div>
              <div className="nutrition-label">碳水</div>
            </div>
            {dish.fiber > 0 && (
              <div className="nutrition-item">
                <div className="nutrition-value">{dish.fiber}g</div>
                <div className="nutrition-label">膳食纤维</div>
              </div>
            )}
            {dish.vitaminC > 0 && (
              <div className="nutrition-item">
                <div className="nutrition-value">{dish.vitaminC}mg</div>
                <div className="nutrition-label">维生素C</div>
              </div>
            )}
          </div>
        </div>

        {dish.effect && (
          <div className="detail-section">
            <h3>✨ 功效说明</h3>
            <div className="effect-content">
              <p>{dish.effect}</p>
            </div>
          </div>
        )}

        {dish.cookingMethod && (
          <div className="detail-section">
            <h3>👨‍🍳 烹饪方法</h3>
            <div className="cooking-content">
              <p>{dish.cookingMethod}</p>
            </div>
          </div>
        )}

        {dish.steps && dish.steps.length > 0 && (
          <div className="detail-section">
            <h3>📝 制作步骤</h3>
            <div className="steps-list">
              {dish.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dish.tips && (
          <div className="detail-section">
            <h3>💡 小贴士</h3>
            <div className="tips-content">
              <p>{dish.tips}</p>
            </div>
          </div>
        )}

        <div className="detail-footer">
          <Button block color="primary" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default DishDetailModal
