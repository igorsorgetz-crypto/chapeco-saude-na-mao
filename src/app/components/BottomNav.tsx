import { Link, useLocation } from 'react-router';
import { Home, Calendar, MessageSquare, FileText, Syringe, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Início' },
    { path: '/agendamentos', icon: Calendar, label: 'Agendamentos' },
    { path: '/triagem', icon: MessageSquare, label: 'Triagem' },
    { path: '/historico', icon: FileText, label: 'Histórico' },
    { path: '/vacinacao', icon: Syringe, label: 'Vacinação' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-50">
      <div className="max-w-screen-xl mx-auto h-full">
        <div className="grid grid-cols-6 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${
                  isActive 
                    ? 'text-[#1B7C3E]' 
                    : 'text-gray-500 hover:text-[#1B7C3E]'
                }`}
              >
                <Icon size={24} aria-hidden="true" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
