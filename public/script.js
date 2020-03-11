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
  const select = document.querySelector('.destinations');
  const time = document.querySelector('.time-delta');
  select.addEventListener('change', () => {
    time.textContent = timeDiff(select.value);
  });
  time.textContent = timeDiff(select.value);
}

function timeDiff(isoTime) {
  const now = new Date().getTime();
  const future = new Date(isoTime).getTime();
  const diff = Math.abs(future - now);
  return `${Math.round(diff / 60000)} minutes`;
}

if (window.location.href !== 'https://willarrive.in/') {
  init();
}