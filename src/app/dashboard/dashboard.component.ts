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
            name: "HBA1C",
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
          },
          {
            name: "Cholesterol",
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
          },
          {
            name: "Blood Pressure",
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
            "Freestate",
            "Northen Cape",
            "Eastern cape",
            "Western cape",
            "Mpumalanga",
            "Kwazulu Natal",
            "North west",
            "Gauteng",
            "Limpopo"
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

      nestedPie: any = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: [
            'Borderline high',
            'High',            
            'Normal',
          ]
        },
        series: [
          {
            name: 'Gender',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner',
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1548, name: 'Male' },
              { value: 775, name: 'Female' },
              { value: 300, name: 'Ges', selected: true },
            ]
          },
          {
            name: 'Total Colestoral',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: [
              { value: 1048, name: 'Borderline high' },
              { value: 335, name: 'High' },
              { value: 310, name: 'Normal' }
            ]
          }
        ]
      };

      barChartoptions: any = {
        colors : ['#346beb', '#eb4034'],
        series: [
            {
              name: "Pending Tests",
              data: [44, 55, 41, 37, 22, 43, 21]
            },
            {
              name: "Test Done",
              data: [53, 32, 33, 52, 13, 43, 32]
            },
           
          ],
          chart: {
            type: "bar",
            height: 350,
            stacked: true
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          stroke: {
            width: 1,
            // colors: ["#fff"]
          },
          title: {
            text: "Tests Conducted"
          },
          xaxis: {
            categories: [2018, 2019, 2020, 2021, 2022, 2023],
            labels: {
              formatter: (val: any) =>{
                return val + "K";
              }
            }
          },
          yaxis: {
            title: {
              text: undefined
            }
          },
          tooltip: {
            y: {
              formatter: (val: any) =>{
                return val + "K";
              }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
            offsetX: 40
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
        }

    }

    downloadExcel(){
       const jsonData: any[] = [
            { name: 'John Doe', age: 30, email: 'john@example.com' },
            { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
            // Add more JSON data here...
          ];

          this.globalService.exportToExcel(jsonData, new Date().getTime()+'_data');
    }

    downloadPdf(){
       const jsonData: any[] = [
            { name: 'Item 1' },
            { name: 'Item 2' },
            // Add more data here or fetch from API
          ];
          this.globalService.generatePDF(jsonData, new Date().getTime()+'_data');
    }
}
