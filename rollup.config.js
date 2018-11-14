import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from "rollup-plugin-eslint-bundle";
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

export default [
	{
		input: 'src/index.js',
		output: {
			file: 'dist/nuxt-magnifier.js',
			format: 'cjs'
		},
		plugins: [
			resolve(), 
			eslint({fix: true}),
			commonjs(),
			babel({ runtimeHelpers: true, externalHelpers: true }),
        	uglify({
				compress: {
					pure_getters: true,
					unsafe: true,
					unsafe_comps: true,
					warnings: false
				}
			})
		]
	}
];
