// 定义类型
interface Video {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Assignment {
  id: number;
  title: string;
  completed: boolean;
  score?: number;
  dueDate?: string;
}

interface Quiz {
  id: number;
  title: string;
  completed: boolean;
  score?: number;
  dueDate?: string;
}

interface Week {
  weekNumber: number;
  title: string;
  completed: boolean;
  progress: number;
  summary: string;
  videos: Video[];
  assignments: Assignment[];
  quiz: Quiz;
}

interface Course {
  id: number;
  title: string;
  description: string;
  totalWeeks: number;
  currentWeek: number;
  overallProgress: number;
  instructor: string;
  weeks: Week[];
}

interface UserData {
  name: string;
  email: string;
  role: string;
  profileImage: string;
  progress: number;
  course: Course;
}

export const mockCourseData = {
  id: 1,
  title: '《人工智能基础导论：AI跨学科工具化思维、伦理设计与应用创想》',
  description: '全面介绍AI基础技术、工具与跨界应用',
  totalWeeks: 12,
  instructor: '李教授',
  image: '/images/course-ai.jpg'
};

export const mockUserData: UserData = {
  name: '张三',
  email: 'student@example.com',
  role: 'student',
  profileImage: '/images/profile.jpg',
  progress: 35,
  course: {
    id: 1,
    title: '《人工智能基础导论：AI跨学科工具化思维、伦理设计与应用创想》',
    description: '全面介绍AI基础技术、工具与跨界应用',
    totalWeeks: 12,
    currentWeek: 3,
    overallProgress: 35,
    instructor: '李教授',
    weeks: [
      {
        weekNumber: 1,
        title: '人工智能的起源与核心概念-第一章节',
        completed: true,
        progress: 100,
        summary: '介绍AI的定义与范围，回顾AI从诞生到现代的主要里程碑事件（如图灵测试、专家系统、机器学习兴起、深度学习浪潮等），讨论AlphaGo人机大战等社会关注案例，引出AI对各学科的影响。本周为课程导入，明确学习目标和安排',
        videos: [
          { id: 301, title: '人工智能概论与发展简史', duration: '45:00', completed: true },
        ],
        assignments: [
          { id: 101, title: '人工智能概念理解', completed: true, score: 92 },
          { id: 102, title: 'AI发展历史时间线', completed: true, score: 88 }
        ],
        quiz: { id: 201, title: '人工智能的起源与核心概念-第一章节，课堂知识测验', completed: true, score: 95 }
      },
      {
        weekNumber: 2,
        title: '人工智能的起源与核心概念-第二章节',
        completed: true,
        progress: 100,
        summary: '阐述基于规则AI 与基于学习AI 的区别，介绍机器学习基本流程（数据、模型、训练、验证）和常见算法类型（监督、无监督、强化学习）。通过直观演示解释算法如何从数据中学习的原理，让学生理解AI与传统程序的区别。',
        videos: [
          { id: 303, title: '人工智能技术基础与分类', duration: '45:10', completed: true },
        ],
        assignments: [
          { id: 103, title: '机器学习基本流程', completed: true, score: 90 },
          { id: 104, title: '常见算法类型', completed: true, score: 85 }
        ],
        quiz: { id: 202, title: '人工智能的起源与核心概念-第二章节，课堂知识测验', completed: true, score: 88 }
      },
      {
        weekNumber: 3,
        title: '机器学习和深度学习实践和扫盲-第一章节',
        completed: false,
        progress: 65,
        summary: '聚焦机器学习实践。介绍国内AutoML平台的概念和作用，让学生使用简体中文界面的AutoML工具（如百度EasyDL或华为ModelArts）训练一个简单模型。实例演示如何通过上传数据、选择算法、一键训练来完成图片分类等任务。培养学生对"无需编程也能训练模型"的直观体验。',
        videos: [
          { id: 305, title: '机器学习实践入门（AutoML 无代码体验）', duration: '35:00', completed: true },
        ],
        assignments: [
          { id: 105, title: 'AutoML平台实际操作', completed: false, score: 82, dueDate: '2023-11-25' },
        ],
        quiz: { id: 203, title: '机器学习和深度学习实践和扫盲-第一章节, 课堂知识测验', completed: false, dueDate: '2023-11-23' }
      },
      {
        weekNumber: 4,
        title: '机器学习和深度学习实践和扫盲-第二章节',
        completed: false,
        progress: 0,
        summary: '用形象类比介绍神经网络的基本结构和工作原理（输入-隐藏层-输出，权重调整），解析深度学习为何强大的直观原因。展示一个训练有素的图像识别模型如何识别猫狗等图片，引入卷积神经网络CNN的概念。案例讨论本土公司在视觉领域的应用，如支付宝人脸识别支付。实践让学生使用EasyDL平台构建一个简单图像分类模型，体验深度学习模型训练流程。',
        videos: [
          { id: 307, title: '深度学习与神经网络初步', duration: '38:55', completed: false }
        ],
        assignments: [
          { id: 107, title: '神经网络的基本结构和工作原理', completed: false, dueDate: '2023-12-02' },
          { id: 108, title: 'EasyDL平台构建一个简单图像分类模型', completed: false, dueDate: '2023-12-05' }
        ],
        quiz: { id: 204, title: '机器学习和深度学习实践和扫盲-第二章节, 课堂知识测验', completed: false, dueDate: '2023-12-07' }
      },
      {
        weekNumber: 5,
        title: '机器学习和深度学习实践和扫盲-第三章节',
        completed: false,
        progress: 0,
        summary: '聚焦计算机视觉AI。介绍图像分类、目标检测、图像分割等任务定义，展示本土案例如平安城市的车辆识别、医疗影像辅助诊断等。学生实践使用预先准备好的小型数据集，在云端平台（如EasyDL或腾讯云TI-ONE）训练一个目标检测模型，通过拖拽式界面完成模型搭建。理解计算机视觉在实际场景中的效果和局限',
        videos: [
          { id: 309, title: '计算机视觉应用', duration: '44:25', completed: false }
        ],
        assignments: [
          { id: 109, title: '目标检测模型训练', completed: false, dueDate: '2023-12-10' },
          { id: 110, title: '计算机视觉应用', completed: false, dueDate: '2023-12-12' }
        ],
        quiz: { id: 205, title: '机器学习和深度学习实践和扫盲-第三章节, 课堂知识测验', completed: false, dueDate: '2023-12-14' }
      },
      {
        weekNumber: 6,
        title: '大模型入门和应用-第一章节',
        completed: false,
        progress: 0,
        summary: '探讨让计算机"理解"人类语言的技术。介绍自然语言处理（NLP）的主要任务如分词、文本分类、机器翻译、问答系统等，重点讲解大语言模型(LLM)兴起带来的变革。案例分析中文大模型代表如百度文心一言和阿里云通义千问，了解其能力。实践环节让学生亲自使用不同模型的聊天界面，提问常见问题或让其撰写短文，从中体会不同模型的区别。文心一言支持多模态，可以尝试上传一张图片让其识别描述（如时间允许）。整个实践强调中文界面、即时返回结果的交互体验。',
        videos: [
          { id: 311, title: '自然语言处理与大语言模型', duration: '45:00', completed: false },
        ],
        assignments: [
          { id: 111, title: '大语言模型应用作业', completed: false, dueDate: '2023-12-17' },
        ],
        quiz: { id: 206, title: '大模型入门和应用-第一章节, 课堂知识测验', completed: false, dueDate: '2023-12-22' }
      },
      {
        weekNumber: 7,
        title: '大模型入门和应用-第二章节',
        completed: false,
        progress: 0,
        summary: '介绍生成式AI模型（如GPT系列）的工作机制，展示AI创作文本、图像的实例。典型案例：新华社的AI合成主播、腾讯新闻Dreamwriter自动写稿，每天生成海量新闻。学生练习设计提示词，让大模型生成一段新闻稿或文章摘要，从中体会提示工程对输出结果的影响。',
        videos: [
          { id: 313, title: '提示词工程', duration: '39:45', completed: false }
        ],
        assignments: [
          { id: 113, title: '提示词工程作业', completed: false, dueDate: '2023-12-24' },
        ],
        quiz: { id: 207, title: '大模型入门和应用-第二章节, 课堂知识测验', completed: false, dueDate: '2023-12-29' }
      },
      {
        weekNumber: 8,
        title: '大模型入门和应用-第三章节',
        completed: false,
        progress: 0,
        summary: '讨论AI如何储存和运用知识以及生成内容的能力。简单介绍数据库，RAG和知识图谱和概念。了解向量检索和知识注入对项目的赋能。实践环节让学生亲自使用Doze或者Dify，通过拖拽式界面完成简单流程搭建。',
        videos: [
          { id: 315, title: '知识表示与RAG 工作流', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 115, title: 'Rag工作流', completed: false },
          { id: 116, title: '知识库结构', completed: false }
        ],
        quiz: { id: 208, title: '大模型入门和应用-第三章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' }
      },
      {
        weekNumber: 9,
        title: '大模型入门和应用-第四章节',
        completed: false,
        progress: 0,
        summary: '案例分析Doze或者Dify上成熟的RAG 工作流和智能体，理解无代码工作流和智能体的 意图-技能-发布全流程',
        videos: [
          { id: 317, title: '复杂智能体', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 117, title: 'Coze-应用', completed: false },
        ],
        quiz: { id: 209, title: '大模型入门和应用-第四章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' }
      },
      {
        weekNumber: 10,
        title: '大模型入门和应用-第五章节',
        completed: false,
        progress: 0,
        summary: '探索AI在艺术设计领域的创新应用。简单介绍生成对抗网络，扩散模型等技术如何用于图像生成、风格迁移，分享本土化案例（如百度"文心一格"AI作画平台，以及国内音乐AI创作）。学生将使用文心一格等中文AI绘画工具在线创作：输入描述让AI生成一幅画作，并与同学分享结果。讨论AI创作对传统艺术的冲击与融合。',
        videos: [
          { id: 319, title: '跨学科AI应用案例，其一，艺术创意应用', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 119, title: '使用文心一格等中文AI绘画工具在线创作', completed: false },
        ],
        quiz: { id: 210, title: '大模型入门和应用-第五章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' }
      },
      {
        weekNumber: 11,
        title: '大模型入门和应用-第六章节',
        completed: false,
        progress: 0,
        summary: '本周通过多个行业案例 展示AI如何赋能各领域。例如：司法领域的智能助手（如百度法行宝，提供法律问答和文书起草）、医疗领域的疾病预测、传媒中的个性化内容推荐等。教师重点讲解学生所属专业相关的案例，加深理解。实践环节按兴趣分组，选择一个领域案例进行情景模拟：如让法律专业学生用AI法律助手解答简单法律问题，新闻专业学生用AI写作辅助改写稿件等。',
        videos: [
          { id: 321, title: '跨学科AI应用案例，其二，理科商科应用', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 121, title: '使用AI法律助手解答简单法律问题', completed: false },
        ],
        quiz: { id: 211, title: '大模型入门和应用-第六章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' }
      },
      {
        weekNumber: 12,
        title: '伦理与创新',
        completed: false,
        progress: 0,
        summary: '引导学生思考AI技术带来的社会问题和伦理挑战。内容涵盖AI偏见与歧视风险、隐私安全、就业影响以及我国最新出台的AI治理政策（如生成式AI管理办法）。结合实例（如Deepfake舆论事件、自动驾驶伦理难题）展开讨论。学生通过分组辩论或问卷调查，加深对"AI向善"理念的认识。小测验检验学生对AI伦理准则的理解。',
        videos: [
          { id: 323, title: '人工智能的社会影响与伦理', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 123, title: 'AI伦理与创新作业', completed: false },
        ],
        quiz: { id: 212, title: '伦理与创新, 课堂知识测验', completed: false, dueDate: '2023-12-31' }
      }
    ]
  }
}; 