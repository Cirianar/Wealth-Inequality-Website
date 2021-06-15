var container = d3.select(".map_container");
var svg = container.append("svg")
    .attr("width", 1200)
    .attr("height", 700)
    .attr("viewBox", "0 -250 1200 700");

var g = svg.append("g")
    .attr("id", "countries")

var projection = d3.geoMercator();

var path = d3.geoPath()
    .projection(projection);

var infobox = d3.select(".infobox")
  .append("div")
    .attr("id", "tooltip")
    .html("<p>-- : --</p>");

d3.csv("./data/EIU Democracy Index 2020.csv", function(d) {
    return {
        "country" : d["country"],
        "eiu" : +d["eiu"],
        "year" : +d["year"]
    }
}).then(function(data) {
    var temp = data.map(Object.values);
    var dataArray = temp.filter((e) =>{return e.includes(2020)})

    console.log(dataArray);

    d3.json("./data/map.json").then(function (mapData) {
         g.selectAll("path")
            .data(topojson.feature(mapData, mapData.objects.countries).features)
            .enter().append("path")
                .attr("d", path)
                .style("stroke-width", "0.8px")
                .style("fill", "red")
                .style("fill-opacity", (d, i) =>{
                    var country = dataArray.filter(e => e.includes(mapData.objects.countries.geometries[i].properties.name));
                    if (country.length > 0) {
                        return 1 - (country[0][1] / 10);
                    }
                    if (country.length < 1) {
                        return 0;
                    }
                })
                .html((d, i) =>{
                    return "<title>" + mapData.objects.countries.geometries[i].properties.name + "</title>"
                })
                .on("mouseover", (d, i) =>{
                  var country = dataArray.filter(e => e.includes(i.properties.name));
                  if (country.length > 0) {
                      infobox.html("<p>" + i.properties.name + ": " + country[0][1] + "</p>")
                        .style("color", "#004aad")
                        .style("font-weight", "bold")
                  }
                  if (country.length < 1) {
                      infobox.html("<p>" + i.properties.name + ": No Data</p>");
                  }
                })
    });
});

$(window).scroll(function() {
  var scrollPos = $(this).scrollTop();
  $(".background_picture").css({
    "background-size" : scrollPos + 100 + "%"
  });
});
