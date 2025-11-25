import { User, Farm, Safra, FieldOperation, Cost, Harvest, Machinery, Improvement, OperationType, CostType, VariableCostCategory } from './types';

export const MOCK_USERS: User[] = [
    {
        id: 'user1',
        name: 'João da Silva',
        username: 'joao',
        password: 'password',
        profile: 'Produtor',
        profilePictureUrl: 'https://picsum.photos/100',
        cpf: '123.456.789-00',
    },
    {
        id: 'user2',
        name: 'Ana a Técnica',
        username: 'ana',
        password: 'password',
        profile: 'Técnico',
        profilePictureUrl: 'https://picsum.photos/seed/tech/100',
        cpf: '009.876.543-21',
    }
];


export const MOCK_FARMS: Farm[] = [
    { id: 'farm1', name: 'Fazenda Boa Esperança', location: 'Anitápolis, SC', producerName: 'João da Silva' },
    { id: 'farm2', name: 'Sítio Recanto Verde', location: 'Alfredo Wagner, SC', producerName: 'João da Silva' },
];

export const MOCK_SAFRAS: Safra[] = [
    { id: 'safra1', farmId: 'farm1', name: 'Milho Verão 23/24', culture: 'Milho', variety: 'AG-7098', area: 50, startDate: '2023-10-15T00:00:00', isActive: true },
    { id: 'safra2', farmId: 'farm1', name: 'Soja Safra 23/24', culture: 'Soja', variety: 'TMG-7062', area: 75, startDate: '2023-11-01T00:00:00', isActive: true },
    { id: 'safra3', farmId: 'farm2', name: 'Trigo Inverno 23', culture: 'Trigo', variety: 'TBIO-Audaz', area: 30, startDate: '2023-05-20T00:00:00', isActive: false },
];

export const MOCK_OPERATIONS: FieldOperation[] = [
    { id: 'op1', safraId: 'safra1', date: '2023-10-16T00:00:00', type: OperationType.Plantio, details: '-', cost: 15000.00 },
    { id: 'op2', safraId: 'safra1', date: '2023-11-20T00:00:00', type: OperationType.AdubacaoCorrecao, details: 'NPK 10-20-20', cost: 25000.00 },
    { id: 'op3', safraId: 'safra1', date: '2024-01-15T00:00:00', type: OperationType.Defensivo, details: 'Herbicida XPTO', cost: 8000.00 },
];

export const MOCK_COSTS: Cost[] = [
    { id: 'cost1', safraId: 'safra1', date: '2024-03-20T00:00:00', type: CostType.Variavel, category: VariableCostCategory.MaoDeObra, description: 'Pagamento colheita', value: 12000.00 },
    { id: 'cost2', safraId: 'safra1', date: '2024-03-25T00:00:00', type: CostType.Variavel, category: VariableCostCategory.Transporte, description: 'Frete para o silo', value: 7500.00 },
    { id: 'cost3', type: CostType.Fixo, date: '2024-01-10T00:00:00', category: 'Impostos', description: 'ITR', value: 15000.00},
    { id: 'cost4', type: CostType.Fixo, date: '2024-02-10T00:00:00', category: 'Salários', description: 'Funcionário Fixo', value: 23657.5342 / 12 },
];

export const MOCK_HARVESTS: Harvest[] = [
    { id: 'harvest1', safraId: 'safra1', date: '2024-03-18T00:00:00', quantity: 4500, unit: 'saca', unitPrice: 55.00, responsible: 'João da Silva' },
];

export const MOCK_MACHINERY: Machinery[] = [
    { id: 'mach1', farmId: 'farm1', name: 'Trator Valtra A950', type: 'Trator', acquisitionValue: 250000.00, acquisitionDate: '2020-01-15T00:00:00', lifespanYears: 10, residualValuePercentage: 20 },
];

export const MOCK_IMPROVEMENTS: Improvement[] = [
    { id: 'imp1', farmId: 'farm1', name: 'Construção de Silo', totalValue: 150000.00, installments: { current: 30, total: 60 }, paymentStartDate: '2021-07-20T00:00:00' },
];