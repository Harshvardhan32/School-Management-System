import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from './utils/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <Toaster />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
);