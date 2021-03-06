H5P.Chart.BarChart = (function () {

  /**
   * Creates a bar chart from the given data set.
   *
   * @class
   * @param {array} dataSet
   * @param {H5P.jQuery} $wrapper
   */
  function BarChart(dataSet, $wrapper, description) {
    var self = this;

    var defColors = d3.scale.ordinal()
      .range(["#90EE90", "#ADD8E6", "#FFB6C1", "#B0C4DE", "#D3D3D3", "#20B2AA", "#FAFAD2"]);

    // Create scales for bars
    var xScale = d3.scale.ordinal()
      .domain(d3.range(dataSet.length));

    var yScale = d3.scale.linear()
      .domain([0, d3.max(dataSet, function (d) {
        return d.value;
      })]);

    var x = d3.time.scale();
    var y = d3.scale.linear();

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat(function (d) {
        return dataSet[d % dataSet.length].text + " " + dataSet[d % dataSet.length].value;

      });

    var wrapper = d3.select($wrapper[0]);

    // Create the description link and text of the chart
    var descriptionLink = wrapper
      .append("a")
      .attr("href","javascript:void(0)")
      .text("Click here to show text description of your chart")
      .on("click",function(event){
        H5P.jQuery(this)
        .next()
        .slideToggle();
      });
    var descriptionText = wrapper
      .append("div")
      .text(description)
      .attr("role","alert")
      .attr("style","display:none");

    // Create SVG element
    var svg = wrapper
      .append("svg")
      .attr("tabindex",0)
      .attr("aria-label", "Bar chart two");

    // Create x axis
    var xAxisG = svg.append("g")
      .attr("class", "x-axis")
      .attr("role","list");

    /**
     * @private
     */
    var key = function (d) {
      return dataSet.indexOf(d);
    };
    // Create labels
    var time = new Date().getTime();


    // Create rectangles for bars

    var rects = svg.selectAll("rect")
      .data(dataSet, key)
      .enter()
      .append("rect")
      //.attr("aria-labelledby", function(d,i){return time + key(d);})
      .attr("tabindex", 0)
      .attr("role","listitem")
      .attr("fill", function(d) {
        if (d.color !== undefined) {
          return '#' + d.color;
        }
        return defColors(dataSet.indexOf(d) % 7);
      });

      var texts = rects.append("svg:text")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .text(function(d, i) { return dataSet[i].value + ": " + dataSet[i].text; })
        .attr("fill", function (d) {
          if (d.fontColor !== undefined) {
            return '#' + d.fontColor;
          }
          return '#000000';
        });
    /**
     * Fit the current bar chart to the size of the wrapper.
     */
    self.resize = function () {
      // Always scale to available space
      var style = window.getComputedStyle($wrapper[0]);
      var width = parseFloat(style.width);
      var h = parseFloat(style.height);
      var fontSize = parseFloat(style.fontSize);
      var lineHeight = (1.25 * fontSize);
      var tickSize = (fontSize * 0.125);
      var height = h - tickSize - lineHeight; // Add space for labels below

      // Update SVG size
      svg.attr("width", width)
        .attr("height", h);

      // Update scales
      xScale.rangeRoundBands([0, width], 0.05);
      yScale.range([0, height]);

      x.range([0, width]);
      y.range([height, 0]);

      xAxis.tickSize([tickSize]);
      xAxisG.attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // Move rectangles (bars)
      rects.attr("x", function(d, i) {
          return xScale(i);
        })
        .attr("y", function(d) {
          return height - yScale(d.value);
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d) {
          return yScale(d.value);
        });

      // Re-locate text value labels
      texts.attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
        })
        .attr("y", function(d) {
          return height - yScale(d.value) + lineHeight;
        });
    };
  }

  return BarChart;
})();
