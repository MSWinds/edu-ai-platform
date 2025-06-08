# AI助教功能集成

## 概述

本模块已成功集成阿里云百炼DashScope API，实现了真实的AI对话功能，支持流式响应和长期记忆。

## 🚀 功能特性

### ✅ 已完成功能
- **真实AI对话** - 替换了mock数据，使用阿里云百炼API
- **流式响应** - 支持打字机效果的实时回复
- **课程上下文** - @引用课程内容功能完善
- **长期记忆** - 支持用户画像和上下文记忆（通过Memory ID）
- **错误处理** - 完善的错误提示和重试机制
- **用户体验** - 加载状态、自动滚动、重试按钮

### 🎯 技术架构
- **API层** - `/api/ai-assistant-stream`
- **状态管理** - useChat hook 和 chatStore (Zustand)
- **组件设计** - MessageList, ChatInput, CourseSelector
- **类型安全** - 完整的TypeScript类型定义

## 📋 使用配置

### 1. 环境变量配置

在项目根目录创建 `.env.local` 文件：

```bash
# 必需配置
DASHSCOPE_API_KEY=sk-your-api-key-here
DASHSCOPE_APP_ID=your-app-id-here

# 可选配置
DASHSCOPE_DEFAULT_MEMORY_ID=your-memory-id-here
```

### 2. 获取API密钥和应用ID

1. 登录 [阿里云百炼控制台](https://bailian.console.aliyun.com/)
2. 创建智能体应用，获取 `APP_ID`
3. 在API密钥管理中获取 `API_KEY`
4. （可选）创建长期记忆体，获取 `MEMORY_ID`

### 3. 启动应用

```bash
cd src/frontend
npm run dev
```

## 🔄 API接口说明

### 对话 API
```
POST /api/ai-assistant-stream
Content-Type: application/json

{
  "message": "用户问题",
  "courseReferences": [/* 课程引用 */],
  "memoryId": "memory-id" // 可选
}
```

## 💡 使用示例

### Hook使用
```typescript
import { useChat } from './hooks/useChat';

function MyComponent() {
  const { messages, sendMessage, isLoading } = useChat();
  
  const handleSend = (message: string, courseRefs: CourseReference[]) => {
    sendMessage(message, courseRefs, true); // 启用流式响应
  };
}
```

### Store使用
```typescript
import { useChatStore } from './store/chatStore';

function MyComponent() {
  const { messages, sendMessage } = useChatStore();
}
```

## 🔧 自定义配置

### 记忆功能
- 每个用户会话可以使用独立的Memory ID
- 支持跨会话的上下文记忆
- 自动提取用户偏好和学习习惯

### 课程上下文
- 通过@符号引用课程内容
- 自动格式化为AI可理解的上下文
- 支持多种内容类型（讲座、作业、资源）

### 错误处理
- 网络错误自动重试
- 用户友好的错误提示
- 支持手动重试失败的消息

## 📁 文件结构

```
ai_assistant/
├── components/
│   ├── ChatInput.tsx      # 输入框组件
│   ├── MessageList.tsx    # 消息列表组件
│   └── CourseSelector.tsx # 课程选择器
├── hooks/
│   └── useChat.ts         # 聊天Hook
├── store/
│   └── chatStore.ts       # Zustand状态管理
├── types/
│   └── chat.ts           # 类型定义
├── mock/
│   └── responses.ts      # Mock数据（已替换）
└── page.tsx              # 主页面组件
```

## 🎮 高级功能

### 流式响应控制
```typescript
// 启用流式响应（默认）
sendMessage(message, courseRefs, true);

// 禁用流式响应
sendMessage(message, courseRefs, false);
```

### 记忆体管理
```typescript
// 使用特定记忆体
sendMessage(message, courseRefs, true, 'specific-memory-id');

// 使用默认记忆体
sendMessage(message, courseRefs, true);
```

## 🚨 注意事项

1. **API密钥安全** - 确保`.env.local`不被提交到版本控制
2. **错误处理** - API调用失败时会显示友好的错误信息
3. **性能优化** - 大量消息时建议实现虚拟滚动
4. **内存管理** - 长对话会话建议定期清理消息历史

## 🔮 后续规划

- [ ] 支持文件上传和图片分析
- [ ] 多模态对话（语音、图片）
- [ ] 更细粒度的记忆体管理
- [ ] 对话导出和分享功能
- [ ] 智能推荐相关课程内容 