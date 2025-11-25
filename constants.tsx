import React from 'react';
import { Screen } from './types';

// ICONS
const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10s5 2 5 2a8 8 0 013.657 6.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 14.121A3 3 0 1014.12 9.88" />
    </svg>
);
const TractorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13v-2l-3-3H6a2 2 0 00-2 2v5h2a2 2 0 012 2v2a2 2 0 002 2h3a2 2 0 002-2v-2a2 2 0 012-2h3zm-8 2a2 2 0 11-4 0 2 2 0 014 0zm-2-7a1 1 0 100-2 1 1 0 000 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13H4a1 1 0 01-1-1V8a1 1 0 011-1h2" />
    </svg>
);
const MoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const WheatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
);
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const WrenchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343L4.929 4.929m12.728 0l-1.414 1.414M6.343 17.657l-1.414 1.414m12.728 0l-1.414-1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);
export const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


export const EditIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

export const DeleteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const MENU_ITEMS = [
    { title: 'Minhas Safras', screen: Screen.Safras, icon: <LeafIcon /> },
    { title: 'Operações de Campo', screen: Screen.Operacoes, icon: <TractorIcon /> },
    { title: 'Custos', screen: Screen.Custos, icon: <MoneyIcon /> },
    { title: 'Colheitas', screen: Screen.Colheitas, icon: <WheatIcon /> },
    { title: 'Maquinário', screen: Screen.Maquinario, icon: <CogIcon /> },
    { title: 'Benfeitorias', screen: Screen.Benfeitorias, icon: <HomeIcon /> },
    { title: 'Resultados', screen: Screen.Resultados, icon: <ChartIcon /> },
    { title: 'Relatórios', screen: Screen.Relatorios, icon: <DocumentIcon /> },
    { title: 'Configurações', screen: Screen.Configuracoes, icon: <WrenchIcon /> },
];

export const OPERATION_TYPES = [
    'Plantio',
    'Defensivo',
    'Adubação e Correção',
    'Irrigação',
    'Preparo do Solo',
    'Tratamento Adicional',
    'Tratos Culturais',
    'Outra',
];

export const VARIABLE_COST_CATEGORIES = [
    'Mão de Obra',
    'Transporte',
    'Armazenagem',
    'Combustível',
    'Outro',
];

export const FIXED_COST_CATEGORIES = [
    'Impostos',
    'Arrendamento',
    'Salários',
    'Manutenção',
    'Outro',
]

export const Logo = () => (
    <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto">
            <g>
                <circle cx="80" cy="40" r="24" fill="#da251d"/>
                <path d="M40 70 H120 V110 C110 120, 90 120, 80 110 C70 120, 50 120, 40 110 V70" stroke="#00843D" strokeWidth="5" fill="none" />
                <line x1="80" y1="70" x2="80" y2="110" stroke="#00843D" strokeWidth="5" />
            </g>
            <text x="80" y="145" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#00843D" fontFamily="sans-serif">Epagri</text>
        </svg>
    </div>
);

const EpagriLogo = () => (
     <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="30" r="18" fill="#da251d"/>
        <path d="M25 55 H75 V80 C68.33 85, 58.33 85, 50 80 C41.67 85, 31.67 85, 25 80 V55" stroke="#00843D" strokeWidth="4" fill="none" />
        <line x1="50" y1="55" x2="50" y2="80" stroke="#00843D" strokeWidth="4" />
    </svg>
);


export const EpagriHeader = () => (
    <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4">
        <div className="flex items-center">
            <EpagriLogo />
            <div className="ml-4 text-sm font-semibold">
                <p>Governo do Estado de Santa Catarina</p>
                <p>Secretaria de Estado da Agricultura e Pecuária</p>
                <p>Empresa de Pesquisa Agropecuária e Extensão Rural de Santa Catarina</p>
            </div>
        </div>
    </div>
);