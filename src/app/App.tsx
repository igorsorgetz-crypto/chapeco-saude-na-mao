import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { ConsultaProvider } from './context/ConsultaContext';

export default function App() {
  return (
    <AuthProvider>
      <ConsultaProvider>
        <RouterProvider router={router} />
      </ConsultaProvider>
    </AuthProvider>
  );
}