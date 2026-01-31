
export interface PigWorker {
  id: string;
  name: string;
  role: string;
  efficiency: number;
  accidents: number;
  status: 'Working' | 'Snacking' | 'Confused' | 'Sleeping' | 'Promoted';
  avatar: string;
}

export interface WackyMachine {
  name: string;
  description: string;
  components: string[];
  hazardLevel: 'Low' | 'Medium' | 'Extreme' | 'Literal Explosion';
  blueprintCode: string;
  rarity?: 'Standard' | 'Royal Gold' | 'Legendary';
}

export enum AppTab {
  WORKSHOP = 'workshop',
  BLUEPRINTS = 'blueprints',
  LABORATORY = 'laboratory',
  CAFETERIA = 'cafeteria',
  SETTINGS = 'settings'
}
