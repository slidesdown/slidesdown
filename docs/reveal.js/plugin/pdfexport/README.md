# PdfExport

A [reveal.js](https://github.com/hakimel/reveal.js/) 3.x / 4.x plugin to easly switch to the built-in PDF export mode and back by pressing a shortcut key.

## Installation

Copy this repository into the plugin folder of your reveal.js presentation, ie ```plugin/pdfexport```.

Add the plugin to the initialization of your presentation, as below.

### reveal 4.x

```javascript
<script src="plugin/pdfexport/pdfexport.js"></script>
// .. 
Reveal.initialize({
	// ...
	plugins: [
		// ..
		PdfExport,
	]
});
```

### reveal 3.x

```javascript
Reveal.initialize({
	// ...
	dependencies: [
		// ...
		{ src: 'plugin/pdfexport/pdfexport.js', async: true },
	]
});
```

For **reveal 3.x only** you need to remove all of the following or similar lines from your presentation. Paper- or PDF-stylesheets will be set by the plugin.

```html
<!-- Printing and PDF exports -->
<script>
	var link = document.createElement( 'link' );
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css';
	document.getElementsByTagName( 'head' )[0].appendChild( link );
</script>
```

## Usage

To toggle between screen and PDF mode you can press the ```E``` shortcut on the keyboard.

### Configuration

You can configure some aspects of the plugin by adding the following options to your reveal configuration. Note that all configuration values are optional and will default to the values specified below.

```javascript
Reveal.initialize({
	// ...

	// Shortcut for toggling between screen and PDF mode
	pdfExportShortcut: 'E',
});
```

## License

[MIT licensed](https://en.wikipedia.org/wiki/MIT_License).

Copyright (C) 2020 [Sören Weber](https://soeren-weber.de)
