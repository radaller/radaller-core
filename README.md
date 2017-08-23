[![Build Status](https://travis-ci.org/radaller/radaller-core.svg?branch=master)](https://travis-ci.org/radaller/radaller-core)

# Quick start

> Important!  
> Do the following before using:
>- checkout this repository
>- run `npm install`
>- run `npm run build`

- **Inside your Project install local module**

```javascript
npm install ./path/to/radaller-core
```

- **Import**
```javascript
import HttpCli from 'radaller-core/http-cli';
```

- **HttpCli**
```javascript
const client = new HttpCli({
    basePath: 'https://raw.githubusercontent.com/radaller/radaller-mock-data/master'
});
```

- **Retrieve the data**
```javascript
client.resolve('path/to/resource')
      .then(function(data) {
          //do something with data
      })
```