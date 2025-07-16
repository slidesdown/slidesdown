/*****************************************************************
 ** Author: Jan Christoph Ebersbach, jceb@e-jc.de
 **
 ** A plugin for reveal.js allowing to integrate chart.js
 **
 ** Version: 0.0.1
 **
 ** License: MIT license (see LICENSE.md)
 **
 ******************************************************************/

async function initializeCharts(canvases) {
  for (let i = 0; i < canvases.length; i++) {
    await createChart(
      canvases[i],
      atob(canvases[i].getAttribute("data-chartjs")),
    );
  }
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

async function createChart(canvas, data) {
  if (canvas.chart) {
    // update existing chart for nice animation purposes
    const data = canvas.chart.data.datasets;
    canvas.chart.data.datasets = [];
    canvas.chart.update();
    canvas.style.visibility = "hidden";
    setTimeout(
      function (canvas, data) {
        canvas.chart.data.datasets = data;
        canvas.style.visibility = "visible";
        canvas.chart.update();
      },
      200,
      canvas,
      data,
    ); // wait for slide transition to re-add data and animation
  } else if (data) {
    try {
      const { Chart } = await import("chartjs");
      canvas.chart = null;
      const ctx = canvas.getContext("2d");
      const _data = JSON.parse(data);
      canvas.chart = new Chart(
        ctx,
        {
          ..._data,
          data: {
            labels: null,
            datasets: [],
            ..._data.data,
          },
          options: {
            animation: false,
            responsive: true,
            // false, because it's required for responsive charts: https://www.chartjs.org/docs/latest/configuration/responsive.html
            maintainAspectRatio: false,
            ..._data?.options,
            transitions: {
              ..._data?.options?.transitions,
              resize: {
                ..._data?.options?.transitions?.resize,
                animations: {
                  ..._data?.options?.transitions?.resize?.animations,
                  duration: 0,
                },
              },
              active: {
                animations: {
                  duration: 0,
                },
                show: {
                  animations: {
                    duration: 0,
                  },
                },
              },
            },
          },
        },
      );
      // const resizer = debounce(() => {
      //   canvas.chart.resize();
      // });
      // // watch CSS mutations and trigger a resize
      // const observer = new ResizeObserver(function (mutations) {
      //   resizer();
      // });
      // observer.observe(canvas);
    } catch (err) {
      console.error(err);
      canvas.textContent = err.toString();
    }
    // canvas.textContent = "done";
  } else {
    const msg = "chartjs: data missing found for chart";
    console.warn(msg);
    canvas.textContent = msg;
  }
}

/*!
 * reveal.js apexchart plugin
 */
const Plugin = {
  id: "chartjs",

  init: function (reveal) {
    console.log("init");
    reveal.addEventListener("ready", async function () {
      // Get all canvases
      const canvases = document.querySelectorAll("canvasdata-chartjs");
      console.log("canvases", canvases);
      await initializeCharts(canvases);
    });
    // Rendering required as the chart might not show under certain
    // circumstances. Therefore, rerender
    reveal.addEventListener("slidechanged", async function () {
      const canvases = reveal.getCurrentSlide().querySelectorAll(
        "canvas[data-chartjs]",
      );
      await initializeCharts(canvases);
    });

    return this;
  },
};

export default () => Plugin;
