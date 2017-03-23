# campspot-challenge
Solution to the CampSpot Developer Challenge

### Build Process
You will need to install Node.js(>= v4.7.0) and NPM(>= v2.0.0) in order to use this module. Please reference https://nodejs.org/en/ in order to download and build a local Node environment.

Assuming Node and NPM are installed simply run `npm install` in the repository directory in order to install the necessary dependencies.

### Running the Tests
Once the module has been built, run the tests by executing `npm test` from within the repository directory.

### Using the Module
The module follows the CommonJS pattern and is fairly easy to use. It returns an uninstantiated `CampsiteFinder` class that can then be instantiated with an appropriate data object. The data object should conform to the following JSON structure:

```json
{
  "search": [{ "startDate": String, "endDate": String }],
  "campsites": [{ "id": Integer, "name": String }],
  "gapRules": [{ "gapSize": Integer }],
  "reservations: [{ "campsiteId": Integer, "startDate": String, "endDate": String }]
}
```

The class exposes 5 methods:

##### filterSites()
Returns a filtered array of campsite names based on the current search dates, reservations and gap rules.
Use this if you just want to instantiate with a full data object and get a filtered set of valid campsites.

##### printSites()
Prints the result of `filterSites()` delimited by newlines.

##### setSearch()
Sets the `search` property. Must contain valid ISO dates for `startDate` and `endDate`.

##### violatesGapRule(rule, reservation)
Returns true if the current search is in violation of the rule and reservation passed in.

##### hasOverlap(reservation)
Returns true if the current search dates directly overlap the reservation passed in.
