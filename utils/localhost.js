'use strict';

module.exports = (app, port) => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
