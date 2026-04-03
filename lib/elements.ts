export type ElementCategory = 
  | "diatomic-nonmetal"
  | "noble-gas"
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "metalloid"
  | "polyatomic-nonmetal"
  | "post-transition-metal"
  | "transition-metal";

export interface ChemicalElement {
  atomicNum: number;
  symbol: string;
  name: string;
  period: number;
  group: number;
  category: ElementCategory;
  atomicMass: number;
}

export const elements: ChemicalElement[] = [
  { atomicNum: 1, symbol: "H", name: "Водород", period: 1, group: 1, category: "diatomic-nonmetal", atomicMass: 1.008 },
  { atomicNum: 2, symbol: "He", name: "Гелий", period: 1, group: 18, category: "noble-gas", atomicMass: 4.0026 },
  { atomicNum: 3, symbol: "Li", name: "Литий", period: 2, group: 1, category: "alkali-metal", atomicMass: 6.94 },
  { atomicNum: 4, symbol: "Be", name: "Бериллий", period: 2, group: 2, category: "alkaline-earth-metal", atomicMass: 9.0122 },
  { atomicNum: 5, symbol: "B", name: "Бор", period: 2, group: 13, category: "metalloid", atomicMass: 10.81 },
  { atomicNum: 6, symbol: "C", name: "Углерод", period: 2, group: 14, category: "polyatomic-nonmetal", atomicMass: 12.011 },
  { atomicNum: 7, symbol: "N", name: "Азот", period: 2, group: 15, category: "diatomic-nonmetal", atomicMass: 14.007 },
  { atomicNum: 8, symbol: "O", name: "Кислород", period: 2, group: 16, category: "diatomic-nonmetal", atomicMass: 15.999 },
  { atomicNum: 9, symbol: "F", name: "Фтор", period: 2, group: 17, category: "diatomic-nonmetal", atomicMass: 18.998 },
  { atomicNum: 10, symbol: "Ne", name: "Неон", period: 2, group: 18, category: "noble-gas", atomicMass: 20.180 },
  { atomicNum: 11, symbol: "Na", name: "Натрий", period: 3, group: 1, category: "alkali-metal", atomicMass: 22.990 },
  { atomicNum: 12, symbol: "Mg", name: "Магний", period: 3, group: 2, category: "alkaline-earth-metal", atomicMass: 24.305 },
  { atomicNum: 13, symbol: "Al", name: "Алюминий", period: 3, group: 13, category: "post-transition-metal", atomicMass: 26.982 },
  { atomicNum: 14, symbol: "Si", name: "Кремний", period: 3, group: 14, category: "metalloid", atomicMass: 28.085 },
  { atomicNum: 15, symbol: "P", name: "Фосфор", period: 3, group: 15, category: "polyatomic-nonmetal", atomicMass: 30.974 },
  { atomicNum: 16, symbol: "S", name: "Сера", period: 3, group: 16, category: "polyatomic-nonmetal", atomicMass: 32.06 },
  { atomicNum: 17, symbol: "Cl", name: "Хлор", period: 3, group: 17, category: "diatomic-nonmetal", atomicMass: 35.45 },
  { atomicNum: 18, symbol: "Ar", name: "Аргон", period: 3, group: 18, category: "noble-gas", atomicMass: 39.95 },
  { atomicNum: 19, symbol: "K", name: "Калий", period: 4, group: 1, category: "alkali-metal", atomicMass: 39.098 },
  { atomicNum: 20, symbol: "Ca", name: "Кальций", period: 4, group: 2, category: "alkaline-earth-metal", atomicMass: 40.078 },
];
