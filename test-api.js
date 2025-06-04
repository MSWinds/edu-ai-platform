// 测试流式API响应
const fetch = require('node-fetch');

async function testStreamAPI() {
  console.log('测试流式API...');
  
  const response = await fetch('http://localhost:3000/api/ai-assistant-stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '这门课程总时长是多少？',
      useStream: true,
    }),
  });

  if (!response.ok) {
    console.error(`Request failed with status ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const reader = response.body;
  const decoder = new TextDecoder();
  let buffer = '';
  let hasDataChunk = false;
  
  for await (const chunk of reader) {
    buffer += decoder.decode(chunk, { stream: true });
    
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          if (!hasDataChunk) {
            console.error('No data chunks received before [DONE]');
            process.exit(1);
          }
          console.log('=== 流结束 ===');
          return;
        } else {
          hasDataChunk = true;
        }
        
        try {
          const parsed = JSON.parse(data);
          console.log('收到数据:', JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('原始数据:', data);
        }
      }
    }
  }
}

testStreamAPI().catch(console.error);
