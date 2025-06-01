import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-v3',
        input: {
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        parameters: {
          max_tokens: 2000,
          temperature: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.output?.choices?.[0]?.message?.content || '生成失败，请重试';

    return NextResponse.json({ 
      success: true, 
      content: generatedText 
    });
  } catch (error) {
    console.error('DashScope API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'API调用失败，请稍后重试' 
      },
      { status: 500 }
    );
  }
} 