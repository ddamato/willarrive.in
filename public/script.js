function getPosition(options) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

async function init() {
  try {
    const { coords } = await getPosition();
    const { name, schedule } = await fetch(`/feed?latitude=${coords.latitude}&longitude=${coords.longitude}`)
      .then((res) => res.json());
    directionSelection(schedule);
    atStation(name);
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
    if (!selects[option]) {
      options[option] = [];
    }
    options[option].push(entry.time);
  });

  const select = document.createElement('select');
  Object.keys(options).forEach((option) => {
    const opt = document.createElement('option');
    opt.textContent = option;
    opt.value = option;
    select.appendChild(opt);
  });
  document.body.appendChild(select);
  select.addEventListener('change', onSelect);
}

function onSelect() {
  console.log(options[this.value]);
}

function atStation(name) {
  const h1 = document.createElement('h1');
  h1.textContent = ` at the ${name} station.`;
  document.body.appendChild(h1);
}

if (window.location.href !== 'https://willarrive.in/') {
  init();
}