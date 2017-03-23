'use strict';
const moment = require('moment');

class CampsiteFilter {
  constructor(data) {
    this.parsedRules = data.gapRules.map(r => parseInt(r.gapSize + 1));
    this.desired = data.search;
    this.campsites = data.campsites;
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

  violatesGapRule(rule, registration) {
    // Because gap rules are so specific we can easily determine "illegal" start/end dates based on a reservation's start/end dates.
    let illegalStart = moment(registration.startDate).subtract(rule, 'days');
    let illegalEnd = moment(registration.endDate).add(rule, 'days');

    // Return a boolean indicating if the rule 
    return illegalStart.isSame(this.desired.endDate, 'day') ||
           illegalEnd.isSame(this.desired.startDate, 'day');
  }

  hasOverlap(registration) {
    let desStart = moment(this.desired.startDate);    
    let regStart = moment(registration.startDate);
    let desEnd = moment(this.desired.endDate);
    let regEnd = moment(registration.endDate);

    return desStart.isBetween(regStart, regEnd) ||
           regStart.isBetween(desStart, desEnd) ||
           desEnd.isBetween(regStart, regEnd);
  }

  filterSites() {
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
