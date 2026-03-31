import { Card } from '../components/Card';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { ChevronLeft, User, Mail, Phone, MapPin, Bell, Lock, LogOut, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function Perfil() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-[#1B7C3E] text-white p-6 rounded-b-3xl shadow-lg">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors mb-4"
          aria-label="Voltar"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <User size={40} className="text-[#1B7C3E]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-white mb-1">{user?.nome || 'Usuário'}</h2>
            <p className="text-white/90 text-sm">CPF: {user?.cpf || 'Não informado'}</p>
            <p className="text-white/90 text-sm">Cartão SUS: {user?.cartaoSus || 'Não informado'}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-8">
        {/* Dados Pessoais */}
        <div>
          <h3 className="text-[#2C3E50] mb-3 px-2">Dados Pessoais</h3>
          <Card>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-gray-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="text-[#2C3E50]">{user?.email || 'Não informado'}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
              </div>

              <div className="border-t border-gray-200" />

              <div className="flex items-start gap-3">
                <Phone size={20} className="text-gray-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-[#2C3E50]">{user?.telefone || 'Não informado'}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
              </div>

              <div className="border-t border-gray-200" />

              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-gray-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="text-[#2C3E50]">
                    {user?.dataNascimento 
                      ? new Date(user.dataNascimento).toLocaleDateString('pt-BR')
                      : 'Não informado'}
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
              </div>

              <div className="border-t border-gray-200" />

              <div className="flex items-start gap-3">
                <User size={20} className="text-gray-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Sexo</p>
                  <p className="text-[#2C3E50]">{user?.sexo || 'Não informado'}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </Card>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="text-[#2C3E50] mb-3 px-2">Endereço</h3>
          <Card>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gray-400 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-[#2C3E50] mb-1">{user?.endereco?.rua || 'Não informado'}</p>
                <p className="text-sm text-gray-600">{user?.endereco?.bairro || 'Não informado'} - {user?.endereco?.cidade || 'Não informado'}, {user?.endereco?.estado || 'Não informado'}</p>
                <p className="text-sm text-gray-600">CEP: {user?.endereco?.cep || 'Não informado'}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
            </div>
          </Card>
        </div>

        {/* Preferências */}
        <div>
          <h3 className="text-[#2C3E50] mb-3 px-2">Configurações</h3>
          <Card>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 text-left">
                <Bell size={20} className="text-gray-400" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-[#2C3E50] font-medium">Notificações</p>
                  <p className="text-sm text-gray-600">Gerenciar alertas e lembretes</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
              </button>

              <div className="border-t border-gray-200 pt-4">
                <button className="w-full flex items-center gap-3 text-left">
                  <Lock size={20} className="text-gray-400" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-[#2C3E50] font-medium">Segurança</p>
                    <p className="text-sm text-gray-600">Senha e privacidade</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" aria-hidden="true" />
            Sair da conta
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>Chapecó Saúde na Mão</p>
          <p className="mt-1">Versão 1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}