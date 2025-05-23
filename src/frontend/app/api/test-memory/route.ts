import { NextRequest, NextResponse } from 'next/server';
import { createDashScopeAPI } from '../lib/dashscope';

export async function POST(request: NextRequest) {
  try {
    const { memoryId, testMessage } = await request.json();
    
    console.log('🧪 Testing memory ID:', memoryId);
    
    const api = createDashScopeAPI();
    
    // 测试调用
    const response = await api.callApplication({
      prompt: testMessage || '你好，请介绍一下你记得的关于我的信息',
      stream: false,
      memory_id: memoryId,
    });
    
    console.log('🧪 Test response:', {
      status_code: response.status_code,
      has_output: !!response.output,
      output_length: response.output?.text?.length,
      request_id: response.request_id
    });
    
    return NextResponse.json({
      success: response.status_code === 200,
      memoryId,
      response: response.output?.text || '无响应',
      request_id: response.request_id
    });
    
  } catch (error) {
    console.error('🧪 Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 