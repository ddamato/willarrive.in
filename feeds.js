const FEED_API_URL_BASE = 'http://datamine.mta.info/mta_esi.php'; // ?key=KEY

module.exports = [{
  feed_id: 1,
  lines: ['1', '2', '3', '4', '5', '6', 'S'],
  get feed () { return `${FEED_API_URL_BASE}?feed_id=${this.feed_id}` }
}, {
  feed_id: 26,
  lines: ['A', 'C', 'E'],
}, {
  feed_id: 16,
  lines: ['N', 'Q', 'R', 'W'],
}, {
  feed_id: 21,
  lines: ['B', 'D', 'F', 'M'],
}, {
  feed_id: 2,
  lines: ['L'],
}, {
  feed_id: 31,
  lines: ['G'],
}, {
  feed_id: 36,
  lines: ['J', 'Z'],
}, {
  feed_id: 51,
  lines: ['7'],
}];