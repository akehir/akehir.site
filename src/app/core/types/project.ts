
// import { rpgAwesomeIcon } from '@triangular/rpg-awesome-icons/icons/build/rpg-awesome-icon.model';
// import { fontAwesomeIcon } from '@triangular/font-awesome-icons/icons/build/font-awesome-icon.model';
// import { noto } from '@triangular/noto-emoji-icons/icons/build/noto-emoji.model';

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
  'prototyping',
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
  '3d-design',
  'design',
  'everything',
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

// export type Icons = noto | rpgAwesomeIcon | fontAwesomeIcon;

// {
//   droplet = 'droplet',
//   grass = 'grass',
//   leaf = 'leaf',
//   mountain = 'mountain',
//   frost = 'frost-emblem',
//   wolfji = 'emoji/emoji_u1f43a'
// }

export enum IconType {
  noto = 'noto',
  rpgAwesome = 'rpgAwesome',
  fontAwesome = 'fontAwesome',
}


export interface Project {
  id: string;
  icon: string;
  iconType: IconType;
  path: string;
  git: string;
  description: string;
  featured: boolean;
  status: ProjectStatus;
  name: string;
  type: ProjectType;
  contribution: ProjectContribution;
  year: number;
}
