import React from 'react'
import Chart from 'chart.js'
import { Col } from 'antd'

// Data
const data = require('../../data/line.json')

const w = 1000
const h = 500

function Line() {

  React.useEffect(() => {
    function drawLine() {
      const values = data.map(d => d.value)
      const time = data.map(d => d.date)

      let btcChart = document.getElementById('line_chart_section').getContext('2d')

      let gradient = btcChart.createLinearGradient(0, 0, 0, 400);

      gradient.addColorStop(0, 'rgba(67,10,180,1)');
      gradient.addColorStop(.425, 'rgba(148,100,246,1)');

      Chart.defaults.global.defaultFontFamily = 'Apercu';
      Chart.defaults.global.defaultFontSize = 12;

      new Chart(btcChart, {
        type: 'line',
        data: {
          labels: time,
          datasets: [{
            data: values,
            backgroundColor: gradient,
            borderColor: 'rgba(67,10,180,1)',
            borderJoinStyle: 'round',
            borderCapStyle: 'round',
            borderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 10,
            lineTension: .2,
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Production (KG)',
            fontSize: 35
          },
          
          legend: {
            display: false
          },
          
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          
          scales: {
            xAxes: [{
              display: false,
              gridLines: {}
            }],
            yAxes: [{
              display: false,
              gridLines: {}
            }]
          },

          tooltips: {
            callbacks: {
              //This removes the tooltip title
              title: function() {}
            },
            //this removes legend color
            displayColors: false,
            yPadding: 10,
            xPadding: 10,
            position: 'nearest',
            caretSize: 10,
            backgroundColor: 'rgba(255,255,255,.9)',
            bodyFontSize: 15,
            bodyFontColor: '#303030'
          }
        }
      });
    }

    drawLine()
  }, [])

  return (
    <>
      <Col xs={24} xl={24} className='column_con site-layout-background' style={{ padding: 8 }}>
        <canvas id="line_chart_section" width={w} height={h}></canvas>
      </Col>
    </>
  )
}

export default Line

