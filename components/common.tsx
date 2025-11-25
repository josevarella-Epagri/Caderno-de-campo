import React from 'react';
import { EditIcon, DeleteIcon } from '../constants';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'w-full py-3 px-4 rounded-md font-semibold text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-darker disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-brand-accent text-white hover:bg-brand-accent-hover',
    secondary: 'bg-brand-light text-brand-text hover:bg-gray-600',
    ghost: 'bg-transparent text-brand-accent hover:underline',
    danger: 'bg-red-700 text-white hover:bg-red-800'
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const IconButton: React.FC<{onClick: () => void, children: React.ReactNode, className?: string, ariaLabel: string}> = ({onClick, children, className, ariaLabel}) => (
    <button onClick={onClick} aria-label={ariaLabel} className={`p-1 rounded-full hover:bg-brand-dark transition-colors ${className}`}>
        {children}
    </button>
);


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
      <input
        id={id}
        className="w-full bg-brand-light border-gray-600 text-brand-text rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent disabled:bg-brand-darker disabled:opacity-70"
        {...props}
      />
    </div>
  );
};


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
    return (
        <div className="w-full">
            {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
            <select
                id={id}
                className="w-full bg-brand-light border-gray-600 text-brand-text rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-500 bg-brand-light text-brand-accent focus:ring-brand-accent"
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-sm text-brand-text">
        {label}
      </label>
    </div>
  );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-dark rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-brand-text">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-brand-text-secondary mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={onClose} className="w-auto px-6">Cancelar</Button>
                <Button variant="danger" onClick={onConfirm} className="w-auto px-6">Confirmar</Button>
            </div>
        </Modal>
    );
};


export const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    return (
        <div className={`bg-brand-light p-4 rounded-lg shadow-md ${className}`}>
            {children}
        </div>
    );
};

export const PageHeader: React.FC<{title: string, onBack: () => void, children?: React.ReactNode}> = ({ title, onBack, children }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                <button onClick={onBack} className="text-brand-text mr-4 p-2 rounded-full hover:bg-brand-light">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-brand-text">{title}</h1>
            </div>
            <div>{children}</div>
        </div>
    );
}

export const formatCurrency = (value: number | undefined) => {
  if (value === undefined || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
};

export const dateToInputFormat = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export const ActionButtons: React.FC<{onEdit: () => void, onDelete: () => void}> = ({ onEdit, onDelete }) => (
    <div className="flex items-center space-x-2 text-brand-text-secondary">
        <IconButton onClick={onEdit} ariaLabel="Editar">
            <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} ariaLabel="Excluir" className="text-red-500 hover:bg-red-900/50">
            <DeleteIcon />
        </IconButton>
    </div>
);
