import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { FridgeManager } from './components/fridge-manager'
  ;
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css'

const container = document.getElementById('root');
const root = createRoot(container!);

const Root = () => (
  <CookiesProvider>
    <div>
      <div className='layout-topbar'>
        <h1>MyFridge App</h1>
      </div>
      <div className='layout-content'>
        <FridgeManager />
      </div>
    </div>
  </CookiesProvider>
);

root.render(<Root />);
