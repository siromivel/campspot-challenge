'use strict';
const moment = require('moment');

class CampsiteFilter {
  constructor(data) {
    this.parsedRules = data.gapRules.map(r => parseInt(r.gapSize + 1));
    this.desired = data.search;
    this.campsites = data.campsites;

    // Map campsite IDs to their respective reservations. This allows us to handle a single site at a time without iterating any irrelevant reservations.
    this.reservationMap = data.reservations.reduce((map, reservation) => {
      if (map[reservation.campsiteId]) {
        map[reservation.campsiteId].push(reservation);
      } else {
        map[reservation.campsiteId] = [reservation];
      }

      return map;
    }, new Map());
  }

  setSearch(query) {
    let validIsoDate = /\d{4}-[01]\d-[0-3]\d/;

    if (query && query.startDate.match(validIsoDate) && query.endDate.match(validIsoDate)) {
      this.desired = query;
    } else {
      return new Error("Invalid Query");
    }
  }

  violatesGapRule(rule, reservation) {
    // Because gap rules are so specific we can easily determine "illegal" start/end dates based on a reservation's start/end dates.
    let illegalStart = moment(reservation.startDate).subtract(rule, 'days');
    let illegalEnd = moment(reservation.endDate).add(rule, 'days');

    // Return a boolean indicating if the rule is violated by the reservation
    return illegalStart.isSame(this.desired.endDate, 'day') ||
           illegalEnd.isSame(this.desired.startDate, 'day');
  }

  hasOverlap(reservation) {
    let desStart = moment(this.desired.startDate);    
    let regStart = moment(reservation.startDate);
    let desEnd = moment(this.desired.endDate);
    let regEnd = moment(reservation.endDate);

    return desStart.isBetween(regStart, regEnd) ||
           regStart.isBetween(desStart, desEnd) ||
           desEnd.isBetween(regStart, regEnd);
  }

  filterSites() {
    // Filter the sites using a reduce - this allows us to run a single loop to filter the sites and pluck out their just their names.
    return this.campsites.reduce((acc, site) => {
      let invalid;

      if (this.reservationMap[site.id]) {
        invalid = this.reservationMap[site.id].some(reg => {
          return this.hasOverlap(reg) || this.parsedRules.some(rule => this.violatesGapRule(rule, reg));
        });
      }

      if (!invalid) acc.push(site.name);
      return acc;
    }, []);
  }

  printFilteredSites() {
    return console.log(this.filterSites().join('\n'));
  }
}

module.exports = CampsiteFilter;
