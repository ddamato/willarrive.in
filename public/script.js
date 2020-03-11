function getPosition(options) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

async function init() {
  const allowPosition = document.querySelector('.allow-geo');
  allowPosition.addEventListener('click', fetchFeed);  
}

async function fetchFeed() {
  this.outerHTML = 'wait...';
  try {
    const { coords } = await getPosition();
    const html = await fetch(`/feed?latitude=${coords.latitude}&longitude=${coords.longitude}`).then((res) => res.text());
    handleResponse(html);
  } catch (err) {
    throw new Error(err);
  }
}

function handleResponse(html) {
  document.body.innerHTML = html;
}

if (window.location.href !== 'https://willarrive.in/') {
  init();
}