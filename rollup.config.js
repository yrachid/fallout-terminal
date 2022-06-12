import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default {
	input: 'src/terminal.ts',
	output: [
		{
			file: pkg.main,
			sourcemap: true,
			format: 'cjs'
		}
	],
	plugins: [
		commonjs(),
		typescript({
			sourceMap: false
		})
	]
};
