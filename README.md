[![Build Status](https://travis-ci.org/radaller/radaller-core.svg?branch=master)](https://travis-ci.org/radaller/radaller-core)

# Quick start

- **Install**

```javascript
npm install --save radaller-core
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