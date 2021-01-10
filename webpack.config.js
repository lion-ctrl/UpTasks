const path = require("path");

module.exports = {
	entry: "./src/public/js/app.js",
	output: {
		filename: "bundle.js",
		path: path.join(__dirname, "src/public/dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node-modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
};
