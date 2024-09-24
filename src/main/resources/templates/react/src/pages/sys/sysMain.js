import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import 'react-calendar/dist/Calendar.css';
import { AppSettings } from '../../config/app-settings';

function SysMain() {
  const context = useContext(AppSettings);
  // const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    context.handleSetAppThemePanelNone(true);
    context.handleSetAppHeaderNone(true);
    context.handleSetAppSysHeaderNone(false);
    context.handleSetAppSidebarNone(false);
    context.handleSetAppHeaderFixed(true);
    context.handleSetAppContentNone(false);


    // eslint-disable-next-line
  }, []);

  var redColor = getComputedStyle(document.body).getPropertyValue('--bs-red').trim();
  var orangeColor = getComputedStyle(document.body).getPropertyValue('--bs-orange').trim();
  var tealColor = getComputedStyle(document.body).getPropertyValue('--bs-teal').trim();
  var blueColor = getComputedStyle(document.body).getPropertyValue('--bs-blue').trim();
  var gray500Color = getComputedStyle(document.body).getPropertyValue('--bs-gray-500').trim();
  var componentColor = getComputedStyle(document.body).getPropertyValue('--bs-component-color').trim();

  var chart1;

  function renderChart() {
    var teal = getComputedStyle(document.body).getPropertyValue('--bs-teal').trim();
    var tealRgb = getComputedStyle(document.body).getPropertyValue('--bs-teal-rgb').trim();
    var blue = getComputedStyle(document.body).getPropertyValue('--bs-blue').trim();
    var blueRgb = getComputedStyle(document.body).getPropertyValue('--bs-blue-rgb').trim();
    var componentBg = getComputedStyle(document.body).getPropertyValue('--bs-component-bg').trim();

    var bodyFontFamily = getComputedStyle(document.body).getPropertyValue('--bs-body-font-family').trim();
    var bodyFontWeight = getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight').trim();
    var bodyColor = getComputedStyle(document.body).getPropertyValue('--bs-body-color').trim();
    var borderColor = getComputedStyle(document.body).getPropertyValue('--bs-border-color').trim();

    Chart.defaults.font.family = bodyFontFamily;
    Chart.defaults.font.size = 12;
    Chart.defaults.color = bodyColor;
    Chart.defaults.borderColor = borderColor;
    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.tooltip.padding = { left: 8, right: 12, top: 8, bottom: 8 };
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleMarginBottom = 6;
    Chart.defaults.plugins.tooltip.titleFont.family = bodyFontFamily;
    Chart.defaults.plugins.tooltip.titleFont.weight = bodyFontWeight;
    Chart.defaults.plugins.tooltip.footerFont.family = bodyFontFamily;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxPadding = 6;
    Chart.defaults.scale.grid.color = borderColor;
    Chart.defaults.scale.beginAtZero = true;
    Chart.defaults.maintainAspectRatio = false;

    var chart1Container = document.getElementById('chart-1');
    if (chart1) {
      chart1.destroy();
    }
    if (chart1Container) {
      chart1Container.innerHTML = '<canvas id="lineChart"></canvas>';
      chart1 = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
          labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: [
            {
              label: 'Page Views',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(' + tealRgb + ', 0.25)',
              borderColor: teal,
              borderWidth: 2,
              pointBorderColor: teal,
              pointBackgroundColor: componentBg,
              pointBorderWidth: 2,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: componentBg,
              pointHoverBorderColor: teal,
              pointHoverBorderWidth: 3,
              pointRadius: 3,
              pointHitRadius: 10,
              data: [65, 59, 80, 81, 56, 55, 40, 59, 76, 94, 77, 82],
            },
            {
              label: 'Visitors',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(' + blueRgb + ', 0.25)',
              borderColor: blue,
              borderWidth: 2,
              pointBorderColor: blue,
              pointBackgroundColor: componentBg,
              pointBorderWidth: 2,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: componentBg,
              pointHoverBorderColor: blue,
              pointHoverBorderWidth: 3,
              pointRadius: 3,
              pointHitRadius: 10,
              data: [25, 29, 40, 45, 16, 15, 20, 39, 26, 44, 57, 32],
            },
          ],
        },
      });
    }
  }

  useEffect(() => {
    renderChart();

    document.addEventListener('theme-reload', () => {
      renderChart();
    });

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ol className='breadcrumb float-xl-end'>
        <li className='breadcrumb-item'>
          <Link to='/dashboard/v1'>Home</Link>
        </li>
        <li className='breadcrumb-item active'>Dashboard</li>
      </ol>
      <h1 className='page-header'>
        Dashboard <small>header small text goes here...</small>
      </h1>

      <div className='row'>
        <div className='col-xl-3 col-md-6'>
          <div className='widget widget-stats bg-blue'>
            <div className='stats-icon'>
              <i className='fa fa-desktop'></i>
            </div>
            <div className='stats-info'>
              <h4>TOTAL VISITORS</h4>
              <p>3,291,922</p>
            </div>
            <div className='stats-link'>
              <Link to='/dashboard/v1'>
                View Detail <i className='fa fa-arrow-alt-circle-right'></i>
              </Link>
            </div>
          </div>
        </div>
        <div className='col-xl-3 col-md-6'>
          <div className='widget widget-stats bg-info'>
            <div className='stats-icon'>
              <i className='fa fa-link'></i>
            </div>
            <div className='stats-info'>
              <h4>BOUNCE RATE</h4>
              <p>20.44%</p>
            </div>
            <div className='stats-link'>
              <Link to='/dashboard/v1'>
                View Detail <i className='fa fa-arrow-alt-circle-right'></i>
              </Link>
            </div>
          </div>
        </div>
        <div className='col-xl-3 col-md-6'>
          <div className='widget widget-stats bg-orange'>
            <div className='stats-icon'>
              <i className='fa fa-users'></i>
            </div>
            <div className='stats-info'>
              <h4>UNIQUE VISITORS</h4>
              <p>1,291,922</p>
            </div>
            <div className='stats-link'>
              <Link to='/dashboard/v1'>
                View Detail <i className='fa fa-arrow-alt-circle-right'></i>
              </Link>
            </div>
          </div>
        </div>
        <div className='col-xl-3 col-md-6'>
          <div className='widget widget-stats bg-red'>
            <div className='stats-icon'>
              <i className='fa fa-clock'></i>
            </div>
            <div className='stats-info'>
              <h4>AVG TIME ON SITE</h4>
              <p>00:12:23</p>
            </div>
            <div className='stats-link'>
              <Link to='/dashboard/v1'>
                View Detail <i className='fa fa-arrow-alt-circle-right'></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SysMain;
