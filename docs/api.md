## Classes

<dl>
<dt><a href="#Document">Document</a></dt>
<dd><p>Represents the data in <a href="#Storage">Storage</a></p>
</dd>
<dt><a href="#DocumentCollection">DocumentCollection</a></dt>
<dd><p>Represents the list of <a href="#Document">Document</a>&#39;s</p>
</dd>
<dt><a href="#GitHubAuth">GitHubAuth</a></dt>
<dd><p>Defines the interface for CRUD operations on cms documents in storage</p>
</dd>
<dt><a href="#GitHubToken">GitHubToken</a></dt>
<dd><p>Provides functionality to manages github access tokens</p>
</dd>
<dt><a href="#GitHubCms">GitHubCms</a></dt>
<dd><p>A Factory to create GitHub CMS components</p>
</dd>
<dt><a href="#RestStorageManager">RestStorageManager</a></dt>
<dd><p>Provides the REST operations to manage cms <a href="#Document">Document</a> in <a href="#Storage">Storage</a></p>
</dd>
<dt><a href="#GitHubStorage">GitHubStorage</a></dt>
<dd><p>Uses GitHub to manage <a href="#Document">Document</a>&#39;s</p>
</dd>
<dt><a href="#Storage">Storage</a></dt>
<dd><p>Storage Interface</p>
</dd>
</dl>

<a id="Document"></a>

## Document
Represents the data in [Storage](#Storage)

<a id="new_Document_new"></a>

### new Document(path, content)

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path to [Document](#Document) in [Storage](#Storage) |
| content | <code>object/string</code> | json or json string representation |

<a id="DocumentCollection"></a>

## DocumentCollection
Represents the list of [Document](#Document)'s

<a id="GitHubAuth"></a>

## GitHubAuth
Defines the interface for CRUD operations on cms documents in storage

<a id="GitHubToken"></a>

## GitHubToken
Provides functionality to manages github access tokens

<a id="GitHubCms"></a>

## GitHubCms
A Factory to create GitHub CMS components


* [GitHubCms](#GitHubCms)
    * [.getRestStorage(config)](#GitHubCms_getRestStorage) ⇒ [<code>`RestStorageManager`</code>](#RestStorageManager)
    * [.getAuth()](#GitHubCms_getAuth) ⇒ [<code>`GitHubAuth`</code>](#GitHubAuth)
    * [.getApi(auth)](#GitHubCms_getApi) ⇒ <code>GitHubApi</code>

<a id="GitHubCms_getRestStorage"></a>

### GitHubCms.getRestStorage(config) ⇒ [<code>`RestStorageManager`</code>](#RestStorageManager)
Returns the instance of [RestStorageManager](#RestStorageManager) for [GitHubStorage](#GitHubStorage)


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | See [GitHubStorage](#GitHubStorage) |

<a id="GitHubCms_getAuth"></a>

### GitHubCms.getAuth() ⇒ [<code>`GitHubAuth`</code>](#GitHubAuth)
Returns instance to manage github authorisations

<a id="GitHubCms_getApi"></a>

### GitHubCms.getApi(auth) ⇒ <code>GitHubApi</code>

| Param | Type | Description |
| --- | --- | --- |
| auth | <code>object</code> |  |
| auth.username | <code>string</code> | The username of github user |
| auth.token | <code>string</code> | Github token. |
| auth.password | <code>string</code> | Github password. |

<a id="RestStorageManager"></a>

## RestStorageManager
Provides the REST operations to manage cms [Document](#Document) in [Storage](#Storage)


* [RestStorageManager](#RestStorageManager)
    * [new RestStorageManager(storage)](#new_RestStorageManager_new)
    * [.get(path, query)](#RestStorageManager__get)
    * [.put(path, data)](#RestStorageManager__put)
    * [.post(path, data)](#RestStorageManager__post)
    * [.remove(path)](#RestStorageManager__remove)

<a id="new_RestStorageManager_new"></a>

### new RestStorageManager(storage)

| Param | Type | Description |
| --- | --- | --- |
| storage | [<code>`Storage`</code>](#Storage) | Document storage interface. |

<a id="RestStorageManager__get"></a>

### restStorageManager.get(path, query)
Returns [Document](#Document) or [DocumentCollection](#DocumentCollection) from [Storage](#Storage)


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Document path |
| query | <code>object</code> | Http query parameters |

<a id="RestStorageManager__put"></a>

### restStorageManager.put(path, data)
Updates the [Document](#Document) in [Storage](#Storage)


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Document path |
| data | <code>object/string</code> | Json content to be saved. |

<a id="RestStorageManager__post"></a>

### restStorageManager.post(path, data)
Updates the [Document](#Document) in [Storage](#Storage)


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path to [Document](#Document) |
| data | <code>object/string</code> | Json content to be saved. |

<a id="RestStorageManager__remove"></a>

### restStorageManager.remove(path)
Removes the [Document](#Document) from [Storage](#Storage)


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path to [Document](#Document) |

<a id="GitHubStorage"></a>

## GitHubStorage
Uses GitHub to manage [Document](#Document)'s

<a id="new_GitHubStorage_new"></a>

### new GitHubStorage(config)

| Param | Type |
| --- | --- |
| config | <code>object</code> | 
| config.username | <code>string</code> | 
| config.token | <code>string</code> | 

<a id="Storage"></a>

## Storage
Storage Interface


* [Storage](#Storage)
    * [.fetchDocument(path)](#Storage__fetchDocument)
    * [.fetchDocumentCollection(type, query)](#Storage__fetchDocumentCollection)
    * [.saveDocument(document)](#Storage__saveDocument)
    * [.deleteDocument(path)](#Storage__deleteDocument)
    * [.getDocumentList(type, filter)](#Storage__getDocumentList)

<a id="Storage__fetchDocument"></a>

### storage.fetchDocument(path)

| Param |
| --- |
| path | 

<a id="Storage__fetchDocumentCollection"></a>

### storage.fetchDocumentCollection(type, query)

| Param |
| --- |
| type | 
| query | 

<a id="Storage__saveDocument"></a>

### storage.saveDocument(document)

| Param | Type |
| --- | --- |
| document | [<code>`Document`</code>](#Document) | 

<a id="Storage__deleteDocument"></a>

### storage.deleteDocument(path)

| Param |
| --- |
| path | 

<a id="Storage__getDocumentList"></a>

### storage.getDocumentList(type, filter)

| Param |
| --- |
| type | 
| filter | 

