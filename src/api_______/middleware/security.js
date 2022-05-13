//    !!!
const secureRedirectMW = ({ port, dev }) => (req, res, next) => {
  if (!dev && !req.secure) {
    const protocol = dev ? 'http' : 'https';
    const portNumber = dev ? `:${port}` : '';
    const url = `${protocol}://${req.hostname}${portNumber}${req.originalUrl}`;

    res.redirect(301, url);
  } else {
    next();
  }
};

//    !!!
const secureRedirectHerokuMW = ({ NodeEnv }) => (req, res, next) => {
  if (NodeEnv || req.headers['x-forwarded-proto'] === 'https') {
    console.log(`MW > security > dev || https: `, true);
    next();
  } else {
    console.log(`MW > security > dev || https: `, false);
    res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  }
};

module.exports = {
  secureRedirectMW,
  secureRedirectHerokuMW,
};
