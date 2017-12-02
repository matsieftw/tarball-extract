var fs = require('fs')
 , tar = require('tar')
 , zlib = require('zlib')
 , wget = require('node-wget-promise')
 
function extractTarball(sourceFile, destination, callback) {
  if( /(gz|tgz)$/i.test(sourceFile)) {
    // This file is gzipped, use zlib to deflate the stream before passing to tar.
    fs.createReadStream(sourceFile)
    .pipe(zlib.createGunzip())
    .pipe(tar.Extract({ path: destination}))
    .on('error', function(er) { callback(er)})
    .on("end", function() { callback(null)})
  } else {
    // This file is not gzipped, just deflate it.
    fs.createReadStream(sourceFile)
    .pipe(tar.Extract({ path: destination}))
    .on('error', function(er) { callback(er)})
    .on("end", function() { callback(null)})
  }
}

function extractTarballDownload(url, downloadFile, destination, options, callback) {
  if(!options) options = {}
  wget(url,{output: downloadFile})
    .then(function(result){
      extractTarball(downloadFile, destination, function(err, data){
        callback(null, {url: url, downloadFile: downloadFile, destination: destination})
      })
    }).catch(function(err){
      callback('error', {error: err})
    })
}

exports.extractTarball = extractTarball
exports.extractTarballDownload = extractTarballDownload
