// INFO: the non-esm plugins need reveal JS in scope so it can't be imported
// here
// import Reveal from "revealjs";
import RevealHighlight from "reveal-highlight";
import RevealMath from "reveal-math";
import RevealNotes from "reveal-notes";
import RevealSearch from "reveal-search";
import RevealZoom from "reveal-zoom";
import RevealECharts from "reveal-echarts";
import RevealMermaid from "reveal-mermaid";
// import RevealApexchart from "reveal-apexchart";
// import RevealChartjs from "reveal-chartjs";
// INFO: non-esm therefore they can't be properly imported:
// import * as PdfExport from "reveal-pdfexport";
// import * as RevealChalkboard from "reveal-chalkboard";
// import * as RevealCustomControls from "reveal-customcontrols";
import SlidesDown from "slidesdown";

// computeURL builds a URL to a raw markdown file from a short human-typable
// string, e.g. it turns github.com/slidesdown/slidesdown into
// https://raw.githubusercontent.com/slidsedown/slidesdown/main/SLIDES.md
function computeURL(defaults, url) {
  if (!(defaults.branch && defaults.resource)) {
    console.error("Default branch and/or resource unset");
    return;
  }
  const decodedURL = decodeURI(url);
  let match = "";
  const githubRegExp = new RegExp(
    /^(?:https:\/\/)?github\.com\/(?<owner>[a-zA-Z0-9_-]+)\/(?<repo>[a-zA-Z0-9_-]+)(?:(?:\/((?<blob>blob)|(?<tree>tree)))?(?:\/(?<dir_or_branch>[^/]+?))?(?:\/(?<resource>.*)))?$/,
  );
  // resource is not considered for gists, because there's no safe way to
  // determine the resource's name from the provided anchor tag
  const gistRegExp = new RegExp(
    /^(?:https:\/\/)?gist\.github\.com\/(?<owner>[a-zA-Z0-9_-]+)\/(?<repo>[a-zA-Z0-9_-]+)\/?/,
  );
  // gistRegExp.exec("gist.github.com/jceb/4bfcfdcddd2020e5b7e521b9e1044f3b")
  // gistRegExp.exec("https://gist.github.com/jceb/4bfcfdcddd2020e5b7e521b9e1044f3b")
  // gistRegExp.exec("https://gist.github.com/jceb/4bfcfdcddd2020e5b7e521b9e1044f3b#file-230911_dif_wg_id_presentation-md")
  // gistRegExp.exec("https://gist.github.com/jceb/4bfcfdcddd2020e5b7e521b9e1044f3b/#file-230911_dif_wg_id_presentation-md")
  // gistRegExp.exec("https://gist.githubusercontent.com/jceb/4bfcfdcddd2020e5b7e521b9e1044f3b/raw/dd6e852ccb04c1690a7e96eb77008240e0fbf69f/SLIDES.md")
  const srhtRegExp = new RegExp(
    /^(?:https:\/\/)?(git\.)?sr\.ht\/(?<owner>~[a-zA-Z0-9_-]+)\/(?<repo>[a-zA-Z0-9_-]+)(?:(?:\/((?<blob>blob)|(?<tree>tree)))?(?:\/(?<dir_or_branch>[^/]+?))?(?:\/(item\/)?(?<resource>.*)))?$/,
  );
  // srhtRegExp.exec("https://git.sr.ht/~jceb/test")
  // srhtRegExp.exec("https://git.sr.ht/~jceb/test/SLIDES.md")
  // srhtRegExp.exec("https://git.sr.ht/~jceb/test/tree")
  // srhtRegExp.exec("https://git.sr.ht/~jceb/test/tree/SLIDES.md")
  // srhtRegExp.exec("https://git.sr.ht/~jceb/test/tree/main/item/SLIDES.md")
  // srhtRegExp.exec("sr.ht/~jceb/test/tree/main/item/SLIDES.md")
  // srhtRegExp.exec("sr.ht/~jceb/test/SLIDES.md")
  if ((match = githubRegExp.exec(decodedURL)) !== null) {
    let resource = `${defaults.branch}/${defaults.resource}`;
    // if tree is present, then the default resouce name must be appended
    if ((match.groups.blob | match.groups.tree) && match.groups.dir_or_branch) {
      // if tree or blob are present, then dir_or_branch is the branch - perfect, I can build the URL with confidence
      resource = `${match.groups.dir_or_branch}/${
        match.groups.resource ? match.groups.resource : defaults.resource
      }`;
    } else if (match.groups.blob && match.groups.dir_or_branch) {
      // if tree or blob are not present, then dir_or_branch must be a dir but the branch name can't be determined
      resource = `${match.groups.dir_or_branch}/${
        match.groups.resource ? match.groups.resource : defaults.resource
      }`;
    } else {
      if (match.groups.dir_or_branch) {
        resource = `${defaults.branch}/${match.groups.dir_or_branch}/${
          match.groups.resource ? match.groups.resource : defaults.resource
        }`;
      } else {
        resource = `${defaults.branch}/${
          match.groups.resource ? match.groups.resource : defaults.resource
        }`;
      }
    }
    return `https://raw.githubusercontent.com/${match.groups.owner}/${match.groups.repo}/${resource}`;
  } else if ((match = gistRegExp.exec(decodedURL)) !== null) {
    return `https://gist.githubusercontent.com/${match.groups.owner}/${match.groups.repo}/raw/SLIDES.md`;
  } else if ((match = srhtRegExp.exec(decodedURL)) !== null) {
    // INFO: support for sr.ht is currently broken due to missing CORS headers on sr.ht's side
    let resource = `${defaults.branch}/${defaults.resource}`;
    // if tree is present, then the default resouce name must be appended
    if ((match.groups.blob | match.groups.tree) && match.groups.dir_or_branch) {
      // if tree or blob are present, then dir_or_branch is the branch - perfect, I can build the URL with confidence
      resource = `${match.groups.dir_or_branch}/${
        match.groups.resource ? match.groups.resource : defaults.resource
      }`;
    } else if (match.groups.blob && match.groups.dir_or_branch) {
      // if tree or blob are not present, then dir_or_branch must be a dir but the branch name can't be determined
      resource = `${match.groups.dir_or_branch}/${
        match.groups.resource ? match.groups.resource : defaults.resource
      }`;
    } else {
      if (match.groups.dir_or_branch) {
        resource = `${defaults.branch}/${match.groups.dir_or_branch}/${
          match.groups.resource ? match.groups.resource : defaults.resource
        }`;
      } else {
        resource = `${defaults.branch}/${
          match.groups.resource ? match.groups.resource : defaults.resource
        }`;
      }
    }
    return `https://git.sr.ht/${match.groups.owner}/${match.groups.repo}/blob/${resource}`;
  }
  return decodedURL;
}

async function main(defaults) {
  if (!(defaults.branch && defaults.resource && defaults.markdownElementId)) {
    console.error(
      "Default branch, resource  and/or markdownElementId are not set",
    );
    return;
  }
  const mdSection = document.getElementById(defaults.markdownElementId);
  if (!mdSection) {
    console.error(
      `Couldn't find markdown element with id: ${defaults.markdownElementId}`,
    );
    return;
  }
  const customSlidesBase64Gzip = new URLSearchParams(
    new URL(document.URL).search,
  ).get("slides64");
  if (customSlidesBase64Gzip) {
    async function decompressBlob(blob) {
      const decompressedStream = blob.pipeThrough(
        new DecompressionStream("gzip"),
      );
      return await new Response(decompressedStream).blob();
    }
    const slidesGz = Uint8Array.from(
      atob(
        decodeURI(
          customSlidesBase64Gzip.replaceAll("-", "+").replaceAll("_", "/"),
        ),
      ),
      (c) => c.charCodeAt(0),
    );
    // function buf2hex(buffer) { // buffer is an ArrayBuffer
    //   return [...new Uint8Array(buffer)]
    //     .map(x => x.toString(16).padStart(2, '0'))
    //     .join('');
    // }
    const blob = await decompressBlob(
      new Blob([slidesGz], { type: "application/octet-stream" }).stream(),
    );
    const text = await blob.text();
    mdSection.setAttribute("data-markdown", "<<load-plain-markdown>>");
    mdSection.setAttribute("data-markdown-plain", text);
  } else {
    const customSlidesURL = new URLSearchParams(new URL(document.URL).search)
      .get("slides");
    let slidesURL = customSlidesURL
      ? customSlidesURL
      : `github.com/slidesdown/slidesdown/blob/${defaults.branch}/${defaults.resource}`;

    slidesURL = computeURL(defaults, slidesURL);

    if (!slidesURL) {
      console.error("Couldn't compute slides URL");
      return;
    }
    mdSection.setAttribute("data-markdown", slidesURL);
  }
  const multiplexBase64 = new URLSearchParams(new URL(document.URL).search).get(
    "multiplex64",
  );
  let multiplex = {};
  let dependencies = [];
  if (multiplexBase64) {
    multiplex = JSON.parse(atob(
      decodeURI(
        multiplexBase64.replaceAll("-", "+").replaceAll("_", "/"),
      ),
    ));
    multiplex = {
      secret: multiplex?.secret || null,
      id: multiplex?.id || null,
      url: "/",
      // url: "https://reveal-multiplex.glitch.me"
    };
    const minium_secret_length = 20;
    if (
      typeof multiplex.id != "string" &&
      multiplex.id.length < minium_secret_length
    ) {
      multiplex = {};
    }
    if (multiplex?.id) {
      dependencies.push({ src: "/socket.io/socket.io.js", async: true });
      // dependencies.push({ src: 'https://reveal-multiplex.glitch.me/socket.io/socket.io.js', async: true })
    }
    if (multiplex?.secret) {
      dependencies.push({ src: "/vendor/multiplex/master.js", async: true });
      // dependencies.push({ src: 'https://reveal-multiplex.glitch.me/master.js', async: true })
    } else {
      dependencies.push({ src: "/vendor/multiplex/client.js", async: true });
      // dependencies.push({ src: 'https://reveal-multiplex.glitch.me/client.js', async: true })
    }
  }
  // initialize presentation
  Reveal.slidesdownLoader = () => {
    window.location.href = "/loader.html";
  };
  Reveal.initialize({
    multiplex,
    dependencies,
    hash: true,
    // mathjax2: {
    //   mathjax: "/vendor/mathjax/MathJax.js"
    // },
    mathjax3: {
      mathjax: "/vendor/mathjax/es5/tex-mml-chtml.js",
    },
    plugins: [
      SlidesDown,
      RevealHighlight,
      RevealMath.MathJax3(),
      RevealNotes,
      RevealSearch,
      RevealZoom,
      // Source: https://github.com/McShelby/reveal-pdfexport
      PdfExport,
      // Source: https://github.com/rajgoel/reveal.js-plugins/tree/master/chalkboard
      RevealChalkboard,
      // Source: https://github.com/rajgoel/reveal.js-plugins/tree/master/customcontrols
      RevealCustomControls,
      // Source: https://github.com/rajgoel/reveal.js-plugins/tree/master/anything
      // RevealAnything,
      // RevealChartjs,
      // RevealApexchart,
      RevealECharts,
      RevealMermaid,
    ],
    customcontrols: {
      collapseIcon: '<div class="i-fa6-solid-chevron-down"></div>',
      expandIcon: '<div class="i-fa6-solid-chevron-up"></div>',
      controls: [
        {
          icon: '<div class="i-fa6-solid-folder-open"></div>',
          title: "Open another presentation",
          action: "Reveal.slidesdownLoader();",
        },
        {
          icon: '<div class="i-fa6-solid-table-cells"></div>',
          id: "toggle-overview",
          title: "Toggle overview (O)",
          action: "Reveal.toggleOverview();",
        },
        {
          icon: '<div class="i-fa6-solid-square-pen"></div>',
          title: "Toggle chalkboard (B)",
          action: "RevealChalkboard.toggleChalkboard();",
        },
        {
          icon: '<div class="i-fa6-solid-pen"></div>',
          title: "Toggle notes canvas (C)",
          action: "RevealChalkboard.toggleNotesCanvas();",
        },
        {
          icon: '<div class="i-fa6-solid-print"></div>',
          title: "Toggle print view (E)",
          action: "PdfExport.togglePdfExport();",
        },
      ],
    },
  }).then(() => {
    console.debug("initialization finished");
  });
}

main({
  branch: "main",
  resource: "SLIDES.md",
  markdownElementId: "markdown",
});
