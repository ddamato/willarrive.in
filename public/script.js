function getPosition(options) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

let t;
let geoposition;

async function fetchPosition() {
  document.body.innerHTML = `<h1>Please wait...</h1>`;
  try {
    const { coords } = await getPosition();
    geoposition = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    fetchFeed();
  } catch (err) {
    document.body.innerHTML = `<h1>${typeof err === 'string' ? err : err.code + ': ' +  err.message}</h1>`;
  }
}

async function fetchFeed() {
  if (t) {
    clearInterval(t);
  }
  const station = document.querySelector('.station-info');
  if (station) {
    await getHtmlByStationId(station.dataset.id);
  } else if (geoposition) {
    await getHtmlByCoords();
  }
}

async function getHtmlByCoords() {
  const params = new URLSearchParams(geoposition);
  fetch(`/feed?${params}`).then((res) => res.text()).then(handleResponse);
}

async function getHtmlByStationId(station) {
  const params = new URLSearchParams({ station });
  fetch(`/feed?${params}`).then((res) => res.text()).then(handleResponse);
}

let selected;

function handleResponse(html) {
  document.body.innerHTML = html;
  const reloader = document.querySelector('.reload');
  reloader.addEventListener('click', fetchFeed);
  initTime();
}

function initTime() {
  const time = document.querySelector('.time-delta');
  const select = document.querySelector('.destinations');

  if(typeof selected !== 'number') {
    selected = 0;
  }

  select.selectedIndex = selected;
  select.addEventListener('change', () => {
    selected = select.selectedIndex;
    clearInterval(t);
    setTime(time, select);
  });
  setTime(time, select);
}

function setTime(time, select) {
  time.textContent = timeDiff(select.value);
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
  fetchPosition();
}