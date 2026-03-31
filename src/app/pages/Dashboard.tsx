import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { BottomNav } from '../components/BottomNav';
import { Bell, Calendar, MessageSquare, FileText, Syringe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useConsultas } from '../context/ConsultaContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { proximaConsulta } = useConsultas();

  // Pegar primeiro nome do usuário
  const primeiroNome = user?.nome.split(' ')[0] || 'Usuário';
  
  // Pegar próxima consulta
  const consulta = proximaConsulta();

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-[#1B7C3E] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm opacity-90">Olá,</p>
            <h2 className="text-white">{primeiroNome}</h2>
          </div>
          <button 
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Notificações"
          >
            <Bell size={24} aria-hidden="true" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-[#FF9800] rounded-full border-2 border-[#1B7C3E]" />
          </button>
        </div>
      </div>

      {/* Próxima Consulta */}
      <div className="px-4 -mt-8">
        {consulta ? (
          <Card variant="elevated" className="border-t-4 border-[#1B7C3E]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Próxima consulta</p>
                <h3 className="text-[#2C3E50] mb-1">{consulta.especialidade}</h3>
                <p className="text-sm text-gray-600">{consulta.medico}</p>
              </div>
              <Badge status={consulta.status}>{consulta.status === 'confirmada' ? 'Confirmada' : 'Pendente'}</Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Calendar size={16} aria-hidden="true" />
              <span>
                {new Date(consulta.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })} às {consulta.hora}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{consulta.local}</p>

            <div className="flex gap-2">
              <Button variant="primary" className="flex-1">
                Ver detalhes
              </Button>
              <Button variant="outline" className="flex-1">
                Cancelar
              </Button>
            </div>
          </Card>
        ) : (
          <Card variant="elevated" className="border-t-4 border-[#1B7C3E]">
            <div className="text-center py-4">
              <Calendar size={48} className="text-gray-300 mx-auto mb-3" aria-hidden="true" />
              <p className="text-gray-600 mb-4">Você não tem consultas agendadas</p>
              <Button variant="primary" onClick={() => navigate('/agendamentos')}>
                Agendar consulta
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Ações Rápidas */}
      <div className="px-4 mt-6">
        <h3 className="text-[#2C3E50] mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/triagem')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 bg-[#1B7C3E]/10 rounded-full flex items-center justify-center mb-3">
                <MessageSquare size={24} className="text-[#1B7C3E]" aria-hidden="true" />
              </div>
              <h4 className="text-[#2C3E50]">Triagem Digital</h4>
              <p className="text-xs text-gray-500 mt-1">Avalie seus sintomas</p>
            </div>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/historico')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 bg-[#0066CC]/10 rounded-full flex items-center justify-center mb-3">
                <FileText size={24} className="text-[#0066CC]" aria-hidden="true" />
              </div>
              <h4 className="text-[#2C3E50]">Histórico</h4>
              <p className="text-xs text-gray-500 mt-1">Seus exames e consultas</p>
            </div>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/vacinacao')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-3">
                <Syringe size={24} className="text-[#4CAF50]" aria-hidden="true" />
              </div>
              <h4 className="text-[#2C3E50]">Vacinação</h4>
              <p className="text-xs text-gray-500 mt-1">Postos e cartão de vacinas</p>
            </div>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/agendamentos')}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 bg-[#FF9800]/10 rounded-full flex items-center justify-center mb-3">
                <Calendar size={24} className="text-[#FF9800]" aria-hidden="true" />
              </div>
              <h4 className="text-[#2C3E50]">Agendamentos</h4>
              <p className="text-xs text-gray-500 mt-1">Ver todos</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Notificações Recentes */}
      <div className="px-4 mt-6 mb-4">
        <h3 className="text-[#2C3E50] mb-4">Notificações</h3>
        
        {consulta && (
          <Card className="mb-2">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#2196F3] rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2C3E50]">Lembrete de consulta</p>
                <p className="text-sm text-gray-600 mt-1">
                  {consulta.especialidade} com {consulta.medico} em {' '}
                  {new Date(consulta.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })} às {consulta.hora}
                </p>
                <p className="text-xs text-gray-400 mt-1">Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
            </div>
          </Card>
        )}
        
        <Card>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#4CAF50] rounded-full mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2C3E50]">Bem-vindo ao app</p>
              <p className="text-sm text-gray-600 mt-1">Comece explorando as funcionalidades disponíveis</p>
              <p className="text-xs text-gray-400 mt-1">Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}