// Debug script to monitor loading issues
// Run this in browser console when white loader appears

console.log('🔍 Starting loading debug session...');

// 1. Check network status
console.log('📡 Network Status:', {
  online: navigator.onLine,
  connection: navigator.connection ? {
    effectiveType: navigator.connection.effectiveType,
    downlink: navigator.connection.downlink,
    rtt: navigator.connection.rtt
  } : 'Not available'
});

// 2. Monitor ongoing network requests
const originalFetch = window.fetch;
const originalXMLHttpRequest = window.XMLHttpRequest;
const pendingRequests = [];

// Override fetch
window.fetch = function(...args) {
  const requestId = Math.random().toString(36).substr(2, 9);
  const startTime = performance.now();
  
  console.log(`🚀 Request started [${requestId}]:`, args[0]);
  pendingRequests.push({ id: requestId, url: args[0], startTime });
  
  return originalFetch.apply(this, args)
    .then(response => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`✅ Request completed [${requestId}] (${duration.toFixed(2)}ms):`, response.status);
      pendingRequests.splice(pendingRequests.findIndex(r => r.id === requestId), 1);
      return response;
    })
    .catch(error => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`❌ Request failed [${requestId}] (${duration.toFixed(2)}ms):`, error);
      pendingRequests.splice(pendingRequests.findIndex(r => r.id === requestId), 1);
      throw error;
    });
};

// 3. Check for React errors
window.addEventListener('error', (e) => {
  console.error('🔴 Global Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('🔴 Unhandled Promise Rejection:', e.reason);
});

// 4. Monitor React component mounting/unmounting
if (window.React) {
  console.log('⚛️ React detected, version:', React.version);
}

// 5. Check localStorage and sessionStorage
console.log('💾 Storage:', {
  localStorage: Object.keys(localStorage),
  sessionStorage: Object.keys(sessionStorage)
});

// 6. Periodic status check
const statusInterval = setInterval(() => {
  console.log(`⏰ Status check (${new Date().toLocaleTimeString()}):`, {
    pendingRequests: pendingRequests.length,
    onlineStatus: navigator.onLine,
    documentReady: document.readyState,
    reactRoot: !!document.getElementById('root'),
    bodyChildren: document.body.children.length
  });
  
  if (pendingRequests.length > 0) {
    console.log('⏳ Pending requests:', pendingRequests.map(r => ({
      id: r.id,
      url: r.url,
      duration: `${(performance.now() - r.startTime).toFixed(2)}ms`
    })));
  }
}, 5000);

// 7. Clean up function
window.stopLoadingDebug = () => {
  clearInterval(statusInterval);
  window.fetch = originalFetch;
  console.log('🛑 Loading debug stopped');
};

console.log('✅ Loading debug active. Use stopLoadingDebug() to stop monitoring.');
console.log('📝 Pending requests will be logged every 5 seconds.');

// 8. Check for common loading blockers
setTimeout(() => {
  console.log('🔍 Checking for common issues...');
  
  // Check if main React app is mounted
  const reactRoot = document.getElementById('root');
  if (!reactRoot || !reactRoot.children.length) {
    console.warn('⚠️ React root element is empty - app may not have mounted');
  }
  
  // Check for stuck promises
  if (pendingRequests.length > 0) {
    const longRunning = pendingRequests.filter(r => 
      performance.now() - r.startTime > 10000
    );
    if (longRunning.length > 0) {
      console.warn('⚠️ Long running requests detected:', longRunning);
    }
  }
  
  // Check for infinite loading states
  const loaders = document.querySelectorAll('[data-testid*="loading"], [class*="loading"], [class*="spinner"]');
  if (loaders.length > 1) {
    console.warn('⚠️ Multiple loaders detected:', loaders);
  }
}, 15000);