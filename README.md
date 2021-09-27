TIPs:
  * npm install -D sass-loader@^10 sass
      vue3 uses webpack 4, latest sass-loader uses webpack 5, downgrade to sass-loader@10 ( https://stackoverflow.com/a/66087132/10562922 )
      vue3 generates webpack config automaticly, no need to configure preprocessors additionaly

  * native custom elements throwing warnings, do not use them?

# vuekaef

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
