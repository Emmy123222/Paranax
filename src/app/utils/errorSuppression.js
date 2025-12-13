/**
 * Error suppression utility for WebSocket and WalletConnect errors
 */

let originalConsoleError = null;
let originalConsoleWarn = null;
let isSuppressionActive = false;

const SUPPRESSED_PATTERNS = [
  'WebSocket connection failed',
  'relay.walletconnect',
  'wss://relay.walletconnect',
  'WalletConnect',
  'jsonrpc-ws-connection'
];

const shouldSuppressMessage = (message) => {
  return SUPPRESSED_PATTERNS.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
};

export const enableErrorSuppression = () => {
  if (isSuppressionActive || typeof window === 'undefined') return;
  
  // Store original console methods
  originalConsoleError = console.error;
  originalConsoleWarn = console.warn;
  
  // Override console.error
  console.error = (...args) => {
    const message = args.join(' ');
    if (shouldSuppressMessage(message)) {
      return; // Suppress the error
    }
    originalConsoleError.apply(console, args);
  };
  
  // Override console.warn
  console.warn = (...args) => {
    const message = args.join(' ');
    if (shouldSuppressMessage(message)) {
      return; // Suppress the warning
    }
    originalConsoleWarn.apply(console, args);
  };
  
  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event) => {
    const message = event.reason?.message || event.reason || '';
    if (shouldSuppressMessage(String(message))) {
      event.preventDefault();
      return;
    }
  };
  
  // Handle general errors
  const handleError = (event) => {
    const message = event.error?.message || event.message || '';
    if (shouldSuppressMessage(String(message))) {
      event.preventDefault();
      return;
    }
  };
  
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('error', handleError);
  
  isSuppressionActive = true;
  
  // Store cleanup functions
  window.__errorSuppressionCleanup = () => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('error', handleError);
    
    if (originalConsoleError) {
      console.error = originalConsoleError;
    }
    if (originalConsoleWarn) {
      console.warn = originalConsoleWarn;
    }
    
    isSuppressionActive = false;
  };
};

export const disableErrorSuppression = () => {
  if (typeof window !== 'undefined' && window.__errorSuppressionCleanup) {
    window.__errorSuppressionCleanup();
    delete window.__errorSuppressionCleanup;
  }
};

// Auto-enable on import in browser environment
if (typeof window !== 'undefined') {
  // Only suppress errors in development mode to keep production debugging clean
  if (process.env.NODE_ENV === 'development') {
    enableErrorSuppression();
  }
}