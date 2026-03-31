import { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';
import { Calendar, MapPin, Clock, ChevronLeft, Plus, X, User, FileText, Syringe } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useConsultas } from '../context/ConsultaContext';

type TabType = 'proximos' | 'passados' | 'cancelados';
type AgendamentoTipo = 'consulta' | 'vacinacao';

export function Agendamentos() {
  const navigate = useNavigate();
  const { consultas, adicionarConsulta } = useConsultas();
  const [activeTab, setActiveTab] = useState<TabType>('proximos');
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [tipoAgendamento, setTipoAgendamento] = useState<AgendamentoTipo>('consulta');
  const [agendamentoStep, setAgendamentoStep] = useState<'tipo' | 'sintomas' | 'especialidade' | 'vacina' | 'posto' | 'data' | 'hora'>('tipo');
  
  // Form state
  const [sintomas, setSintomas] = useState('');
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [vacinaSelecionada, setVacinaSelecionada] = useState('');
  const [postoSelecionado, setPostoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horaSelecionada, setHoraSelecionada] = useState('');

  const especialidades = [
    { id: '1', nome: 'Clínico Geral', medico: 'Dr. João Santos', local: 'UBS Centro - Chapecó' },
    { id: '2', nome: 'Cardiologia', medico: 'Dra. Ana Paula', local: 'Hospital São Francisco' },
    { id: '3', nome: 'Dermatologia', medico: 'Dr. Pedro Silva', local: 'UBS Passo dos Fortes' },
    { id: '4', nome: 'Ortopedia', medico: 'Dr. Carlos Mendes', local: 'UBS Efapi' },
    { id: '5', nome: 'Pediatria', medico: 'Dra. Mariana Costa', local: 'UBS Centro - Chapecó' },
  ];

  const vacinas = [
    { id: '1', nome: 'Gripe (Influenza)', descricao: 'Proteção contra o vírus da gripe' },
    { id: '2', nome: 'COVID-19', descricao: 'Proteção contra o coronavírus' },
    { id: '3', nome: 'Hepatite B', descricao: 'Proteção contra hepatite B' },
    { id: '4', nome: 'Tétano e Difteria (dT)', descricao: 'Reforço a cada 10 anos' },
    { id: '5', nome: 'Pneumocócica', descricao: 'Proteção contra pneumonia' },
  ];

  const postos = [
    { id: '1', nome: 'UBS Centro', endereco: 'Rua Marechal Deodoro, 123', distancia: '0,5 km' },
    { id: '2', nome: 'UBS Efapi', endereco: 'Av. Fernando Machado, 456', distancia: '1,2 km' },
    { id: '3', nome: 'UBS Passo dos Fortes', endereco: 'Rua Getúlio Vargas, 789', distancia: '2,8 km' },
    { id: '4', nome: 'UBS São Pedro', endereco: 'Rua São Pedro, 321', distancia: '3,5 km' },
  ];

  // Gerar datas disponíveis (próximos 10 dias úteis)
  const getAvailableDates = () => {
    const dates = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    while (dates.length < 10) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push({
          date: currentDate.toISOString().split('T')[0],
          formatted: currentDate.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long' 
          }),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const tabs: { key: TabType; label: string }[] = [
    { key: 'proximos', label: 'Próximos' },
    { key: 'passados', label: 'Passados' },
    { key: 'cancelados', label: 'Cancelados' },
  ];

  const handleNextStep = () => {
    if (agendamentoStep === 'tipo' && tipoAgendamento) {
      if (tipoAgendamento === 'consulta') {
        setAgendamentoStep('sintomas');
      } else {
        setAgendamentoStep('vacina');
      }
    } else if (agendamentoStep === 'sintomas' && sintomas.trim()) {
      setAgendamentoStep('especialidade');
    } else if (agendamentoStep === 'especialidade' && especialidadeSelecionada) {
      setAgendamentoStep('data');
    } else if (agendamentoStep === 'vacina' && vacinaSelecionada) {
      setAgendamentoStep('posto');
    } else if (agendamentoStep === 'posto' && postoSelecionado) {
      setAgendamentoStep('data');
    } else if (agendamentoStep === 'data' && dataSelecionada) {
      setAgendamentoStep('hora');
    }
  };

  const handleFinalizarAgendamento = () => {
    if (tipoAgendamento === 'consulta') {
      const especialidade = especialidades.find(e => e.id === especialidadeSelecionada);
      if (!especialidade) return;

      adicionarConsulta({
        especialidade: especialidade.nome,
        medico: especialidade.medico,
        data: dataSelecionada,
        hora: horaSelecionada,
        local: especialidade.local,
        status: 'confirmada',
        origem: 'agendamento',
        tipo: 'consulta',
      });
    } else {
      const vacina = vacinas.find(v => v.id === vacinaSelecionada);
      const posto = postos.find(p => p.id === postoSelecionado);
      if (!vacina || !posto) return;

      adicionarConsulta({
        especialidade: 'Vacinação',
        medico: posto.nome,
        data: dataSelecionada,
        hora: horaSelecionada,
        local: posto.endereco,
        status: 'confirmada',
        origem: 'agendamento',
        tipo: 'vacinacao',
        vacina: vacina.nome,
      });
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setSintomas('');
    setEspecialidadeSelecionada('');
    setVacinaSelecionada('');
    setPostoSelecionado('');
    setDataSelecionada('');
    setHoraSelecionada('');
    setAgendamentoStep('tipo');
    setShowAgendarModal(false);
  };

  const consultasProximas = consultas.filter(c => c.status === 'confirmada' || c.status === 'pendente');

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} className="text-[#2C3E50]" aria-hidden="true" />
            </button>
            <h2 className="text-[#2C3E50]">Agendamentos</h2>
          </div>
          <button
            onClick={() => setShowAgendarModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B7C3E] text-white rounded-full hover:bg-[#156630] transition-colors"
          >
            <Plus size={20} aria-hidden="true" />
            <span className="text-sm font-medium">Agendar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-[#1B7C3E]'
                  : 'text-gray-500 hover:text-[#1B7C3E]'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B7C3E]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="p-4 space-y-4">
        {activeTab === 'proximos' && consultasProximas.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500 mb-4">Nenhum agendamento encontrado</p>
            <Button variant="primary" onClick={() => setShowAgendarModal(true)}>
              <Plus size={20} className="mr-2" aria-hidden="true" />
              Agendar consulta
            </Button>
          </div>
        )}

        {activeTab === 'proximos' && consultasProximas.map((consulta) => (
          <Card key={consulta.id} variant="default">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  consulta.tipo === 'vacinacao' ? 'bg-[#4CAF50]/10' : 'bg-[#0066CC]/10'
                }`}>
                  {consulta.tipo === 'vacinacao' ? (
                    <Syringe size={20} className="text-[#4CAF50]" aria-hidden="true" />
                  ) : (
                    <User size={20} className="text-[#0066CC]" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <h3 className="text-[#2C3E50] mb-1">
                    {consulta.tipo === 'vacinacao' ? consulta.vacina : consulta.especialidade}
                  </h3>
                  <p className="text-sm text-gray-600">{consulta.medico}</p>
                </div>
              </div>
              <Badge status={consulta.status}>
                {consulta.status === 'confirmada' ? 'Confirmada' : 'Pendente'}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} aria-hidden="true" />
                <span>
                  {new Date(consulta.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} aria-hidden="true" />
                <span>{consulta.hora}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} aria-hidden="true" />
                <span>{consulta.local}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="small" className="flex-1">
                Ver detalhes
              </Button>
              <Button variant="destructive" size="small" className="flex-1">
                Cancelar
              </Button>
            </div>
          </Card>
        ))}

        {activeTab === 'passados' && (
          <div className="text-center py-12">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500">Nenhuma consulta passada</p>
          </div>
        )}

        {activeTab === 'cancelados' && (
          <div className="text-center py-12">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500">Nenhuma consulta cancelada</p>
          </div>
        )}
      </div>

      {/* Modal de Agendamento */}
      {showAgendarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
              <h3 className="text-[#2C3E50]">Novo Agendamento</h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Step: Tipo */}
              {agendamentoStep === 'tipo' && (
                <div>
                  <h4 className="text-[#2C3E50] mb-4">Escolha o tipo de agendamento</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setTipoAgendamento('consulta');
                        setAgendamentoStep('sintomas');
                      }}
                      className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-[#1B7C3E] transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0066CC]/10 rounded-full flex items-center justify-center">
                          <User size={20} className="text-[#0066CC]" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E50]">Consulta Médica</p>
                          <p className="text-sm text-gray-600">Agende consulta com especialistas</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setTipoAgendamento('vacinacao');
                        setAgendamentoStep('vacina');
                      }}
                      className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-[#4CAF50] transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                          <Syringe size={20} className="text-[#4CAF50]" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E50]">Vacinação</p>
                          <p className="text-sm text-gray-600">Agende para tomar vacinas</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Sintomas */}
              {agendamentoStep === 'sintomas' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={24} className="text-[#1B7C3E]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Descreva seus sintomas</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Conte-nos o que você está sentindo para podermos recomendar a melhor especialidade.
                  </p>
                  <textarea
                    value={sintomas}
                    onChange={(e) => setSintomas(e.target.value)}
                    placeholder="Exemplo: Estou com dor de cabeça constante há 3 dias..."
                    className="w-full h-32 p-4 bg-[#F5F7FA] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7C3E] resize-none"
                  />
                  <Button
                    variant="primary"
                    className="w-full mt-4"
                    onClick={handleNextStep}
                    disabled={!sintomas.trim()}
                  >
                    Continuar
                  </Button>
                </div>
              )}

              {/* Step 2: Especialidade */}
              {agendamentoStep === 'especialidade' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User size={24} className="text-[#1B7C3E]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha a especialidade</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione qual especialista você gostaria de consultar.
                  </p>
                  <div className="space-y-2 mb-4">
                    {especialidades.map((esp) => (
                      <button
                        key={esp.id}
                        onClick={() => setEspecialidadeSelecionada(esp.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          especialidadeSelecionada === esp.id
                            ? 'border-[#1B7C3E] bg-[#1B7C3E]/5'
                            : 'border-gray-200 hover:border-[#1B7C3E]/50'
                        }`}
                      >
                        <p className="font-medium text-[#2C3E50]">{esp.nome}</p>
                        <p className="text-sm text-gray-600 mt-1">{esp.medico}</p>
                        <p className="text-xs text-gray-500 mt-1">{esp.local}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAgendamentoStep('sintomas')}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleNextStep}
                      disabled={!especialidadeSelecionada}
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Vacina */}
              {agendamentoStep === 'vacina' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Syringe size={24} className="text-[#1B7C3E]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha a vacina</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione a vacina que você deseja tomar.
                  </p>
                  <div className="space-y-2 mb-4">
                    {vacinas.map((vac) => (
                      <button
                        key={vac.id}
                        onClick={() => setVacinaSelecionada(vac.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          vacinaSelecionada === vac.id
                            ? 'border-[#1B7C3E] bg-[#1B7C3E]/5'
                            : 'border-gray-200 hover:border-[#1B7C3E]/50'
                        }`}
                      >
                        <p className="font-medium text-[#2C3E50]">{vac.nome}</p>
                        <p className="text-sm text-gray-600 mt-1">{vac.descricao}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAgendamentoStep('tipo')}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleNextStep}
                      disabled={!vacinaSelecionada}
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Posto */}
              {agendamentoStep === 'posto' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={24} className="text-[#1B7C3E]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha o posto de saúde</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione o posto de saúde mais próximo para a vacinação.
                  </p>
                  <div className="space-y-2 mb-4">
                    {postos.map((posto) => (
                      <button
                        key={posto.id}
                        onClick={() => setPostoSelecionado(posto.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          postoSelecionado === posto.id
                            ? 'border-[#1B7C3E] bg-[#1B7C3E]/5'
                            : 'border-gray-200 hover:border-[#1B7C3E]/50'
                        }`}
                      >
                        <p className="font-medium text-[#2C3E50]">{posto.nome}</p>
                        <p className="text-sm text-gray-600 mt-1">{posto.endereco}</p>
                        <p className="text-xs text-gray-500 mt-1">Distância: {posto.distancia}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAgendamentoStep('vacina')}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleNextStep}
                      disabled={!postoSelecionado}
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Data */}
              {agendamentoStep === 'data' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={24} className="text-[#1B7C3E]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha a data</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione um dia disponível para sua consulta.
                  </p>
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                    {getAvailableDates().map((dateOption) => (
                      <button
                        key={dateOption.date}
                        onClick={() => setDataSelecionada(dateOption.date)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          dataSelecionada === dateOption.date
                            ? 'border-[#1B7C3E] bg-[#1B7C3E]/5'
                            : 'border-gray-200 hover:border-[#1B7C3E]/50'
                        }`}
                      >
                        <p className="font-medium text-[#2C3E50] capitalize">{dateOption.formatted}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAgendamentoStep(tipoAgendamento === 'consulta' ? 'especialidade' : 'posto')}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleNextStep}
                      disabled={!dataSelecionada}
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Horário */}
              {agendamentoStep === 'hora' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={24} className="text-[#1B7C3E]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha o horário</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione o melhor horário para você.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setHoraSelecionada(time)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          horaSelecionada === time
                            ? 'border-[#1B7C3E] bg-[#1B7C3E]/5'
                            : 'border-gray-200 hover:border-[#1B7C3E]/50'
                        }`}
                      >
                        <p className="font-medium text-[#2C3E50]">{time}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setAgendamentoStep('data')}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleFinalizarAgendamento}
                      disabled={!horaSelecionada}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}