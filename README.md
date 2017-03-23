# campspot-challenge
Solution to the CampSpot Developer Challenge

### Description of Solution
I solved the challenge by implementing a class that takes in data formatted like the provided test-case JSON. The class exposes a `filterSite` method that returns a filtered array of sites that are not reserved during the requested dates and for which the requested dates violate none of the given gap rules. The module also exposes a `printSite` method; this is simply a wrapper around `filterSite` that prints each name to stdout separated by a newline in order to generate the exact output specified in the challenge.

Each gap rule is assessed by determining an "illegal" start and end date - those being the dates that leave a gap in violation of the rule on either side of the existing reservation. Once we have determined the illegal dates all we need to do is ensure that the desired start/end dates do not violate the respective illegal dates for the site in question.

The logic is broken up into a few functions to keep things clean and testable. For details about specific functions please read `Using the Module` below. The logic is executed on a site-by-site basis.

### Assumptions
I avoided making any assumptions about the data. Because my approach to checking a gap rule is based on determining illegal start/end dates(that is, start/end dates that leave a gap equal to the gap rule,) I added one to each gap rule in order. This was necessary because simply adding the gap rule value to the original date reflects reservations leaving a gap equal to `gapRule - 1` days where the site is unoccupied since the new reservation will begin/end on the exact dates in the search object.

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
