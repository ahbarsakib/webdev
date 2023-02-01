
var currentCountry;

function getCovidData(callback) {
    const url = "https://api.covid19api.com/summary"
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, true);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhttp);
        }
    }

    xhttp.send();

}

function getCountryData(xhttp){
    
    countryFound = false;
    noNewCases = false;

    const country  = document.getElementById("country").value;
    
    let obj = JSON.parse(xhttp.response);

    let countries = obj.Countries;

    let count = Object.keys(countries).length;
    let totalCountryData = [['Status', 'Number']];
    let newCountryData = [['Status', 'Number']];

    for (i = 0; i < count; i++ ) {
        let currentCountry = countries[i].Country;
        if (currentCountry.toLowerCase() === country.toLowerCase()) {
            //Load the data onto a table later used for creating charts
            totalCountryData.push(['Confirmed', countries[i].TotalConfirmed]);
            totalCountryData.push(['Deaths', countries[i].TotalDeaths]);
            totalCountryData.push(['Recovered', countries[i].TotalRecovered]);

            newCountryData.push(['Confirmed', countries[i].NewConfirmed]);
            newCountryData.push(['Deaths', countries[i].NewDeaths]);
            newCountryData.push(['Recovered', countries[i].NewRecovered]);

            document.getElementById("TotalTitle").innerHTML = currentCountry + " Total Cases";

            if (parseInt(newCountryData[1][1]) === 0 && parseInt(newCountryData[2][1]) === 0 && parseInt(newCountryData[2][1]) === 0) {
                document.getElementById("NewTitle").innerHTML = currentCountry + " has no New Cases!";
                $('#pieChartNew').empty();
                noNewCases = true;
            }
            else {
                document.getElementById("NewTitle").innerHTML = currentCountry + " New Cases";
            }
            countryFound = true;
            break;
        }
    }

    if (countryFound === false) {
        alert("Country not found! Please try again!");
        return;
    }

    google.charts.load('current', {
        packages: ['corechart']
      }).then(function () {
        var totalData = google.visualization.arrayToDataTable(
            totalCountryData
        );

        var newData = google.visualization.arrayToDataTable(
            newCountryData
        );
        
        var options = { 
            chartArea: {left:0, 'width': '80%', 'height': '80%'},
            legend: {
                alignment: 'center',
                position: 'right'
            },
            sliceVisibilityThreshold:0
        };

        var totalContainer = document.getElementById('pieChartTotal');
        var totalChart = new google.visualization.PieChart(totalContainer);
        totalChart.draw(totalData, options);

        if (!noNewCases) {
            var newContainer = document.getElementById('pieChartNew');
            var newChart = new google.visualization.PieChart(newContainer);
            newChart.draw(newData, options);
        }
    });

}

function createNode(e) {
    return document.createElement(e);

}

function append(parent, e) {
    return parent.appendChild(e);
}

function generateChart() {

    console.log(countryData)
    
    // Create and populate the data table.
    var data = google.visualization.arrayToDataTable(countryData);

    // Optional; add a title and set the width and height of the chart
    var options = {'title':'Cases for Country', 'width':550, 'height':400, sliceVisibilityThreshold:0};
  
    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}