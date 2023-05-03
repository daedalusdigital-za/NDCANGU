import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global/global.service';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    isShown: boolean = true;

    columnChartOptions: any = {
        series: [
          {
            name: "Normal",
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
          },
          {
            name: "Prediabetes",
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
          },
          {
            name: "Diabetes",
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: [
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct"
          ]
        },
        yaxis: {
          title: {
            text: " (Cases)"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: (val: any) =>{
              return "" + val + " Cases";
            }
          }
        }
      };

      customizedPie: any = {
        //backgroundColor: '#2c343c',
      
        title: {
          text: 'Customized Pie',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ccc'
          }
        },
      
        tooltip: {
          trigger: 'item'
        },
      
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: 'Direct' },
              { value: 310, name: 'Email' },
              { value: 274, name: 'Union Ads' },
              { value: 235, name: 'Video Ads' },
              { value: 400, name: 'Search Engine' }
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
      
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay:  (idx: any) =>{
              return Math.random() * 200;
            }
          }
        ]
      };

      barChartoptions: any = {
        series: [
          {
            name: "Test Done",
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [
            "Freestate",
            "Northen Cape",
            "Limpopo",
            "Gauteng ",
            "Eastern cape",
            "Western cape",
            "North west",
            "Kwazulu Natal",
            "Mpumalanga"
          ]
        }
      };
    chartNonDiabiates: any = {
        "series": [
            {
                "data": [
                    2,
                    10,
                    18,
                    22,
                    36,
                    15,
                    47,
                    75,
                    65,
                    19,
                    14,
                    2,
                    47,
                    42,
                    15
                ]
            }
        ],
        "chart": {
            "type": "line",
            "height": 50,
            "sparkline": {
                "enabled": true
            }
        },
        "colors": [
            "#5156be"
        ],
        "stroke": {
            "curve": "smooth",
            "width": 2
        },
        "tooltip": {
            "fixed": {
                "enabled": false
            },
            "x": {
                "show": false
            },
            "y": {
                "title": {}
            },
            "marker": {
                "show": false
            }
        },
        "yaxis": [
            {
                "show": false,
                "showAlways": false,
                "showForNullSeries": true,
                "opposite": false,
                "reversed": false,
                "logarithmic": false,
                "forceNiceScale": false,
                "floating": true,
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
                    "text": "",
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
            "convertedCatToNumeric": true
        }
    }

    chartPreDiabetes: any = {
        "series": [
            {
                "data": [
                    15,
                    42,
                    47,
                    2,
                    14,
                    19,
                    65,
                    75,
                    47,
                    15,
                    42,
                    47,
                    2,
                    14,
                    12
                ]
            }
        ],
        "chart": {
            "type": "line",
            "height": 50,
            "sparkline": {
                "enabled": true
            }
        },
        "colors": [
            "#5156be"
        ],
        "stroke": {
            "curve": "smooth",
            "width": 2
        },
        "tooltip": {
            "fixed": {
                "enabled": false
            },
            "x": {
                "show": false
            },
            "y": {
                "title": {}
            },
            "marker": {
                "show": false
            }
        },
        "yaxis": [
            {
                "show": false,
                "showAlways": false,
                "showForNullSeries": true,
                "opposite": false,
                "reversed": false,
                "logarithmic": false,
                "forceNiceScale": false,
                "floating": true,
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
                    "text": "",
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
            "convertedCatToNumeric": true
        }
    }

    chartControlled: any = {
        "series": [
            {
                "data": [
                    47,
                    15,
                    2,
                    67,
                    22,
                    20,
                    36,
                    60,
                    60,
                    30,
                    50,
                    11,
                    12,
                    3,
                    8
                ]
            }
        ],
        "chart": {
            "type": "line",
            "height": 50,
            "sparkline": {
                "enabled": true
            }
        },
        "colors": [
            "#5156be"
        ],
        "stroke": {
            "curve": "smooth",
            "width": 2
        },
        "tooltip": {
            "fixed": {
                "enabled": false
            },
            "x": {
                "show": false
            },
            "y": {
                "title": {}
            },
            "marker": {
                "show": false
            }
        },
        "yaxis": [
            {
                "show": false,
                "showAlways": false,
                "showForNullSeries": true,
                "opposite": false,
                "reversed": false,
                "logarithmic": false,
                "forceNiceScale": false,
                "floating": true,
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
                    "text": "",
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
            "convertedCatToNumeric": true
        }
    }

    chartDiabetes: any = {
        "series": [
            {
                "data": [
                    12,
                    14,
                    2,
                    47,
                    42,
                    15,
                    47,
                    75,
                    65,
                    19,
                    14,
                    2,
                    47,
                    42,
                    15
                ]
            }
        ],
        "chart": {
            "type": "line",
            "height": 50,
            "sparkline": {
                "enabled": true
            }
        },
        "colors": [
            "#5156be"
        ],
        "stroke": {
            "curve": "smooth",
            "width": 2
        },
        "tooltip": {
            "fixed": {
                "enabled": false
            },
            "x": {
                "show": false
            },
            "y": {
                "title": {}
            },
            "marker": {
                "show": false
            }
        },
        "yaxis": [
            {
                "show": false,
                "showAlways": false,
                "showForNullSeries": true,
                "opposite": false,
                "reversed": false,
                "logarithmic": false,
                "forceNiceScale": false,
                "floating": true,
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
                    "text": "",
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
            "convertedCatToNumeric": true
        }
    }

    walletBalenceChart: any = {
        series: [
            35,
            70,
            15
        ],
        "chart": {
            "width": 350,
            "height": 350,
            "type": "pie",
            "labels": [
                "DIABETIC",
                "PREDIABETIC",
                "CONTROLLED"
            ],
            "colors": [
                "#FF0000",
                "#FFA500",
                "#008000"
            ],
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

    pieChart: any = {
        "tooltip": {
            "trigger": "item",
            "formatter": "{a} <br/>{b} : {c} ({d}%)"
        },
        "legend": {
            "orient": "vertical",
            "left": "left",
            "data": [
                "NORMAL",
                "ELEVATED",
                "HYPERTENSION STAGE1",
                "HYPERTENSION STAGE2",
                "HYPERTENSIVE CRISIS"
            ],
            "textStyle": {
                "color": "#858d98"
            }
        },
        "color": [
            "#fd625e",
            "#2ab57d",
            "#4ba6ef",
            "#ffbf53",
            "#5156be"
        ],
        series: {
            "name": "total tests",
            "type": "pie",
            "radius": "55%",
            "center": [
                "50%",
                "60%"
            ],
            data: [
                {
                    "value": 335,
                    "name": "NORMAL"
                },
                {
                    "value": 310,
                    "name": "ELEVATED"
                },
                {
                    "value": 234,
                    "name": "HYPERTENSION STAGE1"
                },
                {
                    "value": 135,
                    "name": "HYPERTENSION STAGE2"
                },
                {
                    "value": 1548,
                    "name": "HYPERTENSIVE CRISIS"
                }
            ],
            "itemStyle": {
                "emphasis": {
                    "shadowBlur": 10,
                    "shadowOffsetX": 0,
                    "shadowColor": "rgba(0, 0, 0, 0.5)"
                }
            }
        }
    }

    mixLineChart: any = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['Male', 'Female', 'Gestational']
        },
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Number of People',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    //formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: 'Number of People',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
//formatter: '{value} °C'
                }
            }
        ],
        series: [
            {
                name: 'Male',
                type: 'bar',
                tooltip: {
                    valueFormatter: (value: any) => {
                        return value ;
                    }
                },
                data: [
                    2, 4, 7, 23, 25, 76, 135, 162, 32, 20, 6, 3
                ]
            },
            {
                name: 'Female',
                type: 'bar',
                tooltip: {
                    valueFormatter: (value: any) => {
                        return value ;
                    }
                },
                data: [
                    2, 5, 9, 26, 28, 70, 175, 182, 48, 18, 6, 2
                ]
            },
            {
                name: 'Gestational',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: (value: any) => {
                        return value;
                    }
                },
                data: [2, 2, 3, 4, 6, 10, 20, 23, 23, 16, 12, 6]
            }
        ]
    };

    userRole: string;
    constructor(private globalService: GlobalService) { }

    ngOnInit(): void {
        this.userRole = this.globalService.getLocalStorage('currentUser')?.role[0]

        this.globalService.topMenuSubject.subscribe(
            (x: any) => {
                console.log(x);

                this.isShown = false;
                this.chartChanged(x);

                setTimeout(() => {
                    this.isShown = true;
                }, 500);
            });
    }


    private chartChanged(val: any) {
        if (val == 1) {
            this.walletBalenceChart.series = [10, 50, 40];

            this.pieChart.series.data = [
                {
                    "value": 335,
                    "name": "NORMAL"
                },
                {
                    "value": 310,
                    "name": "ELEVATED"
                },
                {
                    "value": 234,
                    "name": "HYPERTENSION STAGE1"
                },
                {
                    "value": 135,
                    "name": "HYPERTENSION STAGE2"
                },
                {
                    "value": 1548,
                    "name": "HYPERTENSIVE CRISIS"
                }
            ];

            this.mixLineChart.series = [
                {
                    name: 'Male',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                    ]
                },
                {
                    name: 'Female',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                    ]
                },
                {
                    name: 'Gestational',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' °C';
                        }
                    },
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ];
        } else if (val == 2) {
            this.walletBalenceChart.series = [5, 20, 70];

            this.pieChart.series.data = [
                {
                    "value": 500,
                    "name": "NORMAL"
                },
                {
                    "value": 100,
                    "name": "ELEVATED"
                },
                {
                    "value": 1548,
                    "name": "HYPERTENSION STAGE1"
                },
                {
                    "value": 50,
                    "name": "HYPERTENSION STAGE2"
                },
                {
                    "value": 100,
                    "name": "HYPERTENSIVE CRISIS"
                }
            ];

            this.mixLineChart.series = [
                {
                    name: 'Evaporation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                    ]
                },
                {
                    name: 'Precipitation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                    ]
                },
                {
                    name: 'Temperature',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' °C';
                        }
                    },
                    data: [10.2, 20.3, 23.4, 2.0, 2.2, 3.3, 4.5, 6.3, 23.0, 16.5, 12.0, 6.2]
                }
            ];
        } else if (val == 3) {
            this.walletBalenceChart.series = [80, 10, 10];

            this.pieChart.series.data = [
                {
                    "value": 1548,
                    "name": "NORMAL"
                },
                {
                    "value": 310,
                    "name": "ELEVATED"
                },
                {
                    "value": 150,
                    "name": "HYPERTENSION STAGE1"
                },
                {
                    "value": 70,
                    "name": "HYPERTENSION STAGE2"
                },
                {
                    "value": 200,
                    "name": "HYPERTENSIVE CRISIS"
                }
            ];

            this.mixLineChart.series = [
                {
                    name: 'Evaporation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [25.6, 76.7, 135.6, 2.0, 4.9, 7.0, 23.2, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name: 'Precipitation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 48.7, 18.8, 28.7, 70.7, 175.6, 182.2, 6.0, 2.3
                    ]
                },
                {
                    name: 'Temperature',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' °C';
                        }
                    },
                    data: [23.4, 2.0, , 4.5, 6.3, 23.0, 10.2, 20.3, 2.2, 3.3, 16.5, 12.0, 6.2]
                }
            ];
        } else {
            this.walletBalenceChart.series = [10, 50, 40];

            this.pieChart.series.data = [
                {
                    "value": 335,
                    "name": "NORMAL"
                },
                {
                    "value": 310,
                    "name": "ELEVATED"
                },
                {
                    "value": 234,
                    "name": "HYPERTENSION STAGE1"
                },
                {
                    "value": 135,
                    "name": "HYPERTENSION STAGE2"
                },
                {
                    "value": 1548,
                    "name": "HYPERTENSIVE CRISIS"
                }
            ];

            this.mixLineChart.series = [
                {
                    name: 'Evaporation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.0, 4.9, 7.0, 23.2, 20.0, 6.4, 3.3, 25.6, 76.7, 135.6, 162.2, 32.6]
                },
                {
                    name: 'Precipitation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 48.7, 18.8, 6.0, 2.3, 28.7, 70.7, 175.6, 182.2]
                },
                {
                    name: 'Temperature',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: (value: any) => {
                            return value + ' °C';
                        }
                    },
                    data: [23.4, 2.0, 2.2, 10.2, 20.3, 16.5, 12.0, 6.2, 3.3, 4.5, 6.3, 23.0]
                }
            ];
        }

    }
}
