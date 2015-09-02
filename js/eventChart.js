var eventChart = ({
    labelArr : '',
    dataArr: '',
    chartel: '',
    chartObj: '',
    initEl: function() {
        this.chartel = $("#myChart").get(0).getContext("2d");
    },
    init: function() {
        this.initEl();
    },
    plotLineChart: function(labelArr, dataArr) {
        if (this.chartObj) {
            this.chartObj.destroy();
        }
        this.labelArr = labelArr;
        this.dataArr = dataArr;
        var data = {
            labels: this.labelArr,
            datasets: [
                {
                    fillColor: "rgba(0,100,255,0.5)",
                    strokeColor: "rgba(0,75,255,0.8)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#1447D2",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: this.dataArr
                }
            ]
        };
        //this.chartObj = new Chart(this.chartel).Bar(data);

        this.chartObj = new Chart(this.chartel).Bar(data, {
            barValueSpacing : 1
        });
    },
    bind: function(obj, method) {
        return function() {
            return method.apply(obj, [].slice.call(arguments));
        };
    }
});
