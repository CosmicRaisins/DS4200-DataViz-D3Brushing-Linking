/* global D3 */

// Initialize a Table. Loooooooooooooooooooooosely Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function table(data, columns) {

  let dispatcher;


  let table = d3.select("#table").append("table")
  let thead = table.append("thead")
  let tbody = table.append("tbody")

  // Making the header row
  thead.append("tr")
    .selectAll("th")
    .data(columns).enter()
    .append("th")
      .text(function(column) {
        return column;
      });


  // if the left mouse button is currently being pressed
  let mouseDowned = false

  // Make a row for each entry in the dataset
  let rows = tbody.selectAll("tr")
    .data(data).enter()
    .append("tr")

  // handles mouseover events
  tbody.selectAll("tr")
    .on("mouseover", (event, d) => {
      // if the user is currently dragging/brushing, select the current row
      if (mouseDowned) {
        d3.select(event.currentTarget).classed("selected", true)
        // Get the name of our dispatcher's event
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        // Let other charts know
        dispatcher.call(dispatchString, this, table.selectAll('.selected').data());
      } else {
        // if the user is not burshing, only highlight the current row
        d3.select(event.currentTarget).classed("mouseover", true)
      }
    })
    // remove highlight when mouse out
    .on("mouseout", (event, d) => {
      d3.select(event.currentTarget).classed("mouseover", false)
    })
    // initiates brushing and selecting
    .on("mousedown", function (event, d) {
      // remove all selections when a new round of brushing starts
      tbody.selectAll("tr")
        .attr("class", null);
      // select the clicked row
      d3.select(event.currentTarget).classed("selected", true)
      // Get the name of our dispatcher's event
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      // Let other charts know
      dispatcher.call(dispatchString, this, table.selectAll('.selected').data());
      mouseDowned = true
    })
    // ends brushing and selecting
    .on("mouseup", function () {
      mouseDowned = false
    })
    // handles single selection on table
    .on("click", function (event, d) {
      // remove all previous selections when a new selection is detected
      tbody.selectAll("tr")
        .attr("class", null);
      // select the clicked row
      d3.select(event.currentTarget).classed("selected", true)
        // Get the name of our dispatcher's event
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      // Let other charts know
      dispatcher.call(dispatchString, this, table.selectAll('.selected').data());

    })


  let selectableElements = rows;

  // Make a cell in each row for each column
  let cells = rows.selectAll("td")
    .data(function(row) {
      return columns.map(function(column) {
        return {column: column, value: row[column]};
      });
    }).enter()
    .append("td")
      .html(function(d) { return d.value; });

  // Gets or sets the dispatcher we use for selection events
  table.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return table;
  };

  // Given selected data from another visualization
  // select the relevant elements here (linking)
  table.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed('selected', d =>
      selectedData.includes(d)
    );

  };

    return table;
  }