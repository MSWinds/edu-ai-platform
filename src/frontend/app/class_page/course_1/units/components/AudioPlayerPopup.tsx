import { useState, useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

interface AudioPlayerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  audioUrl: string;
  duration?: string;
}

export default function AudioPlayerPopup({ isOpen, onClose, title, audioUrl, duration }: AudioPlayerPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = parseFloat(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {title}
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Audio player content */}
          <div className="p-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-32 h-32 flex items-center justify-center mx-auto mb-1">
                  <video
                    className="w-32 h-32 object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/icons/AI-Animation2.webm" type="video/webm" />
                    {/* 备用：如果webm不支持，显示简单的AI图标 */}
                    <div className="w-20 h-20 text-gray-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                  </video>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">AI播客</h3>
                <p className="text-gray-600">轻松对话，反思学习</p>
                <p className="text-sm text-gray-500 mt-2">时长: {formatTime(totalDuration)}</p>
              </div>

              {/* Audio element */}
              <audio ref={audioRef} src={audioUrl} preload="metadata" />

              {/* Play/Pause button */}
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-8 h-8 text-white" />
                ) : (
                  <PlayIcon className="w-8 h-8 text-white ml-1" />
                )}
              </button>

              {/* Progress bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={totalDuration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>

              {/* Playback speed controls */}
              <div className="flex justify-center gap-2">
                <span className="text-sm text-gray-600 mr-2">播放速度:</span>
                {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      playbackRate === rate
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Download option */}
            <div className="mt-6 text-center">
              <a
                href={audioUrl}
                download
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                下载音频
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </Dialog>
  );
} 