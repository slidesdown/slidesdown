/*****************************************************************
 ** Author: Jan Christoph Ebersbach, jceb@e-jc.de
 **
 ** A plugin for reveal.js allowing to integrate apexcharts
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
      atob(canvases[i].getAttribute("data-apexchart")),
    );
  }
}

async function createChart(canvas, data) {
  if (data) {
    try {
      const { default: ApexCharts } = await import("apexcharts");
      const _data = JSON.parse(data);
      const chart = new ApexCharts(canvas, _data);
      canvas.innerHTML = ""; //  cleas inner elements since chart.render wont'd do it
      return await chart.render();
    } catch (err) {
      console.error(err);
      canvas.textContent = err.toString();
    }
  } else {
    const msg = `apexcharts: data missing found for chart`;
    console.warn(msg);
    canvas.textContent = msg;
  }
}

/*!
 * reveal.js apexchart plugin
 */
const Plugin = {
  id: "apexchart",

  init: function (reveal) {
    reveal.addEventListener("ready", async function () {
      const canvases = document.querySelectorAll("div[data-apexchart]");
      await initializeCharts(canvases);
    });
    // Rendering required as the chart might not show under certain
    // circumstances. Therefore, rerender
    // https://github.com/apexcharts/apexcharts.js/issues/3087
    reveal.addEventListener("slidechanged", async function () {
      const canvases = reveal.getCurrentSlide().querySelectorAll(
        "div[data-apexchart]",
      );
      await initializeCharts(canvases);
    });

    return this;
  },
};

export default () => Plugin;
