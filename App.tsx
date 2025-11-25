import React, { useState, createContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { Screen, User, Farm, Safra, FieldOperation, Cost, Harvest, Machinery, Improvement } from './types';
import { MOCK_USERS, MOCK_FARMS, MOCK_SAFRAS, MOCK_OPERATIONS, MOCK_COSTS, MOCK_HARVESTS, MOCK_MACHINERY, MOCK_IMPROVEMENTS } from './data';
import { LoginScreen, HomeScreen, SafrasScreen, OperacoesScreen, CustosScreen, ColheitasScreen, MaquinarioScreen, BenfeitoriasScreen, ResultadosScreen, RelatoriosScreen, ConfiguracoesScreen, SafraDetalhesScreen, ReportViewScreen } from './screens';

interface AppContextType {
    user: User | null;
    users: User[];
    login: (username: string, password: string) => void;
    logout: () => void;
    addUser: (user: Omit<User, 'id' | 'profilePictureUrl'>) => void;
    updateUser: (user: User) => void;
    screen: Screen;
    setScreen: (screen: Screen) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    farms: Farm[];
    safras: Safra[];
    operations: FieldOperation[];
    costs: Cost[];
    harvests: Harvest[];
    machinery: Machinery[];
    improvements: Improvement[];
    
    // State for details pages
    selectedSafra: Safra | null;
    setSelectedSafra: (safra: Safra | null) => void;
    selectedSafraIdsForReport: string[];
    setSelectedSafraIdsForReport: (ids: string[]) => void;

    // CRUD Functions
    addFarm: (farm: Omit<Farm, 'id'>) => void;
    addSafra: (safra: Omit<Safra, 'id' | 'isActive'>) => void;
    updateSafra: (safra: Safra) => void;
    deleteSafra: (id: string) => void;
    addOperation: (operation: Omit<FieldOperation, 'id'>) => void;
    updateOperation: (operation: FieldOperation) => void;
    deleteOperation: (id: string) => void;
    addCost: (cost: Omit<Cost, 'id'>) => void;
    updateCost: (cost: Cost) => void;
    deleteCost: (id: string) => void;
    addHarvest: (harvest: Omit<Harvest, 'id'>) => void;
    updateHarvest: (harvest: Harvest) => void;
    deleteHarvest: (id: string) => void;
    addMachinery: (item: Omit<Machinery, 'id'>) => void;
    updateMachinery: (item: Machinery) => void;
    deleteMachinery: (id: string) => void;
    addImprovement: (item: Omit<Improvement, 'id'>) => void;
    updateImprovement: (item: Improvement) => void;
    deleteImprovement: (id: string) => void;
}

export const AppContext = createContext<AppContextType>(null!);

// Helper to create stable CRUD functions
const createCrudHandlers = <T extends { id: string }>(
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  prefix: string
) => ({
  add: (item: Omit<T, 'id'>) => {
    const newItem = { ...item, id: `${prefix}-${crypto.randomUUID()}` } as T;
    setState((prev) => [...prev, newItem]);
  },
  update: (updatedItem: T) => {
    setState((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  },
  delete: (id: string) => {
    setState((prev) => prev.filter((item) => item.id !== id));
  },
});


const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [user, setUser] = useState<User | null>(null);
    const [screen, setScreen] = useState<Screen>(Screen.Login);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    
    const [farms, setFarms] = useState<Farm[]>(MOCK_FARMS);
    const [safras, setSafras] = useState<Safra[]>(MOCK_SAFRAS);
    const [operations, setOperations] = useState<FieldOperation[]>(MOCK_OPERATIONS);
    const [costs, setCosts] = useState<Cost[]>(MOCK_COSTS);
    const [harvests, setHarvests] = useState<Harvest[]>(MOCK_HARVESTS);
    const [machinery, setMachinery] = useState<Machinery[]>(MOCK_MACHINERY);
    const [improvements, setImprovements] = useState<Improvement[]>(MOCK_IMPROVEMENTS);

    const [selectedSafra, setSelectedSafra] = useState<Safra | null>(null);
    const [selectedSafraIdsForReport, setSelectedSafraIdsForReport] = useState<string[]>([]);

    useEffect(() => {
        document.body.classList.remove('theme-light');
        if (theme === 'light') {
            document.body.classList.add('theme-light');
        }
    }, [theme]);

    const usersRef = useRef(users);
    useEffect(() => {
        usersRef.current = users;
    }, [users]);

    const login = useCallback((username: string, password: string) => {
        const foundUser = usersRef.current.find(u => u.username === username && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            setScreen(Screen.Home);
        } else {
            alert('Usuário ou senha inválidos.');
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setScreen(Screen.Login);
    }, []);

    const addUser = useCallback((userData: Omit<User, 'id' | 'profilePictureUrl'>) => {
        const newUser: User = {
            ...userData,
            id: `user-${crypto.randomUUID()}`,
            profilePictureUrl: `https://picsum.photos/seed/${Math.random()}/100`,
        };
        setUsers(prev => [...prev, newUser]);
        alert('Usuário cadastrado com sucesso! Faça o login.');
    }, []);

    const updateUser = useCallback((updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setUser(currentUser => {
            if (currentUser && currentUser.id === updatedUser.id) {
                return updatedUser;
            }
            return currentUser;
        });
        alert('Perfil atualizado com sucesso!');
    }, []);

    // Memoized CRUD handlers for stable function references
    const farmHandlers = useMemo(() => createCrudHandlers(setFarms, 'farm'), []);
    const safraHandlers = useMemo(() => createCrudHandlers(setSafras, 'safra'), []);
    const operationHandlers = useMemo(() => createCrudHandlers(setOperations, 'operation'), []);
    const costHandlers = useMemo(() => createCrudHandlers(setCosts, 'cost'), []);
    const harvestHandlers = useMemo(() => createCrudHandlers(setHarvests, 'harvest'), []);
    const machineryHandlers = useMemo(() => createCrudHandlers(setMachinery, 'machinery'), []);
    const improvementHandlers = useMemo(() => createCrudHandlers(setImprovements, 'improvement'), []);
    
    const addSafraWithDefaults = useCallback((safra: Omit<Safra, 'id' | 'isActive'>) => {
        safraHandlers.add({ ...safra, isActive: true });
    }, [safraHandlers]);


    const contextValue: AppContextType = useMemo(() => ({
        user,
        users,
        login,
        logout,
        addUser,
        updateUser,
        screen,
        setScreen,
        theme,
        setTheme,
        farms,
        safras,
        operations,
        costs,
        harvests,
        machinery,
        improvements,
        selectedSafra,
        setSelectedSafra,
        selectedSafraIdsForReport,
        setSelectedSafraIdsForReport,

        addFarm: farmHandlers.add,
        addSafra: addSafraWithDefaults,
        updateSafra: safraHandlers.update,
        deleteSafra: safraHandlers.delete,
        addOperation: operationHandlers.add,
        updateOperation: operationHandlers.update,
        deleteOperation: operationHandlers.delete,
        addCost: costHandlers.add,
        updateCost: costHandlers.update,
        deleteCost: costHandlers.delete,
        addHarvest: harvestHandlers.add,
        updateHarvest: harvestHandlers.update,
        deleteHarvest: harvestHandlers.delete,
        addMachinery: machineryHandlers.add,
        updateMachinery: machineryHandlers.update,
        deleteMachinery: machineryHandlers.delete,
        addImprovement: improvementHandlers.add,
        updateImprovement: improvementHandlers.update,
        deleteImprovement: improvementHandlers.delete
    }), [
        user, users, login, logout, addUser, updateUser, screen, theme, farms, safras, operations, costs, harvests, machinery, improvements, selectedSafra, selectedSafraIdsForReport,
        farmHandlers, safraHandlers, operationHandlers, costHandlers, harvestHandlers, machineryHandlers, improvementHandlers, addSafraWithDefaults
    ]);

    const renderScreen = () => {
        if (!user) return <LoginScreen />;
        switch (screen) {
            case Screen.Home: return <HomeScreen />;
            case Screen.Safras: return <SafrasScreen />;
            case Screen.Operacoes: return <OperacoesScreen />;
            case Screen.Custos: return <CustosScreen />;
            case Screen.Colheitas: return <ColheitasScreen />;
            case Screen.Maquinario: return <MaquinarioScreen />;
            case Screen.Benfeitorias: return <BenfeitoriasScreen />;
            case Screen.Resultados: return <ResultadosScreen />;
            case Screen.Relatorios: return <RelatoriosScreen />;
            case Screen.Configuracoes: return <ConfiguracoesScreen />;
            case Screen.SafraDetalhes: return <SafraDetalhesScreen />;
            case Screen.ReportView: return <ReportViewScreen />;
            default: return <HomeScreen />;
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className="bg-brand-darker min-h-screen">
                <div className="max-w-xl mx-auto bg-brand-dark min-h-screen shadow-lg print:max-w-none print:bg-transparent print:shadow-none">
                    {renderScreen()}
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default App;