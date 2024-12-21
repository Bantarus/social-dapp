import React from 'react';

interface InnUnfoldLogoProps {
  className?: string;
}

const InnUnfoldLogo: React.FC<InnUnfoldLogoProps> = ({ className = '' }) => {
  const innLetters = ['I', 'n', 'n'];
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center">
        <span className="text-4xl font-bold text-gray-800 dark:text-gray-200 mr-1">unfold</span>
        
        <div className="flex items-baseline">
          {innLetters.map((letter, index) => (
            <div
              key={index}
              className="relative"
              style={{
                width: letter === 'I' ? '16px' : '32px',
                height: '64px',
                perspective: '1000px'
              }}
            >
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  animation: `unfoldInn 0.8s ease-out ${index * 0.2}s forwards`,
                  transformOrigin: 'top',
                  transform: 'rotateX(-90deg)',
                }}
              >
                <div
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-pink-600">
                    {letter}
                  </span>
                </div>

                <div
                  className="absolute w-full h-full bg-gradient-to-b from-purple-200 to-transparent dark:from-purple-800"
                  style={{
                    transform: 'rotateX(90deg) translateZ(32px)',
                    transformOrigin: 'bottom',
                    backfaceVisibility: 'hidden'
                  }}
                />

                <div
                  className="absolute bottom-0 left-0 w-full"
                  style={{
                    height: '20px',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
                    animation: `shadowFade 0.8s ease-out ${index * 0.2}s forwards`,
                    opacity: 0,
                    transform: 'translateY(20px)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes unfoldInn {
          0% {
            transform: rotateX(-90deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }

        @keyframes shadowFade {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default InnUnfoldLogo; 