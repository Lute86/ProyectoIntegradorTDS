document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pageSections = document.querySelectorAll('.page-section');
  const pageTitle = document.getElementById('pageTitle');
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

  const pageTitles = {
    dashboard: 'Dashboard',
    noticias: 'Noticias',
    carreras: 'Carreras',
    eventos: 'Eventos',
    galeria: 'Galería',
    testimonios: 'Testimonios',
    usuarios: 'Usuarios',
    personalizar: 'Personalizar Sitio',
    ajustes: 'Ajustes Generales'
  };

  function navigateTo(page) {
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    pageSections.forEach(section => {
      section.classList.toggle('active', section.id === `page-${page}`);
    });

    pageTitle.textContent = pageTitles[page] || page;
    breadcrumbCurrent.textContent = pageTitles[page] || page;
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.page);
    });
  });

  window.navigateTo = navigateTo;

  window.openModal = function(id) {
    document.getElementById(id).classList.add('active');
    if (id === 'modalLayoutImage') {
      const current = document.getElementById('currentLayoutImage');
      const modalCurrent = document.getElementById('modalCurrentImage');
      const preview = document.getElementById('layoutImagePreview');
      if (current && modalCurrent) {
        modalCurrent.src = current.src;
      }
      if (preview && current) {
        preview.src = current.src;
      }
      loadPreviousImages();
    }
  };

  window.closeModal = function(id) {
    document.getElementById(id).classList.remove('active');
  };

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  window.selectLayout = function(el, layout) {
    document.querySelectorAll('.layout-option').forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
  };

  window.handleLayoutImageSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná un archivo de imagen.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const src = e.target.result;
      const preview = document.getElementById('layoutImagePreview');
      const modalCurrent = document.getElementById('modalCurrentImage');
      const box = document.getElementById('layoutImageBox');

      preview.src = src;
      modalCurrent.src = src;
      box.style.backgroundImage = `url('${src}')`;
      box.style.backgroundSize = document.getElementById('layoutImageFit').value;
      box.style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(file);
  };

  window.applyLayoutImage = function() {
    const preview = document.getElementById('layoutImagePreview');
    if (!preview.src || preview.src.includes('placeholder.com')) {
      alert('Seleccioná primero una imagen.');
      return;
    }

    const current = document.getElementById('currentLayoutImage');
    const box = document.getElementById('layoutImageBox');
    const fit = document.getElementById('layoutImageFit').value;

    current.src = preview.src;
    box.style.backgroundImage = `url('${preview.src}')`;
    box.style.backgroundSize = fit;
    box.style.backgroundPosition = 'center';

    // Guardar la imagen aplicada en localStorage
    saveLayoutImage(preview.src);

    closeModal('modalLayoutImage');
  };

  window.clearLayoutImage = function() {
    const current = document.getElementById('currentLayoutImage');
    const preview = document.getElementById('layoutImagePreview');
    const box = document.getElementById('layoutImageBox');

    current.src = 'https://via.placeholder.com/480x260?text=Imagen+actual';
    preview.src = 'https://via.placeholder.com/420x220?text=Previsualizaci%C3%B3n';
    box.style.backgroundImage = 'linear-gradient(135deg, #eef2ff, #e0f2fe)';
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
    document.getElementById('layoutImageInput').value = '';
  };

  window.applyTheme = function(theme) {
    document.querySelectorAll('.theme-preset').forEach(p => p.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const themes = {
      default: { primary: '#2563eb', secondary: '#0f172a', accent: '#f59e0b' },
      dark: { primary: '#6366f1', secondary: '#1e1b4b', accent: '#ec4899' },
      nature: { primary: '#10b981', secondary: '#064e3b', accent: '#84cc16' },
      warm: { primary: '#f97316', secondary: '#431407', accent: '#eab308' }
    };

    const t = themes[theme];
    if (t) {
      document.getElementById('colorPrimary').value = t.primary;
      document.getElementById('colorSecondary').value = t.secondary;
      document.getElementById('colorAccent').value = t.accent;
    }
  };

  const draggableList = document.getElementById('sectionsList');
  if (draggableList) {
    let draggedItem = null;

    draggableList.querySelectorAll('.draggable-item').forEach(item => {
      item.addEventListener('dragstart', function() {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
      });

      item.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        draggedItem = null;
      });

      item.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (draggedItem && draggedItem !== this) {
          const rect = this.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          if (e.clientY < midpoint) {
            draggableList.insertBefore(draggedItem, this);
          } else {
            draggableList.insertBefore(draggedItem, this.nextSibling);
          }
        }
      });
    });
  }

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });
});
