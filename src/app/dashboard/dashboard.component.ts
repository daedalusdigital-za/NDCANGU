import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global/global.service';
import { DeliveryDataService, ProvinceDeliveryTotals } from '../services/delivery-data.service';
import { User } from '../shared/interfaces/common.interfaces';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    isShown: boolean = true;

      nestedPie: any = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: function(params: any) {
            if (params.seriesName === 'Training by Province' && params.name === 'KZN') {
              return 'Trained By DYLAN GOVENDER <br/>' + params.name + ': ' + params.value + ' participants (' + params.percent + '%)';
            }
            if (params.seriesName === 'Training by Province' && params.name === 'LP') {
              return 'Trained By LINDANI <br/>' + params.name + ': ' + params.value + ' participants (' + params.percent + '%)';
            }
            if (params.seriesName === 'Training by Province' && params.name === 'GP') {
              return 'Trained By MASIXOLE <br/>' + params.name + ': ' + params.value + ' participants (' + params.percent + '%)';
            }
            if (params.seriesName === 'Training by Province' && params.name === 'MPU') {
              return 'Trained By ZIBA <br/>' + params.name + ': ' + params.value + ' participants (' + params.percent + '%)';
            }
            return params.seriesName + ' <br/>' + params.name + ': ' + params.value + ' participants (' + params.percent + '%)';
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#1e3a8a',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontFamily: 'Inter, sans-serif'
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: '5%',
          left: 'center',
          data: [
            'KZN',
            'MPU',
            'GP',
            'LP',
            'Female',
            'Male'
          ],
          textStyle: {
            color: '#8e8da4',
            fontSize: 12,
            fontWeight: 500
          },
          itemGap: 20,
          icon: 'circle'
        },
        series: [
          {
            name: 'Training by Gender',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '35%'],
            center: ['50%', '45%'],
            label: {
              position: 'inner',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff'
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderWidth: 3,
              borderColor: '#fff',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            data: [
              { 
                value: 1146, 
                name: 'Female',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: '#fd79a8' },
                      { offset: 1, color: '#e84393' }
                    ]
                  }
                }
              },
              { 
                value: 194, 
                name: 'Male',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: '#0984e3' },
                      { offset: 1, color: '#2d3436' }
                    ]
                  }
                }
              }
            ]
          },
          {
            name: 'Training by Province',
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderWidth: 2,
              borderColor: '#fff',
              shadowBlur: 8,
              shadowOffsetX: 0,
              shadowOffsetY: 2,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {c} ({d}%)',
              fontSize: 12,
              fontWeight: 500,
              color: '#5a5a5a'
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 20,
              smooth: true
            },
            data: [
              { 
                value: 898, 
                name: 'KZN',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: '#4ecdc4' },
                      { offset: 1, color: '#44a08d' }
                    ]
                  }
                }
              },
              { 
                value: 276, 
                name: 'MPU',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: '#6c5ce7' },
                      { offset: 1, color: '#5f3dc4' }
                    ]
                  }
                }
              },
              { 
                value: 118, 
                name: 'GP',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: '#fd79a8' },
                      { offset: 1, color: '#e84393' }
                    ]
                  }
                }
              },
              { 
                value: 48, 
                name: 'LP',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                      { offset: 0, color: '#f9ca24' },
                      { offset: 1, color: '#f0932b' }
                    ]
                  }
                }
              }
            ]
          }
        ]
      };

      barChartoptions: any = {
        colors: ['#1e3a8a', '#3b82f6'],
        series: [
            {
              name: "Pending Tests",
              data: [44, 55, 41, 37, 22, 43, 21]
            },
            {
              name: "Tests Completed",
              data: [53, 32, 33, 52, 13, 43, 32]
            },
          ],
          chart: {
            type: "bar",
            height: 380,
            stacked: true,
            background: 'transparent',
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false
              }
            },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 800
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              borderRadius: 8,
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#304758'
                  }
                }
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return val + "K";
            },
            style: {
              fontSize: '11px',
              fontWeight: 600,
              colors: ['#fff']
            }
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          title: {
            text: "Test Performance Overview",
            align: 'left',
            style: {
              fontSize: '16px',
              fontWeight: 600,
              color: '#304758'
            }
          },
          xaxis: {
            categories: [2018, 2019, 2020, 2021, 2022, 2023],
            labels: {
              formatter: (val: any) => {
                return val + "K";
              },
              style: {
                colors: '#8e8da4',
                fontSize: '12px',
                fontWeight: 500
              }
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          },
          yaxis: {
            title: {
              text: undefined
            },
            labels: {
              style: {
                colors: '#8e8da4',
                fontSize: '12px'
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: (val: any) => {
                return val + "K";
              }
            },
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: 'horizontal',
              shadeIntensity: 0.25,
              gradientToColors: ['#1d4ed8', '#1e40af'],
              inverseColors: false,
              opacityFrom: 0.85,
              opacityTo: 0.55,
              stops: [0, 100]
            }
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
            offsetX: 40,
            fontSize: '13px',
            fontWeight: 500,
            labels: {
              colors: '#8e8da4'
            },
            markers: {
              width: 8,
              height: 8,
              radius: 4
            }
          },
          grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 3,
            xaxis: {
              lines: {
                show: true
              }
            },
            yaxis: {
              lines: {
                show: false
              }
            },
            padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        };

    chartNonDiabiates: any = {
        "series": [
            {
                "name": "Non-Diabetic Cases",
                "data": [
                    2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15
                ]
            }
        ],
        "chart": {
            "type": "area",
            "height": 60,
            "sparkline": {
                "enabled": true
            },
            "animations": {
                "enabled": true,
                "easing": "easeinout",
                "speed": 800
            }
        },
        "colors": [
            "#1e3a8a"
        ],
        "fill": {
            "type": "gradient",
            "gradient": {
                "shade": "light",
                "type": "vertical",
                "shadeIntensity": 0.4,
                "gradientToColors": ["#1d4ed8"],
                "inverseColors": false,
                "opacityFrom": 0.8,
                "opacityTo": 0.2,
                "stops": [0, 100]
            }
        },
        "stroke": {
            "curve": "smooth",
            "width": 3
        },
        "tooltip": {
            "theme": "dark",
            "fixed": {
                "enabled": false
            },
            "x": {
                "show": false
            },
            "y": {
                "title": {
                    "formatter": function () {
                        return "Cases: ";
                    }
                }
            },
            "marker": {
                "show": false
            },
            "style": {
                "fontSize": "12px",
                "fontFamily": "Inter, sans-serif"
            }
        },
        "grid": {
            "show": false
        },
        "yaxis": {
            "show": false
        },
        "xaxis": {
            "show": false
        }
    }

    chartPreDiabetes: any = {
        "series": [
            {
                "name": "Pre-Diabetic Cases",
                "data": [
                    15, 42, 47, 2, 14, 19, 65, 75, 47, 15, 42, 47, 2, 14, 12
                ]
            }
        ],
        "chart": {
            "type": "area",
            "height": 60,
            "sparkline": {
                "enabled": true
            },
            "animations": {
                "enabled": true,
                "easing": "easeinout",
                "speed": 800
            }
        },
        "colors": [
            "#3b82f6"
        ],
        "fill": {
            "type": "gradient",
            "gradient": {
                "shade": "light",
                "type": "vertical",
                "shadeIntensity": 0.4,
                "gradientToColors": ["#1e40af"],
                "inverseColors": false,
                "opacityFrom": 0.8,
                "opacityTo": 0.2,
                "stops": [0, 100]
            }
        },
        "stroke": {
            "curve": "smooth",
            "width": 3
        },
        "tooltip": {
            "theme": "dark",
            "fixed": {
                "enabled": false
            },
            "x": {
                "show": false
            },
            "y": {
                "title": {
                    "formatter": function () {
                        return "Cases: ";
                    }
                }
            },
            "marker": {
                "show": false
            },
            "style": {
                "fontSize": "12px",
                "fontFamily": "Inter, sans-serif"
            }
        },
        "grid": {
            "show": false
        },
        "yaxis": {
            "show": false
        },
        "xaxis": {
            "show": false
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
        series: [35, 70, 15],
        chart: {
            width: 350,
            height: 350,
            type: "pie",
            background: 'transparent',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        labels: [
            "DIABETIC",
            "PREDIABETIC", 
            "CONTROLLED"
        ],
        colors: [
            "#fd79a8",
            "#fdcb6e",
            "#00b894"
        ],
        stroke: {
            width: 3,
            colors: ['#fff']
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#304758',
                            formatter: function (w: any) {
                                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                                    return a + b;
                                }, 0) + '%';
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: any) {
                return val.toFixed(1) + "%";
            },
            style: {
                fontSize: '13px',
                fontWeight: 600,
                colors: ['#fff']
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                opacity: 0.8
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            labels: {
                colors: '#8e8da4'
            },
            markers: {
                width: 12,
                height: 12,
                radius: 6
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif'
            },
            y: {
                formatter: function (val: any) {
                    return val + "%";
                }
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 280
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    }

    pieChart: any = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} participants ({d}%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#1e3a8a',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'center',
            data: [
                'EN (Enrolled Nurse)',
                'ENA (Enrolled Nursing Assistant)',
                'CNP (Community Nurse Practitioner)',
                'CNS (Clinical Nurse Specialist)',
                'PN (Professional Nurse)',
                'O/T (Occupational Therapist)',
                'C/G (Caregiver)',
                'ADMIN (Administrator)',
                'DATA CAPTURE',
                'NURSE'
            ],
            textStyle: {
                color: '#8e8da4',
                fontSize: 11,
                fontWeight: 500
            },
            icon: 'circle',
            itemGap: 8,
            itemWidth: 10,
            itemHeight: 10
        },
        color: [
            '#00b894',
            '#fdcb6e',
            '#fd79a8',
            '#e17055',
            '#6c5ce7',
            '#74b9ff',
            '#a29bfe',
            '#fd79a8',
            '#00cec9',
            '#e84393'
        ],
        series: {
            name: 'Training Participants',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['65%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 3,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '16',
                    fontWeight: 'bold',
                    color: '#304758'
                },
                itemStyle: {
                    shadowBlur: 15,
                    shadowOffsetX: 0,
                    shadowOffsetY: 8,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {
                    value: 134,
                    name: 'EN (Enrolled Nurse)'
                },
                {
                    value: 60,
                    name: 'ENA (Enrolled Nursing Assistant)'
                },
                {
                    value: 35,
                    name: 'CNP (Community Nurse Practitioner)'
                },
                {
                    value: 21,
                    name: 'CNS (Clinical Nurse Specialist)'
                },
                {
                    value: 16,
                    name: 'PN (Professional Nurse)'
                },
                {
                    value: 10,
                    name: 'O/T (Occupational Therapist)'
                },
                {
                    value: 8,
                    name: 'C/G (Caregiver)'
                },
                {
                    value: 8,
                    name: 'ADMIN (Administrator)'
                },
                {
                    value: 7,
                    name: 'DATA CAPTURE'
                },
                {
                    value: 7,
                    name: 'NURSE'
                }
            ]
        }
    }

    // All occupation data
    allOccupationData = [
        { value: 134, name: 'EN (Enrolled Nurse)' },
        { value: 60, name: 'ENA (Enrolled Nursing Assistant)' },
        { value: 35, name: 'CNP (Community Nurse Practitioner)' },
        { value: 21, name: 'CNS (Clinical Nurse Specialist)' },
        { value: 16, name: 'PN (Professional Nurse)' },
        { value: 10, name: 'O/T (Occupational Therapist)' },
        { value: 8, name: 'C/G (Caregiver)' },
        { value: 8, name: 'ADMIN (Administrator)' },
        { value: 7, name: 'DATA CAPTURE' },
        { value: 7, name: 'NURSE' }
    ];

    selectedOccupation: string = 'ALL';

    // Method to handle occupation selection change
    onOccupationChange(event: any) {
        this.selectedOccupation = event.target.value;
        this.updateOccupationChart();
    }

    // Method to update the occupation chart based on selected occupation
    updateOccupationChart() {
        this.isShown = false;
        setTimeout(() => {
            if (this.selectedOccupation === 'ALL') {
                // Show all occupations
                this.pieChart.series.data = this.allOccupationData;
            } else {
                // Show only selected occupation with its original color
                const selectedData = this.allOccupationData.find(item => {
                    const occupationKey = this.getOccupationKey(item.name);
                    return occupationKey === this.selectedOccupation;
                });
                
                if (selectedData) {
                    // Find the index to get the correct color
                    const originalIndex = this.allOccupationData.findIndex(item => {
                        const occupationKey = this.getOccupationKey(item.name);
                        return occupationKey === this.selectedOccupation;
                    });
                    
                    // Create a copy with the original color
                    const dataWithColor = {
                        ...selectedData,
                        itemStyle: {
                            color: this.pieChart.color[originalIndex]
                        }
                    };
                    
                    this.pieChart.series.data = [dataWithColor];
                }
            }
            this.isShown = true;
        }, 300);
    }

    // Helper method to get occupation key from name
    getOccupationKey(name: string): string {
        const keyMap: { [key: string]: string } = {
            'EN (Enrolled Nurse)': 'EN',
            'ENA (Enrolled Nursing Assistant)': 'ENA',
            'CNP (Community Nurse Practitioner)': 'CNP',
            'CNS (Clinical Nurse Specialist)': 'CNS',
            'PN (Professional Nurse)': 'PN',
            'O/T (Occupational Therapist)': 'OT',
            'C/G (Caregiver)': 'CG',
            'ADMIN (Administrator)': 'ADMIN',
            'DATA CAPTURE': 'DATA_CAPTURE',
            'NURSE': 'NURSE'
        };
        return keyMap[name] || '';
    }

    userRole: string = '';
    
    // National Total Sales Data
    // Delivery statistics from actual data
    deliveryStatistics: any;
    provinceDeliveryTotals: ProvinceDeliveryTotals[] = [];

    nationalTotalData = [
        { item: 'GLUCOSE METER', totalOrdered: 50000, totalDelivered: 48273 }, // Sum: 20437+11166+8089+399+5565+2517+100 = 48273
        { item: 'GLUCOSE STRIPS', totalOrdered: 120000, totalDelivered: 101693 }, // Sum: 38479+22655+11760+399+23300+5000+100 = 101693
        { item: 'HB METER', totalOrdered: 800, totalDelivered: 764 }, // Sum: 50+637+63+0+0+14+0 = 764
        { item: 'HB STRIPS', totalOrdered: 3500, totalDelivered: 2752 }, // Sum: 60+1474+1103+0+0+55+0 = 2752
        { item: 'HBA1C METERS', totalOrdered: 200, totalDelivered: 7 }, // Sum: 7+0+0+0+0+0+0 = 7 (dual glucose/HBA1C meters)
        { item: 'HBA1C STRIPS', totalOrdered: 500, totalDelivered: 365 }, // Sum: 155+170+1+0+0+39+0 = 365
        { item: 'HB SOLUTION', totalOrdered: 25, totalDelivered: 0 } // No HB solution in provided data
    ];

    constructor(
        private globalService: GlobalService,
        private deliveryDataService: DeliveryDataService
    ) { }

    ngOnInit(): void {
        try {
            const currentUser = this.globalService.getLocalStorage<User>('currentUser');
            this.userRole = currentUser?.role?.[0] || 'Guest';
        } catch (error) {
            console.error('Error loading user data:', error);
            this.userRole = 'Guest';
        }

        // Load delivery statistics and data
        this.loadDeliveryData();

        // Initialize occupation chart with all data
        this.updateOccupationChart();

        this.globalService.topMenuSubject.subscribe({
            next: (x: any) => {
                console.log(x);

                this.isShown = false;
                this.chartChanged(x);

                setTimeout(() => {
                    this.isShown = true;
                }, 500);
            },
            error: (error) => {
                console.error('Error in topMenuSubject subscription:', error);
            }
        });
    }


    private chartChanged(val: any) {
        if (val == 1) {
            this.walletBalenceChart.series = [10, 50, 40];
            // Use the current occupation filter
            this.updateOccupationChart();
        }

    }

    // HGT Meter Distribution by Province
    hgtMeterChart: any = {
        backgroundColor: 'transparent',
        animationDuration: 2000,
        animationEasing: 'elasticOut',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: '#ff6b6b',
            borderWidth: 2,
            textStyle: {
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 600
            },
            extraCssText: 'box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);'
        },
        legend: {
            orient: 'horizontal',
            bottom: '5%',
            left: 'center',
            data: ['KZN', 'GP', 'LP', 'FS', 'MPU', 'EC'],
            textStyle: {
                color: '#333',
                fontSize: 14,
                fontWeight: 600
            },
            icon: 'circle',
            itemGap: 20,
            itemWidth: 14,
            itemHeight: 14
        },
        color: [
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#ff6b6b' },
                    { offset: 1, color: '#ee5a52' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#4ecdc4' },
                    { offset: 1, color: '#44a08d' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#45b7d1' },
                    { offset: 1, color: '#2980b9' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#f9ca24' },
                    { offset: 1, color: '#f0932b' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#6c5ce7' },
                    { offset: 1, color: '#5f3dc4' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#fd79a8' },
                    { offset: 1, color: '#e84393' }
                ]
            }
        ],
        series: {
            name: 'HGT Meter',
            type: 'pie',
            radius: '70%',
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 2,
                shadowBlur: 8,
                shadowOffsetX: 0,
                shadowOffsetY: 2,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c}',
                fontSize: 13,
                fontWeight: 700,
                color: '#333'
            },
            labelLine: {
                show: true,
                length: 10,
                length2: 18,
                smooth: true,
                lineStyle: {
                    width: 2
                }
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(255, 107, 107, 0.6)',
                    scale: 1.1
                }
            },
            data: [
                { value: 6018, name: 'KZN' },
                { value: 7067, name: 'GP' },
                { value: 3855, name: 'LP' },
                { value: 26307, name: 'FS' },
                { value: 1400, name: 'MPU' },
                { value: 0, name: 'EC' }
            ]
        }
    };

    // HGT Strips Distribution by Province
    hgtStripsChart: any = {
        backgroundColor: 'transparent',
        animationDuration: 2000,
        animationEasing: 'elasticOut',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: '#a8e6cf',
            borderWidth: 2,
            textStyle: {
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 600
            },
            extraCssText: 'box-shadow: 0 0 20px rgba(168, 230, 207, 0.3);'
        },
        legend: {
            orient: 'horizontal',
            bottom: '5%',
            left: 'center',
            data: ['KZN', 'GP', 'LP', 'FS', 'MPU', 'EC'],
            textStyle: {
                color: '#333',
                fontSize: 14,
                fontWeight: 600
            },
            icon: 'circle',
            itemGap: 20,
            itemWidth: 14,
            itemHeight: 14
        },
        color: [
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#a8e6cf' },
                    { offset: 1, color: '#56ab2f' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#ff8a80' },
                    { offset: 1, color: '#ff5722' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#81c784' },
                    { offset: 1, color: '#4caf50' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#ffb74d' },
                    { offset: 1, color: '#ff9800' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#ba68c8' },
                    { offset: 1, color: '#9c27b0' }
                ]
            },
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#64b5f6' },
                    { offset: 1, color: '#2196f3' }
                ]
            }
        ],
        series: {
            name: 'HGT Strips',
            type: 'pie',
            radius: '70%',
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 2,
                shadowBlur: 8,
                shadowOffsetX: 0,
                shadowOffsetY: 2,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c}',
                fontSize: 13,
                fontWeight: 700,
                color: '#333'
            },
            labelLine: {
                show: true,
                length: 10,
                length2: 18,
                smooth: true,
                lineStyle: {
                    width: 2
                }
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(168, 230, 207, 0.6)',
                    scale: 1.1
                }
            },
            data: [
                { value: 18335, name: 'KZN' },
                { value: 61240, name: 'GP' },
                { value: 50805, name: 'LP' },
                { value: 940, name: 'FS' },
                { value: 10000, name: 'MPU' },
                { value: 0, name: 'EC' }
            ]
        }
    };

    // Total Stock Delivered Bar Chart
    stockDeliveredChart: any = {
        backgroundColor: 'transparent',
        animationDuration: 2000,
        animationEasing: 'elasticOut',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: '#4ecdc4',
            borderWidth: 2,
            textStyle: {
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 600
            },
            extraCssText: 'box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);'
        },
        legend: {
            data: ['HB Meter', 'HB Strips', 'HB Solution', 'Glucose Meter', 'Glucose Strips', 'HBA1C Meter', 'HBA1C Strips'],
            top: '5%',
            textStyle: {
                color: '#333',
                fontSize: 13,
                fontWeight: 600
            },
            icon: 'rect',
            itemGap: 25,
            itemWidth: 18,
            itemHeight: 14
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '15%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['KZN', 'GP', 'FS', 'EC', 'LP', 'MPU', 'NC'],
            axisLabel: {
                color: '#333',
                fontSize: 12,
                fontWeight: 600,
                rotate: 0
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0',
                    width: 2
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666',
                fontSize: 11,
                formatter: function(value: number) {
                    if (value >= 1000) {
                        return (value / 1000).toFixed(0) + 'K';
                    }
                    return value.toString();
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: 'HB Meter',
                type: 'bar',
                data: [50, 637, 63, 0, 0, 14, 0], // KZN, GP, FS, EC, LP, MPU, NC
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#ff6b6b' },
                            { offset: 1, color: '#ee5a52' }
                        ]
                    },
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(255, 107, 107, 0.5)'
                    }
                }
            },
            {
                name: 'HB Strips',
                type: 'bar',
                data: [60, 1474, 1103, 0, 0, 55, 0], // KZN, GP, FS, EC, LP, MPU, NC
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#4ecdc4' },
                            { offset: 1, color: '#44a08d' }
                        ]
                    },
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(78, 205, 196, 0.5)'
                    }
                }
            },
            {
                name: 'HB Solution',
                type: 'bar',
                data: [0, 0, 0, 0, 0, 0, 0], // No HB Solution in the provided data
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#45b7d1' },
                            { offset: 1, color: '#2980b9' }
                        ]
                    },
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(69, 183, 209, 0.5)'
                    }
                }
            },
            {
                name: 'Glucose Meter',
                type: 'bar',
                data: [20437, 11166, 8089, 399, 5565, 2517, 100], // KZN, GP, FS, EC, LP, MPU, NC
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#f9ca24' },
                            { offset: 1, color: '#f0932b' }
                        ]
                    },
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(249, 202, 36, 0.5)'
                    }
                }
            },
            {
                name: 'Glucose Strips',
                type: 'bar',
                data: [38479, 22655, 11760, 399, 23300, 5000, 100], // KZN, GP, FS, EC, LP, MPU, NC
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#6c5ce7' },
                            { offset: 1, color: '#5f3dc4' }
                        ]
                    },
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(108, 92, 231, 0.5)'
                    }
                }
            },
            {
                name: 'HBA1C Meter',
                type: 'bar',
                data: [7, 0, 0, 0, 0, 0, 0], // Only KZN has dual meters (7 units)
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#fd79a8' },
                            { offset: 1, color: '#e84393' }
                        ]
                    },
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(253, 121, 168, 0.5)'
                    }
                }
            },
            {
                name: 'HBA1C Strips',
                type: 'bar',
                data: [155, 170, 1, 0, 0, 39, 0], // KZN, GP, FS, EC, LP, MPU, NC
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#00b894' },
                            { offset: 1, color: '#00cec9' }
                        ]
                    },
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 184, 148, 0.5)'
                    }
                }
            }
        ]
    };

    downloadExcel(){
        // Prepare comprehensive medical equipment data for Excel export
        const excelData: any[] = [];
        
        // Add header information
        excelData.push({
            'Medical Equipment': 'NATIONAL TOTAL - MEDICAL EQUIPMENT ORDERS & DELIVERIES',
            'Total Ordered': `Report Generated: ${new Date().toLocaleDateString()}`,
            'Total Delivered': `Overall Delivery Rate: ${this.getDeliveryRate()}%`,
            'Pending Orders': `Total Items: ${this.nationalTotalData.length}`,
            'Delivery Rate (%)': '',
            'Status': ''
        });
        
        // Add empty row for spacing
        excelData.push({
            'Medical Equipment': '',
            'Total Ordered': '',
            'Total Delivered': '',
            'Pending Orders': '',
            'Delivery Rate (%)': '',
            'Status': ''
        });
        
        // Add column headers
        excelData.push({
            'Medical Equipment': 'MEDICAL EQUIPMENT',
            'Total Ordered': 'TOTAL ORDERED',
            'Total Delivered': 'TOTAL DELIVERED',
            'Pending Orders': 'PENDING ORDERS',
            'Delivery Rate (%)': 'DELIVERY RATE (%)',
            'Status': 'STATUS'
        });
        
        // Add the actual medical equipment data
        this.nationalTotalData.forEach(item => {
            const deliveryRate = this.getItemDeliveryRate(item);
            const pendingOrders = item.totalOrdered - item.totalDelivered;
            let status = '';
            
            if (deliveryRate === 100) {
                status = 'Completed';
            } else if (deliveryRate >= 50) {
                status = 'In Progress';
            } else {
                status = 'Delayed';
            }
            
            excelData.push({
                'Medical Equipment': item.item,
                'Total Ordered': item.totalOrdered,
                'Total Delivered': item.totalDelivered,
                'Pending Orders': pendingOrders,
                'Delivery Rate (%)': deliveryRate,
                'Status': status
            });
        });
        
        // Add summary totals
        excelData.push({
            'Medical Equipment': '',
            'Total Ordered': '',
            'Total Delivered': '',
            'Pending Orders': '',
            'Delivery Rate (%)': '',
            'Status': ''
        });
        
        excelData.push({
            'Medical Equipment': 'TOTALS',
            'Total Ordered': this.getTotalOrdered(),
            'Total Delivered': this.getTotalDelivered(),
            'Pending Orders': this.getTotalOrdered() - this.getTotalDelivered(),
            'Delivery Rate (%)': this.getDeliveryRate(),
            'Status': this.getDeliveryRate() >= 80 ? 'On Track' : this.getDeliveryRate() >= 60 ? 'Needs Attention' : 'Critical'
        });

        // Generate filename with current date
        const filename = `Medical_Equipment_Orders_Deliveries_${new Date().toISOString().split('T')[0]}`;
        
        this.globalService.exportToExcel(excelData, filename);
    }

    /**
     * Export Total Stock Delivered by Province chart data to Excel
     */
    exportStockDeliveredToExcel() {
        // Prepare stock delivered data for Excel export
        const excelData: any[] = [];
        
        // Add header information
        excelData.push({
            'Province': 'TOTAL STOCK DELIVERED BY PROVINCE',
            'HB Meter': `Report Generated: ${new Date().toLocaleDateString()}`,
            'HB Strips': 'Healthcare Equipment Distribution Report',
            'HB Solution': '',
            'Glucose Meter': '',
            'Glucose Strips': '',
            'HBA1C Meter': '',
            'HBA1C Strips': '',
            'Total': ''
        });
        
        // Add empty row for spacing
        excelData.push({
            'Province': '',
            'HB Meter': '',
            'HB Strips': '',
            'HB Solution': '',
            'Glucose Meter': '',
            'Glucose Strips': '',
            'HBA1C Meter': '',
            'HBA1C Strips': '',
            'Total': ''
        });
        
        // Add column headers
        excelData.push({
            'Province': 'PROVINCE',
            'HB Meter': 'HB METER',
            'HB Strips': 'HB STRIPS',
            'HB Solution': 'HB SOLUTION',
            'Glucose Meter': 'GLUCOSE METER',
            'Glucose Strips': 'GLUCOSE STRIPS',
            'HBA1C Meter': 'HBA1C METER',
            'HBA1C Strips': 'HBA1C STRIPS',
            'Total': 'TOTAL'
        });
        
        // Get the provinces and data from the chart
        const provinces = this.stockDeliveredChart.xAxis.data; // ['KZN', 'GP', 'FS', 'EC', 'LP', 'MPU', 'NC']
        const series = this.stockDeliveredChart.series;
        
        // Add data for each province
        provinces.forEach((province: string, index: number) => {
            const hbMeter = series[0].data[index] || 0;
            const hbStrips = series[1].data[index] || 0;
            const hbSolution = series[2].data[index] || 0;
            const glucoseMeter = series[3].data[index] || 0;
            const glucoseStrips = series[4].data[index] || 0;
            const hba1cMeter = series[5].data[index] || 0;
            const hba1cStrips = series[6].data[index] || 0;
            
            const total = hbMeter + hbStrips + hbSolution + glucoseMeter + glucoseStrips + hba1cMeter + hba1cStrips;
            
            excelData.push({
                'Province': this.getProvinceFullName(province),
                'HB Meter': hbMeter,
                'HB Strips': hbStrips,
                'HB Solution': hbSolution,
                'Glucose Meter': glucoseMeter,
                'Glucose Strips': glucoseStrips,
                'HBA1C Meter': hba1cMeter,
                'HBA1C Strips': hba1cStrips,
                'Total': total
            });
        });
        
        // Add empty row for spacing
        excelData.push({
            'Province': '',
            'HB Meter': '',
            'HB Strips': '',
            'HB Solution': '',
            'Glucose Meter': '',
            'Glucose Strips': '',
            'HBA1C Meter': '',
            'HBA1C Strips': '',
            'Total': ''
        });
        
        // Calculate and add totals
        const totals = {
            hbMeter: series[0].data.reduce((sum: number, val: number) => sum + val, 0),
            hbStrips: series[1].data.reduce((sum: number, val: number) => sum + val, 0),
            hbSolution: series[2].data.reduce((sum: number, val: number) => sum + val, 0),
            glucoseMeter: series[3].data.reduce((sum: number, val: number) => sum + val, 0),
            glucoseStrips: series[4].data.reduce((sum: number, val: number) => sum + val, 0),
            hba1cMeter: series[5].data.reduce((sum: number, val: number) => sum + val, 0),
            hba1cStrips: series[6].data.reduce((sum: number, val: number) => sum + val, 0)
        };
        
        const grandTotal = Object.values(totals).reduce((sum: number, val: number) => sum + val, 0);
        
        excelData.push({
            'Province': 'NATIONAL TOTALS',
            'HB Meter': totals.hbMeter,
            'HB Strips': totals.hbStrips,
            'HB Solution': totals.hbSolution,
            'Glucose Meter': totals.glucoseMeter,
            'Glucose Strips': totals.glucoseStrips,
            'HBA1C Meter': totals.hba1cMeter,
            'HBA1C Strips': totals.hba1cStrips,
            'Total': grandTotal
        });

        // Generate filename with current date
        const filename = `Stock_Delivered_by_Province_${new Date().toISOString().split('T')[0]}`;
        
        this.globalService.exportToExcel(excelData, filename);
    }

    /**
     * Get full province name from abbreviation
     */
    getProvinceFullName(abbreviation: string): string {
        const provinceMap: { [key: string]: string } = {
            'KZN': 'KwaZulu-Natal',
            'GP': 'Gauteng',
            'FS': 'Free State',
            'EC': 'Eastern Cape',
            'LP': 'Limpopo',
            'MPU': 'Mpumalanga',
            'NC': 'Northern Cape',
            'WC': 'Western Cape',
            'NW': 'North West'
        };
        
        return provinceMap[abbreviation] || abbreviation;
    }

    /**
     * Export HGT Strips Distribution by Province chart data to Excel
     */
    exportHgtStripsToExcel() {
        // Prepare HGT Strips distribution data for Excel export
        const excelData: any[] = [];
        
        // Add header information
        excelData.push({
            'Province': 'HGT STRIPS DISTRIBUTION BY PROVINCE',
            'Units Distributed': `Report Generated: ${new Date().toLocaleDateString()}`,
            'Percentage': 'Healthcare Glucose Test Strips Distribution Report',
            'Status': `Total Distributed: 141,320 units`
        });
        
        // Add empty row for spacing
        excelData.push({
            'Province': '',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        // Add column headers
        excelData.push({
            'Province': 'PROVINCE',
            'Units Distributed': 'UNITS DISTRIBUTED',
            'Percentage': 'PERCENTAGE (%)',
            'Status': 'DISTRIBUTION STATUS'
        });
        
        // Get the data from the chart
        const chartData = this.hgtStripsChart.series.data;
        const totalUnits = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
        
        // Add data for each province
        chartData.forEach((item: any) => {
            const percentage = totalUnits > 0 ? ((item.value / totalUnits) * 100).toFixed(1) : '0.0';
            let status = '';
            
            if (item.value === 0) {
                status = 'No Distribution';
            } else if (item.value < 5000) {
                status = 'Low Distribution';
            } else if (item.value < 20000) {
                status = 'Moderate Distribution';
            } else if (item.value < 40000) {
                status = 'High Distribution';
            } else {
                status = 'Very High Distribution';
            }
            
            excelData.push({
                'Province': this.getProvinceFullName(item.name),
                'Units Distributed': item.value.toLocaleString(),
                'Percentage': percentage + '%',
                'Status': status
            });
        });
        
        // Add empty row for spacing
        excelData.push({
            'Province': '',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        // Add summary statistics
        const sortedData = [...chartData].sort((a: any, b: any) => b.value - a.value);
        const highestProvince = sortedData[0];
        const lowestProvince = sortedData.find((item: any) => item.value > 0) || sortedData[sortedData.length - 1];
        const averageDistribution = Math.round(totalUnits / chartData.filter((item: any) => item.value > 0).length);
        
        excelData.push({
            'Province': 'SUMMARY STATISTICS',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        excelData.push({
            'Province': 'Total Units Distributed',
            'Units Distributed': totalUnits.toLocaleString(),
            'Percentage': '100.0%',
            'Status': 'Complete'
        });
        
        excelData.push({
            'Province': 'Highest Distribution',
            'Units Distributed': highestProvince.value.toLocaleString(),
            'Percentage': ((highestProvince.value / totalUnits) * 100).toFixed(1) + '%',
            'Status': this.getProvinceFullName(highestProvince.name)
        });
        
        excelData.push({
            'Province': 'Lowest Distribution (Active)',
            'Units Distributed': lowestProvince.value.toLocaleString(),
            'Percentage': lowestProvince.value > 0 ? ((lowestProvince.value / totalUnits) * 100).toFixed(1) + '%' : '0.0%',
            'Status': this.getProvinceFullName(lowestProvince.name)
        });
        
        excelData.push({
            'Province': 'Average Distribution',
            'Units Distributed': averageDistribution.toLocaleString(),
            'Percentage': ((averageDistribution / totalUnits) * 100).toFixed(1) + '%',
            'Status': 'Per Active Province'
        });
        
        excelData.push({
            'Province': 'Provinces with Distribution',
            'Units Distributed': chartData.filter((item: any) => item.value > 0).length.toString(),
            'Percentage': '',
            'Status': 'Out of ' + chartData.length + ' total'
        });

        // Generate filename with current date
        const filename = `HGT_Strips_Distribution_by_Province_${new Date().toISOString().split('T')[0]}`;
        
        this.globalService.exportToExcel(excelData, filename);
    }

    /**
     * Export HGT Meter Distribution by Province chart data to Excel
     */
    exportHgtMeterToExcel() {
        // Prepare HGT Meter distribution data for Excel export
        const excelData: any[] = [];
        
        // Add header information
        excelData.push({
            'Province': 'HGT METER DISTRIBUTION BY PROVINCE',
            'Units Distributed': `Report Generated: ${new Date().toLocaleDateString()}`,
            'Percentage': 'Healthcare Glucose Test Meter Distribution Report',
            'Status': `Total Distributed: 44,647 units`
        });
        
        // Add empty row for spacing
        excelData.push({
            'Province': '',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        // Add column headers
        excelData.push({
            'Province': 'PROVINCE',
            'Units Distributed': 'UNITS DISTRIBUTED',
            'Percentage': 'PERCENTAGE (%)',
            'Status': 'DISTRIBUTION STATUS'
        });
        
        // Get the data from the chart
        const chartData = this.hgtMeterChart.series.data;
        const totalUnits = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
        
        // Add data for each province
        chartData.forEach((item: any) => {
            const percentage = totalUnits > 0 ? ((item.value / totalUnits) * 100).toFixed(1) : '0.0';
            let status = '';
            
            if (item.value === 0) {
                status = 'No Distribution';
            } else if (item.value < 2000) {
                status = 'Low Distribution';
            } else if (item.value < 5000) {
                status = 'Moderate Distribution';
            } else if (item.value < 10000) {
                status = 'High Distribution';
            } else {
                status = 'Very High Distribution';
            }
            
            excelData.push({
                'Province': this.getProvinceFullName(item.name),
                'Units Distributed': item.value.toLocaleString(),
                'Percentage': percentage + '%',
                'Status': status
            });
        });
        
        // Add empty row for spacing
        excelData.push({
            'Province': '',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        // Add summary statistics
        const sortedData = [...chartData].sort((a: any, b: any) => b.value - a.value);
        const highestProvince = sortedData[0];
        const lowestProvince = sortedData.find((item: any) => item.value > 0) || sortedData[sortedData.length - 1];
        const averageDistribution = Math.round(totalUnits / chartData.filter((item: any) => item.value > 0).length);
        const activeProvinces = chartData.filter((item: any) => item.value > 0).length;
        
        excelData.push({
            'Province': 'SUMMARY STATISTICS',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        excelData.push({
            'Province': 'Total Units Distributed',
            'Units Distributed': totalUnits.toLocaleString(),
            'Percentage': '100.0%',
            'Status': 'Complete'
        });
        
        excelData.push({
            'Province': 'Highest Distribution',
            'Units Distributed': highestProvince.value.toLocaleString(),
            'Percentage': ((highestProvince.value / totalUnits) * 100).toFixed(1) + '%',
            'Status': this.getProvinceFullName(highestProvince.name)
        });
        
        excelData.push({
            'Province': 'Lowest Distribution (Active)',
            'Units Distributed': lowestProvince.value.toLocaleString(),
            'Percentage': lowestProvince.value > 0 ? ((lowestProvince.value / totalUnits) * 100).toFixed(1) + '%' : '0.0%',
            'Status': this.getProvinceFullName(lowestProvince.name)
        });
        
        excelData.push({
            'Province': 'Average Distribution',
            'Units Distributed': averageDistribution.toLocaleString(),
            'Percentage': ((averageDistribution / totalUnits) * 100).toFixed(1) + '%',
            'Status': 'Per Active Province'
        });
        
        excelData.push({
            'Province': 'Provinces with Distribution',
            'Units Distributed': activeProvinces.toString(),
            'Percentage': '',
            'Status': 'Out of ' + chartData.length + ' total'
        });
        
        // Add distribution analysis
        excelData.push({
            'Province': '',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        excelData.push({
            'Province': 'DISTRIBUTION ANALYSIS',
            'Units Distributed': '',
            'Percentage': '',
            'Status': ''
        });
        
        // Calculate distribution concentration
        const top2Provinces = sortedData.slice(0, 2);
        const top2Concentration = top2Provinces.reduce((sum: number, item: any) => sum + item.value, 0);
        const concentrationPercentage = ((top2Concentration / totalUnits) * 100).toFixed(1);
        
        excelData.push({
            'Province': 'Top 2 Provinces Concentration',
            'Units Distributed': top2Concentration.toLocaleString(),
            'Percentage': concentrationPercentage + '%',
            'Status': `${this.getProvinceFullName(top2Provinces[0].name)} & ${this.getProvinceFullName(top2Provinces[1].name)}`
        });

        // Generate filename with current date
        const filename = `HGT_Meter_Distribution_by_Province_${new Date().toISOString().split('T')[0]}`;
        
        this.globalService.exportToExcel(excelData, filename);
    }

    downloadPdf(){
        // Prepare comprehensive medical equipment data for PDF export
        const pdfData: any[] = [];
        
        // Add header information as formatted strings
        pdfData.push('NATIONAL TOTAL - MEDICAL EQUIPMENT ORDERS & DELIVERIES');
        pdfData.push(`Report Generated: ${new Date().toLocaleDateString()}`);
        pdfData.push(`Overall Delivery Rate: ${this.getDeliveryRate()}%`);
        pdfData.push(`Total Equipment Types: ${this.nationalTotalData.length}`);
        pdfData.push(''); // Empty line for spacing
        
        // Add column headers
        pdfData.push('MEDICAL EQUIPMENT DETAILS:');
        pdfData.push('='.repeat(50)); // Separator line
        
        // Add the medical equipment data as formatted strings
        this.nationalTotalData.forEach((item, index) => {
            const deliveryRate = this.getItemDeliveryRate(item);
            const pendingOrders = item.totalOrdered - item.totalDelivered;
            let status = '';
            
            if (deliveryRate === 100) {
                status = 'Completed';
            } else if (deliveryRate >= 50) {
                status = 'In Progress';
            } else {
                status = 'Delayed';
            }
            
            pdfData.push(`${index + 1}. ${item.item}`);
            pdfData.push(`   Ordered: ${item.totalOrdered} | Delivered: ${item.totalDelivered} | Pending: ${pendingOrders}`);
            pdfData.push(`   Delivery Rate: ${deliveryRate}% | Status: ${status}`);
            pdfData.push(''); // Empty line for spacing
        });
        
        // Add summary
        pdfData.push('='.repeat(50)); // Separator line
        pdfData.push('GRAND TOTALS:');
        pdfData.push(`Total Ordered: ${this.getTotalOrdered()}`);
        pdfData.push(`Total Delivered: ${this.getTotalDelivered()}`);
        pdfData.push(`Total Pending: ${this.getTotalOrdered() - this.getTotalDelivered()}`);
        pdfData.push(`Overall Delivery Rate: ${this.getDeliveryRate()}%`);
        const overallStatus = this.getDeliveryRate() >= 80 ? 'On Track' : this.getDeliveryRate() >= 60 ? 'Needs Attention' : 'Critical';
        pdfData.push(`Overall Status: ${overallStatus}`);

        // Generate filename with current date
        const filename = `Medical_Equipment_Report_${new Date().toISOString().split('T')[0]}`;
        const title = 'National Medical Equipment Orders & Deliveries Report';
        
        this.globalService.generatePDF(pdfData, filename, title);
    }

    // National Total calculation methods
    getTotalOrdered(): number {
        return this.nationalTotalData.reduce((sum, item) => sum + item.totalOrdered, 0);
    }

    getTotalDelivered(): number {
        return this.nationalTotalData.reduce((sum, item) => sum + item.totalDelivered, 0);
    }

    getDeliveryRate(): number {
        const ordered = this.getTotalOrdered();
        const delivered = this.getTotalDelivered();
        return ordered > 0 ? Math.round((delivered / ordered) * 100) : 0;
    }

    getItemDeliveryRate(item: any): number {
        return item.totalOrdered > 0 ? Math.round((item.totalDelivered / item.totalOrdered) * 100) : 0;
    }

    formatNumber(num: number): string {
        return num.toLocaleString();
    }

    trackByItem(index: number, item: any): string {
        return item.item;
    }

    /**
     * Load delivery data and statistics from the delivery data service
     */
    loadDeliveryData(): void {
        try {
            // Get delivery statistics
            this.deliveryStatistics = this.deliveryDataService.getDeliveryStatistics();
            
            // Get province delivery totals
            this.provinceDeliveryTotals = this.deliveryDataService.getProvinceDeliveryTotals();
            
            // Update national totals with real data
            this.updateNationalTotalsFromDeliveryData();
            
            console.log('Delivery statistics loaded:', this.deliveryStatistics);
            console.log('Province delivery totals:', this.provinceDeliveryTotals);
        } catch (error) {
            console.error('Error loading delivery data:', error);
        }
    }

    /**
     * Update national totals with calculated data from delivery records
     */
    updateNationalTotalsFromDeliveryData(): void {
        const chartData = this.deliveryDataService.getChartDataByProvince();
        
        // Calculate totals from chart data
        const glucoseMeterTotal = chartData.glucoseMeter.reduce((sum: number, val: number) => sum + val, 0);
        const glucoseStripsTotal = chartData.glucoseStrips.reduce((sum: number, val: number) => sum + val, 0);
        const hbMeterTotal = chartData.hbMeter.reduce((sum: number, val: number) => sum + val, 0);
        const hbStripsTotal = chartData.hbStrips.reduce((sum: number, val: number) => sum + val, 0);
        const hba1cMeterTotal = chartData.hba1cMeter.reduce((sum: number, val: number) => sum + val, 0);
        const hba1cStripsTotal = chartData.hba1cStrips.reduce((sum: number, val: number) => sum + val, 0);

        // Update national total data with calculated values
        this.nationalTotalData = [
            { item: 'GLUCOSE METER', totalOrdered: 50000, totalDelivered: glucoseMeterTotal },
            { item: 'GLUCOSE STRIPS', totalOrdered: 120000, totalDelivered: glucoseStripsTotal },
            { item: 'HB METER', totalOrdered: 800, totalDelivered: hbMeterTotal },
            { item: 'HB STRIPS', totalOrdered: 3500, totalDelivered: hbStripsTotal },
            { item: 'HBA1C METERS', totalOrdered: 200, totalDelivered: hba1cMeterTotal },
            { item: 'HBA1C STRIPS', totalOrdered: 500, totalDelivered: hba1cStripsTotal },
            { item: 'HB SOLUTION', totalOrdered: 25, totalDelivered: 0 }
        ];
    }

    /**
     * Get delivery records for a specific province
     */
    getProvinceDeliveryRecords(province: string): any[] {
        return this.deliveryDataService.getDeliveryRecordsByProvince(province);
    }

    /**
     * Get delivery records for a specific item type
     */
    getItemDeliveryRecords(itemDescription: string): any[] {
        return this.deliveryDataService.getDeliveryRecordsByItem(itemDescription);
    }

    /**
     * Export all delivery data to Excel format
     */
    exportDeliveryData(): any[] {
        return this.deliveryDataService.exportDeliveryData();
    }
}
