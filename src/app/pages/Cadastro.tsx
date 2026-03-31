import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Heart, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Cadastro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cartaoSus, setCartaoSus] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Registrar usuário no sistema
    register({
      nome,
      cpf,
      cartaoSus,
      dataNascimento,
      telefone,
      email,
    });
    
    // Redirecionar para dashboard após cadastro
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B7C3E] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white mb-4"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
              <Heart size={48} className="text-[#1B7C3E]" aria-hidden="true" />
            </div>
            <h1 className="text-white mb-2">Novo Cadastro</h1>
            <p className="text-white/90 text-sm">Preencha seus dados para criar sua conta</p>
          </div>
        </div>

        <form onSubmit={handleCadastro} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <Input
            label="Nome Completo"
            type="text"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <Input
            label="CPF"
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <Input
            label="Cartão SUS"
            type="text"
            placeholder="000 0000 0000 0000"
            value={cartaoSus}
            onChange={(e) => setCartaoSus(e.target.value)}
            required
          />

          <Input
            label="Data de Nascimento"
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </div>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">Já tem uma conta? </span>
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="text-[#0066CC] hover:underline font-medium"
            >
              Fazer login
            </button>
          </div>
        </form>

        <p className="text-center text-white/80 text-sm mt-6">
          Ao criar sua conta, você concorda com os termos de uso e política de privacidade
        </p>
      </div>
    </div>
  );
}