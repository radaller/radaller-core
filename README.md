# Quick start

- **Install local module**

```javascript
npm install ./path/to/radaller-core
```

- **Import**
```javascript
import { ClientFile, ClientHttp } from 'radaller-core';
```

- **ClientFile**
```javascript
const client = new ClientFile({
    basePath: 'path/to/data/folder'
});
```


- **ClientHttp**
```javascrypt
const client = new ClientHttp({
    basePath: 'https://raw.githubusercontent.com/osvarychevskyi/test-cms-data/master'
});
```

- **Retrieve the data**
```javascript
client.resolve('path/to/resource')
      .then(function(data) {
          //do something with data
      })
```