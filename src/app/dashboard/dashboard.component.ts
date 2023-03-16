import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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

chartPreDiabetes: any ={
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
  "series": [
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
    "series": [
        {
            "name": "Total sales",
            "type": "pie",
            "radius": "55%",
            "center": [
                "50%",
                "60%"
            ],
            "data": [
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
    ]
}
  constructor() { }

  ngOnInit(): void {
  }

}
