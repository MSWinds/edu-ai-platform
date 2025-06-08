import { NextRequest, NextResponse } from 'next/server';
import { createDashScopeAPI } from '../lib/dashscope';

export async function POST(request: NextRequest) {
  try {
    const { memoryId, testMessage } = await request.json();
    const api = createDashScopeAPI();
    const response = await api.callApplication({
      prompt: testMessage || '请结合知识库内容回答：什么是人工智能？',
      stream: false,
      memory_id: memoryId,
      has_thoughts: true,
      enable_system_time: true,
      rag_options: {
        pipeline_ids: (process.env.DASHSCOPE_PIPELINE_ID || "9z00mkhmz1").split(',').map(id => id.trim()),
      },
    });
    // 返回完整原始响应，便于分析
    return NextResponse.json({
      status_code: response.status_code,
      request_id: response.request_id,
      output: response.output,
      raw: response
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 