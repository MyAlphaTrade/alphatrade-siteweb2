// Nav identique sur toutes les pages — injecté dynamiquement
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isIndex = currentPage === 'index.html' || currentPage === '';

  const links = [
    { href: 'index.html',                 label: 'Accueil',           id: 'home',   anchor: null              },
    { href: 'index.html#fonctionnalites', label: 'Fonctionnalités',   id: 'feat',   anchor: 'fonctionnalites' },
    { href: 'index.html#comment',         label: 'Comment ça marche', id: 'how',    anchor: 'comment'         },
    { href: 'tarifs.html',                label: 'Tarifs',            id: 'tarifs', anchor: null              },
    { href: 'telechargement.html',        label: 'Téléchargement',    id: 'dl',     anchor: null              },
    { href: 'index.html#faq',             label: 'FAQ',               id: 'faq',    anchor: 'faq'             },
  ];

  const pageActiveMap = {
    'tarifs.html':         'tarifs',
    'tarifs':              'tarifs',
    'telechargement.html': 'dl',
    'telechargement':      'dl',
    'inscription.html':    null,
    'inscription':         null,
    'connexion.html':      null,
    'connexion':           null,
    'espace-client.html':  null,
    'espace-client':       null,
  };

  // Active initial selon la page
  const initialActive = isIndex ? 'home' : (pageActiveMap[currentPage] || null);

  function renderLinks(activeId) {
    return links.map(l =>
      `<a href="${l.href}" id="navlink-${l.id}" class="${activeId === l.id ? 'active' : ''}">${l.label}</a>`
    ).join('');
  }

  function setActive(id) {
    links.forEach(l => {
      const el = document.getElementById('navlink-' + l.id);
      if (el) el.classList.toggle('active', l.id === id);
    });
  }

  const user = (() => { try { return JSON.parse(localStorage.getItem('at_user')); } catch { return null; } })();

  const ctaHtml = user
    ? `<a href="espace-client.html" class="btn btn-primary btn-sm">Mon espace</a>
       <a href="#" class="btn btn-outline btn-sm" onclick="logout();return false">Déconnexion</a>`
    : `<a href="connexion.html" class="btn btn-outline btn-sm">Connexion</a>
       <a href="inscription.html" class="btn btn-primary btn-sm">Commencer</a>`;

  const nav = document.getElementById('mainNav');
  if (nav) {
    nav.querySelector('.nav-links').innerHTML = renderLinks(initialActive);
    nav.querySelector('.nav-cta').innerHTML   = ctaHtml;
  }

  // Re-applique l'état actif après chargement complet (pages hors index)
  if (!isIndex && initialActive) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setActive(initialActive));
    } else {
      setActive(initialActive);
    }
  }

  // Sur index.html : détection active par scroll + clic
  if (isIndex) {
    // Sections surveillées dans l'ordre de la page
    const anchorSections = [
      { id: 'fonctionnalites', navId: 'feat' },
      { id: 'comment',         navId: 'how'  },
      { id: 'faq',             navId: 'faq'  },
    ];

    function updateActiveFromScroll() {
      const scrollY = window.scrollY + 120; // compense la hauteur de la nav (68px + marge)
      let current = 'home';
      anchorSections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollY) current = s.navId;
      });
      setActive(current);
    }

    window.addEventListener('DOMContentLoaded', () => {
      updateActiveFromScroll();

      // Mise à jour au scroll
      window.addEventListener('scroll', updateActiveFromScroll, { passive: true });

      // Clic sur un lien ancre → actif immédiatement
      links.forEach(l => {
        const el = document.getElementById('navlink-' + l.id);
        if (el && l.anchor) {
          el.addEventListener('click', () => setActive(l.id));
        }
        // Clic sur Accueil → retour en haut
        if (el && l.id === 'home') {
          el.addEventListener('click', () => setActive('home'));
        }
      });
    });
  }
})();
