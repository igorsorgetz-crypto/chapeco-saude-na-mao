import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { BottomNav } from '../components/BottomNav';
import { ChevronLeft, Calendar, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useConsultas } from '../context/ConsultaContext';

export function Historico() {
  const navigate = useNavigate();
  const { consultas } = useConsultas();

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-[#0066CC] text-white p-6 rounded-b-3xl shadow-lg">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors mb-4"
          aria-label="Voltar"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        <div>
          <h2 className="text-white mb-1">Histórico Médico</h2>
          <p className="text-white/90 text-sm">Consultas e exames anteriores</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Consultas Agendadas */}
        <div>
          <h3 className="text-[#2C3E50] mb-3">Consultas Agendadas</h3>
          {consultas.length > 0 ? (
            consultas.map((consulta) => (
              <Card key={consulta.id} className="mb-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#0066CC]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-[#0066CC]" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-[#2C3E50] mb-1">{consulta.especialidade}</h4>
                      <p className="text-sm text-gray-600">{consulta.medico}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(consulta.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })} às {consulta.hora}
                      </p>
                      <p className="text-sm text-gray-500">{consulta.local}</p>
                    </div>
                  </div>
                  <Badge status={consulta.status}>
                    {consulta.status === 'confirmada' ? 'Confirmada' : 
                     consulta.status === 'pendente' ? 'Pendente' : 'Cancelada'}
                  </Badge>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-6">
                <Calendar size={48} className="text-gray-300 mx-auto mb-3" aria-hidden="true" />
                <p className="text-gray-500">Nenhuma consulta agendada</p>
              </div>
            </Card>
          )}
        </div>

        {/* Consultas Anteriores */}
        <div>
          <h3 className="text-[#2C3E50] mb-3">Consultas Anteriores</h3>
          <Card>
            <div className="text-center py-6">
              <FileText size={48} className="text-gray-300 mx-auto mb-3" aria-hidden="true" />
              <p className="text-gray-500">Nenhuma consulta anterior</p>
            </div>
          </Card>
        </div>

        {/* Exames */}
        <div>
          <h3 className="text-[#2C3E50] mb-3">Exames</h3>
          <Card>
            <div className="text-center py-6">
              <FileText size={48} className="text-gray-300 mx-auto mb-3" aria-hidden="true" />
              <p className="text-gray-500">Nenhum exame disponível</p>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}