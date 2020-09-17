const { Router } = require('express');
const router = Router();
const cors = require('cors');

//  FXN

//  ===============
//  ==   /util   ==
//  ===============
router.post('/', async (req, res, next) => {
  console.log('ENTER: /api/util');
  res.status(200).text('So glad you could make it...');
});

module.exports = router;
