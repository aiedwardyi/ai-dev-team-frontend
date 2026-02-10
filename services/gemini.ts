import { PrdResponse, PlanResponse, CodeResponse } from "../types";

// Simulate network delay and "thinking" time for the demo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generatePRD = async (idea: string): Promise<PrdResponse> => {
  // Simulate AI analyzing the request
  await delay(2000); 
  
  // Create a dynamic title based on the input to make it feel responsive
  const cleanIdea = idea.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").slice(0, 4).join(" ");
  const title = cleanIdea.length > 0 ? `${cleanIdea} (MVP)` : "New Project MVP";
  
  return {
    title: title,
    summary: `This PRD outlines the requirements for "${idea}". The proposed solution leverages a modern tech stack to ensure scalability, maintainability, and a superior user experience. It focuses on core functionality to demonstrate value quickly.`,
    features: [
      "User Authentication (Sign up/Login/Forgot Password)",
      "Responsive Dashboard with Data Visualization",
      "Real-time Notifications System",
      "Data Export (CSV/PDF) Capability",
      "Admin Panel for User Management"
    ],
    userStories: [
      "As a user, I want to securely log in to access my private data.",
      "As a user, I want to filter and sort my dashboard views.",
      "As an admin, I want to oversee system activity and manage roles.",
      "As a user, I want to receive alerts for critical updates."
    ],
    techStackRecommendation: [
      "Frontend: React 19 + TypeScript + Vite",
      "Styling: Tailwind CSS + Lucide Icons",
      "Backend: Node.js + Express (or Serverless)",
      "Database: PostgreSQL or Supabase",
      "State Management: React Context or Zustand"
    ]
  };
};

export const generatePlan = async (prd: PrdResponse): Promise<PlanResponse> => {
  // Simulate Planner AI breaking down the PRD
  await delay(2500); 
  
  return {
    phases: [
      {
        name: "Phase 1: Foundation & Setup",
        description: "Initialize the project environment, CI/CD pipelines, and core architectural patterns.",
        steps: [
          "Initialize Git repository and React/Vite project structure",
          "Configure Tailwind CSS, Prettier, and ESLint",
          "Set up routing (React Router) and layout components",
          "Implement authentication scaffolding (Context/Hooks)"
        ]
      },
      {
        name: "Phase 2: Core Feature Implementation",
        description: "Develop the primary features defined in the PRD, focusing on the MVP scope.",
        steps: [
          "Build 'User Authentication' screens and integration",
          "Develop 'Responsive Dashboard' with mock charts",
          "Implement 'Admin Panel' basic views",
          "Create shared UI component library (Buttons, Inputs, Cards)"
        ]
      },
      {
        name: "Phase 3: Integration & Polish",
        description: "Finalize integration, improve UI/UX, and prepare for deployment.",
        steps: [
          "Integrate real-time notification mock service",
          "Add loading states and error handling boundaries",
          "Conduct responsive design testing on mobile viewports",
          "Generate final build artifacts and documentation"
        ]
      }
    ],
    estimatedTimeline: "3 Weeks"
  };
};

export const generateCode = async (plan: PlanResponse, prd: PrdResponse): Promise<CodeResponse> => {
  // Simulate Engineer AI writing code
  await delay(3500);

  // Generate some realistic looking React code
  return {
    setupInstructions: "1. Clone repository\n2. Run `npm install`\n3. Run `npm run dev`\n4. Open http://localhost:5173",
    files: [
      {
        filename: "src/App.tsx",
        language: "typescript",
        content: `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;`
      },
      {
        filename: "src/components/Dashboard.tsx",
        language: "typescript",
        content: `import React from 'react';
import { BarChart, Users, Activity } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
      </div>
      <div className={\`p-3 rounded-lg \${color} bg-opacity-20\`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="Total Users" 
          value="12,345" 
          icon={Users} 
          color="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          label="Active Sessions" 
          value="843" 
          icon={Activity} 
          color="bg-green-500 text-green-500" 
        />
        <StatCard 
          label="Revenue" 
          value="$45,200" 
          icon={BarChart} 
          color="bg-purple-500 text-purple-500" 
        />
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-64 flex items-center justify-center text-slate-500">
        Chart Visualization Placeholder
      </div>
    </div>
  );
}`
      },
      {
        filename: "README.md",
        language: "markdown",
        content: `# ${prd.title}

${prd.summary}

## 🚀 Features

${prd.features.map(f => `- **${f.split('(')[0].trim()}**: ${f.includes('(') ? f.split('(')[1].replace(')', '') : 'Included in baseline MVP.'}`).join('\n')}

## 🏗 Project Architecture

This project follows a standard React/TypeScript modular architecture:

- \`src/\`: Root source directory
- \`src/components/\`: Shared UI components and layout wrappers
- \`src/pages/\`: High-level route views and page-specific logic
- \`src/services/\`: External API integrations and business logic handlers

## 🛠 Tech Stack

${prd.techStackRecommendation.map(t => `- ${t}`).join('\n')}

## 💻 Getting Started

### Development Mode

\`\`\`bash
# Install dependencies
npm install

# Start local dev server
npm run dev
\`\`\`

### Production Build

\`\`\`bash
# Generate optimized static assets
npm run build
\`\`\`

---

*Generated by ai-dev-team Engine. Synthesized from product brief via autonomous agent pipeline.*
`
      }
    ]
  };
};