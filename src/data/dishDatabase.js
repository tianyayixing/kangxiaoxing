import { storage, STORAGE_KEYS } from '../utils/storage'

/**
 * 初始菜品数据库（100+种常见菜品）
 */
export const initialDishDatabase = [
  // 早餐类
  { id: 1, name: '煎蛋', category: '早餐', calories: 155, protein: 13, fat: 11, carbs: 1, fiber: 0, vitaminC: 0, vitaminB: 8, image: '🍳', cookingMethod: '热锅加油，打入鸡蛋，煎至两面金黄', effect: '富含蛋白质，提供能量' },
  { id: 2, name: '牛奶', category: '早餐', calories: 150, protein: 8, fat: 8, carbs: 12, fiber: 0, vitaminC: 2, vitaminB: 15, image: '🥛', cookingMethod: '直接饮用或加热', effect: '补钙，促进骨骼健康' },
  { id: 3, name: '全麦面包', category: '早餐', calories: 247, protein: 13, fat: 4, carbs: 41, fiber: 7, vitaminC: 0, vitaminB: 25, image: '🍞', cookingMethod: '烘烤或直接食用', effect: '富含膳食纤维，促进消化' },
  { id: 4, name: '燕麦粥', category: '早餐', calories: 389, protein: 17, fat: 7, carbs: 66, fiber: 10, vitaminC: 0, vitaminB: 30, image: '🥣', cookingMethod: '加水或牛奶煮制', effect: '降低胆固醇，稳定血糖' },
  { id: 5, name: '豆浆', category: '早餐', calories: 54, protein: 3.3, fat: 1.8, carbs: 4.5, fiber: 1.1, vitaminC: 0, vitaminB: 12, image: '🥛', cookingMethod: '直接饮用或加热', effect: '植物蛋白，易吸收' },
  
  // 主食类
  { id: 6, name: '米饭', category: '主食', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, fiber: 0.4, vitaminC: 0, vitaminB: 5, image: '🍚', cookingMethod: '电饭煲蒸煮', effect: '提供碳水化合物，快速补充能量' },
  { id: 7, name: '馒头', category: '主食', calories: 221, protein: 7, fat: 1, carbs: 47, fiber: 1.3, vitaminC: 0, vitaminB: 8, image: '🥟', cookingMethod: '蒸制15-20分钟', effect: '易消化，适合肠胃不适者' },
  { id: 8, name: '面条', category: '主食', calories: 137, protein: 4.5, fat: 0.5, carbs: 28, fiber: 1.2, vitaminC: 0, vitaminB: 6, image: '🍜', cookingMethod: '煮沸后加调料', effect: '快速饱腹，提供能量' },
  { id: 9, name: '红薯', category: '主食', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, fiber: 3, vitaminC: 20, vitaminB: 15, image: '🍠', cookingMethod: '蒸、烤或煮', effect: '富含膳食纤维，促进肠道健康' },
  { id: 10, name: '玉米', category: '主食', calories: 96, protein: 3.4, fat: 1.5, carbs: 19, fiber: 2.7, vitaminC: 7, vitaminB: 18, image: '🌽', cookingMethod: '煮或蒸', effect: '富含叶黄素，保护视力' },
  
  // 蔬菜类
  { id: 11, name: '西蓝花', category: '蔬菜', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, fiber: 2.6, vitaminC: 89, vitaminB: 12, image: '🥦', cookingMethod: '焯水后炒制', effect: '抗氧化，增强免疫力' },
  { id: 12, name: '菠菜', category: '蔬菜', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, vitaminC: 28, vitaminB: 20, image: '🥬', cookingMethod: '炒或做汤', effect: '补铁，预防贫血' },
  { id: 13, name: '胡萝卜', category: '蔬菜', calories: 41, protein: 0.9, fat: 0.2, carbs: 10, fiber: 2.8, vitaminC: 6, vitaminB: 10, image: '🥕', cookingMethod: '炒、煮或生食', effect: '富含胡萝卜素，保护视力' },
  { id: 14, name: '西红柿', category: '蔬菜', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, vitaminC: 14, vitaminB: 8, image: '🍅', cookingMethod: '生食或炒制', effect: '富含番茄红素，抗氧化' },
  { id: 15, name: '黄瓜', category: '蔬菜', calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5, vitaminC: 3, vitaminB: 4, image: '🥒', cookingMethod: '凉拌或生食', effect: '补水，清热解毒' },
  { id: 16, name: '白菜', category: '蔬菜', calories: 13, protein: 1.5, fat: 0.2, carbs: 2.2, fiber: 1, vitaminC: 45, vitaminB: 6, image: '🥬', cookingMethod: '炒或煮汤', effect: '促进消化，清热解毒' },
  { id: 17, name: '芹菜', category: '蔬菜', calories: 16, protein: 0.7, fat: 0.2, carbs: 3, fiber: 1.6, vitaminC: 3, vitaminB: 5, image: '🌿', cookingMethod: '炒或凉拌', effect: '降血压，利尿' },
  { id: 18, name: '茄子', category: '蔬菜', calories: 25, protein: 1.2, fat: 0.2, carbs: 5.9, fiber: 3, vitaminC: 2, vitaminB: 7, image: '🍆', cookingMethod: '炒、蒸或烤', effect: '降低胆固醇' },
  
  // 肉类
  { id: 19, name: '鸡胸肉', category: '肉类', calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 25, image: '🍗', cookingMethod: '煎、煮或烤', effect: '低脂高蛋白，适合健身' },
  { id: 20, name: '牛肉', category: '肉类', calories: 250, protein: 26, fat: 15, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 35, image: '🥩', cookingMethod: '炒、炖或煎', effect: '补铁，增强体力' },
  { id: 21, name: '猪瘦肉', category: '肉类', calories: 143, protein: 20, fat: 7, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 30, image: '🥓', cookingMethod: '炒、煮或炖', effect: '提供优质蛋白质' },
  { id: 22, name: '鱼肉', category: '肉类', calories: 206, protein: 22, fat: 12, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 28, image: '🐟', cookingMethod: '蒸、煮或烤', effect: '富含Omega-3，保护心脏' },
  { id: 23, name: '虾', category: '肉类', calories: 99, protein: 24, fat: 0.3, carbs: 0.2, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🦐', cookingMethod: '煮、炒或蒸', effect: '高蛋白低脂，补钙' },
  
  // 豆制品
  { id: 24, name: '豆腐', category: '豆制品', calories: 76, protein: 8, fat: 4.8, carbs: 1.9, fiber: 0.1, vitaminC: 0, vitaminB: 10, image: '🧊', cookingMethod: '炒、煮或炖', effect: '植物蛋白，补钙' },
  { id: 25, name: '豆腐干', category: '豆制品', calories: 140, protein: 17, fat: 3, carbs: 11, fiber: 1.5, vitaminC: 0, vitaminB: 12, image: '🟫', cookingMethod: '炒或凉拌', effect: '高蛋白，适合素食者' },
  
  // 水果类
  { id: 26, name: '苹果', category: '水果', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4, vitaminC: 5, vitaminB: 3, image: '🍎', cookingMethod: '直接食用', effect: '促进消化，补充维生素' },
  { id: 27, name: '香蕉', category: '水果', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, vitaminC: 9, vitaminB: 15, image: '🍌', cookingMethod: '直接食用', effect: '快速补充能量，缓解疲劳' },
  { id: 28, name: '橙子', category: '水果', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, fiber: 2.4, vitaminC: 53, vitaminB: 8, image: '🍊', cookingMethod: '直接食用', effect: '富含维生素C，增强免疫' },
  { id: 29, name: '葡萄', category: '水果', calories: 69, protein: 0.7, fat: 0.2, carbs: 18, fiber: 0.9, vitaminC: 4, vitaminB: 6, image: '🍇', cookingMethod: '直接食用', effect: '抗氧化，保护心血管' },
  
  // 其他常见菜品
  { id: 30, name: '炒青菜', category: '蔬菜', calories: 45, protein: 2, fat: 2, carbs: 5, fiber: 2, vitaminC: 30, vitaminB: 8, image: '🥬', cookingMethod: '热锅快炒', effect: '清淡少油，富含维生素' },
  { id: 31, name: '番茄炒蛋', category: '家常菜', calories: 120, protein: 8, fat: 7, carbs: 8, fiber: 1.5, vitaminC: 12, vitaminB: 10, image: '🍳', cookingMethod: '先炒蛋后炒番茄', effect: '营养均衡，易消化', steps: ['鸡蛋打散，加少许盐和料酒去腥', '番茄洗净切块，准备葱花和蒜末', '热锅凉油，油热后倒入蛋液，用铲子快速打散成大块', '蛋块盛出备用，键内留底油', '下番茄块翻炒，炒出汁水后加盐和白糖调味', '倒入炒好的鸡蛋，快速翻炒均匀，撒葱花出锅'], tips: '蛋液中加少许水淀粉和料酒可以让鸡蛋更嫩滑；番茄可先用开水烫一下去皮，口感更好；加少许白糖可以中和番茄的酸味。' },
  { id: 32, name: '青椒肉丝', category: '家常菜', calories: 180, protein: 15, fat: 10, carbs: 8, fiber: 2, vitaminC: 25, vitaminB: 12, image: '🫑', cookingMethod: '快炒保持脆嫩', effect: '补充蛋白质和维生素C', steps: ['猪肉切丝，加料酒、生抽、淀粉、少许油腌制15分钟', '青椒去籽去籽切丝，蒜姜切丝', '调汁：生抽1勺、老抽半勺、香醋半勺、白糖半勺、水淀粉半勺、清水三勺混合', '热锅凉油，油热后下肉丝滑烫至变色盛出', '键内留底油，爆香蒜姜，下青椒丝大火翻炒', '青椒断生后倒入肉丝，浇入调好的汁，快速翻炒均匀出锅'], tips: '肉丝一定要充分腌制，这样才会嫩滑；烫肉丝时油温不要太高，避免炮溅；全程大火快炒，保持青椒的脆嫩口感。' },
  { id: 33, name: '麻婆豆腐', category: '家常菜', calories: 160, protein: 12, fat: 9, carbs: 10, fiber: 1, vitaminC: 5, vitaminB: 8, image: '🌶️', cookingMethod: '炒制豆腐加调料', effect: '辛辣开胃，高蛋白', steps: ['豆腐切小块，入淡盐水浸泡5分钟后控干', '牛肉末加料酒、生抽腌制，葱1-2瓣切末', '豆瓣遇1勺切末，蒜姜末适量', '热锅凉油，下牛肉末炒至变色、出油', '下豆瓣酱和蒜姜炒出红油，加清水烧开', '下豆腐块，轻轻推匀，中火煮5-8分钟', '加生抽、白糖调味，水淀粉勾芍，撒花椒粉和蒜花即可'], tips: '豆腐用盐水浸泡可以去豆腥味，也不容易碎；煮的时候不要频繁翻动，避免豆腐碎掉；花椒粉一定要最后放，才能保持麻味。' },
  { id: 34, name: '红烧肉', category: '家常菜', calories: 350, protein: 18, fat: 28, carbs: 12, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🍖', cookingMethod: '炖煮入味', effect: '高热量，偶尔食用', steps: ['五花肉切块，冷水下锅焯水去腥，捞出洗净', '热锅凉油，下冰糖小火炒至焦糖色', '下肉块翻炒上色，加料酒、生抽、老抽炒匀', '加热水没过肉块，放入葱段、姜片、八角', '大火烧开后转小火炖煮40-50分钟', '加盐调味，大火收汁至浓稠即可'], tips: '炒糖色时火候要控制好，避免炒糊；炖煮时要保持小火，肉才会软烂入味；收汁时要不断翻动，避免粘锅。' },
  { id: 35, name: '清蒸鱼', category: '海鲜', calories: 120, protein: 22, fat: 3, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 20, image: '🐟', cookingMethod: '清蒸保持原味', effect: '低脂高蛋白，护心' },
  { id: 36, name: '紫菜蛋花汤', category: '汤类', calories: 45, protein: 4, fat: 2, carbs: 3, fiber: 1, vitaminC: 2, vitaminB: 6, image: '🥣', cookingMethod: '煮沸后加蛋花', effect: '补碘，清淡养胃' },
  { id: 37, name: '酸辣土豆丝', category: '家常菜', calories: 95, protein: 2, fat: 3, carbs: 16, fiber: 2.5, vitaminC: 15, vitaminB: 8, image: '🥔', cookingMethod: '快炒保持脆度', effect: '开胃，富含维生素C', steps: ['土豆削皮洗净，切成均匀的细丝', '土豆丝用清水浸泡并洗洃2-3遍，去除表面淀粉', '干辣椒切段，蒜姜切丝，准备花椒粒', '热锅凉油，下花椒、干辣椒、蒜姜爆香', '倒入沥干水分的土豆丝，大火快速翻炒', '加盐、香醋、白糖继续翻炒至断生', '滤入少许香油增香，出锅前撒蒜花即可'], tips: '土豆丝一定要切得均匀，这样受热才会一致；浸泡和清洗可以去掉多余淀粉，保持脆口；全程大火快炒，不要加水，才能保持土豆丝的脆度。' },
  { id: 38, name: '拍黄瓜', category: '凉菜', calories: 35, protein: 1, fat: 1.5, carbs: 5, fiber: 1, vitaminC: 5, vitaminB: 3, image: '🥒', cookingMethod: '拍碎加调料', effect: '清爽解腻，低热量' },
  { id: 39, name: '凉拌木耳', category: '凉菜', calories: 50, protein: 2.5, fat: 2, carbs: 7, fiber: 3, vitaminC: 3, vitaminB: 10, image: '🍄', cookingMethod: '焯水后凉拌', effect: '清肠排毒，富含铁' },
  { id: 40, name: '鸡蛋羹', category: '蛋类', calories: 80, protein: 7, fat: 5, carbs: 2, fiber: 0, vitaminC: 0, vitaminB: 8, image: '🥚', cookingMethod: '蒸制', effect: '易消化，适合老人小孩' },
  
  // 汤类
  { id: 41, name: '西红柿蛋花汤', category: '汤类', calories: 55, protein: 4, fat: 3, carbs: 5, fiber: 1, vitaminC: 10, vitaminB: 6, image: '🍅', cookingMethod: '煮沸后加蛋花', effect: '清淡营养，开胃' },
  { id: 42, name: '冬瓜排骨汤', category: '汤类', calories: 85, protein: 8, fat: 4, carbs: 6, fiber: 1.5, vitaminC: 8, vitaminB: 12, image: '🥣', cookingMethod: '炖煮1-2小时', effect: '利尿消肿，清热' },
  { id: 43, name: '玉米排骨汤', category: '汤类', calories: 110, protein: 10, fat: 5, carbs: 9, fiber: 2, vitaminC: 6, vitaminB: 15, image: '🌽', cookingMethod: '炖煮1小时以上', effect: '营养丰富，滋补' },
  { id: 44, name: '萝卜牛腩汤', category: '汤类', calories: 130, protein: 12, fat: 6, carbs: 8, fiber: 2, vitaminC: 12, vitaminB: 18, image: '🥕', cookingMethod: '慢炖2小时', effect: '暖胃，补气血' },
  
  // 粥类
  { id: 45, name: '皮蛋瘦肉粥', category: '粥', calories: 95, protein: 7, fat: 3, carbs: 12, fiber: 0.5, vitaminC: 0, vitaminB: 10, image: '🥣', cookingMethod: '煮粥加皮蛋肉丝', effect: '养胃，易消化' },
  { id: 46, name: '小米粥', category: '粥', calories: 46, protein: 1.5, fat: 0.4, carbs: 9, fiber: 0.7, vitaminC: 0, vitaminB: 12, image: '🥣', cookingMethod: '慢煮至黏稠', effect: '养胃，补充B族维生素' },
  { id: 47, name: '南瓜粥', category: '粥', calories: 52, protein: 1.8, fat: 0.3, carbs: 11, fiber: 1.5, vitaminC: 8, vitaminB: 10, image: '🎃', cookingMethod: '南瓜煮烂加米', effect: '护眼，增强免疫' },
  
  // 更多蔬菜
  { id: 48, name: '油菜', category: '蔬菜', calories: 15, protein: 1.5, fat: 0.3, carbs: 2.7, fiber: 1.1, vitaminC: 36, vitaminB: 8, image: '🥬', cookingMethod: '快炒', effect: '补钙，清热解毒' },
  { id: 49, name: '生菜', category: '蔬菜', calories: 14, protein: 0.9, fat: 0.2, carbs: 2.9, fiber: 1.3, vitaminC: 4, vitaminB: 5, image: '🥗', cookingMethod: '生食或快炒', effect: '低热量，适合减肥' },
  { id: 50, name: '豆角', category: '蔬菜', calories: 31, protein: 2, fat: 0.2, carbs: 7, fiber: 3.4, vitaminC: 12, vitaminB: 10, image: '🫘', cookingMethod: '炒或焖', effect: '富含膳食纤维' },
  
  // 菌菇类
  { id: 51, name: '香菇', category: '菌菇', calories: 33, protein: 2.2, fat: 0.3, carbs: 7, fiber: 3.3, vitaminC: 2, vitaminB: 18, image: '🍄', cookingMethod: '炒、炖或煮', effect: '增强免疫，降脂' },
  { id: 52, name: '金针菇', category: '菌菇', calories: 32, protein: 2.7, fat: 0.3, carbs: 6, fiber: 2.7, vitaminC: 2, vitaminB: 20, image: '🍄', cookingMethod: '煮或涮火锅', effect: '促进智力发育' },
  { id: 53, name: '平菇', category: '菌菇', calories: 26, protein: 2, fat: 0.2, carbs: 6, fiber: 2.3, vitaminC: 3, vitaminB: 15, image: '🍄', cookingMethod: '炒或炖', effect: '降血压，抗癌' },
  
  // 海产品
  { id: 54, name: '带鱼', category: '海鲜', calories: 127, protein: 17, fat: 5, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 12, image: '🐟', cookingMethod: '煎或红烧', effect: '补脑，护心' },
  { id: 55, name: '鲍鱼', category: '海鲜', calories: 105, protein: 18, fat: 0.5, carbs: 4, fiber: 0, vitaminC: 2, vitaminB: 8, image: '🦪', cookingMethod: '蒸或炖', effect: '滋补，提高免疫' },
  { id: 56, name: '扇贝', category: '海鲜', calories: 88, protein: 17, fat: 0.6, carbs: 3, fiber: 0, vitaminC: 1, vitaminB: 10, image: '🦪', cookingMethod: '蒸或烤', effect: '低脂高蛋白' },
  { id: 57, name: '海带', category: '海产', calories: 12, protein: 0.9, fat: 0.1, carbs: 2.1, fiber: 0.5, vitaminC: 1, vitaminB: 6, image: '🌿', cookingMethod: '煮或凉拌', effect: '补碘，降脂' },
  
  // 坚果类
  { id: 58, name: '核桃', category: '坚果', calories: 654, protein: 15, fat: 65, carbs: 14, fiber: 6.7, vitaminC: 1, vitaminB: 25, image: '🌰', cookingMethod: '直接食用', effect: '补脑，抗氧化' },
  { id: 59, name: '杏仁', category: '坚果', calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12, vitaminC: 0, vitaminB: 30, image: '🌰', cookingMethod: '直接食用', effect: '降胆固醇，护心' },
  { id: 60, name: '花生', category: '坚果', calories: 567, protein: 26, fat: 49, carbs: 16, fiber: 8, vitaminC: 0, vitaminB: 35, image: '🥜', cookingMethod: '煮或炒', effect: '补血，提高记忆力' },
  
  // 更多家常菜
  { id: 61, name: '宫保鸡丁', category: '家常菜', calories: 210, protein: 20, fat: 12, carbs: 10, fiber: 2, vitaminC: 8, vitaminB: 15, image: '🌶️', cookingMethod: '炒制', effect: '营养丰富，开胃', steps: ['鸡胸肉切小丁，加料酒、生抽、蛋清、淀粉腌制20分钟', '花生米油炸至金黄酥脆，干辣椒切段', '调汁：生抽2勺、老抽半勺、白糖1勺、香醋1勺、料酒半勺、水淀粉半勺、清水适量', '热锅凉油，油热后下鸡丁滑烫至变色，盛出', '键内留底油，爆香花椒和干辣椒', '下蒜姜炒香，倒入鸡丁和花生米', '浇入调好的汁，大火快速翻炒均匀即可'], tips: '鸡丁一定要充分腌制，这样才会嫩滑多汁；花生米炸至表面金黄即可，不要炸过头；全程大火快炒，保持鸡丁的嫩度和花生米的酥脆。' },
  { id: 62, name: '鱼香肉丝', category: '家常菜', calories: 190, protein: 16, fat: 11, carbs: 12, fiber: 1.5, vitaminC: 6, vitaminB: 12, image: '🥢', cookingMethod: '快炒', effect: '酸甜适口，下饭', steps: ['猪肉切丝腌制，木耳泡发切丝，胡萝卜、笋切丝', '调鱼香汁：生抽2勺、香醋2勺、白糖2勺、豆瓣遱1勺、蒜姜末适量', '热锅凉油，肉丝滑烫至变色盛出', '键内留底油，爆香蒜姜，下木耳和配菜翻炒', '倒入肉丝，浇入鱼香汁，大火快速翻炒均匀出锅'], tips: '肉丝切好后要充分腌制；鱼香汁要提前调好，炒菜时才不会手忙脚乱；木耳要充分泡发，口感更好。' },
  { id: 63, name: '糖醋里脊', category: '家常菜', calories: 280, protein: 18, fat: 15, carbs: 22, fiber: 1, vitaminC: 5, vitaminB: 10, image: '🍖', cookingMethod: '炸后炒制', effect: '高热量，偶尔食用', steps: ['里脊肉切条，加料酒、盐腌制10分钟', '肉条裹上淀粉，油炸至金黄捞出', '调糖醋汁：番茄酱2勺、白糖2勺、白醋1勺、生抽半勺、水淀粉适量', '锅内留少许油，下番茄酱炒出红油', '倒入糖醋汁炒匀，下炸好的里脊肉翻炒均匀', '撒白芝麻出锅'], tips: '肉条要切得粗细均匀，这样受热一致；炸制时油温要控制好，避免外焦内生；糖醋汁的比例可以根据个人口味调整。' },
  { id: 64, name: '木须肉', category: '家常菜', calories: 160, protein: 14, fat: 10, carbs: 8, fiber: 1.5, vitaminC: 4, vitaminB: 12, image: '🥚', cookingMethod: '炒制', effect: '营养均衡', steps: ['木耳泡发洗净，黄瓜切片，猪肉切片腌制', '鸡蛋打散，加少许盐和料酒', '热锅凉油，倒入蛋液炒成大块，盛出', '键内留底油，下肉片炒至变色', '下木耳和黄瓜翻炒，加盐调味', '倒入鸡蛋，快速翻炒均匀即可'], tips: '鸡蛋不要炒得太碎，大块更好看；木耳要充分泡发；黄瓜不要炒太软，保持一定口感。' },
  { id: 65, name: '回锅肉', category: '家常菜', calories: 320, protein: 16, fat: 26, carbs: 10, fiber: 1, vitaminC: 8, vitaminB: 12, image: '🥓', cookingMethod: '煮后炒制', effect: '高脂高热，偶尔食用', steps: ['五花肉冷水下锅，加料酒、姜片煮15分钟', '捞出晾凉切片，青椒切块，蒜苗切段', '豆瓣酱剁碎，豆豉少许', '热锅下肉片小火煸炒出油，肉片微卷', '下豆瓣酱和豆豉炒出红油', '下青椒和蒜苗翻炒断生，加少许盐和糖调味即可'], tips: '煮肉时不要煮太烂，否则切片困难；煸炒肉片时要用小火，避免炒糊；豆瓣酱要炒出红油才香。' },
  { id: 66, name: '蒜蓉西蓝花', category: '蔬菜', calories: 50, protein: 3, fat: 2, carbs: 7, fiber: 2.8, vitaminC: 90, vitaminB: 12, image: '🥦', cookingMethod: '焯水后炒蒜蓉', effect: '抗癌，营养丰富' },
  { id: 67, name: '红烧茄子', category: '蔬菜', calories: 110, protein: 2, fat: 6, carbs: 14, fiber: 3.5, vitaminC: 3, vitaminB: 8, image: '🍆', cookingMethod: '炒制', effect: '降脂，软化血管' },
  { id: 68, name: '凉拌豆皮', category: '凉菜', calories: 95, protein: 10, fat: 4, carbs: 8, fiber: 1.5, vitaminC: 2, vitaminB: 10, image: '🧊', cookingMethod: '焯水后凉拌', effect: '高蛋白，清爽' },
  { id: 69, name: '蒜泥白肉', category: '凉菜', calories: 240, protein: 18, fat: 18, carbs: 4, fiber: 0.5, vitaminC: 3, vitaminB: 15, image: '🥓', cookingMethod: '煮熟切片', effect: '高蛋白高脂' },
  { id: 70, name: '手撕包菜', category: '蔬菜', calories: 40, protein: 2, fat: 1.5, carbs: 6, fiber: 2, vitaminC: 40, vitaminB: 8, image: '🥬', cookingMethod: '快炒', effect: '清热解毒，促消化' },
  
  // 炖菜类
  { id: 71, name: '红烧排骨', category: '炖菜', calories: 280, protein: 22, fat: 20, carbs: 8, fiber: 0, vitaminC: 0, vitaminB: 18, image: '🍖', cookingMethod: '炖煮入味', effect: '补钙，滋补' },
  { id: 72, name: '土豆炖牛肉', category: '炖菜', calories: 220, protein: 20, fat: 12, carbs: 15, fiber: 2.5, vitaminC: 12, vitaminB: 25, image: '🥔', cookingMethod: '慢炖', effect: '营养丰富，暖身' },
  { id: 73, name: '炖鸡汤', category: '汤类', calories: 150, protein: 18, fat: 7, carbs: 3, fiber: 0, vitaminC: 2, vitaminB: 20, image: '🍗', cookingMethod: '慢炖2小时', effect: '滋补，增强体质' },
  
  // 蒸菜类
  { id: 74, name: '清蒸鲈鱼', category: '海鲜', calories: 115, protein: 20, fat: 3.5, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 18, image: '🐟', cookingMethod: '清蒸', effect: '低脂高蛋白，护脑' },
  { id: 75, name: '蒜蓉粉丝蒸虾', category: '海鲜', calories: 140, protein: 22, fat: 3, carbs: 10, fiber: 0.5, vitaminC: 1, vitaminB: 12, image: '🦐', cookingMethod: '蒸制', effect: '高蛋白，补钙' },
  { id: 76, name: '蒸南瓜', category: '蔬菜', calories: 26, protein: 0.7, fat: 0.1, carbs: 5.5, fiber: 1.4, vitaminC: 8, vitaminB: 8, image: '🎃', cookingMethod: '蒸熟', effect: '护眼，增强免疫' },
  
  // 烧烤类
  { id: 77, name: '烤鸡翅', category: '肉类', calories: 290, protein: 25, fat: 20, carbs: 4, fiber: 0, vitaminC: 0, vitaminB: 15, image: '🍗', cookingMethod: '烤箱烤制', effect: '高蛋白，偶尔食用' },
  { id: 78, name: '烤茄子', category: '蔬菜', calories: 65, protein: 1.5, fat: 3, carbs: 9, fiber: 3.2, vitaminC: 3, vitaminB: 8, image: '🍆', cookingMethod: '烤制后加调料', effect: '低热量，美味' },
  
  // 快手菜
  { id: 79, name: '蒜苔炒肉', category: '家常菜', calories: 170, protein: 15, fat: 10, carbs: 8, fiber: 2, vitaminC: 18, vitaminB: 12, image: '🥬', cookingMethod: '快炒', effect: '杀菌，增强免疫', steps: ['蒜苔去头尾洗净，切成段', '猪肉切片，加料酒、生抽、淀粉腌制5分钟', '热锅凉油，下肉片滑烫至变色，盛出', '键内留底油，大火下蒜苔翻炒', '蒜苔断生后加盐调味', '倒入肉片，快速翻炒均匀即可'], tips: '蒜苔不要炒太软，断生即可，保持脆度；大火快炒，才能保持蒜苔的香味；肉片要提前腌制。' },
  { id: 80, name: '韭菜炒蛋', category: '家常菜', calories: 135, protein: 10, fat: 8, carbs: 7, fiber: 1.8, vitaminC: 24, vitaminB: 15, image: '🥬', cookingMethod: '快炒', effect: '补肾，促消化', steps: ['韭菜洗净控干水分，切成小段', '鸡蛋打散，加少许盐和料酒打匀', '热锅凉油，油热后倒入蛋液', '蛋液凝固后用铲子打散成大块，盛出', '键内留底油，大火下韭菜翻炒', '韭菜断生后加盐，倒入鸡蛋块翻炒均匀即可'], tips: '韭菜一定要控干水分，避免出水；鸡蛋不要炒过头，嫩滑即可；韭菜快速翻炒，保持绿色和香味。' },
  { id: 81, name: '炒豆芽', category: '蔬菜', calories: 30, protein: 2, fat: 0.5, carbs: 5, fiber: 1.5, vitaminC: 20, vitaminB: 10, image: '🌱', cookingMethod: '快炒', effect: '低热量，清热解毒', steps: ['绿豆芽洗净，去除豆皮和根须', '热锅凉油，下蒜末爆香', '倒入豆芽大火快速翻炒', '加盐、少许白醋调味', '炒至豆芽变软，撒少许香油出锅'], tips: '豆芽一定要洗净，去除杂质；全程大火快炒，保持豆芽的脆嫩；加少许醋可以保持豆芽的白色。' },
  { id: 82, name: '炒空心菜', category: '蔬菜', calories: 35, protein: 2.5, fat: 1, carbs: 5, fiber: 2.2, vitaminC: 25, vitaminB: 8, image: '🥬', cookingMethod: '大火快炒', effect: '清热解毒，通便', steps: ['空心菜摘去老叶，洗净切段', '热锅下猪油或植物油，大火烧热', '下蒜蓉爆香', '倒入空心菜快速翻炒', '加盐调味，炒至断生即可出锅'], tips: '空心菜要大火快炒，保持脆嫩；炒制时间不宜过长，避免出水；蒜蓉可以多放一些，增加香味。' },
  
  // 凉菜续
  { id: 83, name: '凉拌海带丝', category: '凉菜', calories: 28, protein: 1.2, fat: 0.5, carbs: 5, fiber: 1, vitaminC: 2, vitaminB: 8, image: '🌿', cookingMethod: '焯水后凉拌', effect: '补碘，降脂' },
  { id: 84, name: '凉拌三丝', category: '凉菜', calories: 55, protein: 2, fat: 2, carbs: 8, fiber: 2, vitaminC: 15, vitaminB: 8, image: '🥗', cookingMethod: '切丝凉拌', effect: '清爽，促食欲' },
  { id: 85, name: '皮蛋豆腐', category: '凉菜', calories: 110, protein: 9, fat: 7, carbs: 5, fiber: 0.5, vitaminC: 1, vitaminB: 10, image: '🧊', cookingMethod: '切块拌调料', effect: '清热，下火' },
  
  // 米面类续
  { id: 86, name: '炒饭', category: '主食', calories: 215, protein: 6, fat: 8, carbs: 30, fiber: 1, vitaminC: 5, vitaminB: 10, image: '🍚', cookingMethod: '隔夜饭炒制', effect: '快速饱腹' },
  { id: 87, name: '炒面', category: '主食', calories: 240, protein: 8, fat: 10, carbs: 32, fiber: 2, vitaminC: 6, vitaminB: 12, image: '🍜', cookingMethod: '煮熟后炒制', effect: '营养丰富' },
  { id: 88, name: '饺子', category: '主食', calories: 200, protein: 10, fat: 7, carbs: 26, fiber: 1.5, vitaminC: 3, vitaminB: 12, image: '🥟', cookingMethod: '煮或蒸', effect: '营养全面' },
  { id: 89, name: '包子', category: '主食', calories: 180, protein: 7, fat: 5, carbs: 28, fiber: 1.2, vitaminC: 2, vitaminB: 10, image: '🥟', cookingMethod: '蒸制', effect: '易消化，饱腹' },
  { id: 90, name: '花卷', category: '主食', calories: 195, protein: 6, fat: 3, carbs: 36, fiber: 1.5, vitaminC: 0, vitaminB: 8, image: '🥐', cookingMethod: '蒸制', effect: '松软可口' },
  
  // 甜点类
  { id: 91, name: '红豆粥', category: '粥', calories: 110, protein: 5, fat: 0.5, carbs: 22, fiber: 4, vitaminC: 0, vitaminB: 15, image: '🥣', cookingMethod: '煮至软烂', effect: '补血，利尿' },
  { id: 92, name: '绿豆汤', category: '甜品', calories: 85, protein: 4, fat: 0.3, carbs: 17, fiber: 3, vitaminC: 2, vitaminB: 12, image: '🥣', cookingMethod: '煮至开花', effect: '清热解毒，消暑' },
  { id: 93, name: '银耳莲子羹', category: '甜品', calories: 95, protein: 2, fat: 0.2, carbs: 20, fiber: 2.5, vitaminC: 1, vitaminB: 8, image: '🥣', cookingMethod: '炖煮至黏稠', effect: '养颜，润肺' },
  
  // 饮品类
  { id: 94, name: '酸奶', category: '饮品', calories: 72, protein: 4, fat: 3, carbs: 9, fiber: 0, vitaminC: 1, vitaminB: 18, image: '🥛', cookingMethod: '直接饮用', effect: '促进消化，补益生菌' },
  { id: 95, name: '绿茶', category: '饮品', calories: 2, protein: 0.2, fat: 0, carbs: 0.5, fiber: 0, vitaminC: 3, vitaminB: 2, image: '🍵', cookingMethod: '冲泡', effect: '抗氧化，提神' },
  { id: 96, name: '柠檬水', category: '饮品', calories: 12, protein: 0.1, fat: 0, carbs: 3, fiber: 0.1, vitaminC: 18, vitaminB: 1, image: '🍋', cookingMethod: '柠檬片泡水', effect: '补充维C，美白' },
  
  // 更多营养餐
  { id: 97, name: '鸡肉沙拉', category: '沙拉', calories: 145, protein: 22, fat: 5, carbs: 6, fiber: 2, vitaminC: 15, vitaminB: 18, image: '🥗', cookingMethod: '鸡肉配蔬菜', effect: '低脂高蛋白，减脂', steps: ['鸡胸肉煮熟或煎熟，撕成丝', '生菜、黄瓜、番茄等蔬菜洗净切块', '将鸡肉丝和蔬菜混合', '淋上沙拉酱或油醋汁拌匀即可'], tips: '鸡胸肉可以提前煮熟冷藏，随用随取；蔬菜要沥干水分，避免稀释调料；沙拉酱要适量，避免热量过高。' },
  { id: 98, name: '蔬菜沙拉', category: '沙拉', calories: 65, protein: 2, fat: 3, carbs: 8, fiber: 3, vitaminC: 35, vitaminB: 8, image: '🥗', cookingMethod: '生菜配调料', effect: '低热量，富含维生素', steps: ['生菜、黄瓜、胡萝卜、紫甘蓝等蔬菜洗净', '蔬菜切丝或切块，装入大碗', '加入少许盐、橄榄油、柠檬汁拌匀', '撒上坚果或奶酪增加口感'], tips: '蔬菜要彻底洗净并沥干水分；调料要现吃现拌，保持蔬菜脆嫩；可以根据个人喜好添加不同蔬菜。' },
  { id: 99, name: '水果沙拉', category: '水果', calories: 85, protein: 1, fat: 2, carbs: 18, fiber: 3, vitaminC: 45, vitaminB: 6, image: '🍇', cookingMethod: '切块混合', effect: '补充维生素，抗氧化', steps: ['苹果、香蕉、橙子、葡萄等水果洗净', '水果去皮切块，装入碗中', '可以加入酸奶或蜂蜜增加风味', '拌匀后即可食用'], tips: '水果要选择成熟新鲜的；切好的水果要尽快食用，避免氧化变色；可以根据季节选择当季水果。' },
  { id: 100, name: '牛排', category: '肉类', calories: 271, protein: 26, fat: 18, carbs: 0, fiber: 0, vitaminC: 0, vitaminB: 35, image: '🥩', cookingMethod: '煎至理想熟度', effect: '高蛋白，补铁', steps: ['牛排室温回温15分钟，用厨房纸吸干表面水分', '在牛排两面撒上盐和黑胡椒腌制10分钟', '平底锅大火加热，放入黄油', '放入牛排，每面煎2-3分钟（根据厚度和喜好调整）', '煎好后静置5分钟再切，让肉汁回流'], tips: '牛排要提前回温，煎制时受热均匀；煎制时不要频繁翻动；静置是关键步骤，可以让牛排更嫩更香。' },
];

/**
 * 获取菜品数据库（包含修改和删除后的数据）
 */
export function getDishDatabase() {
  // 加载自定义菜品
  const customDishes = storage.get(STORAGE_KEYS.CUSTOM_DISHES, [])
  // 加载已删除的系统菜品ID
  const deletedSystemDishes = storage.get(STORAGE_KEYS.DELETED_SYSTEM_DISHES, [])
  // 加载修改过的系统菜品
  const modifiedSystemDishes = storage.get(STORAGE_KEYS.MODIFIED_SYSTEM_DISHES, {})
  
  // 处理系统菜品
  const processedSystemDishes = initialDishDatabase
    .filter(dish => !deletedSystemDishes.includes(dish.id))
    .map(dish => {
      if (modifiedSystemDishes[dish.id]) {
        return modifiedSystemDishes[dish.id]
      }
      return dish
    })
  
  return [...processedSystemDishes, ...customDishes]
}

/**
 * 根据ID查找菜品
 */
export function findDishById(id) {
  const allDishes = getDishDatabase()
  return allDishes.find(dish => dish.id === id)
}

/**
 * 根据名称搜索菜品
 */
export function searchDishByName(name) {
  const allDishes = getDishDatabase()
  return allDishes.filter(dish => 
    dish.name.toLowerCase().includes(name.toLowerCase())
  );
}

/**
 * 根据分类筛选菜品
 */
export function filterDishByCategory(category) {
  const allDishes = getDishDatabase()
  return allDishes.filter(dish => dish.category === category)
}

/**
 * 获取所有分类
 */
export function getAllCategories() {
  const allDishes = getDishDatabase()
  const categories = [...new Set(allDishes.map(dish => dish.category))]
  return categories
}
