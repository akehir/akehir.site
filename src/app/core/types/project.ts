import {Environment} from './environment';

export enum ProjectType {
  'none',
  'idea',
  'website',
  'game',
  'tool',
  'library',
  'flyer',
  'design',
  'ux',
  'book',
  'blog',
  'article',
  'paper',
  'whitepaper',
  'term-paper',
  '3d-printing',
}

export enum ProjectContribution {
  'none',
  'frontend',
  'backend',
  'programming',
  'minor',
}

export enum ProjectStatus {
  'on-hold',
  'completed',
  'cancelled',
  'in-progress',
  'alpha',
  'beta',
  'released',
  'maintaining',
  'planned',
}


export interface Project {
  symbol: string;
  path: string;
  git: string;
  description: string;
  status: ProjectStatus;
  name: string;
  environment: Environment;
  type: ProjectType;
  contribution: ProjectContribution;
  year: number;
}
