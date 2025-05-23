// 测试脚本：验证不同用户的memory ID是否正确使用

async function testMemoryIds() {
  const baseUrl = 'http://localhost:3000/api/ai-assistant-stream';
  
  // 测试初学者学生
  console.log('=== 测试初学者学生 ===');
  const beginnerMemoryId = '748182d5281c4032a10e70085ce6aea0';
  
  try {
    const response1 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '什么是Python？',
        memoryId: beginnerMemoryId,
        useStream: false
      })
    });
    
    console.log('初学者响应状态:', response1.status);
    
    // 测试进阶学生
    console.log('\n=== 测试进阶学生 ===');
    const advancedMemoryId = '5e4ed1246f524fd4a7f56eb2a4120906';
    
    const response2 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '什么是Python？',
        memoryId: advancedMemoryId,
        useStream: false
      })
    });
    
    console.log('进阶学生响应状态:', response2.status);
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testMemoryIds(); 