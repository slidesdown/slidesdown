// computeURL builds a URL to a raw markdown file from a short human-typable
// string, e.g. it turn github.com/jceb/slidesdown into
// https://raw.githubusercontent.com/jceb/slidesdown/main/SLIDES.md
const computeURL = (defaults, url) => {
  if (!(defaults.branch && defaults.resource)) {
    console.error("ERROR: default branch and/or resource unset");
    return;
  }
  const decodedURL = decodeURI(url);
  let match = "";
  const githubRegExp = new RegExp(
    /^(?:https:\/\/)?github\.com\/(?<owner>[a-zA-Z0-9_-]*)\/(?<repo>[a-zA-Z0-9_-]*)(?:\/(?:((?<blob>blob)|(?<tree>tree))\/)?(?:(?<dir_or_branch>[^/]*)\/)?(?<resource>.*))?/,
  );
  if ((match = githubRegExp.exec(decodedURL)) !== null) {
    // console.log("match", match)
    let resource = `${defaults.branch}/${defaults.resource}`;
    // if tree is present, then the default resouce name must be appended
    if (match.groups.tree && match.groups.dir_or_branch) {
      // if tree or blob are present, then dir_or_branch is the branch - perfect, I can build the URL with confidence
      resource =
        `${match.groups.dir_or_branch}/${match.groups.resource}/${defaults.resource}`;
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
  }
  return decodedURL;
};

const main = (defaults) => {
  if (!(defaults.branch && defaults.resource && defaults.markdownElementId)) {
    console.error(
      "ERROR: default branch, resource  and/or markdownElementId are not set",
    );
    return;
  }
  const customSlidesURL = new URLSearchParams(
    new URL(document.URL).search,
  ).get("slides");
  let slidesURL = customSlidesURL
    ? customSlidesURL
    : `github.com/jceb/slidesdown/blob/${defaults.branch}/${defaults.resource}`;

  slidesURL = computeURL(defaults, slidesURL);

  if (!slidesURL) {
    console.error("ERROR: couldn't compute slides URL");
    return;
  }
  const mdSection = document.getElementById(defaults.markdownElementId);
  if (!mdSection) {
    console.error(
      `ERROR: couldn't find markdown element with id: ${defaults.markdownElementId}`,
    );
    return;
  }

  // initialize presentation
  mdSection.setAttribute("data-markdown", slidesURL);
  Reveal.initialize({
    hash: true,
    plugins: [
      RevealMarkdown,
      RevealHighlight,
      RevealMath,
      RevealNotes,
      RevealSearch,
      RevealZoom,
      PdfExport,
      RevealChalkboard,
      RevealCustomControls,
      RevealChart,
    ],
    pdfExportShortcut: "p",
    // FIXME: hide controls in print view: https://github.com/rajgoel/reveal.js-plugins/issues/159
    customcontrols: {
      controls: [
        {
          id: "toggle-overview",
          title: "Toggle overview (O)",
          icon: '<i class="fa-light fa-th"></i>',
          action: "Reveal.toggleOverview();",
        },
        {
          icon: '<i class="fa-light fa-pen-square"></i>',
          title: "Toggle chalkboard (B)",
          action: "RevealChalkboard.toggleChalkboard();",
        },
        {
          icon: '<i class="fa-light fa-pen"></i>',
          title: "Toggle notes canvas (C)",
          action: "RevealChalkboard.toggleNotesCanvas();",
        },
        {
          icon: '<i class="fa-light fa-print"></i>',
          title: "Toggle print view (P)",
          action: "PdfExport.togglePdfExport();",
        },
      ],
    },
  });
};

main({
  branch: "main",
  resource: "SLIDES.md",
  markdownElementId: "markdown",
});
