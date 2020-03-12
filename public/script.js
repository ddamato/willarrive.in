function getPosition(options) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

let t;

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
  if (t) {
    clearInterval(t);
  }
  const station = document.querySelector('.station-info');
  if (station) {
    await getHtmlByStationId(station.dataset.id);
  } else if (sessionStorage.coords) {
    await getHtmlByCoords();
  }
}

async function getHtmlByCoords() {
  const params = new URLSearchParams(JSON.parse(sessionStorage.coords));
  fetch(`/feed?${params}`).then((res) => res.text()).then(handleResponse);
}

async function getHtmlByStationId(station) {
  const params = new URLSearchParams({ station });
  fetch(`/feed?${params}`).then((res) => res.text()).then(handleResponse);
}

function handleResponse(html) {
  document.body.innerHTML = html;
  const reloader = document.querySelector('.reload');
  reloader.addEventListener('click', fetchFeed);
  startTime();
}

function startTime() {
  const time = document.querySelector('.time-delta');
  const select = document.querySelector('.destinations');
  t = setInterval(() => {
    time.textContent = timeDiff(select.value);
  }, 10000);
}

function timeDiff(isoTime) {
  if (isoTime === 'N/A') {
    return '∞ minutes';
  }

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