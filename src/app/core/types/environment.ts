export type Environment = LandEnvironment |
  WaterEnvironment |
  ForestEnvironment |
  IceEnvironment |
  MountainEnvironment;

export class LandEnvironment implements BaseEnvironment {
  img = 'assets/grass.svg';
  background = '#008700';
}

export class ForestEnvironment implements BaseEnvironment {
  img = 'assets/leaf.svg';
  background = '#53823b';
}

export class WaterEnvironment implements BaseEnvironment {
  img = 'assets/droplet.svg';
  background = '#00a6f3';
}

export class MountainEnvironment implements BaseEnvironment {
  img = 'assets/mountain.svg';
  background = '#f97a00';
}

export class IceEnvironment implements BaseEnvironment {
  img = 'assets/frost-emblem.svg';
  background = '#69e3f5';
}

export interface BaseEnvironment {
  img: string;
  background: string;
}
