import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-stats',
  templateUrl: './list-stats.component.html',
  styleUrls: ['./list-stats.component.scss']
})
export class ListStatsComponent implements OnInit {
  chartLineSparkline3Options: any = {
    series: [{
      data: [20, 40, 30]
    }],
    type: "pie",
    height: 200,
    resize: !0,
    sliceColors: ['#2ab57d', '#5156be', '#e9ecef'],
  };


  pieChartOptions: any = {
    "series": [20, 40, 30],
    "chart": {
      height: 200,
      "resize": !0,
      "type": "pie",
      "sliceColors": ['#2ab57d', '#5156be', '#e9ecef'],
      "colors": ['#2ab57d', '#5156be', '#e9ecef'],
      "stroke": {
        "width": 0
      },
      "legend": {
        "show": false
      },
      "responsive": [
        {
          "breakpoint": 480,
          "options": {
            "chart": {
              "width": 200
            }
          }
        }
      ],
      "yaxis": [
        {
          "show": true,
          "showAlways": false,
          "showForNullSeries": true,
          "opposite": false,
          "reversed": false,
          "logarithmic": false,
          "forceNiceScale": false,
          "floating": false,
          "labels": {
            "show": true,
            "minWidth": 0,
            "maxWidth": 160,
            "offsetX": 0,
            "offsetY": 0,
            "rotate": 0,
            "padding": 20,
            "style": {
              "colors": [],
              "fontSize": "11px",
              "fontWeight": 400,
              "cssClass": ""
            }
          },
          "axisBorder": {
            "show": false,
            "color": "#e0e0e0",
            "width": 1,
            "offsetX": 0,
            "offsetY": 0
          },
          "axisTicks": {
            "show": false,
            "color": "#e0e0e0",
            "width": 6,
            "offsetX": 0,
            "offsetY": 0
          },
          "title": {
            "rotate": -90,
            "offsetY": 0,
            "offsetX": 0,
            "style": {
              "fontSize": "11px",
              "fontWeight": 900,
              "cssClass": ""
            }
          },
          "tooltip": {
            "enabled": false,
            "offsetX": 0
          },
          "crosshairs": {
            "show": true,
            "position": "front",
            "stroke": {
              "color": "#b6b6b6",
              "width": 1,
              "dashArray": 0
            }
          }
        }
      ],
      "annotations": {
        "yaxis": [],
        "xaxis": [],
        "points": []
      },
      "xaxis": {
        "convertedCatToNumeric": false
      }
    },
  }

  lineChartOptions: any = {
    series: [{
      data: [0, 23, 43, 35, 44, 45, 56, 37, 40, 45, 56, 7, 10]
    }],
    chart: {
      type: 'line',
      height: 200,
      resize: !0,
      barSpacing: "7",
      barWidth: "10",
      width: "100%",
      minSpotColor: void 0,
      maxSpotColor: void 0,
      highlightSpotColor: void 0,
      highlightLineColor: void 0,
      lineColor: ['#5156be', '#2ab57d'],
      fillColor: "transparent",
      spotColor: ['#5156be', '#2ab57d'],
      lineWidth: 2,
      barColor: ['#5156be', '#2ab57d'],
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3
    },
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    yaxis: {
      min: 0
    },
    title: {
      text: '$135,965',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Profits',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  }

  barChartOptions: any = {
    series: [{
      data: [5, 6, 2, 9, 4, 7, 10, 12, 4, 7, 10]
    }],
    chart: {
      type: 'bar',
      height: 200,
      resize: !0,
      barSpacing: "7",
      barWidth: "10",

      barColor: ['#5156be', '#2ab57d'],
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3
    },
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    yaxis: {
      min: 0
    },
    title: {
      text: '$135,965',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Profits',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  }


  compositeChartOptions: any = {
    series: [{
      type: 'bar',
      data: [5, 6, 2, 9, 4, 7, 10, 12, 4, 7, 10]
    }, {
      type: 'line',
      data: [5, 6, 2, 9, 4, 7, 10, 12, 4, 7, 10]
    }],
    chart: {
      type: 'line',
      height: "200",
			barWidth: "10",
			resize: !0,
			barSpacing: "7",
      fillColor: "transparent",
      composite: !0,
			lineWidth: 2,
			highlightLineColor: "rgba(0,0,0,.1)",
			highlightSpotColor: "rgba(0,0,0,.2)",
      barColor: ['#5156be', '#2ab57d'],
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3
    },
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    yaxis: {
      min: 0
    },
    title: {
      text: '$135,965',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Profits',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  }

  compositeLineChartOptions: any = {
    series: [{
      type: 'line',
      data: [15, 23, 55, 35, 54, 45, 66, 47, 30]
    }, {
      type: 'line',
      data: [0, 13, 10, 14, 15, 10, 18, 20, 0]
    }],
    chart: {
      type: 'line',
      height: "200",
			barWidth: "10",
			resize: !0,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3
    },
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    yaxis: {
      min: 0
    },
    title: {
      text: '$135,965',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Profits',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  }

  discreteChartOptions: any = {
    series: [{
      data: [4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 5, 6, 3, 4, 5, 8, 7, 6, 9, 3, 2, 4, 1, 5, 6, 4, 3, 7]
    }],
    chart: {
      type: 'discrete',
      height: "200",
			width: "280",
			resize: !0,
      lineColor:'#fff',
     
    }
  }

  // bulletChartOptions: any = {
  //   series: [{
  //     data: [110, 12, 12, 9, 7]
  //   }],
  //   chart: {
  //     type: 'bullet',
  //     height: "200",
	// 		barWidth: "10",
	// 		resize: !0,
  //     // '#5156be', '#fd625e']"
  //     targetColor: '#5156be',
	// 		performanceColor: '#fd625e',
  //     sparkline: {
  //       enabled: true
  //     },
  //   },
  //   stroke: {
  //     curve: 'straight'
  //   },
  //   fill: {
  //     opacity: 0.3
  //   },
  //   xaxis: {
  //     crosshairs: {
  //       width: 1
  //     },
  //   },
  //   yaxis: {
  //     min: 0
  //   },
  //   title: {
  //     text: '$135,965',
  //     offsetX: 0,
  //     style: {
  //       fontSize: '24px',
  //     }
  //   },
  //   subtitle: {
  //     text: 'Profits',
  //     offsetX: 0,
  //     style: {
  //       fontSize: '14px',
  //     }
  //   }
  // }

  bulletChartOptions: any = {
    series: [{
      data: [110, 12, 12, 9, 7]
    }],
    chart: {
      type: 'bullet',
      height: "200",
			barWidth: "10",
			resize: !0,
			barSpacing: "7",
      composite: !0,
			lineWidth: 2,
			highlightLineColor: "rgba(0,0,0,.1)",
			highlightSpotColor: "rgba(0,0,0,.2)",
      barColor: ['#5156be', '#2ab57d'],
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3
    },
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    yaxis: {
      min: 0
    },
    title: {
      text: '$135,965',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Profits',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  }

  boxChartOptions: any = {
    series: [{
      data: [4, 27, 34, 52, 54, 59, 61, 68, 78, 82, 85, 87, 91, 93, 100]
    }],
    chart: {
      type: 'tristate',
      height: 200,
      resize: !0,
      barSpacing: "7",
      barWidth: "10",
      width: "100%",
      minSpotColor: void 0,
      maxSpotColor: void 0,
      highlightSpotColor: void 0,
      highlightLineColor: void 0,
      lineColor: ['#5156be', '#2ab57d'],
      fillColor: "transparent",
      spotColor: ['#5156be', '#2ab57d'],
      lineWidth: 2,
      barColor: ['#5156be', '#2ab57d'],
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3
    },
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    yaxis: {
      min: 0
    },
    title: {
      text: '$135,965',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Profits',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  }
  

  constructor() { }

  ngOnInit(): void {
  }

}
