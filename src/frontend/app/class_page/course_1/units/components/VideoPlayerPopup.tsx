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

  const currentSection = sections[currentSectionIndex];

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setQuizStarted(false);
      setSelectedAnswer(null);
      setQuizCompleted(false);
      setOptionFeedback(null);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setQuizStarted(false);
      setSelectedAnswer(null);
      setQuizCompleted(false);
      setOptionFeedback(null);
    }
  };

  const handleQuizStart = () => {
    setQuizStarted(true);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setOptionFeedback(null);
  };

  const handleOptionClick = (index: number) => {
    setSelectedAnswer(index);
    setOptionFeedback(currentSection.quiz[0].options[index].feedback);
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-7xl h-[80vh] bg-white rounded-xl shadow-lg flex">
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
              <div className="flex-1 bg-black">
                <iframe
                  src={currentSection.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Quiz section */}
            <div className="p-6 border-t border-gray-200">
              {!quizStarted && !quizCompleted && (
                <button
                  onClick={handleQuizStart}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  开始测验
                </button>
              )}
              {quizStarted && !quizCompleted && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">测验</h4>
                  <p className="text-gray-700">{currentSection.quiz[0].question}</p>
                  <div className="space-y-2">
                    {currentSection.quiz[0].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={selectedAnswer === currentSection.quiz[0].answer}
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
                    <div className={`text-base font-semibold ${selectedAnswer === currentSection.quiz[0].answer ? 'text-green-600' : 'text-red-600'}`}>{optionFeedback}</div>
                  )}
                  {selectedAnswer === currentSection.quiz[0].answer && (
                    <button
                      onClick={handleQuizComplete}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      完成测验
                    </button>
                  )}
                </div>
              )}
              {quizCompleted && (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-green-600">测验已完成，可进入下一节！</div>
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
              <button
                onClick={handleNextSection}
                disabled={currentSectionIndex === sections.length - 1 || !quizCompleted}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一节
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 