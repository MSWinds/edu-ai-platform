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
  resources: {
    id: number;
    title: string;
    type: string;
    url: string;
    duration?: string;
  }[];
  sections?: {
    title: string;
    videoUrl: string;
    quiz: {
      question: string;
      options: { text: string; feedback: string }[];
      answer: number;
    }[];
    completed: boolean;
  }[];
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
  totalWeeks: 14,
  instructor: '李教授',
  image: '/images/course-ai.jpg'
};

export const mockUserData: UserData = {
  name: '张三',
  email: 'student@example.com',
  role: 'student',
  profileImage: '/images/profile.jpg',
  progress: 50,
  course: {
    id: 1,
    title: '《人工智能基础导论：AI跨学科工具化思维、伦理设计与应用创想》',
    description: '全面介绍AI基础技术、工具与跨界应用',
    totalWeeks: 14,
    currentWeek: 7,
    overallProgress: 50,
    instructor: '李教授',
    weeks: [
      {
        weekNumber: 1,
        title: '人工智能概论与发展简史',
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
        quiz: { id: 201, title: '人工智能的起源与核心概念-第一章节，课堂知识测验', completed: true, score: 95 },
        resources: [
          { id: 1, title: 'AI发展史PPT', type: 'ppt', url: '#' },
          { id: 2, title: '推荐阅读：AI伦理论文', type: 'pdf', url: '#' }
        ]
      },
      {
        weekNumber: 2,
        title: '人工智能技术基础与分类',
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
        quiz: { id: 202, title: '人工智能的起源与核心概念-第二章节，课堂知识测验', completed: true, score: 88 },
        resources: [
          { id: 3, title: '机器学习算法分类指南', type: 'pdf', url: '#' },
          { id: 4, title: 'AI技术基础讲义', type: 'doc', url: '#' }
        ]
      },
      {
        weekNumber: 3,
        title: '机器学习实践入门（AutoML 无代码体验）',
        completed: true,
        progress: 100,
        summary: '聚焦机器学习实践。介绍国内AutoML平台的概念和作用，让学生使用简体中文界面的AutoML工具（如百度EasyDL或华为ModelArts）训练一个简单模型。实例演示如何通过上传数据、选择算法、一键训练来完成图片分类等任务。培养学生对"无需编程也能训练模型"的直观体验。',
        videos: [
          { id: 305, title: '机器学习实践入门（AutoML 无代码体验）', duration: '35:00', completed: true },
        ],
        assignments: [
          { id: 105, title: 'AutoML平台实际操作', completed: true, score: 90 },
        ],
        quiz: { id: 203, title: '机器学习和深度学习实践和扫盲-第一章节, 课堂知识测验', completed: true },
        resources: [
          { id: 5, title: 'AutoML平台使用指南', type: 'pdf', url: '#' },
          { id: 6, title: '机器学习实践案例集', type: 'doc', url: '#' }
        ]
      },
      {
        weekNumber: 4,
        title: '深度学习与神经网络初步',
        completed: true,
        progress: 100,
        summary: '用形象类比介绍神经网络的基本结构和工作原理（输入-隐藏层-输出，权重调整），解析深度学习为何强大的直观原因。展示一个训练有素的图像识别模型如何识别猫狗等图片，引入卷积神经网络CNN的概念。案例讨论本土公司在视觉领域的应用，如支付宝人脸识别支付。实践让学生使用EasyDL平台构建一个简单图像分类模型，体验深度学习模型训练流程。',
        videos: [
          { id: 307, title: '深度学习与神经网络初步', duration: '38:55', completed: true }
        ],
        assignments: [
          { id: 107, title: '神经网络的基本结构和工作原理', completed: true },
          { id: 108, title: 'EasyDL平台构建一个简单图像分类模型', completed: true }
        ],
        quiz: { id: 204, title: '机器学习和深度学习实践和扫盲-第二章节, 课堂知识测验', completed: true },
        resources: [
          { id: 7, title: '神经网络基础讲义', type: 'pdf', url: '#' },
          { id: 8, title: '深度学习实践指南', type: 'doc', url: '#' }
        ]
      },
      {
        weekNumber: 5,
        title: '计算机视觉应用',
        completed: true,
        progress: 100,
        summary: '聚焦计算机视觉AI。介绍图像分类、目标检测、图像分割等任务定义，展示本土案例如平安城市的车辆识别、医疗影像辅助诊断等。学生实践使用预先准备好的小型数据集，在云端平台（如EasyDL或腾讯云TI-ONE）训练一个目标检测模型，通过拖拽式界面完成模型搭建。理解计算机视觉在实际场景中的效果和局限',
        videos: [
          { id: 309, title: '计算机视觉应用', duration: '44:25', completed: true }
        ],
        assignments: [
          { id: 109, title: '目标检测模型训练', completed: true },
          { id: 110, title: '计算机视觉应用', completed: true }
        ],
        quiz: { id: 205, title: '机器学习和深度学习实践和扫盲-第三章节, 课堂知识测验', completed: true },
        resources: [
          { id: 9, title: '计算机视觉技术手册', type: 'pdf', url: '#' },
          { id: 10, title: '目标检测实践教程', type: 'doc', url: '#' }
        ]
      },
      {
        weekNumber: 6,
        title: '自然语言处理与大语言模型',
        completed: true,
        progress: 100,
        summary: '探讨让计算机"理解"人类语言的技术。介绍自然语言处理（NLP）的主要任务如分词、文本分类、机器翻译、问答系统等，重点讲解大语言模型(LLM)兴起带来的变革。案例分析中文大模型代表如百度文心一言和阿里云通义千问，了解其能力。实践环节让学生亲自使用不同模型的聊天界面，提问常见问题或让其撰写短文，从中体会不同模型的区别。文心一言支持多模态，可以尝试上传一张图片让其识别描述（如时间允许）。整个实践强调中文界面、即时返回结果的交互体验。',
        videos: [
          { id: 311, title: '自然语言处理与大语言模型', duration: '45:00', completed: true },
        ],
        assignments: [
          { id: 111, title: '大语言模型应用作业', completed: true },
        ],
        quiz: { id: 206, title: '大模型入门和应用-第一章节, 课堂知识测验', completed: true },
        resources: [
          { id: 11, title: 'NLP基础教程', type: 'pdf', url: '#' },
          { id: 12, title: '大语言模型应用指南', type: 'doc', url: '#' }
        ]
      },
      {
        weekNumber: 7,
        title: '提示词工程',
        completed: false,
        progress: 0,
        summary: '介绍生成式AI模型（如GPT系列）的工作机制，展示AI创作文本、图像的实例。典型案例：新华社的AI合成主播、腾讯新闻Dreamwriter自动写稿，每天生成海量新闻。学生练习设计提示词，让大模型生成一段新闻稿或文章摘要，从中体会提示工程对输出结果的影响。',
        videos: [
          { id: 313, title: '提示词工程', duration: '39:45', completed: false }
        ],
        assignments: [
          { id: 113, title: '提示词工程作业', completed: false, dueDate: '2023-12-24' },
        ],
        quiz: { id: 207, title: '提示词课堂练习', completed: false, dueDate: '2023-12-29' },
        resources: [
          { id: 13, title: '提示词工程最佳实践', type: 'pdf', url: '#' },
          { id: 14, title: '提示词模板库', type: 'doc', url: '#' },
          { id: 15, title: '提示词工程基础与进阶技巧 - AI播客', type: 'audio', url: '/audio/prompt-engineering-podcast.wav', duration: '20:00' }
        ],
        sections: [
          {
            title: '主题1：什么是提示工程？',
            videoUrl: '/video/topic1_video.mp4',
            quiz: [
              {
                question: '你想让 AI 写一篇约 300 字、语言生动易懂、主题为"人工智能在护理行业中的应用"的短文，并举出一个具体案例。下面哪一个提示（Prompt）最符合提示工程的原则，最有可能一次就得到满意的答案？',
                options: [
                  { text: 'A. "写一篇文章。"', feedback: '过于笼统：没有任何主题、长度、风格或格式要求，属于"含糊提问"。模型不知道你想要什么内容或深度，极易跑题或生成与护理无关的文章。' },
                  { text: 'B. 请写一篇文章，主题是护理。"', feedback: '缺乏关键细节：虽然给出主题"护理"，但仍未说明篇幅、语言风格、是否需要举例等信息，也未指定角色。结果可能篇幅不符或内容泛泛而谈。' },
                  { text: 'C. "你是一名护理信息学专家。请写一篇约 300 字的短文，说明人工智能在护理行业中的应用，并举一个护理工作中使用 AI 的具体案例，语言生动、易于理解，分三段呈现。"', feedback: '最佳提示：① 指定角色（护理信息学专家）保证专业度；② 明确字数（约 300 字）和输出结构（分三段）；③ 给出主题与案例要求；④ 要求语言生动易懂。充分满足"清晰具体、提供上下文、指定角色、指明输出格式"等提示工程原则，因此最可能一次生成高质量答案。' },
                  { text: 'D. """写 300 字，关于护理 AI。"', feedback: '信息不完整：只给了字数和主题关键词，没有说明语言风格、是否举例或结构要求，且未说明模型身份。尽管比 A/B 稍好，但仍缺少足够上下文和格式指令，会导致结果质量不稳定。' }
                ],
                answer: 2
              }
            ],
            completed: false
          },
          {
            title: '主题2：基础提示结构',
            videoUrl: '/video/topic2_video.mp4',
            quiz: [
              {
                question: '以下哪一项最能体现"格式要求（Format）"在结构化提示中的作用？',
                options: [
                  { text: 'A. 指定AI回答时要用律师的身份', feedback: '这个选项属于"角色（Role）"的设定，即让AI以特定身份或视角来回答问题。角色设定可以让回答更贴合专业领域，但它并没有规定答案的呈现形式，所以不属于"格式要求"' },
                  { text: 'B. 让AI用项目符号列出要点，每条不超过20字', feedback: '正确！这就是"格式要求（Format）"的典型例子。你明确告诉AI答案要用项目符号（bullet points）来列出，而且每条要点的字数有具体限制。这种要求可以帮助你直接获得结构清晰、方便使用的输出，减少后期整理的工作量。' },
                  { text: 'C. 要求AI解释某个法律概念', feedback: '这个选项是"指令（Instruction）"，即你在告诉AI需要完成什么具体任务，比如"解释"、"总结"或"分析"。虽然指令很重要，但它没有涉及答案的具体呈现方式，所以不属于"格式要求"。' },
                  { text: 'D. 让AI用幽默的语气回答', feedback: '这个选项涉及的是"表达风格"或"语气"，有时可以作为格式要求的补充，但它本质上是对回答语气的规定，而不是对答案结构或输出形式的要求。格式要求通常更关注答案是以列表、表格、段落等形式输出。' }
                ],
                answer: 1
              }
            ],
            completed: false
          },
          {
            title: '主题3：少样本学习（Few-Shot Learning）',
            videoUrl: '/video/topic3_video.mp4',
            quiz: [
              {
                question: '在以下哪种情况下，使用"少样本提示（Few-shot Prompting）"最能显著提升AI的输出效果？',
                options: [
                  { text: 'A. 你需要AI快速回答一个事实性问题，如："中国的首都是哪里？"', feedback: '这个任务非常简单且标准化，通常使用零样本提示（zero-shot prompting）就能得到准确答案。不需要提供示例来引导模型输出格式或风格。' },
                  { text: 'B. 你想让AI用特定格式写一份会议纪要，例如包括时间、地点、参与人和总结要点', feedback: '正确！这是一个非常适合使用少样本提示的场景。通过提供1-3个格式规范的会议纪要示例，可以让AI明确了解你期望的输出结构和内容要素，从而生成更符合预期的回答。' },
                  { text: 'C. 你希望AI生成一段随机的小说情节，没有具体风格或结构要求', feedback: '如果对输出没有具体格式或风格要求，那么提供示例可能反而会限制AI的创造力，或者导致其偏离自由发挥的方向。这种情况下，零样本提示通常更适合。' },
                  { text: 'D. 你要求AI翻译一段标准英文新闻句子成中文', feedback: '翻译属于高度结构化任务，尤其对于常见语言对（如英译中），AI已经训练得非常成熟。在这种情况下，即使不提供示例，也能获得高质量结果，因此few-shot提示并非必要。' }
                ],
                answer: 1
              }
            ],
            completed: false
          },
          {
            title: '主题4：链式思考提示（Chain-of-Thought）',
            videoUrl: '/video/topic4_video.mp4',
            quiz: [
              {
                question: '以下哪种场景最适合使用Chain-of-Thought（思维链）提示？',
                options: [
                  { text: 'A. 让AI直接回答"中国的首都是哪个城市？"', feedback: '这是一个简单的事实性问题，不需要多步推理。AI可以直接给出答案（北京），使用思维链提示反而冗余。' },
                  { text: 'B. 让AI写一首关于春天的诗', feedback: '诗歌创作属于创意性任务，需要自由发挥而非逻辑推理。思维链提示更适合需要结构化分析的场景。' },
                  { text: 'C. 让AI分析患者发烧、咳嗽、呼吸急促的可能病因，并给出诊断依据', feedback: '正确！医学诊断需要综合症状、排除可能性并逐步推理，这正是思维链提示的典型应用场景。通过分步骤分析症状（如发热→感染可能，咳嗽→呼吸道问题，呼吸急促→肺部受累），AI的结论会更可靠且可验证。' },
                  { text: 'D. 让AI将100条用户评论分类为"好评"或"差评"', feedback: '分类任务通常不需要复杂推理，直接使用指令（如"请分类以下评论"）或简单示例即可。思维链提示在此场景中价值有限。' }
                ],
                answer: 2
              }
            ],
            completed: false
          },
          {
            title: '主题5：提示迭代（Prompt Iteration）',
            videoUrl: '/video/topic5_video.mp4',
            quiz: [
              {
                question: '在使用AI写作或问答时，为什么"提示迭代（Iterative Prompting）"是一种非常重要的技巧？',
                options: [
                  { text: 'A.  因为AI每次的回答都是完全随机的，必须多试几次才有可能碰到好答案', feedback: 'AI的回答并不是完全随机的，而是根据你的提示和上下文生成的。多次尝试的意义在于优化提示，而不是"碰运气"' },
                  { text: 'B. 因为通过多轮修改和反馈，可以逐步优化提示，让AI输出更接近你的真实需求', feedback: '正确！提示迭代的核心就是通过反复调整和反馈，让AI的回答越来越符合你的要求。这是高效使用AI的关键方法。' },
                  { text: 'C. 因为AI只能理解非常简单的指令，复杂任务无法完成', feedback: 'AI可以完成复杂任务，只要你的提示足够清晰具体。迭代的作用是让复杂任务的提示越来越完善.' },
                  { text: 'D. 因为每次修改提示都会让AI忘记之前的内容', feedback: '实际上，每次你修改提示，AI会根据新提示重新生成答案。迭代的价值在于你能不断补充和调整需求，而不是让AI"遗忘"' }
                ],
                answer: 1
              }
            ],
            completed: false
          }
          
        ]
      },
      {
        weekNumber: 8,
        title: '知识表示与RAG 工作流',
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
        quiz: { id: 208, title: '大模型入门和应用-第三章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' },
        resources: []
      },
      {
        weekNumber: 9,
        title: '复杂智能体',
        completed: false,
        progress: 0,
        summary: '案例分析Doze或者Dify上成熟的RAG 工作流和智能体，理解无代码工作流和智能体的 意图-技能-发布全流程',
        videos: [
          { id: 317, title: '复杂智能体', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 117, title: 'Coze-应用', completed: false },
        ],
        quiz: { id: 209, title: '大模型入门和应用-第四章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' },
        resources: []
      },
      {
        weekNumber: 10,
        title: '跨学科AI应用案例，其一，艺术创意应用',
        completed: false,
        progress: 0,
        summary: '探索AI在艺术设计领域的创新应用。简单介绍生成对抗网络，扩散模型等技术如何用于图像生成、风格迁移，分享本土化案例（如百度"文心一格"AI作画平台，以及国内音乐AI创作）。学生将使用文心一格等中文AI绘画工具在线创作：输入描述让AI生成一幅画作，并与同学分享结果。讨论AI创作对传统艺术的冲击与融合。',
        videos: [
          { id: 319, title: '跨学科AI应用案例，其一，艺术创意应用', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 119, title: '使用文心一格等中文AI绘画工具在线创作', completed: false },
        ],
        quiz: { id: 210, title: '大模型入门和应用-第五章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' },
        resources: []
      },
      {
        weekNumber: 11,
        title: '跨学科AI应用案例，其二，理科商科应用',
        completed: false,
        progress: 0,
        summary: '本周通过多个行业案例 展示AI如何赋能各领域。例如：司法领域的智能助手（如百度法行宝，提供法律问答和文书起草）、医疗领域的疾病预测、传媒中的个性化内容推荐等。教师重点讲解学生所属专业相关的案例，加深理解。实践环节按兴趣分组，选择一个领域案例进行情景模拟：如让法律专业学生用AI法律助手解答简单法律问题，新闻专业学生用AI写作辅助改写稿件等。',
        videos: [
          { id: 321, title: '跨学科AI应用案例，其二，理科商科应用', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 121, title: '使用AI法律助手解答简单法律问题', completed: false },
        ],
        quiz: { id: 211, title: '大模型入门和应用-第六章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' },
        resources: []
      },
      {
        weekNumber: 12,
        title: '人工智能的社会影响与伦理',
        completed: false,
        progress: 0,
        summary: '引导学生思考AI技术带来的社会问题和伦理挑战。内容涵盖AI偏见与歧视风险、隐私安全、就业影响以及我国最新出台的AI治理政策（如生成式AI管理办法）。结合实例（如Deepfake舆论事件、自动驾驶伦理难题）展开讨论。学生通过分组辩论或问卷调查，加深对"AI向善"理念的认识。小测验检验学生对AI伦理准则的理解。',
        videos: [
          { id: 323, title: '人工智能的社会影响与伦理', duration: '45:15', completed: false }
        ],
        assignments: [
          { id: 123, title: 'AI伦理与创新作业', completed: false },
        ],
        quiz: { id: 212, title: '伦理与创新, 课堂知识测验', completed: false, dueDate: '2023-12-31' },
        resources: []
      },
      {
        weekNumber: 13,
        title: '复习',
        completed: false,
        progress: 0,
        summary: '本周进入综合复习阶段：教师将归纳本学期核心概念与典型案例，梳理大模型原理、提示词设计、跨学科应用等关键知识点。同学们可根据个人兴趣或职业方向，自主选择之前的案例进行回顾与讨论，并完成模拟测验，为期末考试打好基础。',
        videos: [
          { id: 324, title: '期末复习要点与答题策略', duration: '30:00', completed: false }
        ],
        assignments: [
          { id: 124, title: '整理个人复习笔记并提交思维导图', completed: false },
        ],
        quiz: { id: 213, title: '期末模拟测试', completed: false, dueDate: '2023-12-31' },
        resources: []
      },
      {
        weekNumber: 14,
        title: '期末考试',
        completed: false,
        progress: 0,
        summary: '本周进行期末考核：涵盖大模型基础、行业应用分析与实操技能。考试形式为线上闭卷测验与案例分析，重点考察对课程知识的综合运用能力。请同学按学校考试安排准时参加，并注意诚信应考。',
        videos: [
          { id: 325, title: '参加期末线上考试', duration: '45:15', completed: false }
        ],
        assignments: [
        
        ],
        quiz: { id: 211, title: '大模型入门和应用-第六章节, 课堂知识测验', completed: false, dueDate: '2023-12-31' },
        resources: []
      }
    ]
  }
}; 