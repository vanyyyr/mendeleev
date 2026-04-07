export type ElementCategory = 
  | "diatomic-nonmetal"
  | "noble-gas"
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "metalloid"
  | "polyatomic-nonmetal"
  | "post-transition-metal"
  | "transition-metal"
  | "lanthanide"
  | "actinide"
  | "unknown";

export interface ChemicalElement {
  atomicNum: number;
  symbol: string;
  name: string;
  period: number;
  group: number;      // 0 for lanthanides/actinides (they don't fit standard groups)
  category: ElementCategory;
  atomicMass: number;
}

export const elements: ChemicalElement[] = [
  // Period 1
  { atomicNum: 1,  symbol: "H",  name: "Водород",    period: 1, group: 1,  category: "diatomic-nonmetal",      atomicMass: 1.008 },
  { atomicNum: 2,  symbol: "He", name: "Гелий",       period: 1, group: 18, category: "noble-gas",              atomicMass: 4.0026 },
  // Period 2
  { atomicNum: 3,  symbol: "Li", name: "Литий",       period: 2, group: 1,  category: "alkali-metal",           atomicMass: 6.94 },
  { atomicNum: 4,  symbol: "Be", name: "Бериллий",    period: 2, group: 2,  category: "alkaline-earth-metal",   atomicMass: 9.0122 },
  { atomicNum: 5,  symbol: "B",  name: "Бор",         period: 2, group: 13, category: "metalloid",              atomicMass: 10.81 },
  { atomicNum: 6,  symbol: "C",  name: "Углерод",     period: 2, group: 14, category: "polyatomic-nonmetal",    atomicMass: 12.011 },
  { atomicNum: 7,  symbol: "N",  name: "Азот",        period: 2, group: 15, category: "diatomic-nonmetal",      atomicMass: 14.007 },
  { atomicNum: 8,  symbol: "O",  name: "Кислород",    period: 2, group: 16, category: "diatomic-nonmetal",      atomicMass: 15.999 },
  { atomicNum: 9,  symbol: "F",  name: "Фтор",        period: 2, group: 17, category: "diatomic-nonmetal",      atomicMass: 18.998 },
  { atomicNum: 10, symbol: "Ne", name: "Неон",        period: 2, group: 18, category: "noble-gas",              atomicMass: 20.180 },
  // Period 3
  { atomicNum: 11, symbol: "Na", name: "Натрий",      period: 3, group: 1,  category: "alkali-metal",           atomicMass: 22.990 },
  { atomicNum: 12, symbol: "Mg", name: "Магний",      period: 3, group: 2,  category: "alkaline-earth-metal",   atomicMass: 24.305 },
  { atomicNum: 13, symbol: "Al", name: "Алюминий",    period: 3, group: 13, category: "post-transition-metal",  atomicMass: 26.982 },
  { atomicNum: 14, symbol: "Si", name: "Кремний",     period: 3, group: 14, category: "metalloid",              atomicMass: 28.085 },
  { atomicNum: 15, symbol: "P",  name: "Фосфор",      period: 3, group: 15, category: "polyatomic-nonmetal",    atomicMass: 30.974 },
  { atomicNum: 16, symbol: "S",  name: "Сера",        period: 3, group: 16, category: "polyatomic-nonmetal",    atomicMass: 32.06 },
  { atomicNum: 17, symbol: "Cl", name: "Хлор",        period: 3, group: 17, category: "diatomic-nonmetal",      atomicMass: 35.45 },
  { atomicNum: 18, symbol: "Ar", name: "Аргон",       period: 3, group: 18, category: "noble-gas",              atomicMass: 39.95 },
  // Period 4
  { atomicNum: 19, symbol: "K",  name: "Калий",       period: 4, group: 1,  category: "alkali-metal",           atomicMass: 39.098 },
  { atomicNum: 20, symbol: "Ca", name: "Кальций",     period: 4, group: 2,  category: "alkaline-earth-metal",   atomicMass: 40.078 },
  { atomicNum: 21, symbol: "Sc", name: "Скандий",     period: 4, group: 3,  category: "transition-metal",       atomicMass: 44.956 },
  { atomicNum: 22, symbol: "Ti", name: "Титан",       period: 4, group: 4,  category: "transition-metal",       atomicMass: 47.867 },
  { atomicNum: 23, symbol: "V",  name: "Ванадий",     period: 4, group: 5,  category: "transition-metal",       atomicMass: 50.942 },
  { atomicNum: 24, symbol: "Cr", name: "Хром",        period: 4, group: 6,  category: "transition-metal",       atomicMass: 51.996 },
  { atomicNum: 25, symbol: "Mn", name: "Марганец",    period: 4, group: 7,  category: "transition-metal",       atomicMass: 54.938 },
  { atomicNum: 26, symbol: "Fe", name: "Железо",      period: 4, group: 8,  category: "transition-metal",       atomicMass: 55.845 },
  { atomicNum: 27, symbol: "Co", name: "Кобальт",     period: 4, group: 9,  category: "transition-metal",       atomicMass: 58.933 },
  { atomicNum: 28, symbol: "Ni", name: "Никель",      period: 4, group: 10, category: "transition-metal",       atomicMass: 58.693 },
  { atomicNum: 29, symbol: "Cu", name: "Медь",        period: 4, group: 11, category: "transition-metal",       atomicMass: 63.546 },
  { atomicNum: 30, symbol: "Zn", name: "Цинк",       period: 4, group: 12, category: "transition-metal",       atomicMass: 65.38 },
  { atomicNum: 31, symbol: "Ga", name: "Галлий",      period: 4, group: 13, category: "post-transition-metal",  atomicMass: 69.723 },
  { atomicNum: 32, symbol: "Ge", name: "Германий",    period: 4, group: 14, category: "metalloid",              atomicMass: 72.630 },
  { atomicNum: 33, symbol: "As", name: "Мышьяк",      period: 4, group: 15, category: "metalloid",              atomicMass: 74.922 },
  { atomicNum: 34, symbol: "Se", name: "Селен",       period: 4, group: 16, category: "polyatomic-nonmetal",    atomicMass: 78.971 },
  { atomicNum: 35, symbol: "Br", name: "Бром",        period: 4, group: 17, category: "diatomic-nonmetal",      atomicMass: 79.904 },
  { atomicNum: 36, symbol: "Kr", name: "Криптон",     period: 4, group: 18, category: "noble-gas",              atomicMass: 83.798 },
  // Period 5
  { atomicNum: 37, symbol: "Rb", name: "Рубидий",     period: 5, group: 1,  category: "alkali-metal",           atomicMass: 85.468 },
  { atomicNum: 38, symbol: "Sr", name: "Стронций",    period: 5, group: 2,  category: "alkaline-earth-metal",   atomicMass: 87.62 },
  { atomicNum: 39, symbol: "Y",  name: "Иттрий",      period: 5, group: 3,  category: "transition-metal",       atomicMass: 88.906 },
  { atomicNum: 40, symbol: "Zr", name: "Цирконий",    period: 5, group: 4,  category: "transition-metal",       atomicMass: 91.224 },
  { atomicNum: 41, symbol: "Nb", name: "Ниобий",      period: 5, group: 5,  category: "transition-metal",       atomicMass: 92.906 },
  { atomicNum: 42, symbol: "Mo", name: "Молибден",    period: 5, group: 6,  category: "transition-metal",       atomicMass: 95.95 },
  { atomicNum: 43, symbol: "Tc", name: "Технеций",    period: 5, group: 7,  category: "transition-metal",       atomicMass: 98 },
  { atomicNum: 44, symbol: "Ru", name: "Рутений",     period: 5, group: 8,  category: "transition-metal",       atomicMass: 101.07 },
  { atomicNum: 45, symbol: "Rh", name: "Родий",       period: 5, group: 9,  category: "transition-metal",       atomicMass: 102.91 },
  { atomicNum: 46, symbol: "Pd", name: "Палладий",    period: 5, group: 10, category: "transition-metal",       atomicMass: 106.42 },
  { atomicNum: 47, symbol: "Ag", name: "Серебро",     period: 5, group: 11, category: "transition-metal",       atomicMass: 107.87 },
  { atomicNum: 48, symbol: "Cd", name: "Кадмий",      period: 5, group: 12, category: "transition-metal",       atomicMass: 112.41 },
  { atomicNum: 49, symbol: "In", name: "Индий",       period: 5, group: 13, category: "post-transition-metal",  atomicMass: 114.82 },
  { atomicNum: 50, symbol: "Sn", name: "Олово",       period: 5, group: 14, category: "post-transition-metal",  atomicMass: 118.71 },
  { atomicNum: 51, symbol: "Sb", name: "Сурьма",      period: 5, group: 15, category: "metalloid",              atomicMass: 121.76 },
  { atomicNum: 52, symbol: "Te", name: "Теллур",      period: 5, group: 16, category: "metalloid",              atomicMass: 127.60 },
  { atomicNum: 53, symbol: "I",  name: "Иод",         period: 5, group: 17, category: "diatomic-nonmetal",      atomicMass: 126.90 },
  { atomicNum: 54, symbol: "Xe", name: "Ксенон",      period: 5, group: 18, category: "noble-gas",              atomicMass: 131.29 },
  // Period 6
  { atomicNum: 55, symbol: "Cs", name: "Цезий",       period: 6, group: 1,  category: "alkali-metal",           atomicMass: 132.91 },
  { atomicNum: 56, symbol: "Ba", name: "Барий",       period: 6, group: 2,  category: "alkaline-earth-metal",   atomicMass: 137.33 },
  // Lanthanides (period 6, group 0 — rendered separately)
  { atomicNum: 57, symbol: "La", name: "Лантан",      period: 6, group: 0,  category: "lanthanide",             atomicMass: 138.91 },
  { atomicNum: 58, symbol: "Ce", name: "Церий",       period: 6, group: 0,  category: "lanthanide",             atomicMass: 140.12 },
  { atomicNum: 59, symbol: "Pr", name: "Празеодим",   period: 6, group: 0,  category: "lanthanide",             atomicMass: 140.91 },
  { atomicNum: 60, symbol: "Nd", name: "Неодим",      period: 6, group: 0,  category: "lanthanide",             atomicMass: 144.24 },
  { atomicNum: 61, symbol: "Pm", name: "Прометий",    period: 6, group: 0,  category: "lanthanide",             atomicMass: 145 },
  { atomicNum: 62, symbol: "Sm", name: "Самарий",     period: 6, group: 0,  category: "lanthanide",             atomicMass: 150.36 },
  { atomicNum: 63, symbol: "Eu", name: "Европий",     period: 6, group: 0,  category: "lanthanide",             atomicMass: 151.96 },
  { atomicNum: 64, symbol: "Gd", name: "Гадолиний",   period: 6, group: 0,  category: "lanthanide",             atomicMass: 157.25 },
  { atomicNum: 65, symbol: "Tb", name: "Тербий",      period: 6, group: 0,  category: "lanthanide",             atomicMass: 158.93 },
  { atomicNum: 66, symbol: "Dy", name: "Диспрозий",   period: 6, group: 0,  category: "lanthanide",             atomicMass: 162.50 },
  { atomicNum: 67, symbol: "Ho", name: "Гольмий",     period: 6, group: 0,  category: "lanthanide",             atomicMass: 164.93 },
  { atomicNum: 68, symbol: "Er", name: "Эрбий",       period: 6, group: 0,  category: "lanthanide",             atomicMass: 167.26 },
  { atomicNum: 69, symbol: "Tm", name: "Тулий",       period: 6, group: 0,  category: "lanthanide",             atomicMass: 168.93 },
  { atomicNum: 70, symbol: "Yb", name: "Иттербий",    period: 6, group: 0,  category: "lanthanide",             atomicMass: 173.05 },
  { atomicNum: 71, symbol: "Lu", name: "Лютеций",     period: 6, group: 3,  category: "lanthanide",             atomicMass: 174.97 },
  // Period 6 continued
  { atomicNum: 72, symbol: "Hf", name: "Гафний",      period: 6, group: 4,  category: "transition-metal",       atomicMass: 178.49 },
  { atomicNum: 73, symbol: "Ta", name: "Тантал",      period: 6, group: 5,  category: "transition-metal",       atomicMass: 180.95 },
  { atomicNum: 74, symbol: "W",  name: "Вольфрам",    period: 6, group: 6,  category: "transition-metal",       atomicMass: 183.84 },
  { atomicNum: 75, symbol: "Re", name: "Рений",       period: 6, group: 7,  category: "transition-metal",       atomicMass: 186.21 },
  { atomicNum: 76, symbol: "Os", name: "Осмий",       period: 6, group: 8,  category: "transition-metal",       atomicMass: 190.23 },
  { atomicNum: 77, symbol: "Ir", name: "Иридий",      period: 6, group: 9,  category: "transition-metal",       atomicMass: 192.22 },
  { atomicNum: 78, symbol: "Pt", name: "Платина",     period: 6, group: 10, category: "transition-metal",       atomicMass: 195.08 },
  { atomicNum: 79, symbol: "Au", name: "Золото",      period: 6, group: 11, category: "transition-metal",       atomicMass: 196.97 },
  { atomicNum: 80, symbol: "Hg", name: "Ртуть",       period: 6, group: 12, category: "transition-metal",       atomicMass: 200.59 },
  { atomicNum: 81, symbol: "Tl", name: "Таллий",      period: 6, group: 13, category: "post-transition-metal",  atomicMass: 204.38 },
  { atomicNum: 82, symbol: "Pb", name: "Свинец",      period: 6, group: 14, category: "post-transition-metal",  atomicMass: 207.2 },
  { atomicNum: 83, symbol: "Bi", name: "Висмут",      period: 6, group: 15, category: "post-transition-metal",  atomicMass: 208.98 },
  { atomicNum: 84, symbol: "Po", name: "Полоний",     period: 6, group: 16, category: "post-transition-metal",  atomicMass: 209 },
  { atomicNum: 85, symbol: "At", name: "Астат",       period: 6, group: 17, category: "metalloid",              atomicMass: 210 },
  { atomicNum: 86, symbol: "Rn", name: "Радон",       period: 6, group: 18, category: "noble-gas",              atomicMass: 222 },
  // Period 7
  { atomicNum: 87, symbol: "Fr", name: "Франций",     period: 7, group: 1,  category: "alkali-metal",           atomicMass: 223 },
  { atomicNum: 88, symbol: "Ra", name: "Радий",       period: 7, group: 2,  category: "alkaline-earth-metal",   atomicMass: 226 },
  // Actinides (period 7, group 0 — rendered separately)
  { atomicNum: 89, symbol: "Ac", name: "Актиний",     period: 7, group: 0,  category: "actinide",               atomicMass: 227 },
  { atomicNum: 90, symbol: "Th", name: "Торий",       period: 7, group: 0,  category: "actinide",               atomicMass: 232.04 },
  { atomicNum: 91, symbol: "Pa", name: "Протактиний", period: 7, group: 0,  category: "actinide",               atomicMass: 231.04 },
  { atomicNum: 92, symbol: "U",  name: "Уран",        period: 7, group: 0,  category: "actinide",               atomicMass: 238.03 },
  { atomicNum: 93, symbol: "Np", name: "Нептуний",    period: 7, group: 0,  category: "actinide",               atomicMass: 237 },
  { atomicNum: 94, symbol: "Pu", name: "Плутоний",    period: 7, group: 0,  category: "actinide",               atomicMass: 244 },
  { atomicNum: 95, symbol: "Am", name: "Америций",    period: 7, group: 0,  category: "actinide",               atomicMass: 243 },
  { atomicNum: 96, symbol: "Cm", name: "Кюрий",       period: 7, group: 0,  category: "actinide",               atomicMass: 247 },
  { atomicNum: 97, symbol: "Bk", name: "Берклий",     period: 7, group: 0,  category: "actinide",               atomicMass: 247 },
  { atomicNum: 98, symbol: "Cf", name: "Калифорний",  period: 7, group: 0,  category: "actinide",               atomicMass: 251 },
  { atomicNum: 99, symbol: "Es", name: "Эйнштейний",  period: 7, group: 0,  category: "actinide",               atomicMass: 252 },
  { atomicNum: 100, symbol: "Fm", name: "Фермий",     period: 7, group: 0,  category: "actinide",               atomicMass: 257 },
  { atomicNum: 101, symbol: "Md", name: "Менделевий", period: 7, group: 0,  category: "actinide",               atomicMass: 258 },
  { atomicNum: 102, symbol: "No", name: "Нобелий",    period: 7, group: 0,  category: "actinide",               atomicMass: 259 },
  { atomicNum: 103, symbol: "Lr", name: "Лоуренсий",  period: 7, group: 3,  category: "actinide",               atomicMass: 266 },
  // Period 7 continued
  { atomicNum: 104, symbol: "Rf", name: "Резерфордий",period: 7, group: 4,  category: "transition-metal",       atomicMass: 267 },
  { atomicNum: 105, symbol: "Db", name: "Дубний",     period: 7, group: 5,  category: "transition-metal",       atomicMass: 268 },
  { atomicNum: 106, symbol: "Sg", name: "Сиборгий",   period: 7, group: 6,  category: "transition-metal",       atomicMass: 269 },
  { atomicNum: 107, symbol: "Bh", name: "Борий",      period: 7, group: 7,  category: "transition-metal",       atomicMass: 270 },
  { atomicNum: 108, symbol: "Hs", name: "Хассий",     period: 7, group: 8,  category: "transition-metal",       atomicMass: 277 },
  { atomicNum: 109, symbol: "Mt", name: "Мейтнерий",  period: 7, group: 9,  category: "unknown",                atomicMass: 278 },
  { atomicNum: 110, symbol: "Ds", name: "Дармштадтий",period: 7, group: 10, category: "unknown",                atomicMass: 281 },
  { atomicNum: 111, symbol: "Rg", name: "Рентгений",  period: 7, group: 11, category: "unknown",                atomicMass: 282 },
  { atomicNum: 112, symbol: "Cn", name: "Коперниций", period: 7, group: 12, category: "transition-metal",       atomicMass: 285 },
  { atomicNum: 113, symbol: "Nh", name: "Нихоний",    period: 7, group: 13, category: "unknown",                atomicMass: 286 },
  { atomicNum: 114, symbol: "Fl", name: "Флеровий",   period: 7, group: 14, category: "unknown",                atomicMass: 289 },
  { atomicNum: 115, symbol: "Mc", name: "Московий",   period: 7, group: 15, category: "unknown",                atomicMass: 290 },
  { atomicNum: 116, symbol: "Lv", name: "Ливерморий", period: 7, group: 16, category: "unknown",                atomicMass: 293 },
  { atomicNum: 117, symbol: "Ts", name: "Теннессин",  period: 7, group: 17, category: "unknown",                atomicMass: 294 },
  { atomicNum: 118, symbol: "Og", name: "Оганесон",   period: 7, group: 18, category: "noble-gas",              atomicMass: 294 },
];

/** Helper: get element symbol by atomic number */
export function getSymbolByAtomicNum(atomicNum: number): string {
  return elements.find(e => e.atomicNum === atomicNum)?.symbol ?? `#${atomicNum}`;
}
