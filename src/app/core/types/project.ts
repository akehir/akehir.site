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

export enum Icons {
  droplet = 'droplet',
  grass = 'grass',
  leaf = 'leaf',
  mountain = 'mountain',
  frost = 'frost-emblem',
  wolfji = 'emoji/emoji_u1f43a'
}

export interface Project {
  id: string;
  icon: Icons;
  path: string;
  git: string;
  description: string;
  status: ProjectStatus;
  name: string;
  type: ProjectType;
  contribution: ProjectContribution;
  year: number;
}
