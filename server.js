const http = require('http');
const app = require('./app');

// linux commamd: export PORT=9000 (win: set)
const port =  process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server on port ${port}`);
});
