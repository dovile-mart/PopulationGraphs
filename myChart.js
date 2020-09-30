var currentChart;
async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';  
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        renderChart(data, labels, countryName);
    }
}

        document.getElementById('renderBtn').addEventListener('click', fetchData);

        function renderChart(data, labels, countryName) {
            var ctx = document.getElementById('myChart').getContext('2d');
            if (currentChart){
                //Clear the previous chart if it exists
                currentChart.destroy();
            }
            // Draw new chart
            currentChart = new Chart(ctx, {
                type: 'line',       //if change into 'bar' then border lines disappear -D
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Population, ' + countryName,
                        data: data,
                        borderColor: 'rgba(255, 99, 71, 1)',    //line border color -D
                        backgroundColor: 'rgba(255, 99, 71, 0.2)',      //chart background color -D
                    }]
                },
                options: {
                    scales: {           //must be only one option (?), tried make chart animation slower by adding- animation: {duration: 10000} but it didn't work(?) -D
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
        
        function getValues(data) {
            var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
            return vals;
        }
        
        function getLabels(data) {
            var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
            return labels;
        }
        
        function getCountryName(data) {
            var countryName = data[1][0].country.value;
            return countryName;
        }

        