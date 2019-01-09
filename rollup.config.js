// import uglify from 'rollup-plugin-uglify-es'
import { terser } from 'rollup-plugin-terser' // uglify alternative
import replace from 'rollup-plugin-replace'
const typescript = require('rollup-plugin-typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const glob = require('glob')

let plugins = {
  plugins: [
    replace({
      '$Fetch_Inject_Version': process.env.FETCHINJECTVERSION,
      delimiters: ['', '']
    }),
    typescript({
      target: 'ES6',
      typescript: require('typescript'), // use local version
      rootDir: './',
      module: 'es6',
      allowJs: true,
      declaration: false,
      removeComments: true,
      lib: [
        'dom',
        'es6',
        'es2016'
      ]
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      browser: true,
      extensions: [ '.js', '.json' ],
      preferBuiltins: false
    }),
    terser()
  ]
}

// create config for each bundle
let configs = glob.sync('resources/js/*.ts').map(path => {
  return Object.assign({
    input: path,
    output: {
      format: 'iife',
      file: path.replace('resources', 'public').split('.')[0] + '.js',
      sourcemap: false
    } }, plugins)
})

export default configs
