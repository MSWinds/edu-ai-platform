import { NextRequest, NextResponse } from 'next/server';
import { createDashScopeAPI, formatCourseReferences } from '../lib/dashscope';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, courseReferences, memoryId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 创建DashScope API实例
    const api = createDashScopeAPI();

    // 格式化上下文
    const contextStr = formatCourseReferences(courseReferences);
    const finalPrompt = `${contextStr}${message}`;

    // 使用传入的memoryId或默认的memoryId
    const finalMemoryId = memoryId || process.env.DASHSCOPE_DEFAULT_MEMORY_ID;
    
    // 调用AI API
    const response = await api.callApplication({
      prompt: finalPrompt,
      stream: false,
      memory_id: finalMemoryId,
      has_thoughts: true,
      enable_system_time: true,
      rag_options: {
        pipeline_ids: [process.env.DASHSCOPE_PIPELINE_ID || "gqhpyjb6l1"],  // 从环境变量读取或使用默认值
      },
    });

    // 检查响应状态
    if (response.status_code !== 200) {
      console.error('DashScope API error:', response);
      return NextResponse.json(
        { error: response.message || 'AI service error' },
        { status: 500 }
      );
    }

    // 返回AI回复，包含文档引用等完整信息
    return NextResponse.json({
      content: response.output.text || '抱歉，我无法理解您的问题。',
      request_id: response.request_id,
      doc_references: response.output.doc_references || [],
      model: response.usage?.models?.[0]?.model_id,
      usage: {
        inputTokens: response.usage?.models?.[0]?.input_tokens,
        outputTokens: response.usage?.models?.[0]?.output_tokens,
      },
    });

  } catch (error) {
    console.error('AI Assistant API error:', error);
    
    // 处理不同类型的错误
    if (error instanceof Error) {
      if (error.message.includes('DASHSCOPE_API_KEY')) {
        return NextResponse.json(
          { error: '服务配置错误，请联系管理员' },
          { status: 500 }
        );
      }
      if (error.message.includes('DASHSCOPE_APP_ID')) {
        return NextResponse.json(
          { error: '服务配置错误，请联系管理员' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: '服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
} 