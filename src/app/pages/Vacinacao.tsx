import { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { ChevronLeft, Syringe, MapPin, Clock, CheckCircle, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useConsultas } from '../context/ConsultaContext';

export function Vacinacao() {
  const navigate = useNavigate();
  const { adicionarConsulta } = useConsultas();
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [agendamentoStep, setAgendamentoStep] = useState<'vacina' | 'posto' | 'data' | 'hora'>('vacina');
  
  // Form state
  const [vacinaSelecionada, setVacinaSelecionada] = useState('');
  const [postoSelecionado, setPostoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horaSelecionada, setHoraSelecionada] = useState('');

  const vacinasDisponiveis = [
    {
      id: '1',
      nome: 'Gripe (Influenza)',
      descricao: 'Proteção contra o vírus da gripe',
      indicacao: 'Idosos, gestantes e grupos de risco',
      doses: '1 dose anual',
      disponivel: true,
    },
    {
      id: '2',
      nome: 'COVID-19',
      descricao: 'Proteção contra o coronavírus',
      indicacao: 'Toda a população',
      doses: 'Dose de reforço anual',
      disponivel: true,
    },
    {
      id: '3',
      nome: 'Hepatite B',
      descricao: 'Proteção contra hepatite B',
      indicacao: 'Crianças e adultos não vacinados',
      doses: '3 doses',
      disponivel: true,
    },
    {
      id: '4',
      nome: 'Tétano e Difteria (dT)',
      descricao: 'Reforço a cada 10 anos',
      indicacao: 'Adolescentes e adultos',
      doses: 'Reforço a cada 10 anos',
      disponivel: true,
    },
    {
      id: '5',
      nome: 'Pneumocócica',
      descricao: 'Proteção contra pneumonia',
      indicacao: 'Idosos acima de 60 anos',
      doses: '1 dose',
      disponivel: true,
    },
  ];

  const postosVacinacao = [
    {
      id: '1',
      nome: 'UBS Centro',
      endereco: 'Rua Marechal Deodoro, 123',
      distancia: '0,5 km',
      horario: 'Seg-Sex: 8h-17h',
      telefone: '(49) 3321-0000',
    },
    {
      id: '2',
      nome: 'UBS Efapi',
      endereco: 'Av. Fernando Machado, 456',
      distancia: '1,2 km',
      horario: 'Seg-Sex: 8h-17h',
      telefone: '(49) 3321-0001',
    },
    {
      id: '3',
      nome: 'UBS Passo dos Fortes',
      endereco: 'Rua Getúlio Vargas, 789',
      distancia: '2,8 km',
      horario: 'Seg-Sex: 8h-17h',
      telefone: '(49) 3321-0002',
    },
    {
      id: '4',
      nome: 'UBS São Pedro',
      endereco: 'Rua São Pedro, 321',
      distancia: '3,5 km',
      horario: 'Seg-Sex: 8h-17h',
      telefone: '(49) 3321-0003',
    },
  ];

  // Gerar datas disponíveis (próximos 15 dias úteis)
  const getAvailableDates = () => {
    const dates = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    while (dates.length < 15) {
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
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleNextStep = () => {
    if (agendamentoStep === 'vacina' && vacinaSelecionada) {
      setAgendamentoStep('posto');
    } else if (agendamentoStep === 'posto' && postoSelecionado) {
      setAgendamentoStep('data');
    } else if (agendamentoStep === 'data' && dataSelecionada) {
      setAgendamentoStep('hora');
    }
  };

  const handleFinalizarAgendamento = () => {
    const vacina = vacinasDisponiveis.find(v => v.id === vacinaSelecionada);
    const posto = postosVacinacao.find(p => p.id === postoSelecionado);
    
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

    // Reset form
    setVacinaSelecionada('');
    setPostoSelecionado('');
    setDataSelecionada('');
    setHoraSelecionada('');
    setAgendamentoStep('vacina');
    setShowAgendarModal(false);
  };

  const handleOpenModal = (vacinaId?: string) => {
    if (vacinaId) {
      setVacinaSelecionada(vacinaId);
      setAgendamentoStep('posto');
    } else {
      setAgendamentoStep('vacina');
    }
    setShowAgendarModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-[#4CAF50] text-white p-6 rounded-b-3xl shadow-lg">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors mb-4"
          aria-label="Voltar"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        <div>
          <h2 className="text-white mb-1">Vacinação</h2>
          <p className="text-white/90 text-sm">Vacinas disponíveis e postos de atendimento</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Vacinas Disponíveis */}
        <div>
          <h3 className="text-[#2C3E50] mb-3">Vacinas Disponíveis</h3>
          <div className="space-y-3">
            {vacinasDisponiveis.map((vacina) => (
              <Card key={vacina.id}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Syringe size={20} className="text-[#4CAF50]" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#2C3E50] mb-1">{vacina.nome}</h4>
                      <p className="text-sm text-gray-600 mb-2">{vacina.descricao}</p>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Indicação:</span> {vacina.indicacao}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Doses:</span> {vacina.doses}
                        </p>
                      </div>
                      {vacina.disponivel && (
                        <Badge status="confirmed" className="inline-flex">
                          <CheckCircle size={14} className="mr-1" aria-hidden="true" />
                          Disponível
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="primary" className="w-full" onClick={() => handleOpenModal(vacina.id)}>
                  Agendar Vacinação
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Postos de Vacinação Próximos */}
        <div>
          <h3 className="text-[#2C3E50] mb-3">Postos Mais Próximos</h3>
          <div className="space-y-3">
            {postosVacinacao.map((posto) => (
              <Card key={posto.id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[#2C3E50]">{posto.nome}</h4>
                    <span className="text-sm font-medium text-[#4CAF50]">{posto.distancia}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>{posto.endereco}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>{posto.horario}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Telefone:</span> {posto.telefone}
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    Ver no mapa
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Cartão de Vacinas */}
        <div>
          <h3 className="text-[#2C3E50] mb-3">Meu Cartão de Vacinas</h3>
          <Card>
            <div className="text-center py-6">
              <Syringe size={48} className="text-gray-300 mx-auto mb-3" aria-hidden="true" />
              <p className="text-gray-500 mb-4">Nenhuma vacina registrada</p>
              <p className="text-sm text-gray-400">
                Suas vacinas aplicadas aparecerão aqui
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {showAgendarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="text-[#2C3E50]">Agendar Vacinação</h3>
              <button
                onClick={() => {
                  setShowAgendarModal(false);
                  setAgendamentoStep('vacina');
                  setVacinaSelecionada('');
                  setPostoSelecionado('');
                  setDataSelecionada('');
                  setHoraSelecionada('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" aria-hidden="true" />
              </button>
            </div>

            {/* Steps */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${agendamentoStep === 'vacina' ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className={`flex-1 h-1 ${agendamentoStep !== 'vacina' ? 'bg-[#4CAF50]' : 'bg-gray-200'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${agendamentoStep === 'posto' ? 'bg-[#4CAF50] text-white' : agendamentoStep === 'data' || agendamentoStep === 'hora' ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <div className={`flex-1 h-1 ${agendamentoStep === 'data' || agendamentoStep === 'hora' ? 'bg-[#4CAF50]' : 'bg-gray-200'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${agendamentoStep === 'data' ? 'bg-[#4CAF50] text-white' : agendamentoStep === 'hora' ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
                <div className={`flex-1 h-1 ${agendamentoStep === 'hora' ? 'bg-[#4CAF50]' : 'bg-gray-200'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${agendamentoStep === 'hora' ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  4
                </div>
              </div>

              {/* Step 1: Escolher Vacina */}
              {agendamentoStep === 'vacina' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Syringe size={24} className="text-[#4CAF50]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha a vacina</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione qual vacina você deseja tomar.
                  </p>
                  <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                    {vacinasDisponiveis.map((vacina) => (
                      <button
                        key={vacina.id}
                        onClick={() => setVacinaSelecionada(vacina.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          vacinaSelecionada === vacina.id
                            ? 'border-[#4CAF50] bg-[#4CAF50]/5'
                            : 'border-gray-200 hover:border-[#4CAF50]/50'
                        }`}
                      >
                        <p className="font-medium text-[#2C3E50]">{vacina.nome}</p>
                        <p className="text-sm text-gray-600 mt-1">{vacina.descricao}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {vacina.doses} • {vacina.indicacao}
                        </p>
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleNextStep}
                    disabled={!vacinaSelecionada}
                  >
                    Continuar
                  </Button>
                </div>
              )}

              {/* Step 2: Escolher Posto */}
              {agendamentoStep === 'posto' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={24} className="text-[#4CAF50]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha o posto</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione o posto de vacinação mais próximo de você.
                  </p>
                  <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                    {postosVacinacao.map((posto) => (
                      <button
                        key={posto.id}
                        onClick={() => setPostoSelecionado(posto.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          postoSelecionado === posto.id
                            ? 'border-[#4CAF50] bg-[#4CAF50]/5'
                            : 'border-gray-200 hover:border-[#4CAF50]/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-[#2C3E50]">{posto.nome}</p>
                          <span className="text-sm font-medium text-[#4CAF50]">{posto.distancia}</span>
                        </div>
                        <p className="text-sm text-gray-600">{posto.endereco}</p>
                        <p className="text-xs text-gray-500 mt-1">{posto.horario}</p>
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

              {/* Step 3: Escolher Data */}
              {agendamentoStep === 'data' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={24} className="text-[#4CAF50]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha a data</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione um dia disponível para vacinação.
                  </p>
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                    {getAvailableDates().map((dateOption) => (
                      <button
                        key={dateOption.date}
                        onClick={() => setDataSelecionada(dateOption.date)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          dataSelecionada === dateOption.date
                            ? 'border-[#4CAF50] bg-[#4CAF50]/5'
                            : 'border-gray-200 hover:border-[#4CAF50]/50'
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
                      onClick={() => setAgendamentoStep('posto')}
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

              {/* Step 4: Escolher Horário */}
              {agendamentoStep === 'hora' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={24} className="text-[#4CAF50]" aria-hidden="true" />
                    <h4 className="text-[#2C3E50]">Escolha o horário</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione o melhor horário para você.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4 max-h-64 overflow-y-auto">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setHoraSelecionada(time)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          horaSelecionada === time
                            ? 'border-[#4CAF50] bg-[#4CAF50]/5'
                            : 'border-gray-200 hover:border-[#4CAF50]/50'
                        }`}
                      >
                        <p className="font-medium text-[#2C3E50] text-sm">{time}</p>
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