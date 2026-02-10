import React from 'react';
import { AgentStage } from '../types';
import { Check } from 'lucide-react';

interface StageStepperProps {
  currentStage: AgentStage;
}

const steps = [
  { id: 'pm', label: 'PM Agent' },
  { id: 'planner', label: 'Planner' },
  { id: 'engineer', label: 'Engineer' },
];

const StageStepper: React.FC<StageStepperProps> = ({ currentStage }) => {
  const getStepStatus = (stepId: string) => {
    const stages = ['idle', 'pm', 'planner', 'engineer', 'complete'];
    const currentIndex = stages.indexOf(currentStage);
    const stepIndex = stages.indexOf(stepId);

    if (currentStage === 'complete') return 'completed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative max-w-3xl mx-auto px-4">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-0 rounded-full"></div>
        
        {/* Progress Fill - Gradient Blue to Purple */}
        <div className={`absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 -z-0 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)] ${
           currentStage === 'pm' ? 'w-[15%]' : 
           currentStage === 'planner' ? 'w-[50%]' : 
           currentStage === 'engineer' ? 'w-[85%]' : 
           currentStage === 'complete' ? 'w-full' : 'w-0'
        }`}></div>
        
        {steps.map((step, idx) => {
          const status = getStepStatus(step.id);
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 group">
              <div 
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-[#0b0e14]
                  ${status === 'completed' || status === 'active' 
                    ? 'border-transparent bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                    : 'border-white/10 text-white/20'
                  }
                `}
              >
                {/* Inner Circle to simulate ring effect if active/completed */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#0b0e14] transition-all duration-300 ${status === 'active' ? 'scale-95' : 'scale-100'}`}>
                    {status === 'completed' ? (
                        <Check size={20} className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                    ) : status === 'active' ? (
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-white/10"></div>
                    )}
                </div>
              </div>
              
              <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                status === 'active' ? 'text-blue-400 text-shadow-glow scale-105' : 
                status === 'completed' ? 'text-indigo-300' : 'text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StageStepper;