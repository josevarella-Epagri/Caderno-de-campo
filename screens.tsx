import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { AppContext } from './App';
import { Button, Input, Checkbox, Modal, Card, PageHeader, Select, formatCurrency, formatDate, dateToInputFormat, ConfirmModal, ActionButtons, IconButton } from './components/common';
import { Logo, MENU_ITEMS, OPERATION_TYPES, VARIABLE_COST_CATEGORIES, FIXED_COST_CATEGORIES, LogoutIcon, EditIcon, DeleteIcon, EpagriHeader } from './constants';
import { MACHINERY_DATA } from './machinery_data';
import { Screen, Safra, OperationType, CostType, FieldOperation, Cost, Harvest, Machinery, Improvement, User, CostTypeString, Farm } from './types';

const NovoUsuarioForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addUser, users } = useContext(AppContext);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const cpf = formData.get('cpf') as string;
        const profile = formData.get('profile') as 'Produtor' | 'Técnico';


        if (password !== confirmPassword) {
            setError('As senhas não conferem.');
            return;
        }
        if (users.find(u => u.username === username)) {
            setError('Nome de usuário já existe.');
            return;
        }
         if (users.find(u => u.cpf === cpf)) {
            setError('CPF já cadastrado.');
            return;
        }

        addUser({ name, username, password, cpf, profile });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" label="Nome Completo" required />
            <Input name="cpf" label="CPF" required />
            <Input name="username" label="Nome de Usuário" required />
            <Select name="profile" label="Perfil" required>
                <option value="Produtor">Produtor</option>
                <option value="Técnico">Técnico</option>
            </Select>
            <Input name="password" label="Senha" type="password" required />
            <Input name="confirmPassword" label="Confirmar Senha" type="password" required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Cadastrar</Button>
            </div>
        </form>
    )
}


export const LoginScreen: React.FC = () => {
    const { login } = useContext(AppContext);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <div className="w-full max-w-sm">
                <div className="text-center">
                    <Logo />
                    <div className="my-8">
                        <h2 className="text-3xl font-extrabold text-brand-text">
                            Caderno de Campo
                        </h2>
                        <p className="mt-2 text-sm text-brand-text-secondary">
                            Acesse sua conta para gerenciar suas safras.
                        </p>
                    </div>
                </div>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); login( (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value, (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value ); }}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <Input name="username" type="text" placeholder="Nome de usuário" defaultValue="joao" className="rounded-t-md" />
                        <Input name="password" type="password" placeholder="Senha" defaultValue="password" className="rounded-b-md" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Checkbox id="remember-me" label="Lembrar login" />
                        <div className="text-sm">
                            <button type="button" onClick={() => setRegisterModalOpen(true)} className="font-medium text-brand-accent hover:text-brand-accent-hover">
                                Cadastrar Novo Usuário
                            </button>
                        </div>
                    </div>

                    <div>
                        <Button type="submit">
                            Entrar
                        </Button>
                    </div>
                </form>
            </div>
            <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} title="Cadastrar Novo Usuário">
                <NovoUsuarioForm onClose={() => setRegisterModalOpen(false)} />
            </Modal>
        </div>
    );
};

export const HomeScreen: React.FC = () => {
    const { user, setScreen, logout } = useContext(AppContext);

    return (
        <div className="p-4 text-brand-text">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <img src={user?.profilePictureUrl} alt="Foto do Perfil" className="w-16 h-16 rounded-full mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold">Caderno de Campo</h1>
                        <p className="text-brand-text-secondary">Bem-vindo, {user?.name}!</p>
                    </div>
                </div>
                <IconButton onClick={logout} ariaLabel="Sair" className="text-brand-text-secondary">
                    <LogoutIcon />
                </IconButton>
            </header>
            <main>
                <div className="grid grid-cols-2 gap-4">
                    {MENU_ITEMS.map((item) => (
                        <button key={item.title} onClick={() => setScreen(item.screen)} className="bg-brand-light p-4 rounded-lg flex flex-col items-center justify-center text-center aspect-square transition-transform transform hover:scale-105">
                            <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center mb-2">
                              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                                {item.icon}
                              </div>
                            </div>
                            <span className="font-semibold">{item.title}</span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

const NovaSafraForm: React.FC<{onClose: () => void, safraToEdit?: Safra | null}> = ({onClose, safraToEdit}) => {
    const { farms, addSafra, updateSafra } = useContext(AppContext);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const safraData = {
            farmId: formData.get('farmId') as string,
            name: formData.get('name') as string,
            culture: formData.get('culture') as string,
            variety: formData.get('variety') as string,
            area: Number(formData.get('area')),
            startDate: new Date(formData.get('startDate') as string).toISOString(),
            soilAnalysis: {
                ph: Number(formData.get('soil-ph')),
                phosphorus: Number(formData.get('soil-phosphorus')),
                potassium: Number(formData.get('soil-potassium')),
                organicMatter: Number(formData.get('soil-organicMatter')),
                calcium: Number(formData.get('soil-calcium')),
                magnesium: Number(formData.get('soil-magnesium')),
                aluminum: Number(formData.get('soil-aluminum')),
                baseSaturation: Number(formData.get('soil-baseSaturation')),
                aluminumSaturation: Number(formData.get('soil-aluminumSaturation')),
                cec: Number(formData.get('soil-cec')),
                sulfur: Number(formData.get('soil-sulfur')),
                boron: Number(formData.get('soil-boron')),
                copper: Number(formData.get('soil-copper')),
                iron: Number(formData.get('soil-iron')),
                manganese: Number(formData.get('soil-manganese')),
                zinc: Number(formData.get('soil-zinc')),
            }
        };

        if (safraToEdit) {
            updateSafra({ ...safraToEdit, ...safraData });
        } else {
            addSafra(safraData);
        }
        
        onClose();
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <Select name="farmId" label="Fazenda" required defaultValue={safraToEdit?.farmId}>
                {farms.map(farm => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
            </Select>
            <Input name="name" label="Nome da Safra (ex: Soja Verão 23/24)" required defaultValue={safraToEdit?.name}/>
            <Input name="culture" label="Cultura" required defaultValue={safraToEdit?.culture} />
            <Input name="variety" label="Variedade" required defaultValue={safraToEdit?.variety} />
            <Input name="area" label="Área (ha)" type="number" step="0.1" required defaultValue={safraToEdit?.area} />
            <Input name="startDate" label="Data de Início" type="date" defaultValue={dateToInputFormat(safraToEdit?.startDate || new Date().toISOString())} required />
            
            <details className="text-brand-text-secondary cursor-pointer pt-2" open={!!safraToEdit?.soilAnalysis}>
                <summary className="font-semibold text-brand-text">Análise de Solo (Opcional)</summary>
                <Card className="p-4 mt-2 bg-brand-darker rounded-md space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Input name="soil-ph" label="pH em H₂O" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.ph} />
                        <Input name="soil-organicMatter" label="M.O. (%)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.organicMatter}/>
                        <Input name="soil-phosphorus" label="Fósforo (P) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.phosphorus}/>
                        <Input name="soil-potassium" label="Potássio (K) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.potassium}/>
                        <Input name="soil-calcium" label="Cálcio (Ca) (cmolc/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.calcium}/>
                        <Input name="soil-magnesium" label="Magnésio (Mg) (cmolc/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.magnesium}/>
                        <Input name="soil-aluminum" label="Alumínio (Al) (cmolc/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.aluminum}/>
                        <Input name="soil-baseSaturation" label="Sat. Bases (V%)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.baseSaturation}/>
                        <Input name="soil-aluminumSaturation" label="Sat. Alumínio (m%)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.aluminumSaturation}/>
                        <Input name="soil-cec" label="CTC (cmolc/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.cec}/>
                        <Input name="soil-sulfur" label="Enxofre (S) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.sulfur}/>
                        <Input name="soil-boron" label="Boro (B) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.boron}/>
                        <Input name="soil-copper" label="Cobre (Cu) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.copper}/>
                        <Input name="soil-iron" label="Ferro (Fe) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.iron}/>
                        <Input name="soil-manganese" label="Manganês (Mn) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.manganese}/>
                        <Input name="soil-zinc" label="Zinco (Zn) (mg/dm³)" type="number" step="0.1" defaultValue={safraToEdit?.soilAnalysis?.zinc}/>
                    </div>
                </Card>
            </details>
            
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    );
};

export const SafrasScreen: React.FC = () => {
    const { safras, setScreen, deleteSafra, setSelectedSafra } = useContext(AppContext);
    const [showInactive, setShowInactive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [safraToEdit, setSafraToEdit] = useState<Safra | null>(null);
    const [safraToDelete, setSafraToDelete] = useState<Safra | null>(null);

    const filteredSafras = safras.filter(s => showInactive || s.isActive);
    
    const handleOpenModal = (safra: Safra | null = null) => {
        setSafraToEdit(safra);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSafraToEdit(null);
    };
    
    const handleViewDetails = (safra: Safra) => {
        setSelectedSafra(safra);
        setScreen(Screen.SafraDetalhes);
    }

    return (
        <div className="p-4">
            <PageHeader title="Minhas Safras" onBack={() => setScreen(Screen.Home)} />
            <div className="flex justify-between items-center mb-6">
                <Checkbox id="show-inactive" label="Mostrar safras inativas" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
                <Button onClick={() => handleOpenModal()} className="w-auto px-4 py-2">Nova Safra</Button>
            </div>

            <div className="space-y-4">
                {filteredSafras.map(safra => (
                    <Card key={safra.id} className="text-brand-text">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-brand-accent">{safra.name}</h3>
                                <p className="text-sm">{safra.culture} - {safra.variety}</p>
                                <p className="text-sm text-brand-text-secondary">{safra.area} ha</p>
                                <p className="text-sm text-brand-text-secondary">Início: {formatDate(safra.startDate)}</p>
                            </div>
                            <ActionButtons onEdit={() => handleOpenModal(safra)} onDelete={() => setSafraToDelete(safra)} />
                        </div>
                        <div className="flex justify-end mt-2">
                             <button onClick={() => handleViewDetails(safra)} className="text-brand-accent font-semibold hover:underline text-sm">Ver Detalhes</button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={safraToEdit ? "Editar Safra" : "Nova Safra"}>
                <NovaSafraForm onClose={handleCloseModal} safraToEdit={safraToEdit} />
            </Modal>
            <ConfirmModal 
                isOpen={!!safraToDelete}
                onClose={() => setSafraToDelete(null)}
                onConfirm={() => {
                    if (safraToDelete) {
                        deleteSafra(safraToDelete.id);
                        setSafraToDelete(null);
                    }
                }}
                title="Excluir Safra"
                message={`Tem certeza que deseja excluir a safra "${safraToDelete?.name}"? Esta ação não pode ser desfeita.`}
            />
        </div>
    );
};

const NovaOperacaoForm: React.FC<{safraId: string, onClose: () => void, operationToEdit?: FieldOperation | null}> = ({safraId, onClose, operationToEdit}) => {
    const { addOperation, updateOperation } = useContext(AppContext);
    const [operationType, setOperationType] = useState<OperationType>(operationToEdit?.type || OperationType.Plantio);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const opData = {
            safraId,
            date: new Date(formData.get('date') as string).toISOString(),
            type: formData.get('type') as OperationType,
            details: formData.get('details') as string,
            cost: Number(formData.get('cost')),
        };
        
        if (operationToEdit) {
            updateOperation({ ...operationToEdit, ...opData });
        } else {
            addOperation(opData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="date" label="Data" type="date" defaultValue={dateToInputFormat(operationToEdit?.date || new Date().toISOString())} required />
            <Select name="type" label="Tipo" value={operationType} onChange={(e) => setOperationType(e.target.value as OperationType)} required>
                {OPERATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>

            {operationType === OperationType.Defensivo && (
                <Card className="bg-brand-darker space-y-3">
                    <Input name="defensivo-produto" label="Nome do Produto/Defensivo" />
                    <Input name="defensivo-dose" label="Dose (unidade/ha)" />
                    <Input name="defensivo-calda" label="Volume de Calda (L/ha)" />
                    <Input name="defensivo-ph" label="pH da Água" />
                    <Input name="defensivo-carencia" label="Período de Carência (dias)" />
                    <fieldset>
                        <legend className="text-sm font-medium text-brand-text-secondary mb-1">Condições Climáticas</legend>
                        <div className="grid grid-cols-2 gap-2">
                             <Input name="clima-temp" label="Temperatura (°C)" />
                             <Input name="clima-umidade" label="Umidade (%)" />
                             <Input name="clima-vento" label="Vento" />
                             <Input name="clima-clima" label="Clima" />
                        </div>
                    </fieldset>
                </Card>
            )}

            <Input name="details" label="Nome / Descrição da Operação (opcional)" defaultValue={operationToEdit?.details}/>
            <Input name="cost" label="Custo Total (R$)" type="number" step="0.01" required defaultValue={operationToEdit?.cost} />
             <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    );
};

export const OperacoesScreen: React.FC = () => {
    const { safras, operations, setScreen, deleteOperation } = useContext(AppContext);
    const [selectedSafraId, setSelectedSafraId] = useState<string>(safras.find(s=>s.isActive)?.id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [opToEdit, setOpToEdit] = useState<FieldOperation|null>(null);
    const [opToDelete, setOpToDelete] = useState<FieldOperation|null>(null);

    const filteredOperations = operations.filter(op => op.safraId === selectedSafraId);
    const totalCost = filteredOperations.reduce((sum, op) => sum + op.cost, 0);
    
    const handleOpenModal = (op: FieldOperation | null = null) => {
        setOpToEdit(op);
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setOpToEdit(null);
    }

    return (
        <div className="p-4">
            <PageHeader title="Operações de Campo" onBack={() => setScreen(Screen.Home)} />
            <Card className="mb-6">
                <Select
                    label="Selecione a Safra"
                    value={selectedSafraId}
                    onChange={(e) => setSelectedSafraId(e.target.value)}
                >
                    {safras.filter(s=>s.isActive).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-brand-text-secondary">Custo Total:</p>
                        <p className="text-2xl font-bold text-brand-text">{formatCurrency(totalCost)}</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="w-auto px-4">Registrar Operação</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-brand-text">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-2">Data</th>
                                <th className="p-2">Tipo</th>
                                <th className="p-2 hidden sm:table-cell">Detalhes</th>
                                <th className="p-2 text-right">Custo</th>
                                <th className="p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOperations.map(op => (
                                <tr key={op.id} className="border-b border-gray-700">
                                    <td className="p-2">{formatDate(op.date)}</td>
                                    <td className="p-2">{op.type}</td>
                                    <td className="p-2 hidden sm:table-cell">{op.details}</td>
                                    <td className="p-2 text-right">{formatCurrency(op.cost)}</td>
                                    <td className="p-2"><ActionButtons onEdit={() => handleOpenModal(op)} onDelete={() => setOpToDelete(op)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={opToEdit ? "Editar Operação" : "Registrar Operação de Campo"}>
                {selectedSafraId && <NovaOperacaoForm safraId={selectedSafraId} onClose={handleCloseModal} operationToEdit={opToEdit} />}
            </Modal>
            <ConfirmModal
                isOpen={!!opToDelete}
                onClose={() => setOpToDelete(null)}
                onConfirm={() => {
                    if (opToDelete) {
                        deleteOperation(opToDelete.id);
                        setOpToDelete(null);
                    }
                }}
                title="Excluir Operação"
                message={`Tem certeza que deseja excluir a operação do tipo "${opToDelete?.type}"?`}
            />
        </div>
    );
};


const NovoCustoForm: React.FC<{ type: CostTypeString, safraId?: string, onClose: () => void, costToEdit?: Cost | null }> = ({ type, safraId, onClose, costToEdit }) => {
    const { addCost, updateCost } = useContext(AppContext);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const costData = {
            safraId: safraId,
            date: new Date(formData.get('date') as string).toISOString(),
            type: type === 'Variável' ? CostType.Variavel : CostType.Fixo,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            value: Number(formData.get('value')),
        };

        if (costToEdit) {
            updateCost({ ...costToEdit, ...costData });
        } else {
            addCost(costData);
        }
        onClose();
    };

    const categories = type === 'Variável' ? VARIABLE_COST_CATEGORIES : FIXED_COST_CATEGORIES;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="date" label="Data" type="date" defaultValue={dateToInputFormat(costToEdit?.date || new Date().toISOString())} required />
            <Select name="category" label="Tipo" required defaultValue={costToEdit?.category}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <Input name="description" label="Descrição" required defaultValue={costToEdit?.description} />
            <Input name="value" label="Valor (R$)" type="number" step="0.01" required defaultValue={costToEdit?.value} />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    );
};

export const CustosScreen: React.FC = () => {
    const { safras, costs, setScreen, deleteCost } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<CostTypeString>('Variável');
    const [selectedSafraId, setSelectedSafraId] = useState<string>(safras.find(s => s.isActive)?.id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [costToEdit, setCostToEdit] = useState<Cost | null>(null);
    const [costToDelete, setCostToDelete] = useState<Cost | null>(null);

    const handleOpenModal = (cost: Cost | null = null) => {
        setCostToEdit(cost);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCostToEdit(null);
    };

    const filteredCosts = costs.filter(c => {
        if (activeTab === 'Variável') {
            return c.type === 'Variável' && c.safraId === selectedSafraId;
        }
        return c.type === 'Fixo';
    });

    return (
        <div className="p-4">
            <PageHeader title="Gerenciamento de Custos" onBack={() => setScreen(Screen.Home)} />
            <div className="mb-4 border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('Variável')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Variável' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        Custos Variáveis
                    </button>
                    <button
                        onClick={() => setActiveTab('Fixo')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Fixo' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        Custos Fixos
                    </button>
                </nav>
            </div>

            {activeTab === 'Variável' && (
                <Card className="mb-6">
                    <Select label="Selecione a Safra" value={selectedSafraId} onChange={(e) => setSelectedSafraId(e.target.value)}>
                        {safras.filter(s => s.isActive).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                </Card>
            )}

            <Button onClick={() => handleOpenModal()} className="mb-6">
                Registrar Custo {activeTab}
            </Button>

            <Card>
                <table className="w-full text-left text-sm text-brand-text">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">Data</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Descrição</th>
                            <th className="p-2 text-right">Valor</th>
                            <th className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCosts.map(cost => (
                            <tr key={cost.id} className="border-b border-gray-700">
                                <td className="p-2">{formatDate(cost.date)}</td>
                                <td className="p-2">{cost.category}</td>
                                <td className="p-2">{cost.description}</td>
                                <td className="p-2 text-right">{formatCurrency(cost.value)}</td>
                                <td className="p-2"><ActionButtons onEdit={() => handleOpenModal(cost)} onDelete={() => setCostToDelete(cost)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`${costToEdit ? 'Editar' : 'Registrar'} Custo ${activeTab}`}>
                <NovoCustoForm type={activeTab} safraId={activeTab === 'Variável' ? selectedSafraId : undefined} onClose={handleCloseModal} costToEdit={costToEdit} />
            </Modal>
            <ConfirmModal 
                isOpen={!!costToDelete}
                onClose={() => setCostToDelete(null)}
                onConfirm={() => {
                    if (costToDelete) {
                        deleteCost(costToDelete.id);
                        setCostToDelete(null);
                    }
                }}
                title="Excluir Custo"
                message={`Tem certeza que deseja excluir o custo "${costToDelete?.description}"?`}
            />
        </div>
    );
};

const NovaColheitaForm: React.FC<{ safraId: string, onClose: () => void, harvestToEdit?: Harvest | null }> = ({ safraId, onClose, harvestToEdit }) => {
    const { addHarvest, updateHarvest } = useContext(AppContext);
    const [quantity, setQuantity] = useState(harvestToEdit?.quantity || 0);
    const [unitPrice, setUnitPrice] = useState(harvestToEdit?.unitPrice || 0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const harvestData = {
            safraId,
            date: new Date(formData.get('date') as string).toISOString(),
            quantity: Number(formData.get('quantity')),
            unit: formData.get('unit') as 'kg' | 'saca' | 'ton',
            unitPrice: Number(formData.get('unitPrice')),
            responsible: formData.get('responsible') as string,
        };

        if (harvestToEdit) {
            updateHarvest({ ...harvestToEdit, ...harvestData });
        } else {
            addHarvest(harvestData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="date" label="Data" type="date" defaultValue={dateToInputFormat(harvestToEdit?.date || new Date().toISOString())} required />
            <div className="flex items-end gap-2">
                <Input name="quantity" label="Quantidade" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required className="flex-grow" />
                <Select name="unit" defaultValue={harvestToEdit?.unit || "saca"} className="w-28">
                    <option>kg</option>
                    <option>saca</option>
                    <option>ton</option>
                </Select>
            </div>
            <Input name="unitPrice" label="Preço Unitário (R$)" type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value))} required />
            <Input name="responsible" label="Responsável" required defaultValue={harvestToEdit?.responsible} />
            <div className="text-right text-brand-text font-bold">
                Receita: {formatCurrency(quantity * unitPrice)}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    );
};

export const ColheitasScreen: React.FC = () => {
    const { safras, harvests, setScreen, deleteHarvest } = useContext(AppContext);
    const [selectedSafraId, setSelectedSafraId] = useState<string>(safras.find(s => s.isActive)?.id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [harvestToEdit, setHarvestToEdit] = useState<Harvest | null>(null);
    const [harvestToDelete, setHarvestToDelete] = useState<Harvest | null>(null);

    const handleOpenModal = (harvest: Harvest | null = null) => {
        setHarvestToEdit(harvest);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setHarvestToEdit(null);
    };

    const filteredHarvests = harvests.filter(h => h.safraId === selectedSafraId);
    const totalRevenue = filteredHarvests.reduce((sum, h) => sum + h.quantity * h.unitPrice, 0);

    return (
        <div className="p-4">
            <PageHeader title="Colheitas" onBack={() => setScreen(Screen.Home)} />
            <Card className="mb-6">
                <Select label="Selecione a Safra" value={selectedSafraId} onChange={(e) => setSelectedSafraId(e.target.value)}>
                    {safras.filter(s => s.isActive).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-brand-text-secondary">Receita Total:</p>
                        <p className="text-2xl font-bold text-brand-text">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="w-auto px-4">Registrar Colheita</Button>
                </div>
                <table className="w-full text-left text-sm text-brand-text">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">Data</th>
                            <th className="p-2">Quantidade</th>
                            <th className="p-2">Preço Unit.</th>
                            <th className="p-2 text-right">Total</th>
                            <th className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHarvests.map(h => (
                            <tr key={h.id} className="border-b border-gray-700">
                                <td className="p-2">{formatDate(h.date)}</td>
                                <td className="p-2">{h.quantity} {h.unit}</td>
                                <td className="p-2">{formatCurrency(h.unitPrice)}</td>
                                <td className="p-2 text-right">{formatCurrency(h.quantity * h.unitPrice)}</td>
                                <td className="p-2"><ActionButtons onEdit={() => handleOpenModal(h)} onDelete={() => setHarvestToDelete(h)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={harvestToEdit ? 'Editar Colheita' : 'Registrar Colheita'}>
                {selectedSafraId && <NovaColheitaForm safraId={selectedSafraId} onClose={handleCloseModal} harvestToEdit={harvestToEdit} />}
            </Modal>
             <ConfirmModal 
                isOpen={!!harvestToDelete}
                onClose={() => setHarvestToDelete(null)}
                onConfirm={() => {
                    if (harvestToDelete) {
                        deleteHarvest(harvestToDelete.id);
                        setHarvestToDelete(null);
                    }
                }}
                title="Excluir Colheita"
                message={`Tem certeza que deseja excluir o registro de colheita de ${harvestToDelete?.quantity} ${harvestToDelete?.unit}?`}
            />
        </div>
    );
};


const NovoMaquinarioForm: React.FC<{ onClose: () => void, machineryToEdit?: Machinery | null }> = ({ onClose, machineryToEdit }) => {
    const { addMachinery, updateMachinery, farms } = useContext(AppContext);
    const [selectedType, setSelectedType] = useState(machineryToEdit?.type || MACHINERY_DATA[0].name);
    const [acquisitionValue, setAcquisitionValue] = useState(machineryToEdit?.acquisitionValue || 0);

    const selectedMachineData = useMemo(() => {
        return MACHINERY_DATA.find(m => m.name === selectedType);
    }, [selectedType]);

    const residualValue = useMemo(() => {
        if (!selectedMachineData) return 0;
        return acquisitionValue * (selectedMachineData.residualValuePercentage / 100);
    }, [selectedMachineData, acquisitionValue]);

    const annualDepreciation = useMemo(() => {
        if (!selectedMachineData || !selectedMachineData.lifespanYears) return 0;
        return (acquisitionValue - residualValue) / selectedMachineData.lifespanYears;
    }, [acquisitionValue, residualValue, selectedMachineData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!selectedMachineData) return;

        const machineryData = {
            farmId: formData.get('farmId') as string,
            name: formData.get('name') as string,
            type: selectedMachineData.name,
            acquisitionValue: Number(formData.get('acquisitionValue')),
            acquisitionDate: new Date(formData.get('acquisitionDate') as string).toISOString(),
            lifespanYears: selectedMachineData.lifespanYears,
            residualValuePercentage: selectedMachineData.residualValuePercentage
        };

        if(machineryToEdit) {
            updateMachinery({ ...machineryToEdit, ...machineryData });
        } else {
            addMachinery(machineryData);
        }
        onClose();
    };

    useEffect(() => {
        if (machineryToEdit) {
            setSelectedType(machineryToEdit.type);
            setAcquisitionValue(machineryToEdit.acquisitionValue);
        }
    }, [machineryToEdit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-brand-text">
             <Select name="farmId" label="Propriedade" required defaultValue={machineryToEdit?.farmId}>
                {farms.map(farm => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
            </Select>
            <Input name="name" label="Nome / Identificação" placeholder="Trator Valtra Amarelo" required defaultValue={machineryToEdit?.name} />
            <Select label="Tipo de Maquinário" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                {MACHINERY_DATA.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
            </Select>
            <Input name="acquisitionValue" label="Valor de Aquisição (R$)" type="number" step="0.01" value={acquisitionValue} onChange={e => setAcquisitionValue(Number(e.target.value))} required />
            <Input name="acquisitionDate" label="Data de Aquisição" type="date" required defaultValue={dateToInputFormat(machineryToEdit?.acquisitionDate || new Date().toISOString())} />
            
            <Card className="bg-brand-darker">
                <h4 className="font-semibold mb-2">Dados do Equipamento:</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="text-brand-text-secondary">Vida Útil:</p> <p>{selectedMachineData?.lifespanYears || 'N/A'} anos</p>
                    <p className="text-brand-text-secondary">Valor Residual:</p> <p>{selectedMachineData?.residualValuePercentage || 'N/A'}%</p>
                </div>
            </Card>

            <Card className="bg-brand-darker">
                <h4 className="font-semibold mb-2">Cálculos Automáticos:</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="text-brand-text-secondary">Valor Residual Final:</p> <p>{formatCurrency(residualValue)}</p>
                    <p className="text-brand-text-secondary">Depreciação Anual:</p> <p>{formatCurrency(annualDepreciation)}</p>
                </div>
            </Card>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    );
};

export const MaquinarioScreen: React.FC = () => {
    const { machinery, setScreen, deleteMachinery, farms } = useContext(AppContext);
    const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [machineryToEdit, setMachineryToEdit] = useState<Machinery | null>(null);
    const [machineryToDelete, setMachineryToDelete] = useState<Machinery | null>(null);

    const filteredMachinery = machinery.filter(m => m.farmId === selectedFarmId);

    const handleOpenModal = (item: Machinery | null = null) => {
        setMachineryToEdit(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMachineryToEdit(null);
    };

    return (
        <div className="p-4">
            <PageHeader title="Maquinário" onBack={() => setScreen(Screen.Home)} />
             <Card className="mb-6">
                <Select label="Selecione a Propriedade" value={selectedFarmId} onChange={e => setSelectedFarmId(e.target.value)}>
                    {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
            </Card>
            <Button onClick={() => handleOpenModal()} className="mb-6">Adicionar Maquinário</Button>
            <Card>
                <table className="w-full text-left text-sm text-brand-text">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">Nome</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2 text-right">Valor</th>
                            <th className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMachinery.map(m => (
                            <tr key={m.id} className="border-b border-gray-700">
                                <td className="p-2">{m.name}</td>
                                <td className="p-2">{m.type}</td>
                                <td className="p-2 text-right">{formatCurrency(m.acquisitionValue)}</td>
                                <td className="p-2"><ActionButtons onEdit={() => handleOpenModal(m)} onDelete={() => setMachineryToDelete(m)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={machineryToEdit ? 'Editar Maquinário' : "Adicionar Maquinário"}>
                <NovoMaquinarioForm onClose={handleCloseModal} machineryToEdit={machineryToEdit} />
            </Modal>
            <ConfirmModal 
                isOpen={!!machineryToDelete}
                onClose={() => setMachineryToDelete(null)}
                onConfirm={() => {
                    if (machineryToDelete) {
                        deleteMachinery(machineryToDelete.id);
                        setMachineryToDelete(null);
                    }
                }}
                title="Excluir Maquinário"
                message={`Tem certeza que deseja excluir o maquinário "${machineryToDelete?.name}"?`}
            />
        </div>
    );
};

const NovaBenfeitoriaForm: React.FC<{ onClose: () => void, improvementToEdit?: Improvement | null }> = ({ onClose, improvementToEdit }) => {
    const { addImprovement, updateImprovement, farms } = useContext(AppContext);
    const [totalValue, setTotalValue] = useState(improvementToEdit?.totalValue || 0);
    const [installmentsDone, setInstallmentsDone] = useState(improvementToEdit?.installments.current || 0);
    const [installmentsTotal, setInstallmentsTotal] = useState(improvementToEdit?.installments.total || 1);

    const installmentValue = useMemo(() => {
        return installmentsTotal > 0 ? totalValue / installmentsTotal : 0;
    }, [totalValue, installmentsTotal]);

    const balanceDue = useMemo(() => {
        return (installmentsTotal - installmentsDone) * installmentValue;
    }, [installmentsDone, installmentValue, installmentsTotal]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const improvementData = {
            farmId: formData.get('farmId') as string,
            name: formData.get('name') as string,
            totalValue: Number(formData.get('totalValue')),
            installments: {
                current: Number(formData.get('installmentsDone')),
                total: Number(formData.get('installmentsTotal')),
            },
            paymentStartDate: new Date(formData.get('paymentDate') as string).toISOString(),
        };

        if (improvementToEdit) {
            updateImprovement({ ...improvementToEdit, ...improvementData });
        } else {
            addImprovement(improvementData);
        }
        onClose();
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-brand-text">
             <Select name="farmId" label="Propriedade" required defaultValue={improvementToEdit?.farmId}>
                {farms.map(farm => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
            </Select>
            <Input name="name" label="Nome da Benfeitoria" placeholder="Silo, Galpão" required defaultValue={improvementToEdit?.name} />
            <Input name="totalValue" label="Valor Total (R$)" type="number" step="0.01" value={totalValue} onChange={e => setTotalValue(Number(e.target.value))} />
            <div className="grid grid-cols-2 gap-4">
                 <Input name="installmentsDone" label="Parcelas Pagas" type="number" value={installmentsDone} onChange={e => setInstallmentsDone(Number(e.target.value))} />
                 <Input name="installmentsTotal" label="Total Parcelas" type="number" value={installmentsTotal} onChange={e => setInstallmentsTotal(Number(e.target.value) || 1)} />
            </div>
             <Input name="paymentDate" label="Início Pagamento" type="date" defaultValue={dateToInputFormat(improvementToEdit?.paymentStartDate || new Date().toISOString())} />
            <Card className="bg-brand-darker">
                <h4 className="font-semibold mb-2">Cálculos:</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="text-brand-text-secondary">Valor da Parcela:</p> <p>{formatCurrency(installmentValue)}</p>
                    <p className="text-brand-text-secondary">Saldo a Pagar:</p> <p>{formatCurrency(balanceDue)}</p>
                </div>
            </Card>
             <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    );
};

export const BenfeitoriasScreen: React.FC = () => {
    const { improvements, setScreen, deleteImprovement, farms } = useContext(AppContext);
    const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [improvementToEdit, setImprovementToEdit] = useState<Improvement | null>(null);
    const [improvementToDelete, setImprovementToDelete] = useState<Improvement | null>(null);

    const filteredImprovements = improvements.filter(i => i.farmId === selectedFarmId);

    const handleOpenModal = (item: Improvement | null = null) => {
        setImprovementToEdit(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setImprovementToEdit(null);
    };

    return (
        <div className="p-4">
            <PageHeader title="Benfeitorias e Estruturas" onBack={() => setScreen(Screen.Home)} />
             <Card className="mb-6">
                <Select label="Selecione a Propriedade" value={selectedFarmId} onChange={e => setSelectedFarmId(e.target.value)}>
                    {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
            </Card>
            <Button onClick={() => handleOpenModal()} className="mb-6">Adicionar Benfeitoria</Button>
            <Card>
                <table className="w-full text-left text-sm text-brand-text">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">Nome</th>
                            <th className="p-2">Parcelas</th>
                            <th className="p-2 text-right">Valor Total</th>
                            <th className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImprovements.map(i => (
                            <tr key={i.id} className="border-b border-gray-700">
                                <td className="p-2">{i.name}</td>
                                <td className="p-2">{i.installments.current} / {i.installments.total}</td>
                                <td className="p-2 text-right">{formatCurrency(i.totalValue)}</td>
                                <td className="p-2"><ActionButtons onEdit={() => handleOpenModal(i)} onDelete={() => setImprovementToDelete(i)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={improvementToEdit ? 'Editar Benfeitoria' : "Adicionar Benfeitoria"}>
                <NovaBenfeitoriaForm onClose={handleCloseModal} improvementToEdit={improvementToEdit}/>
            </Modal>
            <ConfirmModal 
                isOpen={!!improvementToDelete}
                onClose={() => setImprovementToDelete(null)}
                onConfirm={() => {
                    if (improvementToDelete) {
                        deleteImprovement(improvementToDelete.id);
                        setImprovementToDelete(null);
                    }
                }}
                title="Excluir Benfeitoria"
                message={`Tem certeza que deseja excluir a benfeitoria "${improvementToDelete?.name}"?`}
            />
        </div>
    );
};

export const useSafraCalculations = (safra: Safra | null, allOperations: FieldOperation[], allCosts: Cost[], allHarvests: Harvest[], allSafras: Safra[]) => {
    return useMemo(() => {
        if (!safra) {
            return {
                totalRevenue: 0, totalCost: 0, grossProfit: 0, roi: 0, productivity: 0, costPerSack: 0,
                profitPerHectare: 0, costDistribution: [], totalHarvestSacks: 0, rentabilidade: 0,
            };
        }

        const safraOperations = allOperations.filter(op => op.safraId === safra.id);
        const safraVariableCosts = allCosts.filter(c => c.safraId === safra.id && c.type === CostType.Variavel);
        
        const fixedCostsForSafra = allCosts
            .filter(cost => cost.type === CostType.Fixo)
            .reduce((total, cost) => {
                const costDate = new Date(cost.date);
                if (isNaN(costDate.getTime())) return total;

                // Check if the current safra was active on the cost date.
                const safraStartDate = new Date(safra.startDate);
                if (isNaN(safraStartDate.getTime())) return total;
                
                const safraEndDate = safra.endDate ? new Date(safra.endDate) : null;
                const isCurrentSafraActive = safraStartDate <= costDate && (safra.isActive || (safraEndDate && costDate <= safraEndDate));

                if (!isCurrentSafraActive) {
                    return total;
                }

                // Find how many safras were active on that date to prorate the cost.
                const numSafrasActiveOnCostDate = allSafras.filter(s => {
                    const sStartDate = new Date(s.startDate);
                    if (isNaN(sStartDate.getTime())) return false;
                    const sEndDate = s.endDate ? new Date(s.endDate) : null;
                    return sStartDate <= costDate && (s.isActive || (sEndDate && costDate <= sEndDate));
                }).length;
                
                const divisor = numSafrasActiveOnCostDate > 0 ? numSafrasActiveOnCostDate : 1;
                
                return total + (cost.value / divisor);
            }, 0);
        
        const safraHarvests = allHarvests.filter(h => h.safraId === safra.id);

        const totalRevenue = safraHarvests.reduce((sum, h) => sum + h.quantity * h.unitPrice, 0);
        
        const operationsCost = safraOperations.reduce((sum, op) => sum + op.cost, 0);
        const variableCostsTotal = safraVariableCosts.reduce((sum, c) => sum + c.value, 0);
        const totalCost = operationsCost + variableCostsTotal + fixedCostsForSafra;
        
        const grossProfit = totalRevenue - totalCost;
        const roi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;
        const rentabilidade = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
        
        const totalHarvestSacks = safraHarvests.reduce((sum, h) => {
            if (h.unit === 'saca') return sum + h.quantity;
            if (h.unit === 'kg') return sum + h.quantity / 60; // Assuming 60kg sack
            if (h.unit === 'ton') return sum + (h.quantity * 1000) / 60;
            return sum;
        }, 0);

        const productivity = safra.area > 0 ? totalHarvestSacks / safra.area : 0; // sacks/ha
        const costPerSack = totalHarvestSacks > 0 ? totalCost / totalHarvestSacks : 0;
        const profitPerHectare = safra.area > 0 ? grossProfit / safra.area : 0;
        
        const rawCostDistribution = [
            ...safraOperations.map(op => ({ name: op.type, value: op.cost })),
            ...safraVariableCosts.map(c => ({ name: c.category, value: c.value })),
            { name: 'Custos Fixos (Rateado)', value: fixedCostsForSafra }
        ].filter(item => item.value > 0);

        const costDistribution = rawCostDistribution.reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.name);
            if (existing) {
                existing.value += curr.value;
            } else {
                acc.push({ ...curr });
            }
            return acc;
        }, [] as {name: string, value: number}[]);

        return { totalRevenue, totalCost, grossProfit, roi, productivity, costPerSack, profitPerHectare, costDistribution, totalHarvestSacks, rentabilidade };
    }, [safra, allOperations, allCosts, allHarvests, allSafras]);
}

const Indicator: React.FC<{title: string, value: string, isHighlighted?: boolean}> = ({title, value, isHighlighted}) => (
    <div className={`p-3 rounded-md bg-brand-darker`}>
        <p className="text-sm text-brand-text-secondary">{title}</p>
        <p className={`font-bold text-xl ${isHighlighted ? 'text-green-400' : 'text-brand-text'}`}>{value}</p>
    </div>
);

export const ResultadosScreen: React.FC = () => {
    const { safras, operations, costs, harvests, setScreen } = useContext(AppContext);
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedSafraId, setSelectedSafraId] = useState<string | null>(null);

    const sortedSafras = useMemo(() => {
        return [...safras].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, [safras]);

    const handleSelectSafra = (id: string) => {
        setSelectedSafraId(id);
        setView('detail');
    };

    const handleBack = () => {
        setView('list');
        setSelectedSafraId(null);
    };

    const selectedSafra = useMemo(() => safras.find(s => s.id === selectedSafraId), [selectedSafraId, safras]);
    
    // Always call hooks at the top level, passing potentially null safra
    const calculations = useSafraCalculations(selectedSafra || null, operations, costs, harvests, safras);
    const { totalRevenue, totalCost, grossProfit, roi, rentabilidade, productivity, costPerSack, profitPerHectare, costDistribution } = calculations;

    const safraHarvests = useMemo(() => {
        if (!selectedSafra) return [];
        return harvests.filter(h => h.safraId === selectedSafra.id);
    }, [harvests, selectedSafra]);

    if (view === 'list') {
        return (
            <div className="p-4">
                <PageHeader title="Resultados e Indicadores" onBack={() => setScreen(Screen.Home)} />
                <Card className="mb-6 bg-brand-accent/10 border border-brand-accent/20">
                     <p className="text-sm text-brand-text-secondary">
                        Selecione uma safra abaixo para visualizar os indicadores de desempenho, rentabilidade e custos detalhados.
                     </p>
                </Card>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sortedSafras.map(safra => (
                        <Card key={safra.id} className="cursor-pointer hover:bg-brand-light/80 transition-all duration-200 border-2 border-transparent hover:border-brand-accent group" >
                            <div onClick={() => handleSelectSafra(safra.id)} className="h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-accent">{safra.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${safra.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                            {safra.isActive ? 'Ativa' : 'Finalizada'}
                                        </span>
                                    </div>
                                    <p className="text-brand-text-secondary text-sm mb-1"><span className="font-semibold text-brand-text">Cultura:</span> {safra.culture}</p>
                                    <p className="text-brand-text-secondary text-sm mb-1"><span className="font-semibold text-brand-text">Variedade:</span> {safra.variety}</p>
                                    <p className="text-brand-text-secondary text-sm"><span className="font-semibold text-brand-text">Área:</span> {safra.area} ha</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                                    <span className="text-brand-accent text-sm font-semibold group-hover:underline">Ver Resultados &rarr;</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {sortedSafras.length === 0 && (
                         <div className="col-span-full text-center text-brand-text-secondary p-8 bg-brand-light rounded-lg">
                            <p className="mb-2">Nenhuma safra cadastrada.</p>
                            <Button variant="secondary" onClick={() => setScreen(Screen.Safras)} className="w-auto">Cadastrar Safra</Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Detail View - Robust handling for missing safra
    if (view === 'detail') {
        if (!selectedSafra) {
            return (
                <div className="p-4">
                    <PageHeader title="Erro" onBack={handleBack} />
                    <Card>
                        <div className="text-center p-6">
                            <h3 className="text-xl font-bold text-red-500 mb-2">Safra não encontrada</h3>
                            <p className="text-brand-text-secondary mb-4">A safra selecionada não foi encontrada ou foi excluída.</p>
                            <Button variant="secondary" onClick={handleBack} className="w-auto">Voltar</Button>
                        </div>
                    </Card>
                </div>
            );
        }

        return (
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button onClick={handleBack} className="text-brand-text mr-4 p-2 rounded-full hover:bg-brand-light transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-text">{selectedSafra.name}</h1>
                            <p className="text-sm text-brand-text-secondary">Análise de Resultados</p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <span className={`text-xs px-3 py-1 rounded-full ${selectedSafra.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                            {selectedSafra.isActive ? 'Safra Ativa' : 'Safra Finalizada'}
                        </span>
                    </div>
                </div>

                <div className="space-y-6 animate-fade-in">
                    <Card>
                        <h3 className="text-lg font-bold text-brand-text mb-4 border-b border-gray-700 pb-2">Resumo Financeiro</h3>
                        <table className="w-full text-left text-brand-text">
                            <tbody>
                                <tr className="border-b border-gray-700 hover:bg-brand-dark/30 transition-colors">
                                    <td className="py-3 px-2 text-brand-text-secondary">Renda Bruta (Receita)</td>
                                    <td className="py-3 px-2 text-right font-semibold text-lg">{formatCurrency(totalRevenue)}</td>
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-brand-dark/30 transition-colors">
                                    <td className="py-3 px-2 text-brand-text-secondary">Custo Total</td>
                                    <td className="py-3 px-2 text-right font-semibold text-lg text-red-400">-{formatCurrency(totalCost)}</td>
                                </tr>
                                <tr className="bg-brand-darker mt-2">
                                    <td className="py-4 px-3 rounded-l-md text-brand-text font-bold text-lg">Renda Líquida (Lucro)</td>
                                    <td className={`py-4 px-3 rounded-r-md text-right font-bold text-2xl ${grossProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(grossProfit)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-brand-text mb-4 border-b border-gray-700 pb-2">Indicadores de Desempenho</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Indicator title="Rentabilidade" value={`${rentabilidade.toFixed(2)}%`} isHighlighted={rentabilidade > 0} />
                            <Indicator title="ROI" value={`${roi.toFixed(2)}%`} isHighlighted={roi > 0} />
                            <Indicator title="Lucro por ha" value={formatCurrency(profitPerHectare)} isHighlighted={profitPerHectare > 0} />
                            <Indicator title="Produtividade" value={`${productivity.toFixed(2)} sc/ha`} />
                            <Indicator title="Custo por Saca" value={formatCurrency(costPerSack)} />
                            <Indicator title="Área Total" value={`${selectedSafra.area} ha`} />
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-brand-text mb-4">Produção Realizada</h3>
                        {safraHarvests.length > 0 ? (
                            <ul className="divide-y divide-gray-700">
                                {safraHarvests.map(h => (
                                    <li key={h.id} className="py-2 flex justify-between">
                                        <span>{h.quantity} {h.unit}</span>
                                        <span className="text-brand-text-secondary">({formatCurrency(h.unitPrice)}/{h.unit})</span>
                                        <span className="font-semibold">{formatCurrency(h.quantity * h.unitPrice)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-brand-text-secondary">Nenhuma colheita registrada.</p>
                        )}
                    </Card>
                    
                    <Card>
                        <h3 className="text-lg font-bold text-brand-text mb-4">Distribuição de Custos</h3>
                            {costDistribution.length > 0 ? (
                            <ul className="divide-y divide-gray-700">
                                {costDistribution.map((item, index) => (
                                    <li key={index} className="py-2 flex justify-between items-center">
                                        <span className="text-brand-text">{item.name}</span>
                                        <div className="flex items-center">
                                            <span className="font-semibold text-brand-text mr-4">{formatCurrency(item.value)}</span>
                                            <span className="text-xs text-brand-text-secondary bg-brand-dark px-2 py-1 rounded">
                                                {((item.value / totalCost) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                                <p className="text-brand-text-secondary">Nenhum custo registrado.</p>
                        )}
                    </Card>
                </div>
            </div>
        );
    }
    
    return null;
};

export const RelatoriosScreen: React.FC = () => {
    const { safras, setScreen, setSelectedSafraIdsForReport } = useContext(AppContext);
    const [selectedSafras, setSelectedSafras] = useState<string[]>([]);

    const handleSelect = (safraId: string) => {
        setSelectedSafras(prev => 
            prev.includes(safraId) ? prev.filter(id => id !== safraId) : [...prev, safraId]
        );
    };

    const handleGenerateReport = () => {
        setSelectedSafraIdsForReport(selectedSafras);
        setScreen(Screen.ReportView);
    };

    return (
        <div className="p-4">
            <PageHeader title="Relatórios" onBack={() => setScreen(Screen.Home)} />
            <Card>
                <h3 className="text-lg font-bold text-brand-text mb-2">Gerar Relatório de Safra</h3>
                <p className="text-sm text-brand-text-secondary mb-4">Selecione uma ou mais safras</p>
                <div className="space-y-3 border border-gray-600 rounded-md p-4 mb-6 max-h-60 overflow-y-auto">
                    {safras.map(safra => (
                         <Checkbox 
                            key={safra.id} 
                            id={`safra-report-${safra.id}`} 
                            label={`${safra.name} ${safra.isActive ? '' : '(Inativa)'}`}
                            checked={selectedSafras.includes(safra.id)}
                            onChange={() => handleSelect(safra.id)}
                         />
                    ))}
                </div>
                <Button onClick={handleGenerateReport} disabled={selectedSafras.length === 0}>
                    Gerar Relatório ({selectedSafras.length})
                </Button>
            </Card>
        </div>
    );
};

const EditarPerfilForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { user, updateUser } = useContext(AppContext);
    const [error, setError] = useState('');
    const [newProfilePic, setNewProfilePic] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setNewProfilePic(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (!user) return;
        
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const username = formData.get('username') as string;

        updateUser({ 
            ...user, 
            name, 
            username,
            profilePictureUrl: newProfilePic || user.profilePictureUrl,
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-2 mb-4">
                <img src={newProfilePic || user?.profilePictureUrl} alt="Foto do Perfil" className="w-24 h-24 rounded-full object-cover" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-brand-accent hover:underline">
                    Alterar Foto
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            <Input name="name" label="Nome Completo" required defaultValue={user?.name}/>
            <Input name="username" label="Nome de Usuário" required defaultValue={user?.username}/>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    )
}

const NovaPropriedadeForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { user, addFarm } = useContext(AppContext);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const location = formData.get('location') as string;
        const producerName = formData.get('producerName') as string;
        const lat = formData.get('latitude') as string;
        const lon = formData.get('longitude') as string;

        addFarm({
            name,
            location,
            producerName: user?.profile === 'Técnico' ? producerName : user?.name,
            latitude: lat ? Number(lat) : undefined,
            longitude: lon ? Number(lon) : undefined,
        });
        onClose();
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" label="Nome da Propriedade" required />
            <Input name="location" label="Localização (Município/UF)" required />
             <div className="grid grid-cols-2 gap-4">
                <Input name="latitude" label="Latitude (Opcional)" type="number" step="any" placeholder="-28.123456" />
                <Input name="longitude" label="Longitude (Opcional)" type="number" step="any" placeholder="-49.123456" />
            </div>
            {user?.profile === 'Técnico' && (
                <Input name="producerName" label="Nome do Produtor" required />
            )}
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button type="submit" variant="primary" className="w-auto px-6">Salvar</Button>
            </div>
        </form>
    );
};

export const ConfiguracoesScreen: React.FC = () => {
    const { user, farms, setScreen, theme, setTheme } = useContext(AppContext);
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    const [isAddFarmModalOpen, setAddFarmModalOpen] = useState(false);

    return (
        <div className="p-4">
            <PageHeader title="Configurações" onBack={() => setScreen(Screen.Home)} />
            <div className="space-y-8">
                <Card>
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-brand-text mb-4">Informações do Usuário</h3>
                        <Button variant="secondary" className="w-auto px-3 py-1 text-sm" onClick={() => setEditProfileModalOpen(true)}>Editar Perfil</Button>
                    </div>
                    <div className="flex items-center">
                        <img src={user?.profilePictureUrl} alt="Foto do Perfil" className="w-20 h-20 rounded-full mr-6" />
                        <div className="text-brand-text space-y-1">
                           <p><span className="font-semibold">Nome:</span> {user?.name}</p>
                           <p><span className="font-semibold">CPF:</span> {user?.cpf}</p>
                           <p><span className="font-semibold">Usuário:</span> {user?.username}</p>
                           <p><span className="font-semibold">Perfil:</span> {user?.profile}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold text-brand-text mb-4">Minhas Propriedades</h3>
                    <div className="space-y-3 mb-4">
                        {farms.map(farm => (
                            <div key={farm.id} className="bg-brand-darker p-3 rounded-md">
                                <p className="font-semibold text-brand-text">{farm.name}</p>
                                <p className="text-sm text-brand-text-secondary">{farm.location}</p>
                                {farm.latitude && farm.longitude && (
                                    <p className="text-xs text-brand-text-secondary">Coords: {farm.latitude.toFixed(6)}, {farm.longitude.toFixed(6)}</p>
                                )}
                                {user?.profile === 'Técnico' && <p className="text-xs text-brand-text-secondary">Produtor: {farm.producerName}</p>}
                            </div>
                        ))}
                    </div>
                    <Button variant="secondary" onClick={() => setAddFarmModalOpen(true)}>Adicionar Propriedade</Button>
                </Card>

                 <Card>
                    <h3 className="text-lg font-bold text-brand-text mb-4">Tema do Aplicativo</h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-md ${theme === 'light' ? 'bg-brand-accent text-white' : 'bg-brand-light text-brand-text'}`}>Claro</button>
                        <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-md ${theme === 'dark' ? 'bg-brand-accent text-white' : 'bg-brand-light text-brand-text'}`}>Escuro</button>
                    </div>
                </Card>
            </div>
            <Modal isOpen={isEditProfileModalOpen} onClose={() => setEditProfileModalOpen(false)} title="Editar Perfil">
                <EditarPerfilForm onClose={() => setEditProfileModalOpen(false)} />
            </Modal>
            <Modal isOpen={isAddFarmModalOpen} onClose={() => setAddFarmModalOpen(false)} title="Adicionar Propriedade">
                <NovaPropriedadeForm onClose={() => setAddFarmModalOpen(false)} />
            </Modal>
        </div>
    );
};

// =================================================================
// NEW SCREENS
// =================================================================

export const SafraDetalhesScreen: React.FC = () => {
    const { selectedSafra, setScreen, operations, costs, harvests, safras } = useContext(AppContext);

    const { totalRevenue, totalCost, grossProfit, productivity, profitPerHectare, totalHarvestSacks } = useSafraCalculations(selectedSafra, operations, costs, harvests, safras);

    if (!selectedSafra) {
        return (
            <div className="p-4 text-white">
                <PageHeader title="Erro" onBack={() => setScreen(Screen.Safras)} />
                <p>Nenhuma safra selecionada.</p>
            </div>
        );
    }
    
    const safraOperations = operations.filter(op => op.safraId === selectedSafra.id);
    const safraCosts = costs.filter(c => c.safraId === selectedSafra.id);
    const safraHarvests = harvests.filter(h => h.safraId === selectedSafra.id);


    return (
        <div className="p-4">
            <PageHeader title={selectedSafra.name} onBack={() => setScreen(Screen.Safras)} >
                <Button variant="primary" className="w-auto text-sm px-3 py-2" onClick={() => setScreen(Screen.Resultados)}>
                    Ver Gráficos
                </Button>
            </PageHeader>
            <div className="space-y-6">
                <Card>
                    <h3 className="text-lg font-bold text-brand-text mb-2">Resumo da Safra</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-brand-text">
                        <span>Cultura:</span> <span className="font-semibold">{selectedSafra.culture} {selectedSafra.variety}</span>
                        <span>Área:</span> <span className="font-semibold">{selectedSafra.area} ha</span>
                        <span>Produtividade:</span> <span className="font-semibold">{productivity.toFixed(2)} sc/ha</span>
                        <span>Receita:</span> <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
                        <span>Custo:</span> <span className="font-semibold">{formatCurrency(totalCost)}</span>
                        <span>Lucro:</span> <span className="font-semibold">{formatCurrency(grossProfit)}</span>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-brand-text mb-2">Operações ({safraOperations.length})</h3>
                    <div className="max-h-48 overflow-y-auto text-sm">
                         {safraOperations.map(op => <div key={op.id} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-b-0"><p>{op.type}</p><p>{formatCurrency(op.cost)}</p></div>)}
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-lg font-bold text-brand-text mb-2">Custos Variáveis ({safraCosts.length})</h3>
                     <div className="max-h-48 overflow-y-auto text-sm">
                         {safraCosts.map(c => <div key={c.id} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-b-0"><p>{c.description}</p><p>{formatCurrency(c.value)}</p></div>)}
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-lg font-bold text-brand-text mb-2">Colheitas ({safraHarvests.length})</h3>
                     <div className="max-h-48 overflow-y-auto text-sm">
                         {safraHarvests.map(h => <div key={h.id} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-b-0"><p>{h.quantity} {h.unit}</p><p>{formatCurrency(h.quantity*h.unitPrice)}</p></div>)}
                    </div>
                </Card>
            </div>
        </div>
    );
};


const SafraReportSection: React.FC<{ safra: Safra; isLast: boolean }> = ({ safra, isLast }) => {
    const { operations, costs, harvests, safras, farms } = useContext(AppContext);
    
    // Call the hook at the top level of the component
    const { totalRevenue, totalCost, grossProfit, productivity, profitPerHectare } = useSafraCalculations(safra, operations, costs, harvests, safras);
    
    const safraOperations = operations.filter(op => op.safraId === safra.id);
    const safraCosts = costs.filter(c => c.safraId === safra.id);
    const safraHarvests = harvests.filter(h => h.safraId === safra.id);
    const farm = farms.find(f => f.id === safra.farmId);

    return (
        <section className={!isLast ? 'page-break' : ''}>
            <h2 className="text-2xl font-bold bg-gray-200 p-2 -mx-2 mb-4 border-t-2 border-b-2 border-gray-400">{safra.name}</h2>
            
            <div className="mb-6">
                <h3 className="text-xl font-bold border-b border-gray-400 pb-1 mb-2">Informações Gerais</h3>
                <p><strong>Produtor:</strong> {farm?.producerName}</p>
                <p><strong>Propriedade:</strong> {farm?.name} - {farm?.location}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 p-2 border border-gray-300 rounded">
                <div><strong className="block">Cultura:</strong> {safra.culture} ({safra.variety})</div>
                <div><strong className="block">Área:</strong> {safra.area} ha</div>
                <div><strong className="block">Produtividade:</strong> {productivity.toFixed(2)} sc/ha</div>
                <div><strong className="block">Lucro/ha:</strong> {formatCurrency(profitPerHectare)}</div>
                <div className="font-bold"><strong className="block">Receita Total:</strong> {formatCurrency(totalRevenue)}</div>
                <div className="font-bold"><strong className="block">Custo Total:</strong> {formatCurrency(totalCost)}</div>
                <div className="col-span-2 text-lg font-bold bg-gray-100 p-2 rounded"><strong className="block">Lucro Bruto:</strong> <span className="font-extrabold">{formatCurrency(grossProfit)}</span></div>
            </div>
            
            <h3 className="text-lg font-bold mt-6 mb-2">Operações</h3>
            <table className="w-full text-sm table-auto border-collapse border border-gray-400">
                <thead className="bg-gray-100"><tr><th className="border p-1 text-left">Data</th><th className="border p-1 text-left">Tipo</th><th className="border p-1 text-right">Custo</th></tr></thead>
                <tbody>{safraOperations.map(o => <tr key={o.id}><td className="border p-1">{formatDate(o.date)}</td><td className="border p-1">{o.type}</td><td className="border p-1 text-right">{formatCurrency(o.cost)}</td></tr>)}</tbody>
            </table>
            
            <h3 className="text-lg font-bold mt-6 mb-2">Custos Variáveis</h3>
            <table className="w-full text-sm table-auto border-collapse border border-gray-400">
                <thead className="bg-gray-100"><tr><th className="border p-1 text-left">Data</th><th className="border p-1 text-left">Descrição</th><th className="border p-1 text-right">Valor</th></tr></thead>
                <tbody>{safraCosts.map(c => <tr key={c.id}><td className="border p-1">{formatDate(c.date)}</td><td className="border p-1">{c.description}</td><td className="border p-1 text-right">{formatCurrency(c.value)}</td></tr>)}</tbody>
            </table>

            <h3 className="text-lg font-bold mt-6 mb-2">Colheitas</h3>
            <table className="w-full text-sm table-auto border-collapse border border-gray-400">
                <thead className="bg-gray-100"><tr><th className="border p-1 text-left">Data</th><th className="border p-1 text-left">Quantidade</th><th className="border p-1 text-right">Preço Unit.</th><th className="border p-1 text-right">Total</th></tr></thead>
                <tbody>{safraHarvests.map(h => <tr key={h.id}><td className="border p-1">{formatDate(h.date)}</td><td className="border p-1">{h.quantity} {h.unit}</td><td className="border p-1 text-right">{formatCurrency(h.unitPrice)}</td><td className="border p-1 text-right">{formatCurrency(h.quantity*h.unitPrice)}</td></tr>)}</tbody>
            </table>
        </section>
    );
};

export const ReportViewScreen: React.FC = () => {
    const { selectedSafraIdsForReport, safras, setScreen } = useContext(AppContext);

    const reportSafras = safras.filter(s => selectedSafraIdsForReport.includes(s.id));
    
    return (
        <div className="p-4 bg-gray-300">
             <style>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #report-container {
                        margin: 0;
                        padding: 0;
                        border: none;
                        box-shadow: none;
                    }
                     .page-break {
                        page-break-after: always;
                     }
                }
                @page {
                    size: A4;
                    margin: 2cm;
                }
            `}</style>
            <div className="flex justify-between items-center mb-4 px-2 no-print">
                <Button variant="secondary" className="w-auto px-4" onClick={() => setScreen(Screen.Relatorios)}>Voltar</Button>
                <h2 className="text-brand-text font-semibold">Pré-visualização do Relatório</h2>
                <Button variant="primary" className="w-auto px-4" onClick={() => window.print()}>Imprimir</Button>
            </div>
            <div id="report-container" className="bg-white text-gray-900 mx-auto" style={{width: '210mm', minHeight: '297mm'}}>
                <div id="report-content" className="p-12 font-serif">
                    <EpagriHeader />
                    <header className="my-12 text-center">
                        <h1 className="text-3xl font-bold">Relatório Técnico de Safra</h1>
                        <p className="text-sm mt-2">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
                    </header>

                    {reportSafras.map((safra, index) => (
                        <SafraReportSection 
                            key={safra.id} 
                            safra={safra} 
                            isLast={index === reportSafras.length - 1} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};