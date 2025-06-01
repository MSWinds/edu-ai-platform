import type { CourseReference } from '../types/chat';

interface MockResponse {
  content: string;
  courseRefs?: CourseReference[];
}

// 根据不同的课程内容类型返回不同的模拟回答
export const getMockResponse = (courseRefs?: CourseReference[]): MockResponse => {
  if (!courseRefs || courseRefs.length === 0) {
    return {
      content: "你好！我是AI助教，请问有什么可以帮你的？"
    };
  }

  const ref = courseRefs[0]; // 取第一个引用

  // 处理特殊功能引用
  if (ref.referenceLevel === 'special') {
    switch (ref.specialType) {
      case 'learning-tracking':
        return {
          content: `关于智能学习跟踪功能，我可以帮你：
1. 查看学习进度和完成情况
2. 分析学习效果和薄弱环节
3. 提供个性化的学习建议

你想了解哪个方面？`,
          courseRefs
        };

      case 'quiz':
        return {
          content: `关于智能测验功能，我可以帮你：
1. 生成针对性的练习题
2. 评估你的知识掌握程度
3. 提供详细的答案解析

需要我为你生成一些练习题吗？`,
          courseRefs
        };

      case 'community':
        return {
          content: `关于学习社区功能，我可以帮你：
1. 查看最新的讨论话题
2. 参与学习交流
3. 分享学习心得

你想了解哪个方面？`,
          courseRefs
        };

      default:
        return {
          content: "抱歉，我不太理解这个特殊功能。请尝试重新选择或使用@引用具体的课程内容。"
        };
    }
  }

  // 处理课程内容引用
  switch (ref.contentType) {
    case 'lecture':
      return {
        content: `关于${ref.contentName}，这是一个重要的知识点。在提示词工程中，我们需要特别注意以下几点：
1. 明确性和具体性
2. 上下文的重要性
3. 迭代优化过程

你想了解哪个具体方面？`,
        courseRefs
      };

    case 'assignment':
      return {
        content: `关于${ref.contentName}，这是一个实践性很强的练习。建议你：
1. 先复习相关理论知识
2. 按照步骤逐步完成
3. 注意检查每个优化点

需要我详细解释某个步骤吗？`,
        courseRefs
      };

    case 'resource':
      return {
        content: `关于${ref.contentName}，这是一个很好的学习资源。主要内容包括：
1. 提示词工程的基本原则
2. 常见问题和解决方案
3. 最佳实践案例

你想了解哪个部分？`,
        courseRefs
      };

    case 'quiz':
      return {
        content: `关于${ref.contentName}，这是一个重要的测验。建议你：
1. 仔细阅读题目要求
2. 回顾相关知识点
3. 注意答题时间

需要我为你解释某个题目吗？`,
        courseRefs
      };

    default:
      return {
        content: "抱歉，我不太理解你的问题。请尝试重新提问或使用@引用具体的课程内容。"
      };
  }
};