import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { PermissionProvider } from './context/PermissionContext.tsx';
import { SocketProvider } from './context/SocketContext.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tính năng tự động fetch lại khi focus vào tab
      retry: 0, // Thử gọi lại API 2 lần nếu thất bại
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <PermissionProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </PermissionProvider>
      </AuthProvider>
    </BrowserRouter>
    {/* <ReactQueryDevtools initialIsOpen={true} /> */}
  </QueryClientProvider>
);
