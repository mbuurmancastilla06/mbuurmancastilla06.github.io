// Filtros del portfolio + botón «Mostrar más».
// Este bloque usa los helpers q(selector) y qa(selector) del script principal.
const filters = qa('[data-testid^="filter-tab-"]');
const cards = qa('.project-card');
const showMoreButton = q('[data-testid="portfolio-show-more"]');
const showMoreWrap = q('[data-testid="portfolio-more-wrap"]');
const INITIAL_PROJECTS = 2;
let selectedCategory = 'todos';
let showAllProjects = false;

const normalizeCategory = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

function renderPortfolio() {
  const matchingCards = cards.filter((card) => {
    const category = normalizeCategory(card.getAttribute('data-category'));
    return selectedCategory === 'todos' || category === selectedCategory;
  });

  cards.forEach((card) => {
    const index = matchingCards.indexOf(card);
    card.hidden = index === -1 ||
      (selectedCategory === 'todos' && !showAllProjects && index >= INITIAL_PROJECTS);
  });

  const hasMore = selectedCategory === 'todos' && matchingCards.length > INITIAL_PROJECTS;
  if (showMoreWrap) showMoreWrap.hidden = !hasMore;
  if (showMoreButton) {
    showMoreButton.hidden = !hasMore;
    showMoreButton.setAttribute('aria-expanded', String(showAllProjects));
    showMoreButton.innerHTML = showAllProjects
      ? 'Mostrar menos <span aria-hidden="true">↑</span>'
      : 'Mostrar más <span aria-hidden="true">↓</span>';
  }

  let message = q('#empty-projects');
  if (!message) {
    message = document.createElement('p');
    message.id = 'empty-projects';
    message.className = 'demo-note';
    q('[data-testid="portfolio-grid"]')?.after(message);
  }
  if (message) {
    message.textContent = matchingCards.length
      ? ''
      : 'Todavía no hay proyectos en esta categoría.';
  }
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    selectedCategory = normalizeCategory(button.textContent);
    showAllProjects = false;

    filters.forEach((filter) => {
      const active = filter === button;
      filter.style.background = active ? 'var(--gold)' : 'transparent';
      filter.style.color = active ? '#000' : '#d4d4d8';
      filter.setAttribute('aria-pressed', String(active));
    });

    renderPortfolio();
  });
});

showMoreButton?.addEventListener('click', () => {
  showAllProjects = !showAllProjects;
  renderPortfolio();
  if (!showAllProjects) {
    q('[data-testid="portfolio-grid"]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

filters.find((button) => normalizeCategory(button.textContent) === 'todos')?.click();
