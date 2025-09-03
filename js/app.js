// Main application JavaScript - ES6+ Vanilla JS
class AdamHub {
  constructor() {
    this.config = CONFIG;
    this.init();
  }
  
  init() {
    this.setCurrentYear();
    this.renderQuickLinks();
    this.renderProjects();
    this.renderTools();
    this.renderSupportOrganizations();
    this.initializeEventListeners();
    this.initializeLucideIcons();
  }
  
  setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
  
  initializeLucideIcons() {
    // Initialize Lucide icons after DOM content is loaded
    if (typeof lucide !== 'undefined') {
      setTimeout(() => {
        lucide.createIcons();
      }, 100);
    }
  }
  
  renderQuickLinks() {
    const container = document.getElementById('quick-links-grid');
    if (!container || !this.config.quickLinks) return;
    
    container.innerHTML = this.config.quickLinks
      .map(link => this.createLinkCard(link))
      .join('');
  }
  
  createLinkCard(link) {
    const iconStyle = `background-color: ${link.color}20;`;
    const featuredClass = link.featured ? 'featured' : '';
    const starBadge = link.featured ? `<i data-lucide="star" class="star-badge"></i>` : '';
    
    return `
      <a href="${link.url}" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="card link-card ${featuredClass}" 
         data-link-id="${link.id}"
         data-category="quick-link">
        ${starBadge}
        <div class="link-icon" style="${iconStyle}">
          <i data-lucide="${link.icon}" style="color: ${link.color}"></i>
        </div>
        <div class="link-title">${link.title}</div>
        <i data-lucide="external-link" class="external-icon"></i>
      </a>
    `;
  }
  
  renderProjects() {
    const featuredContainer = document.getElementById('featured-projects-grid');
    const allContainer = document.getElementById('all-projects-grid');
    const featuredSection = document.getElementById('featured-projects');
    const allSection = document.getElementById('all-projects');
    
    if (!this.config.projects) return;
    
    const featured = this.config.projects.filter(p => p.featured);
    const others = this.config.projects.filter(p => !p.featured);
    
    if (featured.length > 0 && featuredContainer) {
      featuredContainer.innerHTML = featured
        .map(project => this.createProjectCard(project))
        .join('');
      featuredSection.style.display = 'block';
    } else if (featuredSection) {
      featuredSection.style.display = 'none';
    }
    
    if (others.length > 0 && allContainer) {
      allContainer.innerHTML = others
        .map(project => this.createProjectCard(project, true))
        .join('');
      allSection.style.display = 'block';
    } else if (allSection) {
      allSection.style.display = 'none';
    }
  }
  
  createProjectCard(project, compact = false) {
    const statusConfig = {
      active: { icon: 'zap', color: 'var(--color-green-400)', label: 'Active' },
      development: { icon: 'code', color: 'var(--color-gray-300)', label: 'In Development' },
      completed: { icon: 'pause', color: 'var(--color-gray-400)', label: 'Completed' }
    };
    
    const status = statusConfig[project.status] || statusConfig.completed;
    const compactClass = compact ? 'compact' : '';
    const starBadge = project.featured ? `<i data-lucide="star" class="star-badge"></i>` : '';
    const placeholder = project.title.split(' ').map(w => w[0]).join('').slice(0, 2);
    
    return `
      <a href="${project.link}" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="card project-card ${compactClass}" 
         data-link-id="${project.id}"
         data-category="project">
        <div class="project-image">
          ${starBadge}
          <div class="project-placeholder">${placeholder}</div>
          <div class="status-badge ${project.status}">
            <i data-lucide="${status.icon}"></i>
            ${status.label}
          </div>
        </div>
        <div class="project-content">
          <h4 class="project-title">${project.title}</h4>
          <p class="project-description">${project.description}</p>
          <div class="project-footer">
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <i data-lucide="external-link" class="external-icon"></i>
          </div>
        </div>
      </a>
    `;
  }
  
  renderTools() {
    const featuredContainer = document.getElementById('featured-tools-grid');
    const categoriesContainer = document.getElementById('tools-categories');
    const featuredSection = document.getElementById('featured-tools');
    
    if (!this.config.tools) return;
    
    const featured = this.config.tools.filter(t => t.featured);
    const others = this.config.tools.filter(t => !t.featured);
    
    // Render featured tools
    if (featured.length > 0 && featuredContainer) {
      featuredContainer.innerHTML = featured
        .map(tool => this.createToolCard(tool))
        .join('');
      featuredSection.style.display = 'block';
    } else if (featuredSection) {
      featuredSection.style.display = 'none';
    }
    
    // Render tools by category
    if (others.length > 0 && categoriesContainer) {
      const categories = [...new Set(others.map(t => t.category))];
      
      categoriesContainer.innerHTML = categories
        .map(category => {
          const categoryTools = others.filter(t => t.category === category);
          return `
            <div class="tools-category" style="margin-bottom: var(--spacing-xl);">
              <h3 class="subsection-title">${category}</h3>
              <div class="tools-category-grid">
                ${categoryTools.map(tool => this.createToolCard(tool, true)).join('')}
              </div>
            </div>
          `;
        })
        .join('');
    }
  }
  
  createToolCard(tool, compact = false) {
    const compactClass = compact ? 'compact' : '';
    const starBadge = tool.featured ? `<i data-lucide="star" class="star-badge"></i>` : '';
    const placeholder = tool.title.split(' ').map(w => w[0]).join('').slice(0, 2);
    const isPaid = !tool.price.toLowerCase().includes('free');
    const priceIcon = isPaid ? `<i data-lucide="dollar-sign"></i>` : '';
    
    return `
      <a href="${tool.link}" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="card tool-card ${compactClass}" 
         data-link-id="${tool.id}"
         data-category="tool">
        <div class="tool-image">
          ${starBadge}
          <div class="tool-placeholder">${placeholder}</div>
          <div class="price-badge">
            ${priceIcon}
            ${tool.price}
          </div>
        </div>
        <div class="tool-content">
          <h4 class="tool-title">${tool.title}</h4>
          <p class="tool-description">${tool.description}</p>
          <div class="tool-footer">
            <span class="tool-category">${tool.category}</span>
            <i data-lucide="external-link" class="external-icon"></i>
          </div>
        </div>
      </a>
    `;
  }
  
  initializeEventListeners() {
    // Track clicks on all links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link-id]');
      if (link && analytics) {
        const linkId = link.dataset.linkId;
        const category = link.dataset.category || 'link';
        const url = link.href;
        
        analytics.trackClick(linkId, url, category);
      }
    });
    
    // Handle keyboard navigation
    this.initializeKeyboardNavigation();
    
    // Handle window resize for responsive updates
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 300));
  }
  
  initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Enable keyboard navigation for cards
      if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('card')) {
          e.preventDefault();
          focusedElement.click();
        }
      }
    });
    
    // Add tabindex to cards for keyboard navigation
    document.querySelectorAll('.card').forEach(card => {
      card.setAttribute('tabindex', '0');
    });
  }
  
  handleResize() {
    // Reinitialize icons after resize if needed
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  // Utility function for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  renderSupportOrganizations() {
    const container = document.getElementById('support-organizations-grid');
    if (!container || !this.config.supportOrganizations) return;
    
    container.innerHTML = this.config.supportOrganizations
      .map(org => this.createSupportOrgCard(org))
      .join('');
  }
  
  createSupportOrgCard(org) {
    const iconStyle = `background-color: ${org.color}20;`;
    const featuredClass = org.featured ? 'featured' : '';
    const starBadge = org.featured ? `<i data-lucide="star" class="star-badge"></i>` : '';
    
    return `
      <a href="${org.url}" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="card link-card ${featuredClass}" 
         data-link-id="${org.id}"
         data-category="support-organization">
        ${starBadge}
        <div class="link-icon" style="${iconStyle}">
          <i data-lucide="${org.icon}" style="color: ${org.color}"></i>
        </div>
        <div class="link-title">${org.title}</div>
        <div class="link-description">${org.description}</div>
        <i data-lucide="external-link" class="external-icon"></i>
      </a>
    `;
  }

  // Method to refresh content if needed
  refresh() {
    this.renderQuickLinks();
    this.renderProjects();
    this.renderTools();
    this.renderSupportOrganizations();
    this.initializeLucideIcons();
  }
  
  // Method to update configuration dynamically
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.refresh();
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adamHub = new AdamHub();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && analytics) {
    analytics.trackPageView(window.location.pathname);
  }
});

// Error handling for missing dependencies
window.addEventListener('error', (e) => {
  console.warn('Adam Hub: Error occurred:', e.error);
});

// Expose app instance globally for debugging
window.AdamHub = AdamHub;