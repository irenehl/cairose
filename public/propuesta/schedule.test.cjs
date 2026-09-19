const test = require('node:test');
const assert = require('node:assert/strict');
const { datesOf, entries, nextDate, validDate, statusOn } = require('./schedule.js');

test('one occasion produces exactly one delivery, without recurrence', () => {
  const order = { mode:'single', date:'2026-10-01', status:'active' };
  assert.deepEqual(entries([order]).map(row=>row.date), ['2026-10-01']);
});
test('chosen dates are unique, chronological and have independent status', () => {
  const order = {mode:'dates', dates:['2027-02-14','2026-12-24','2027-02-14'], status:'active', deliveryStatuses:{'2026-12-24':'delivered'}};
  assert.deepEqual(datesOf(order), ['2026-12-24','2027-02-14']);
  assert.deepEqual(entries([order]).map(row=>row.status), ['delivered','scheduled']);
  assert.equal(nextDate(order), '2027-02-14');
  order.deliveryStatuses['2027-02-14']='delivered';
  assert.equal(nextDate(order), null);
  assert.equal(entries([order]).length,2);
});
test('paused and canceled orders never appear in the active agenda', () => {
  const base={mode:'dates',dates:['2026-12-24','2027-02-14']};
  assert.deepEqual(entries([{...base,status:'paused'},{...base,status:'canceled'}]),[]);
});
test('dates require real calendar days, future minimum, and explicit year', () => {
  for (const bad of ['', '2026-02-30', '2026-09-18','14/02/2027','2026-13-01']) assert.equal(validDate(bad,'2026-09-19'),false,bad);
  assert.equal(validDate('2026-09-19','2026-09-19'),true);
  assert.equal(validDate('2027-02-14','2026-09-19'),true);
  assert.equal(validDate('2028-02-29','2026-09-19'),true);
});
test('existing recurring example keeps its schedule and status', () => {
  const plan={date:'2026-10-01',frequency:14,delivery:'out',status:'active'};
  assert.equal(statusOn(plan,'2026-10-01'),'out');
  assert.equal(entries([plan]).length,1);
  plan.deliveryStatuses={'2026-10-01':'delivered'};
  assert.equal(statusOn(plan,'2026-10-01'),'delivered');
});
