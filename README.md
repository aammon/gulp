## Getting Started

```bash
git clone https://github.com/aammon/gulp.git MyApp
cd MyApp
npm install
```

#### Development 

```bash
gulp
```

#### Production

```bash
gulp --production
```


Features | Tools Used
------ | -----
**CSS** | [Sass](http://sass-lang.com/) ([Libsass](http://sass-lang.com/libsass) via [node-sass](https://github.com/sass/node-sass)), [Autoprefixer](https://github.com/postcss/autoprefixer), [CSSComb](https://www.npmjs.com/package/gulp-csscomb), [Shorthand](https://github.com/kevva/gulp-shorthand), [Bourbon/Neat](http://bourbon.io/), Sourcemaps
**HTML** | [Nunjucks](https://mozilla.github.io/nunjucks/), [gulp-data](https://github.com/colynb/gulp-data)
**Images** | Compression with [imagemin](https://www.npmjs.com/package/gulp-imagemin)
**Fonts** | Folder
**Live Updating** | [BrowserSync](http://www.browsersync.io/)
**Production Builds** | JS [uglified](https://github.com/terinjokes/gulp-uglify), CSS [minified](http://cssnano.co/), & HTML [minified](https://www.npmjs.com/package/gulp-html-minifier) [file size reporting](https://github.com/jaysalvat/gulp-sizereport)

