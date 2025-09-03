// Analytics and tracking functionality
class Analytics {
  constructor() {
    this.config = CONFIG?.analytics || {};
    this.gaId = this.getGoogleAnalyticsId();
    this.init();
  }
  
  init() {
    if (this.config.enabled && this.gaId) {
      this.loadGoogleAnalytics();
    }
  }
  
  getGoogleAnalyticsId() {
    // Check for environment variable in production
    // For development, return null or a test ID
    return window.GA_MEASUREMENT_ID || null;
  }
  
  loadGoogleAnalytics() {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      dataLayer.push(arguments);
    };
    
    gtag('js', new Date());
    gtag('config', this.gaId, {
      page_path: window.location.pathname,
    });
  }
  
  trackClick(linkId, url, category = 'link') {
    // Track with Google Analytics if available
    if (window.gtag && this.config.trackClicks) {
      gtag('event', 'click', {
        event_category: category,
        event_label: linkId,
        value: 1,
      });
    }
    
    // Console log for development
    if (this.isDevelopment()) {
      console.log(`Click tracked: ${category} -> ${linkId} (${url})`);
    }
  }
  
  trackPageView(url) {
    if (window.gtag && this.gaId) {
      gtag('config', this.gaId, {
        page_path: url,
      });
    }
  }
  
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
  }
}

// Create global analytics instance
const analytics = new Analytics();