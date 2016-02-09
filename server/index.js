import express from 'express';
import serialize from 'serialize-javascript';
import { resolve } from 'path';
import { Observable } from 'rx';
import { run } from '@cycle/core';
import { makeHTMLDriver } from '@cycle/dom';

export default ({port, env = 'dev'}) => {
    const appsrc = require.resolve('../app');
    let App = require(appsrc).default;

    const server = express();
    if (env === 'dev'){
        const config = require('../webpack.config').default,
              compiler = require('webpack')(config),
              dev = require('webpack-dev-middleware'),
              hot = require('webpack-hot-middleware');

        server.use(dev(compiler, {noInfo: true, publicPath: config.output.publicPath}));
        server.use(hot(compiler));
        require('./hot').default({[appsrc]: next=> {App = next;}});
    }

    server.set('views', __dirname + '/views');
    server.set('view engine', 'jade');
    server.get('/favicon.ico', (req, res)=>{
        res.writeHead(200, {'Content-Type': 'image/x-icon'});
        res.end();
        return;
    });
    server.use(express.static(resolve('./www')));
    server.get('/', (req, res)=>{
        const context = { weight: req.query.weight || 70, height: req.query.height || 170 };
        let {sources} = run(App, {DOM: makeHTMLDriver(), context: ()=> context});
        sources.DOM.take(1).subscribe(html => res.render('app', {APP: html, CTX: serialize(context)}));
    });
    return server.listen(port, ()=> console.log('Server running at port: %d', port));
};
