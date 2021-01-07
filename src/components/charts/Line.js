import React from 'react'
//import Chart from 'chart.js'
import * as d3 from 'd3'

// Data
const data = require('../../data/data.json')
//const data = [20, 25, 30, 45, 50, 65, 85, 63, 54, 75]

const w = 300
const h = 90
const margin = {
  top: 20,
  right: 30,
  bottom: 30,
  left: 40,
}

function Line() {

  const svgRef = React.useRef()

  React.useEffect(() => {
    function drawLine() {
/*
 *      const values = data.map(d => d.value)
 *      const time = data.map(d => d.date)
 *
 *      let btcChart = document.getElementById('line_chart_section').getContext('2d')
 *
 *      let gradient = btcChart.createLinearGradient(0, 0, 0, 400);
 *
 *      gradient.addColorStop(0, 'rgba(67,10,180,1)');
 *      gradient.addColorStop(.425, 'rgba(148,100,246,1)');
 *
 *      Chart.defaults.global.defaultFontFamily = 'Apercu';
 *      Chart.defaults.global.defaultFontSize = 12;
 *
 *      new Chart(btcChart, {
 *        type: 'line',
 *        data: {
 *          labels: time,
 *          datasets: [{
 *            data: values,
 *            backgroundColor: gradient,
 *            borderColor: 'rgba(67,10,180,1)',
 *            borderJoinStyle: 'round',
 *            borderCapStyle: 'round',
 *            borderWidth: 3,
 *            pointRadius: 0,
 *            pointHitRadius: 10,
 *            lineTension: .2,
 *          }]
 *        },
 *        options: {
 *          title: {
 *            display: true,
 *            text: 'Production (KG)',
 *            fontSize: 35
 *          },
 *
 *          legend: {
 *            display: false
 *          },
 *
 *          layout: {
 *            padding: {
 *              left: 0,
 *              right: 0,
 *              top: 0,
 *              bottom: 0
 *            }
 *          },
 *
 *          scales: {
 *            xAxes: [{
 *              display: false,
 *              gridLines: {}
 *            }],
 *            yAxes: [{
 *              display: false,
 *              gridLines: {}
 *            }]
 *          },
 *
 *          tooltips: {
 *            callbacks: {
 *              //This removes the tooltip title
 *              title: function() {}
 *            },
 *            //this removes legend color
 *            displayColors: false,
 *            yPadding: 10,
 *            xPadding: 10,
 *            position: 'nearest',
 *            caretSize: 10,
 *            backgroundColor: 'rgba(255,255,255,.9)',
 *            bodyFontSize: 15,
 *            bodyFontColor: '#303030'
 *          }
 *        }
 *      });
 */
      const svg = d3.select(svgRef.current)

      function compare(a, b) {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1
        }
        return 0
      }

      const points = data.map(i => {
        const newPoints = {
          date: new Date(i.date),
          value: i.value,
        }
        return newPoints
      }).sort(compare)

      const xScale = d3
        .scaleUtc()
        .domain(d3.extent(points, d => d.date))
        .range([margin.left, w - margin.right])

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(points, d => d.value)]).nice()
        .range([h - margin.bottom, margin.top])

      const area = d3
        .area()
        .curve(d3.curveLinear)
        .x(d => xScale(d.date))
        .y0(yScale(0))
        .y1(d => yScale(d.value))

      svg
        .selectAll('path')
        .data([points])
        .join('path')
        .attr('fill', '#7546C9')
        .attr('stroke', '#7546C9')
        .attr('d', d => area(d))
    }

    drawLine()
  }, [])

  return (
    <svg width={w} height={h} ref={svgRef}></svg>
  )
}

export default Line

