import w from 'webpack';
import {resolve} from 'path';
export default {
	devtool: 'eval',
	entry: [
		'webpack-hot-middleware/client?reload=true',
		'./client.js'
	],
	output: {
		path: resolve(__dirname + '/www'),
		filename: 'app.bundle.js',
		publicPath: '/'
	},
	plugins: [
		new w.HotModuleReplacementPlugin(),
		new w.optimize.DedupePlugin(),
		new w.optimize.OccurenceOrderPlugin(),
        new w.NoErrorsPlugin()
	],
	module: {
		loaders: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }]
	}
};
