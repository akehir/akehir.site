export type Environment = LandEnvironment |
  WaterEnvironment |
  ForestEnvironment |
  IceEnvironment |
  MountainEnvironment;

export interface BaseEnvironment {
  img: string;
  background: string;
}

export class LandEnvironment implements BaseEnvironment {
  img = 'assets/grass.svg';
  background = 'rgba(55, 155, 55, 0.5)';
}

export class ForestEnvironment implements BaseEnvironment {
  img = 'assets/leaf.svg';
  background = 'rgba(33, 77, 33, 0.5)';
}

export class WaterEnvironment implements BaseEnvironment {
  img = 'assets/droplet.svg';
  background = 'rgba(11, 55, 155, 0.5)';
}

export class MountainEnvironment implements BaseEnvironment {
  img = 'assets/mountain.svg';
  background = 'rgba(155, 111, 55, 0.5)';
}

export class IceEnvironment implements BaseEnvironment {
  img = 'assets/frost-emblem.svg';
  background = 'rgba(55, 155, 155, 0.5)';
}

export class WhiteEnvironment implements BaseEnvironment {
  img = 'assets/frost-emblem.svg';
  background = 'rgba(255, 255, 255, 0.2)';
}
