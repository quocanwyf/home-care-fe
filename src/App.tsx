import 'animate.css';

import { TooltipProvider } from '@radix-ui/react-tooltip';

import ConfigToaster from './config/ConfigToaster';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <>
      <TooltipProvider delayDuration={400} skipDelayDuration={100}>
        <AppRouter />
      </TooltipProvider>
      <ConfigToaster />
    </>
  );
}

export default App;
