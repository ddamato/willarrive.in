function getPosition(options) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

async function init() {
  const allowPosition = document.querySelector('.allow-geo');
  allowPosition.addEventListener('click', fetchFeed);  
}

async function fetchFeed() {
  this.outerHTML = 'wait...';
  const preGeo = document.querySelector('.pre-geo');
  const postGeo = document.querySelector('.post-geo');
  try {
    const { coords } = await getPosition();
    const { name, schedule } = await fetch(`/feed?latitude=${coords.latitude}&longitude=${coords.longitude}`)
      .then((res) => res.json());
    directionSelection(schedule);
    atStation(name);
    preGeo.classList.remove('active');
    postGeo.classList.add('active');
  } catch (err) {
    throw new Error(err);
  }
}

const options = {};

function directionSelection(schedule) {

  schedule.forEach((entry) => {
    let option = `${entry.bound} bound`;
    if (entry.bound !== entry.destination) {
      option = `${entry.bound} (${entry.destination}) bound`;
    }
    if (!options[option]) {
      options[option] = [];
    }
    options[option].push(entry.time);
  });

  const select = document.querySelector('.direction-selection');
  select.innerHTML = Object.keys(options).map((option) => {
    return `<option value=${option}>${option}</option>`;
  }).join('');
  const times = document.querySelector('.time-slider');
  select.addEventListener('change', ({ target }) => onSelect(target, times));
}

function onSelect(select, target) {
  target.innerHTML = options[select.value].map((time) => {
    // TODO: Convert to now diff
    return `<li>${new Date(time).toLocaleString()}</li>`;
  }).join('');
}

function atStation(name) {
  const closestStation = document.querySelector('.closest-station');
  closestStation = name;
}

if (window.location.href !== 'https://willarrive.in/') {
  init();
}