[![Build Status](https://travis-ci.org/radaller/radaller-core.svg?branch=master)](https://travis-ci.org/radaller/radaller-core)
[![npm version](https://badge.fury.io/js/radaller-core.svg)](https://badge.fury.io/js/radaller-core)

# Quick start

- **Install**

```javascript
npm install --save radaller-core
```

- **Import**
```javascript
import {HttpCli} from 'radaller-core';
```

- **HttpCli**
```javascript
const client = HttpCli.getClient({
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