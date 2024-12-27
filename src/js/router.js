const routes = {
  '/': 'home',
//   '/about': 'about',
//   '/contact': 'contact'
};

const loadView = (view) => {
  const viewModule = import(`./views/${view}.js`);
  viewModule.then(module => {
    module.render();
  }).catch(err => {
    console.error(`Error loading view: ${view}`, err);
  });
};

const router = () => {
  const path = window.location.pathname;
  const view = routes[path] || 'home';
  loadView(view);
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    if (event.target.matches('[data-link]')) {
      event.preventDefault();
      const url = event.target.href;
      window.history.pushState(null, null, url);
      router();
    }
  });

  router();
});
