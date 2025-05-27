import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Section {
  title: string;
  videoUrl: string;
  quiz: {
    question: string;
    options: { text: string; feedback: string }[];
    answer: number;
  }[];
  completed: boolean;
}

interface VideoPlayerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
}

export default function VideoPlayerPopup({ isOpen, onClose, sections }: VideoPlayerPopupProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [optionFeedback, setOptionFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setQuizStarted(false);
      setSelectedAnswer(null);
      setQuizCompleted(false);
      setOptionFeedback(null);
      setAttempts(0);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setQuizStarted(false);
      setSelectedAnswer(null);
      setQuizCompleted(false);
      setOptionFeedback(null);
      setAttempts(0);
    }
  };

  const handleQuizStart = () => {
    setQuizStarted(true);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setOptionFeedback(null);
    setAttempts(0);
  };

  const handleOptionClick = (index: number) => {
    setSelectedAnswer(index);
    setOptionFeedback(currentSection.quiz[0].options[index].feedback);
    
    if (index === currentSection.quiz[0].answer) {
      setQuizCompleted(true);
    } else {
      setAttempts(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setOptionFeedback(null);
  };

  const handleCompleteLearning = () => {
    setShowCompletionDialog(true);
  };

  const handleCloseCompletionDialog = () => {
    setShowCompletionDialog(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-7xl h-[90vh] bg-white rounded-xl shadow-lg flex">
          {/* Left sidebar with sections */}
          <div className="w-1/4 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程内容</h3>
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSectionIndex(index);
                      setQuizStarted(false);
                      setSelectedAnswer(null);
                      setQuizCompleted(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      currentSectionIndex === index
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="text-sm">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {currentSection.title}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Video player */}
            {!quizStarted && (
              <div className="flex-1 bg-black relative">
                {currentSection.videoUrl.includes('youtube.com') ? (
                  <iframe
                    src={currentSection.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : currentSection.videoUrl.endsWith('.pdf') ? (
                  <iframe
                    src={currentSection.videoUrl}
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <video
                    src={currentSection.videoUrl}
                    className="absolute inset-0 w-full h-full object-contain"
                    controls
                  />
                )}
              </div>
            )}

            {/* Quiz section */}
            <div className="p-6 border-t border-gray-200 bg-white">
              {!quizStarted && !quizCompleted && (
                <div className="flex justify-end">
                  <button
                    onClick={handleQuizStart}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    开始测验
                  </button>
                </div>
              )}
              {quizStarted && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">测验</h4>
                  <p className="text-gray-700">{currentSection.quiz[0].question}</p>
                  <div className="space-y-2">
                    {currentSection.quiz[0].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                          selectedAnswer === index
                            ? (selectedAnswer === currentSection.quiz[0].answer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                  {optionFeedback && (
                    <div className={`text-base font-semibold ${selectedAnswer === currentSection.quiz[0].answer ? 'text-green-600' : 'text-red-600'}`}>
                      {optionFeedback}
                    </div>
                  )}
                  {selectedAnswer !== null && selectedAnswer !== currentSection.quiz[0].answer && attempts < 2 && (
                    <button
                      onClick={handleRetry}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      再试一次
                    </button>
                  )}
                  {selectedAnswer === currentSection.quiz[0].answer && (
                    <div className="text-lg font-semibold text-green-600">
                      测验已完成！
                    </div>
                  )}
                  {selectedAnswer !== null && selectedAnswer !== currentSection.quiz[0].answer && attempts >= 2 && (
                    <div className="text-lg font-semibold text-red-600">
                      已达到最大尝试次数，请进入下一节
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={handlePreviousSection}
                disabled={currentSectionIndex === 0}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一节
              </button>
              {isLastSection && selectedAnswer === currentSection.quiz[0].answer ? (
                <button
                  onClick={handleCompleteLearning}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  完成学习
                </button>
              ) : !isLastSection && (
                <button
                  onClick={handleNextSection}
                  disabled={!quizCompleted && attempts < 2}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一节
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>

      {/* Completion Dialog */}
      <Dialog
        open={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4 text-center">
              恭喜你完成本周的学习！
            </Dialog.Title>
            <p className="text-gray-600 mb-6 text-center">
              现在轮到你了
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleCloseCompletionDialog}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                进入本周练习
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Dialog>
  );
} 