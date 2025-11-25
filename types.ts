export enum Screen {
  Login,
  Home,
  Safras,
  Operacoes,
  Custos,
  Colheitas,
  Maquinario,
  Benfeitorias,
  Resultados,
  Relatorios,
  Configuracoes,
  SafraDetalhes, // New screen for safra details
  ReportView, // New screen to display generated report
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  profile: 'Produtor' | 'Técnico';
  profilePictureUrl: string;
  cpf: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  producerName?: string; // For technicians managing multiple producers
  latitude?: number;
  longitude?: number;
}

export interface SoilAnalysis {
  ph: number;
  phosphorus: number; // P
  potassium: number;  // K
  organicMatter: number; // M.O.
  calcium: number; // Ca
  magnesium: number; // Mg
  aluminum: number; // Al
  baseSaturation?: number; // V%
  aluminumSaturation?: number; // m%
  cec?: number; // CTC
  sulfur?: number; // S
  boron?: number; // B
  copper?: number; // Cu
  iron?: number; // Fe
  manganese?: number; // Mn
  zinc?: number; // Zn
}

export interface Safra {
  id: string;
  farmId: string;
  name: string;
  culture: string;
  variety: string;
  area: number; // in hectares (ha)
  startDate: string;
  endDate?: string;
  isActive: boolean;
  soilAnalysis?: SoilAnalysis;
}

export enum OperationType {
  Plantio = 'Plantio',
  Defensivo = 'Defensivo',
  AdubacaoCorrecao = 'Adubação e Correção',
  Irrigacao = 'Irrigação',
  PreparoSolo = 'Preparo do Solo',
  TratamentoAdicional = 'Tratamento Adicional',
  TratosCulturais = 'Tratos Culturais',
  Outra = 'Outra',
}

export interface FieldOperation {
  id: string;
  safraId: string;
  date: string;
  type: OperationType;
  details: string;
  cost: number;
}

export enum CostType {
  Variavel = 'Variável',
  Fixo = 'Fixo',
}

// Added this to allow string type from tab state
export type CostTypeString = 'Variável' | 'Fixo';


export enum VariableCostCategory {
  MaoDeObra = 'Mão de Obra',
  Transporte = 'Transporte',
  Armazenagem = 'Armazenagem',
  Outro = 'Outro',
}

export interface Cost {
  id: string;
  safraId?: string; // Optional for fixed costs not tied to a specific safra
  date: string;
  type: CostType;
  category: string;
  description: string;
  value: number;
}

export interface Harvest {
  id: string;
  safraId: string;
  date: string;
  quantity: number;
  unit: 'kg' | 'saca' | 'ton';
  unitPrice: number;
  responsible: string;
}

export interface Machinery {
  id: string;
  farmId: string;
  name: string;
  type: string; // This will be the selected type from the list
  acquisitionValue: number;
  acquisitionDate: string;
  lifespanYears: number;
  residualValuePercentage: number;
}

export interface Improvement {
  id: string;
  farmId: string;
  name: string;
  totalValue: number;
  installments: {
    current: number;
    total: number;
  };
  paymentStartDate: string;
}