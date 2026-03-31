import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [cpf, setCpf] = useState('');
  const [cartaoSus, setCartaoSus] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(cpf, cartaoSus);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('CPF ou Cartão SUS inválidos. Verifique seus dados ou faça seu cadastro.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B7C3E] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <Heart size={48} className="text-[#1B7C3E]" aria-hidden="true" />
          </div>
          <h1 className="text-white mb-2">Bem-vindo ao</h1>
          <h2 className="text-white">Chapecó Saúde na Mão</h2>
          <p className="text-white/90 mt-2 text-sm">Cuidando da sua saúde com facilidade</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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

          <Button type="submit" className="w-full">
            Entrar
          </Button>

          <div className="flex justify-between text-sm mt-4">
            <button type="button" className="text-[#0066CC] hover:underline">
              Esqueci minha senha
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/cadastro')}
              className="text-[#0066CC] hover:underline"
            >
              Fazer cadastro
            </button>
          </div>
        </form>

        <p className="text-center text-white/80 text-sm mt-6">
          Acesso exclusivo para usuários do SUS de Chapecó
        </p>
      </div>
    </div>
  );
}