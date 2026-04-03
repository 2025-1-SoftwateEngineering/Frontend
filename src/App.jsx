import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VocaProvider } from './context/VocaContext';
import { router } from './router';

export default function App() {
  return (
    <AuthProvider>
      <VocaProvider>
        <RouterProvider router={router} />
      </VocaProvider>
    </AuthProvider>
  );
}
