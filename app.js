var fs = require('fs')
var path = require('path')
var express = require('express')
var app = express()

var PORT = 9009
var revealPath = path.join(__dirname, 'lib', 'reveal.js')
var presentation = fs.readFileSync(path.join(revealPath,  'index.html'), 'utf-8')
// Integration hack: change resources base path
presentation = presentation.replace('<head>', '<head>\n<base href="../">')

app.use('/talks', express.static(revealPath))
app.use('/talks', express.static(path.join(__dirname, 'talks')))

app.use(function (req, res, next) {
	var updatedPath
	if (!path.extname(req.url) && req.url.indexOf('?') === -1) {
		updatedPath = req.url.replace(/\/*$/, '/');
		if (updatedPath !== req.url) {
			res.status(301).redirect(updatedPath)
			return
		}
	}
	next()
})

app.get(/.*\.md$/, function (req, res, next) {
	res.send(404)
})

app.get('/talks/:talk', function (req, res, next) {
	res.set('Content-type', 'text/html')
	res.send(presentation.replace('presentation.md', req.params.talk + '.md'))
})

app.listen(PORT)
console.log('Server started at', PORT)