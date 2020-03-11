# [willarrive.in](https://willarrive.in)

### A quick way to find your subway arrival time in New York City

Just start a willarrive.in url with the number or letter of the line where you need the next arrival. The page will ask for your location and when the times load you can select which direction you're heading.

**Example:** [f.willarrive.in](https://f.willarrive.in)

## About the project

This would have been a fairly quick project if it wasn't for the GTFS standard in which transit data is normally supplied. The data from the MTA API needs to be further decoded after it's fetched with some other file. It's really not a good developer experience and the official docs don't help either.

It's no wonder that on the MTA's official site, their API calls are returning much better data, so I used their APIs instead. For whatever reason, they have an API key exposed and no CORS on the endpoints. If at some point they decide to fix these vulnerabilities, then I'll travel down the GTFS path once again.

### Subdomain routing

Subdomain routing is setup by having a wildcard domain in AWS (`*.willarrive.in`) and then grabbing the `domainPrefix` that's passed through the `event.requestContext` parameter in a Lambda. Apparently, this only works when using the final `callback` parameter to return data. From there, we can determine what line the user is interested in.

### Geolocation

The data coming from any API is almost never exactly what you need out of the box. Because of the way I'm leeching data, I need to make two calls; one for all the stops on the line and a second for the arrival times of all those stops.

While you might think the first API request would return geolocation data for the stops; it doesn't. The second call for data for each stop will return the coordinates along with the arrival times. So after making the second call, I merge the data to the stops provided in the first call, and then determine the closest stop to the user's position.