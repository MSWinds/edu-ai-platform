import os
import sys
from http import HTTPStatus
from dashscope import Application

def print_stream(text):
    """打印流式文本，确保立即刷新输出"""
    if text:  # 只打印非空文本
        print(text, end='', flush=True)

def chat_with_ai():
    print("欢迎使用AI对话系统！输入 'quit' 或 'exit' 退出对话。")
    print("-" * 50)
    
    session_id = None
    
    while True:
        user_input = input("你: ").strip()
        
        if user_input.lower() in ['quit', 'exit']:
            print("感谢使用，再见！")
            break
            
        if not user_input:
            continue

        print("AI: ", end='', flush=True)
        
        try:
            # 获取流式响应
            response_stream = Application.call(
                api_key=os.getenv("DASHSCOPE_API_KEY"),
                app_id='2c67f3e7920a40c1a6a315053a819c9f',
                prompt=user_input,
                session_id=session_id,
                stream=True,
                incremental_output=True)

            # 处理流式输出
            for chunk in response_stream:
                if chunk.status_code != HTTPStatus.OK:
                    print(f'\n请求失败: request_id={chunk.request_id}, code={chunk.status_code}, message={chunk.message}')
                    print('请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
                    break
                
                if hasattr(chunk, 'output') and hasattr(chunk.output, 'text'):
                    text = chunk.output.text
                    if text:  # 只处理非空文本
                        print_stream(text)
                        session_id = chunk.output.session_id
            
            print('\n')  # 在回答结束后换行

        except Exception as e:
            print(f'\n发生错误: {str(e)}')
            continue

if __name__ == '__main__':
    chat_with_ai()