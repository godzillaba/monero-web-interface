module.exports = function(req, res, next) {
  if (req.client.authorized)
    next();
  else
    res.send('401'); // TODO: << this
}
