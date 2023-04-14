const fs = require('fs');

const api = fs.readFileSync('./dev-data/data.json', 'utf-8');
const apiJson = JSON.parse(api);

const overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const card = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const product = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const http = require('http');

const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

///////////////SERVER

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  if (pathname === '/' || pathname === '/overview') {
    response.writeHead('200', { 'Content-type': 'text/html' });

    const cardsHtml = apiJson.map((obj) => replaceTemplate(card, obj));
    const allCardsOverview = overview.replace('{%PRODUCT_CARD%}', cardsHtml);

    response.end(allCardsOverview);
  } else if (pathname === '/product') {
    response.writeHead('200', { 'Content-type': 'text/html' });

    const findProduct = apiJson[query.id];
    const selectedProduct = replaceTemplate(product, findProduct);
    response.end(selectedProduct);
  } else if (pathname === '/api') {
    response.writeHead('200', { 'Content-type': 'application/json' });
    response.end(api);
  } else {
    response.writeHead('404');
    response.end('PAGE NOT FOUND ');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Primeiro server no ar');
});
