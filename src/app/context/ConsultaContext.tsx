import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Consulta {
  id: string;
  especialidade: string;
  medico: string;
  data: string;
  hora: string;
  local: string;
  status: 'confirmada' | 'pendente' | 'cancelada';
  origem?: 'triagem' | 'agendamento';
  tipo: 'consulta' | 'vacinacao';
  vacina?: string;
}

interface ConsultaContextType {
  consultas: Consulta[];
  adicionarConsulta: (consulta: Omit<Consulta, 'id'>) => void;
  proximaConsulta: () => Consulta | null;
}

const ConsultaContext = createContext<ConsultaContextType | undefined>(undefined);

export function ConsultaProvider({ children }: { children: ReactNode }) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  // Carregar consultas do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('consultas');
    if (stored) {
      setConsultas(JSON.parse(stored));
    }
  }, []);

  // Salvar consultas no localStorage
  useEffect(() => {
    if (consultas.length > 0) {
      localStorage.setItem('consultas', JSON.stringify(consultas));
    }
  }, [consultas]);

  const adicionarConsulta = (consulta: Omit<Consulta, 'id'>) => {
    const novaConsulta: Consulta = {
      ...consulta,
      id: Date.now().toString(),
    };
    setConsultas((prev) => [...prev, novaConsulta]);
  };

  const proximaConsulta = (): Consulta | null => {
    if (consultas.length === 0) return null;
    
    // Ordenar por data e pegar a próxima
    const sortedConsultas = [...consultas].sort((a, b) => {
      const dateA = new Date(a.data + ' ' + a.hora);
      const dateB = new Date(b.data + ' ' + b.hora);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedConsultas[0];
  };

  return (
    <ConsultaContext.Provider
      value={{
        consultas,
        adicionarConsulta,
        proximaConsulta,
      }}
    >
      {children}
    </ConsultaContext.Provider>
  );
}

export function useConsultas() {
  const context = useContext(ConsultaContext);
  if (context === undefined) {
    throw new Error('useConsultas must be used within a ConsultaProvider');
  }
  return context;
}