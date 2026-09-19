import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Remove StrictMode for Three.js compatibility (avoids double-render issues with R3F)
createRoot(document.getElementById('root')).render(<App />);
