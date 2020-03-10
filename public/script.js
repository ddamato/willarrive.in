function getPosition(options) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

async function init() {
  try {
    const { coords } = await getPosition();
    const response = await fetch(`/feed?latitude=${coords.latitude}&longitude=${coords.longitude}`)
      .then((res) => res.json());
    console.log(response);
  } catch (err) {
    throw new Error(err);
  }
}

if (window.location.href !== 'https://willarrive.in/') {
  init();
}