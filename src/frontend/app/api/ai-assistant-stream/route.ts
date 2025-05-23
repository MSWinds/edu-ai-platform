import { NextRequest } from 'next/server';
import { createDashScopeAPI, formatCourseReferences } from '../lib/dashscope';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, courseReferences, memoryId } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 创建DashScope API实例
    const api = createDashScopeAPI();

    // 格式化上下文
    const contextStr = formatCourseReferences(courseReferences);
    const finalPrompt = `${contextStr}${message}`;

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullContent = '';
          let chunkCount = 0;

          // 使用传入的memoryId或默认的memoryId
          const finalMemoryId = memoryId || process.env.DASHSCOPE_DEFAULT_MEMORY_ID;

          // 调用流式API
          for await (const chunk of api.callApplicationStream({
            prompt: finalPrompt,
            stream: true,
            incremental_output: true,
            memory_id: finalMemoryId,
          })) {
            chunkCount++;

            // 检查状态码
            if (chunk.status_code !== 200) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ 
                  error: chunk.message || 'AI service error' 
                })}\n\n`)
              );
              controller.close();
              return;
            }

            // 处理文本输出
            if (chunk.output?.text) {
              fullContent += chunk.output.text;
              
              const data = {
                type: 'text',
                content: chunk.output.text,
                fullContent: fullContent,
                request_id: chunk.request_id,
              };

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
              );
            }

            // 处理思考过程（如果有）
            if (chunk.output?.thoughts) {
              for (const thought of chunk.output.thoughts) {
                const data = {
                  type: 'thought',
                  content: thought.thought,
                  action_type: thought.action_type,
                  request_id: chunk.request_id,
                };

                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
              }
            }
          }

          // 发送完成信号
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

        } catch (error) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              error: '服务暂时不可用，请稍后重试' 
            })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: '服务暂时不可用，请稍后重试' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 