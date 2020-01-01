### OSM-Explorer
An OpenStreetMap wrapper for practical uses. This app was designed as a back end micro service. 
It mainly serves as a middleware for automated requests for OSM.

---------------------------------------------


#### /nodes
Will return a list of OSM nodes for further API use. 

<b>Example</b><br/>
Calling /node via POST and suppyling following data:
<pre>{ "query": "Frankfurt am Main" }</pre>
will return a list of OSM nodes. The response would look like

<pre>
{
  "data": {
    "City": {
      "class": "set_position",
      "data-lat": "50.1106444",
      "data-lon": "8.6820917",
      "data-min-lat": "49.9506444",
      "data-max-lat": "50.2706444",
      "data-min-lon": "8.5220917",
      "data-max-lon": "8.8420917",
      "data-prefix": "City",
      "data-name": "Frankfurt am Main, Hessen, 60311, Deutschland",
      "data-type": "node",
      "data-id": "27418664",
      "href": "/node/27418664"
    },
    ...
    }
}
</pre>

To narrow down the results, the node type can be defined in the same query:
<pre>{ "query": "Frankfurt am Main", "type": "City" }</pre>
<br/>

#### /distance
Will return the distance between two geo locations.

<b>Example</b><br/>

Calling /distance via POST and following data:

<pre>
{
  "type": "car",
  "lat_from": 50.0820384,
  "lon_from": 8.2416556,
  "lat_to": 50.1106444,
  "lon_to": 8.6820917
}
</pre>

Will return a response like:
<pre>
{
  "from_text": "Schloßplatz",
  "to_text": "Braubachstraße",
  "distance_meters": 39590.4,
  "distance_minutes": 31
}
</pre>

<br/>

#### /radius
Will return all nodes around a given geo location.

<b>Example</b><br/>
Calling this endpoint with following POST data:
<pre>
{
   "radius": 2000,
   "type": "shop",
   "lat": 50.0819935,
   "lon": 8.2081650
} 
</pre>

Will (eventually) return a big list of all nodes/elements. In this case caching the results is recommended.