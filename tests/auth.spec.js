const assert = require('assert');
const { validateToken } = require('../api_______/middleware/auth');
const jwt = require('jsonwebtoken');
const shhh = process.env.JWT_SHHH;
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzQxZDI0MTAtZTFjYi00Yjc2LWFlZmMtOThjYTE4MmYzMzgwIn0sImlhdCI6MTYwNDExMTkyNCwiZXhwIjoxNjA0MTI5OTI0fQ.qlHIARTzib9OgU6aJi1kSPc2c3Baq2UR9EYM_MCSJm0';
const userId = '341d2410-e1cb-4b76-aefc-98ca182f3380';

// describe() or it() functions
//      describe()
//          Group of related functions
//      it()
//          specific unit test for a component function

describe('validating user token in req header', () => {
  it('should contain a token that matches userId when decoded', () => {
    const result = jwt.verify(token, shhh);
    assert.equal(result.user.id, userId);
  });
});
