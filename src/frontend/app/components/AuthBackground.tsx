import { ReactNode } from 'react';

interface AuthBackgroundProps {
  children: ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-md w-full relative z-10">
        {children}
      </div>
    </div>
  );
} 