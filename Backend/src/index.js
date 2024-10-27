import app from './app.js';

const main = () => {
  app.listen(app.get('port'));
  console.log('Server on Port: ', app.get('port'));
};
main();
