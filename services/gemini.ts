
import { PrdResponse, PlanResponse, CodeResponse } from "../types";

// Simulated delay to mimic agent "thinking" time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generatePRD = async (idea: string): Promise<PrdResponse> => {
  await delay(2000);
  return {
    title: `${idea} - Product Requirements`,
    summary: `A comprehensive plan to build: ${idea}. This document outlines the core functional requirements and user experience goals for the proposed application.`,
    features: [
      "Intuitive and responsive user interface with multi-theme support",
      "Real-time data synchronization with optimistic UI updates",
      "Advanced search and filtering capabilities for system artifacts",
      "Automated workflow orchestration with persistent session state"
    ],
    userStories: [
      "As a developer, I want to see the progress of the agent swarm so I can track development in real-time.",
      "As a project manager, I want a clear PRD generated from my ideas to ensure technical alignment.",
      "As a stakeholder, I want to see a live preview of the code to verify feature implementation."
    ],
    techStackRecommendation: [
      "Frontend: React 19 with TypeScript",
      "Styling: Tailwind CSS 3.4+",
      "State: React Context & Hooks",
      "Icons: Lucide React"
    ]
  };
};

export const generatePlan = async (prd: PrdResponse): Promise<PlanResponse> => {
  await delay(2500);
  return {
    phases: [
      {
        name: "Phase 1: Environment Synthesis",
        description: "Setting up the core project structure and base dependencies.",
        steps: ["Initialize React/Vite ecosystem", "Configure Tailwind design tokens", "Set up project directory layout"]
      },
      {
        name: "Phase 2: Core Logic Implementation",
        description: "Developing the primary business logic and state management.",
        steps: ["Implement central orchestration state", "Build agent communication protocol", "Create data persistence layer"]
      },
      {
        name: "Phase 3: High-Fidelity UI/UX",
        description: "Assembling the visual interface and interactive components.",
        steps: ["Build responsive dashboard layout", "Implement artifact visualization panels", "Add real-time progress indicators"]
      }
    ],
    estimatedTimeline: "3 Business Days (Simulated)"
  };
};

export const generateCode = async (plan: PlanResponse, prd: PrdResponse): Promise<CodeResponse> => {
  await delay(3000);
  return {
    files: [
      {
        filename: "App.tsx",
        language: "typescript",
        content: `import React from 'react';\nimport Dashboard from './components/Dashboard';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white font-sans">\n      <Dashboard project="${prd.title}" />\n    </div>\n  );\n}`
      },
      {
        filename: "components/Dashboard.tsx",
        language: "typescript",
        content: `import React from 'react';\n\nexport default function Dashboard({ project }) {\n  return (\n    <div className="p-10">\n      <h1 className="text-4xl font-black tracking-tighter mb-4">{project}</h1>\n      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">\n        <p className="text-slate-400">Dashboard interface active.</p>\n      </div>\n    </div>\n  );\n}`
      },
      {
        filename: "README.md",
        language: "markdown",
        content: `# Generated Project: ${prd.title}\n\nBuilt using the AI Dev Team Orchestrator.\n\n## Setup\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``
      }
    ],
    setupInstructions: "Run 'npm install' followed by 'npm run dev' to launch the development server."
  };
};
