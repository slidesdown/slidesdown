/*****************************************************************
 ** Author: Jan Christoph Ebersbach, jceb@e-jc.de
 **
 ** A plugin for reveal.js allowing to integrate echarts
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
      atob(canvases[i].getAttribute("data-echarts")),
    );
  }
}

async function createChart(canvas, data) {
  if (data) {
    try {
      const echarts = await import("echarts");
      const _data = JSON.parse(data);
      const chart = echarts.init(canvas, null, { renderer: "svg" });
      chart.setOption(_data);
      // watch CSS mutations and trigger a resize
      const observer = new ResizeObserver(function (mutations) {
        // console.log("mutations:", mutations);
        chart.resize();
      });
      observer.observe(canvas);
    } catch (err) {
      console.error(err);
      canvas.textContent = err.toString();
    }
  } else {
    const msg = `echarts: data missing found for chart`;
    console.warn(msg);
    canvas.textContent = msg;
  }
}

/*!
 * reveal.js apexchart plugin
 */
const Plugin = {
  id: "echarts",

  init: function (reveal) {
    reveal.addEventListener("ready", async function () {
      const canvases = document.querySelectorAll("div[data-echarts]");
      await initializeCharts(canvases);
    });
    // Rendering required as the chart might not show under certain
    // circumstances. Therefore, rerender
    reveal.addEventListener("slidechanged", async function () {
      const canvases = reveal.getCurrentSlide().querySelectorAll(
        "div[data-echarts]",
      );
      await initializeCharts(canvases);
    });

    return this;
  },
};

export default () => Plugin;
