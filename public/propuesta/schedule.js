/* Pure scheduling helpers shared by the prototype and its checks. */
(function (root) {
  'use strict';
  const modeOf = plan => plan.mode || 'recurring';
  const datesOf = plan => [...new Set(modeOf(plan) === 'dates' ? (plan.dates || []) : [plan.date])].filter(Boolean).sort();
  const statusOn = (plan, date) => plan.deliveryStatuses?.[date] || (modeOf(plan) === 'recurring' ? plan.delivery : null) || 'scheduled';
  const entries = plans => plans.filter(plan => plan.status === 'active').flatMap(plan => datesOf(plan).map(date => ({ plan, date, status: statusOn(plan, date) }))).sort((a,b) => a.date.localeCompare(b.date));
  const nextDate = plan => datesOf(plan).find(date => statusOn(plan,date) !== 'delivered') || null;
  const validDate = (value, minimum) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value && value >= minimum;
  };
  const api = { modeOf, datesOf, statusOn, entries, nextDate, validDate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CairoseSchedule = api;
})(globalThis);
