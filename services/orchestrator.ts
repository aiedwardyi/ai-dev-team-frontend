import { Project, Artifact, LogEntry, AgentStage } from "../types";
import { generatePRD, generatePlan, generateCode } from "./gemini";
import { v4 as uuidv4 } from 'uuid';

// In-memory "Database" for the session
// In a real app, this would be SQLite + Flask
class MockBackend {
  private projects: Project[] = [];
  private artifacts: Artifact[] = [];
  private logs: LogEntry[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const p = localStorage.getItem('da_projects');
      const a = localStorage.getItem('da_artifacts');
      const l = localStorage.getItem('da_logs');
      if (p) this.projects = JSON.parse(p);
      if (a) this.artifacts = JSON.parse(a);
      if (l) this.logs = JSON.parse(l);
    } catch (e) {
      console.error("Failed to load data", e);
    }
  }

  private save() {
    localStorage.setItem('da_projects', JSON.stringify(this.projects));
    localStorage.setItem('da_artifacts', JSON.stringify(this.artifacts));
    localStorage.setItem('da_logs', JSON.stringify(this.logs));
    this.notify();
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- Public API methods simulating Backend Routes ---

  getProjects() {
    return [...this.projects].sort((a, b) => b.createdAt - a.createdAt);
  }

  getProject(id: string) {
    return this.projects.find(p => p.id === id);
  }

  getArtifacts(projectId: string) {
    return this.artifacts.filter(a => a.projectId === projectId).sort((a, b) => a.createdAt - b.createdAt);
  }

  getLogs(projectId: string) {
    return this.logs.filter(l => l.projectId === projectId).sort((a, b) => a.timestamp - b.timestamp); // Sort by oldest first for display
  }

  createProject(name: string, description: string) {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      createdAt: Date.now(),
      status: 'IDLE',
      currentStage: 'idle'
    };
    this.projects.push(newProject);
    this.addLog(newProject.id, `Project "${name}" created.`, 'info');
    this.save();
    return newProject;
  }

  public addLog(projectId: string, message: string, type: LogEntry['type']) {
    this.logs.push({
      id: uuidv4(),
      projectId,
      timestamp: Date.now(),
      message,
      type
    });
    this.save(); 
  }

  private updateProjectStatus(id: string, status: Project['status'], stage: AgentStage) {
    const p = this.projects.find(proj => proj.id === id);
    if (p) {
      p.status = status;
      p.currentStage = stage;
      this.save();
    }
  }

  // The "Async Task Queue" Processor
  async startExecution(projectId: string) {
    const project = this.getProject(projectId);
    if (!project) return;

    // Reset for fresh run
    this.artifacts = this.artifacts.filter(a => a.projectId !== projectId); // Clear old artifacts? or Keep history? Let's clear for "Demo" simplicity on re-run
    this.logs = this.logs.filter(l => l.projectId !== projectId); // Clear logs for fresh run view
    
    this.updateProjectStatus(projectId, 'RUNNING', 'pm');
    this.addLog(projectId, "Starting execution pipeline...", 'system');
    this.save();

    try {
      // 1. PM AGENT
      this.addLog(projectId, "PM Agent: Analyzing requirements...", 'info');
      await new Promise(r => setTimeout(r, 1000)); // Simulate queue delay
      
      const prd = await generatePRD(project.description);
      this.artifacts.push({
        id: uuidv4(),
        projectId,
        type: 'PRD',
        title: 'Product Requirements Document',
        content: prd,
        createdAt: Date.now(),
        agent: 'PM Agent (ai-dev-team Engine)'
      });
      this.addLog(projectId, "PM Agent: PRD generated successfully.", 'success');
      this.updateProjectStatus(projectId, 'RUNNING', 'planner');
      this.save();

      // 2. PLANNER AGENT
      this.addLog(projectId, "Planner Agent: Architecting solution...", 'info');
      await new Promise(r => setTimeout(r, 1000));

      const plan = await generatePlan(prd);
      this.artifacts.push({
        id: uuidv4(),
        projectId,
        type: 'PLAN',
        title: 'Execution Plan',
        content: plan,
        createdAt: Date.now(),
        agent: 'Architect Agent (ai-dev-team Engine)'
      });
      this.addLog(projectId, "Planner Agent: Execution plan created.", 'success');
      this.updateProjectStatus(projectId, 'RUNNING', 'engineer');
      this.save();

      // 3. ENGINEER AGENT
      this.addLog(projectId, "Engineer Agent: Writing code...", 'info');
      await new Promise(r => setTimeout(r, 1000));

      const code = await generateCode(plan, prd);
      this.artifacts.push({
        id: uuidv4(),
        projectId,
        type: 'CODE',
        title: 'Source Code',
        content: code,
        createdAt: Date.now(),
        agent: 'Engineer Agent (ai-dev-team Engine)'
      });
      this.addLog(projectId, "Engineer Agent: Code generation complete.", 'success');
      
      this.updateProjectStatus(projectId, 'COMPLETED', 'complete');
      this.addLog(projectId, "Workflow completed successfully.", 'system');
      this.save();

    } catch (error: any) {
      console.error(error);
      this.addLog(projectId, `Workflow failed: ${error.message}`, 'error');
      this.updateProjectStatus(projectId, 'FAILED', 'idle');
      this.save();
    }
  }
}

export const backend = new MockBackend();