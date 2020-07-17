d3.json("samples.json").then((data) => {
    var bacteriaData = data
    var dropdown = d3.select("#selDataset");
    var subjectID = bacteriaData.names;

    subjectID.forEach((subject) => {
    dropdown.append("option")
    .text(subject)
    .property("value", subject);
    });
  
    demoInfo(subjectID[0], bacteriaData);
    barCharts(subjectID[0], bacteriaData);
    bubbleCharts(subjectID[0], bacteriaData);
    
});


function demoInfo(subject, data) {
    var sampleMetadata = data.metadata;
    var filteredData = sampleMetadata.filter(subjectData => subjectData.id == subject);
    var subjectSelected = filteredData[0];
    var textbox = d3.select("#sample-metadata");

    textbox.html("");
    Object.entries(subjectSelected).forEach(([key, value]) => {
        textbox.append("p").text(`${key}: ${value}`);
    });
}

function barCharts(subject, data) {
    var sampleData = data.samples;
    var filteredData = sampleData.filter(subjectData => subjectData.id == subject);
    var subjectSelected = filteredData[0];
    var sample_values = subjectSelected.sample_values;
    var otu_ids = subjectSelected.otu_ids;
    var otu_labels = subjectSelected.otu_labels;
    
    var barData = [
        {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
    ];
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
            t: 30,
            l: 200 }
    };

    Plotly.newPlot("bar", barData, barLayout);
};

function bubbleCharts(subject, data) {
    var sampleData = data.samples;
    var filteredData = sampleData.filter(subjectData => subjectData.id == subject);
    var subjectSelected = filteredData[0];
    var sample_values = subjectSelected.sample_values;
    var otu_ids = subjectSelected.otu_ids;
    var otu_labels = subjectSelected.otu_labels;   
    
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: {t: 0 },
        hovermode: "closest",
        xaxis: {title: "OTU ID" },
        margin: {t: 30}
      };
    var bubbleData = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        }
    ];
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
};
  

function optionChanged(newSubject) {
    d3.json("samples.json").then((data) => {
        demoInfo(newSubject, data);
        barCharts(newSubject, data);
        bubbleCharts(newSubject, data);
    })
}
  