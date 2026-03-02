import { StrictMode } from 'react';
import { AppRegistry } from 'react-native';
import App from './App.tsx';
import './index.css';

// Global error handler for debugging
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error:", message, "at", source, lineno, ":", colno, error);
};

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
