module.exports = function(req, res, next) {
  if (req.client.authorized) {
    console.log("client connected: " +
      req.socket.getPeerCertificate().subject.CN);
    next();
  }
  else {
    res.send('401');
  }
}
