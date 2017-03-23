'use strict';
const expect = require('chai').expect;
const testData = require('../data/test-case.json');

describe('CampsiteFilter', () => {
  let campsiteFilter;

  beforeEach(() => {
    campsiteFilter = new (require('../'))(testData);
  });

  describe('hasOverlap', () => {
    let mockReservation = { 'startDate': '2003-12-29', 'endDate': '2004-01-04' };
    
    it('returns false if reservation and desired dates overlap', () => {
      campsiteFilter.setSearch({ 'startDate': '2004-01-03', 'endDate': '2004-01-07' });
      expect(campsiteFilter.hasOverlap(mockReservation)).to.be.true;
    });

    it('returns true for non-overlapping dates', () => {
      campsiteFilter.setSearch({ 'startDate': '2003-12-20', 'endDate': '2003-12-28' });
      expect(campsiteFilter.hasOverlap(mockReservation)).to.be.false;
    });
  });

  describe('violatesGapRule', () => {
    let mockReservation = { 'startDate': '2003-12-29', 'endDate': '2004-01-04' };
    let mockRule = 5;

    it('returns false if desired dates violate the gap rule', () => {
      campsiteFilter.setSearch({ 'startDate': '2004-01-09', 'endDate': '2004-01-15' });
      expect(campsiteFilter.violatesGapRule(mockRule, mockReservation)).to.be.true;

      campsiteFilter.setSearch({ 'startDate': '2003-12-10', 'endDate': '2003-12-24' });
      expect(campsiteFilter.violatesGapRule(mockRule, mockReservation)).to.be.true;
    });    

    it('returns true if the desired dates comply with the gap rule', () => {
      campsiteFilter.setSearch({ 'startDate': '2004-01-10', 'endDate': '2004-01-15' });
      expect(campsiteFilter.violatesGapRule(mockRule, mockReservation)).to.be.false;

      campsiteFilter.setSearch({ 'startDate': '2003-12-10', 'endDate': '2003-12-23' });
      expect(campsiteFilter.violatesGapRule(mockRule, mockReservation)).to.be.false;
    });
  });

  describe('filterSites', () => {
    it('returns an array of site names', () => {
      expect(campsiteFilter.filterSites()).to.be.an('array');
    });

    it('returns a valid array of sites for the search', () => {
      expect(campsiteFilter.filterSites()).to.eql([
          'Daniel Boone Bungalow'
          , 'Teddy Rosevelt Tent Site'
          , 'Bear Grylls Cozy Cave'
          , 'Wyatt Earp Corral' 
      ]);
    });
  });
});
