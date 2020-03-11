function getPosition(options) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

async function init() {
  const allowPosition = document.querySelector('.allow-geo');
  if (allowPosition) {
    allowPosition.addEventListener('click', fetchPosition);
  }
}

async function fetchPosition() {
  this.outerHTML = 'wait...';
  try {
    const { coords } = await getPosition();
    const { latitude, longitude } = coords;
    sessionStorage.coords = JSON.stringify({ latitude, longitude });
    fetchFeed();
  } catch (err) {
    throw new Error(err);
  }
}

async function fetchFeed() {
  if (!sessionStorage.coords) {
    return;
  }  

  try {
    const { latitude, longitude } = JSON.parse(sessionStorage.coords);
    const html = await fetch(`/feed?latitude=${latitude}&longitude=${longitude}`).then((res) => res.text());
    handleResponse(html);
  } catch (err) {
    throw new Error(err);
  }
}

function handleResponse(html) {
  document.body.innerHTML = html;
  const select = document.querySelector('.destinations');
  const time = document.querySelector('.time-delta');
  const reloader = document.querySelector('.reload');
  select.addEventListener('change', () => {
    time.textContent = timeDiff(select.value);
  });
  time.textContent = timeDiff(select.value);
  reloader.addEventListener('click', fetchFeed);
}

function timeDiff(isoTime) {
  const now = new Date().getTime();
  const future = new Date(isoTime).getTime();
  const minutes = Math.round((future - now) / 60000);
  return Math.abs(minutes) === 1
    ? `${minutes} minute`
    : `${minutes} minutes`;
}

if (window.location.href !== 'https://willarrive.in/') {
  init();
}