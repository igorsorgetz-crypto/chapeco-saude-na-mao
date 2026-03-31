import { useState } from 'react';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { ChevronLeft, Send, AlertCircle, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useConsultas } from '../context/ConsultaContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  showScheduleOptions?: boolean;
  showDateOptions?: boolean;
  showTimeOptions?: boolean;
  showConfirmation?: boolean;
}

type ConversationStep = 'initial' | 'symptom' | 'duration' | 'intensity' | 'other_symptoms' | 'recommendation' | 'schedule_confirm' | 'date_selection' | 'time_selection' | 'final';

export function Triagem() {
  const navigate = useNavigate();
  const { adicionarConsulta } = useConsultas();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou seu assistente virtual de triagem. Vou fazer algumas perguntas para entender melhor seus sintomas. O que você está sentindo?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversationStep, setConversationStep] = useState<ConversationStep>('initial');
  const [userSymptom, setUserSymptom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Gerar datas disponíveis (próximos 5 dias úteis)
  const getAvailableDates = () => {
    const dates = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Começar amanhã

    while (dates.length < 5) {
      const dayOfWeek = currentDate.getDay();
      // Pular finais de semana (0 = domingo, 6 = sábado)
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

  const getBotResponse = (userMessage: string, step: ConversationStep): string => {
    switch (step) {
      case 'initial':
        setUserSymptom(userMessage);
        setConversationStep('duration');
        return 'Entendo. Há quanto tempo você está com esse sintoma?';
      
      case 'duration':
        setConversationStep('intensity');
        return 'Certo. Em uma escala de 1 a 10, qual a intensidade desse sintoma?';
      
      case 'intensity':
        setConversationStep('other_symptoms');
        return 'Obrigado pelas informações. Você apresenta algum outro sintoma como febre, náusea ou dificuldade para respirar?';
      
      case 'other_symptoms':
        setConversationStep('recommendation');
        return `Com base nas informações fornecidas sobre ${userSymptom}, recomendo:\n\n✅ Agendar uma consulta com clínico geral\n✅ Manter hidratação adequada\n✅ Monitorar a evolução dos sintomas\n\n⚠️ Se os sintomas piorarem, procure atendimento de urgência imediatamente.`;
      
      default:
        return 'Como posso ajudá-lo?';
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = getBotResponse(currentInput, conversationStep);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        showScheduleOptions: conversationStep === 'recommendation',
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleScheduleResponse = (response: 'sim' | 'nao') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: response === 'sim' ? 'Sim, gostaria de agendar' : 'Não, obrigado',
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (response === 'sim') {
      setConversationStep('date_selection');
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Ótimo! Escolha uma data disponível para sua consulta:',
          isUser: false,
          timestamp: new Date(),
          showDateOptions: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    } else {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Entendo. Se precisar agendar depois, você pode usar a aba "Agendamentos" no menu. Cuide-se e melhoras!',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleDateSelection = (date: string, formatted: string) => {
    setSelectedDate(date);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: formatted,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setConversationStep('time_selection');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Perfeito! Agora escolha o horário:',
        isUser: false,
        timestamp: new Date(),
        showTimeOptions: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: time,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Criar a consulta
    const dataFormatada = new Date(selectedDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    adicionarConsulta({
      especialidade: 'Clínico Geral',
      medico: 'Dr. João Santos',
      data: selectedDate,
      hora: time,
      local: 'UBS Centro - Chapecó',
      status: 'confirmada',
      origem: 'triagem',
      tipo: 'consulta',
    });

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `✅ Consulta agendada com sucesso!\n\n📋 Detalhes:\n• Especialidade: Clínico Geral\n• Médico: Dr. João Santos\n• Data: ${dataFormatada}\n• Horário: ${time}\n• Local: UBS Centro - Chapecó\n\n📱 Você pode ver sua consulta na tela inicial. Lembre-se de chegar 15 minutos antes!`,
        isUser: false,
        timestamp: new Date(),
        showConfirmation: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} className="text-[#2C3E50]" aria-hidden="true" />
          </button>
          <div>
            <h2 className="text-[#2C3E50]">Triagem Digital</h2>
            <p className="text-sm text-gray-500">Assistente Virtual</p>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-[#FF9800] text-white p-4 text-sm">
        <div className="flex items-start gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium">⚠️ Atenção:</p>
            <p className="mt-1">
              Em caso de emergência, ligue 192 (SAMU) ou dirija-se ao pronto-socorro mais próximo.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-[#1B7C3E] text-white'
                    : 'bg-white text-[#2C3E50] shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isUser ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Schedule Options */}
            {message.showScheduleOptions && (
              <div className="flex justify-start mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScheduleResponse('sim')}
                    className="px-6 py-3 bg-[#1B7C3E] text-white rounded-full text-sm hover:bg-[#156630] transition-colors font-medium"
                  >
                    ✓ Sim, agendar agora
                  </button>
                  <button
                    onClick={() => handleScheduleResponse('nao')}
                    className="px-6 py-3 bg-white text-gray-700 rounded-full text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Não, obrigado
                  </button>
                </div>
              </div>
            )}

            {/* Date Options */}
            {message.showDateOptions && (
              <div className="flex justify-start mt-2">
                <div className="bg-white rounded-2xl shadow-sm p-3 max-w-[80%]">
                  <div className="space-y-2">
                    {getAvailableDates().map((dateOption) => (
                      <button
                        key={dateOption.date}
                        onClick={() => handleDateSelection(dateOption.date, dateOption.formatted)}
                        className="w-full flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg hover:bg-[#1B7C3E] hover:text-white transition-colors text-left group"
                      >
                        <Calendar size={20} className="text-[#1B7C3E] group-hover:text-white" aria-hidden="true" />
                        <span className="text-sm capitalize">{dateOption.formatted}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Time Options */}
            {message.showTimeOptions && (
              <div className="flex justify-start mt-2">
                <div className="bg-white rounded-2xl shadow-sm p-3 max-w-[80%]">
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelection(time)}
                        className="flex items-center justify-center gap-2 p-3 bg-[#F5F7FA] rounded-lg hover:bg-[#1B7C3E] hover:text-white transition-colors group"
                      >
                        <Clock size={16} className="text-[#1B7C3E] group-hover:text-white" aria-hidden="true" />
                        <span className="text-sm font-medium">{time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {message.showConfirmation && (
              <div className="flex justify-start mt-3">
                <button
                  onClick={handleGoToDashboard}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1B7C3E] text-white rounded-full hover:bg-[#156630] transition-colors font-medium"
                >
                  <CheckCircle size={20} aria-hidden="true" />
                  Ver no início
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 h-12 px-4 bg-[#F5F7FA] border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#1B7C3E]"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-12 h-12 bg-[#1B7C3E] text-white rounded-full flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-[#156630]"
            aria-label="Enviar mensagem"
          >
            <Send size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}