import 'animate.css';

import { TooltipProvider } from '@radix-ui/react-tooltip';

import Chatbot from './components/chatbot/Chatbot';
import ConfigToaster from './config/ConfigToaster';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="blue">
        <TooltipProvider delayDuration={400} skipDelayDuration={100}>
          <AppRouter />
          <Chatbot />
        </TooltipProvider>
      </ThemeProvider>
      <ConfigToaster />
    </>
  );
}

export default App;
