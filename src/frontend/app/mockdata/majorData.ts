// 张家界学院专业数据配置
export interface Major {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface MajorCategory {
  name: string;
  color: string;
  icon: string;
  majors: Major[];
}

// 张家界学院专业分类数据
export const majorCategories: Record<string, MajorCategory> = {
  'business': {
    name: '经济管理类',
    color: '#10B981',
    icon: '💼',
    majors: [
      { id: 'economics', name: '经济学', description: '研究经济运行规律和资源配置', keywords: ['宏观经济', '微观经济', '金融', '投资'] },
      { id: 'international_trade', name: '国际经济与贸易', description: '国际商务和贸易实务', keywords: ['国际贸易', '跨境电商', '外汇', '海关'] },
      { id: 'business_management', name: '工商管理', description: '企业管理和商业运营', keywords: ['管理学', '战略管理', '人力资源', '组织行为'] },
      { id: 'marketing', name: '市场营销', description: '市场分析和营销策略', keywords: ['品牌管理', '消费者行为', '数字营销', '市场调研'] },
      { id: 'accounting', name: '会计学', description: '财务管理和会计核算', keywords: ['财务报表', '审计', '税务', '成本管理'] },
      { id: 'logistics', name: '物流管理', description: '供应链和物流优化', keywords: ['供应链', '仓储管理', '运输', '采购'] },
      { id: 'tourism', name: '旅游管理', description: '旅游业管理和服务', keywords: ['旅游规划', '酒店管理', '景区管理', '文旅'] },
      { id: 'ecommerce', name: '电子商务', description: '数字商务和网络营销', keywords: ['网络营销', '电商平台', '数据分析', '用户体验'] }
    ]
  },
  'engineering': {
    name: '工学与信息技术类',
    color: '#3B82F6',
    icon: '⚙️',
    majors: [
      { id: 'electronic_engineering', name: '电子信息工程', description: '电子技术和信息处理', keywords: ['电路设计', '信号处理', '嵌入式', 'FPGA'] },
      { id: 'communication_engineering', name: '通信工程', description: '通信系统和网络技术', keywords: ['无线通信', '网络协议', '5G', '物联网'] },
      { id: 'computer_science', name: '计算机科学与技术', description: '软硬件开发和系统设计', keywords: ['编程', '算法', '数据结构', '操作系统'] },
      { id: 'software_engineering', name: '软件工程', description: '软件开发和项目管理', keywords: ['软件开发', '项目管理', '测试', '架构设计'] },
      { id: 'artificial_intelligence', name: '人工智能', description: '机器学习和智能系统', keywords: ['机器学习', '深度学习', '神经网络', '数据挖掘'] },
      { id: 'civil_engineering', name: '土木工程', description: '建筑结构和工程设计', keywords: ['结构设计', '施工管理', 'CAD', '工程测量'] }
    ]
  },
  'medical': {
    name: '医学与健康类',
    color: '#EF4444',
    icon: '🏥',
    majors: [
      { id: 'nursing', name: '护理学', description: '临床护理和健康管理', keywords: ['临床护理', '基础护理', '健康教育', '护理管理'] },
      { id: 'medical_imaging', name: '医学影像技术', description: '医学成像和诊断技术', keywords: ['X光', 'CT', 'MRI', '超声'] },
      { id: 'midwifery', name: '助产学', description: '产科护理和母婴健康', keywords: ['产科护理', '母婴健康', '助产技术', '妇幼保健'] }
    ]
  },
  'literature': {
    name: '文学与语言类',
    color: '#8B5CF6',
    icon: '📚',
    majors: [
      { id: 'chinese_literature', name: '汉语言文学', description: '中文写作和文学研究', keywords: ['古代文学', '现代文学', '写作', '语言学'] },
      { id: 'english', name: '英语', description: '英语语言和跨文化交流', keywords: ['英语语言', '翻译', '跨文化交流', '商务英语'] },
      { id: 'japanese', name: '日语', description: '日语语言和日本文化', keywords: ['日语语言', '日本文化', '日语翻译', '商务日语'] }
    ]
  },
  'law_education': {
    name: '法学与教育类',
    color: '#F59E0B',
    icon: '⚖️',
    majors: [
      { id: 'law', name: '法学', description: '法律理论和司法实务', keywords: ['民法', '刑法', '行政法', '法律实务'] },
      { id: 'intellectual_property', name: '知识产权', description: '知识产权保护和管理', keywords: ['专利', '商标', '版权', '知识产权法'] },
      { id: 'physical_education', name: '体育教育', description: '体育教学和运动训练', keywords: ['体育教学', '运动训练', '体育管理', '健身指导'] }
    ]
  },
  'arts': {
    name: '艺术与设计类',
    color: '#EC4899',
    icon: '🎨',
    majors: [
      { id: 'music', name: '音乐学', description: '音乐理论和表演艺术', keywords: ['音乐理论', '声乐', '器乐', '音乐教育'] },
      { id: 'dance', name: '舞蹈学', description: '舞蹈编创和表演', keywords: ['舞蹈编创', '舞蹈表演', '舞蹈教育', '舞蹈治疗'] },
      { id: 'fine_arts', name: '美术学', description: '绘画创作和艺术理论', keywords: ['绘画', '雕塑', '艺术史', '美术教育'] },
      { id: 'visual_design', name: '视觉传达设计', description: '平面设计和视觉传达', keywords: ['平面设计', '品牌设计', 'UI设计', '包装设计'] },
      { id: 'environmental_design', name: '环境设计', description: '空间设计和环境规划', keywords: ['室内设计', '景观设计', '展示设计', '环境规划'] }
    ]
  }
};

// 专业偏好类型
export const majorPreferences = {
  'same': { label: '同专业优先', description: '主要面向同专业同学', color: '#10B981' },
  'related': { label: '相关专业', description: '欢迎相关专业同学', color: '#3B82F6' },
  'cross': { label: '跨专业合作', description: '鼓励不同专业交流', color: '#8B5CF6' },
  'any': { label: '不限专业', description: '所有专业都欢迎', color: '#6B7280' }
};

// 学习水平
export const studyLevels = {
  'beginner': { label: '初学者', description: '刚开始学习，需要基础指导', color: '#10B981' },
  'intermediate': { label: '进阶者', description: '有一定基础，想要深入学习', color: '#F59E0B' },
  'advanced': { label: '高级者', description: '基础扎实，追求专业精进', color: '#EF4444' }
};

// 协作类型
export const collaborationTypes = {
  'homework': { label: '作业互助', description: '一起完成课业作业', icon: '📝' },
  'project': { label: '项目合作', description: '共同开展实践项目', icon: '🚀' },
  'exam': { label: '考试复习', description: '一起备考和复习', icon: '📖' },
  'discussion': { label: '学术讨论', description: '深入探讨专业问题', icon: '💬' },
  'competition': { label: '竞赛组队', description: '参加学科竞赛', icon: '🏆' },
  'research': { label: '学术研究', description: '开展学术研究', icon: '🔬' }
};

// 工具函数：根据专业ID获取专业信息
export function getMajorById(majorId: string): (Major & { category: string; categoryColor: string }) | null {
  for (const [categoryKey, category] of Object.entries(majorCategories)) {
    const major = category.majors.find(m => m.id === majorId);
    if (major) {
      return {
        ...major,
        category: category.name,
        categoryColor: category.color
      };
    }
  }
  return null;
}

// 工具函数：获取相关专业推荐
export function getRelatedMajors(majorId: string, limit: number = 5): Major[] {
  const currentMajor = getMajorById(majorId);
  if (!currentMajor) return [];

  // 先从同类别找相关专业
  const sameCategoryMajors: Major[] = [];
  const otherMajors: Major[] = [];

  for (const [categoryKey, category] of Object.entries(majorCategories)) {
    if (category.name === currentMajor.category) {
      sameCategoryMajors.push(...category.majors.filter(m => m.id !== majorId));
    } else {
      otherMajors.push(...category.majors);
    }
  }

  // 基于关键词相似度排序（简化版）
  const scoredMajors = [...sameCategoryMajors, ...otherMajors].map(major => {
    const commonKeywords = major.keywords.filter(k => 
      currentMajor.keywords.some(ck => ck.includes(k) || k.includes(ck))
    );
    return {
      ...major,
      score: commonKeywords.length + (sameCategoryMajors.includes(major) ? 2 : 0)
    };
  });

  return scoredMajors
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...major }) => major);
} 