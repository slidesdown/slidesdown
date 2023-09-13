/*****************************************************************
 ** Author: Jan Christoph Ebersbach, jceb@e-jc.de
 **
 ** A plugin for reveal.js allowing to integrate mermaid.js
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
      canvases[i].getAttribute("data-mermaid-id"),
      atob(canvases[i].getAttribute("data-mermaid")),
    );
  }
}

async function createChart(canvas, id, data) {
  if (id && data) {
    try {
      const { default: mermaid } = await import("mermaid");
      const { svg } = await mermaid.render(
        id,
        data,
      );
      canvas.innerHTML = svg;
    } catch (err) {
      console.error(err);
      canvas.textContent = err.toString();
    }
    // canvas.textContent = "done";
  } else {
    if (id) {
      const msg = `mermaid: data missing found for chart "${id}"`;
      console.warn(msg);
      canvas.textContent = msg;
    } else {
      const msg = `mermaid: id missing found for chart`;
      console.warn(msg);
      canvas.textContent = msg;
    }
  }
}

/*!
 * reveal.js apexchart plugin
 */
const Plugin = {
  id: "mermaid",

  init: function (reveal) {
    reveal.addEventListener("ready", async function () {
      // Get all canvases
      const canvases = document.querySelectorAll("div[data-mermaid]");
      await initializeCharts(canvases);
    });
    // reveal.addEventListener("slidechanged", async function () {
    //   const canvases = reveal.getCurrentSlide().querySelectorAll(
    //     "div[data-mermaid]",
    //   );
    //   await initializeCharts(canvases);
    // });

    return this;
  },
};

export default () => Plugin;
