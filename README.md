# doser

[![version](https://img.shields.io/npm/v/doser.svg?style=flat-square)](http://npm.im/doser)
[![downloads](https://img.shields.io/npm/dm/doser.svg?style=flat-square)](http://npm-stat.com/charts.html?package=doser&from=2017-01-01)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](http://opensource.org/licenses/MIT)

Lightweight ES2015+ dependency injection written in ES6

## Installation

```
npm install doser --save
```

## Usage

```js
import Doser from 'doser';

class DatabaseConnection {
	constructor(url) {...}
	query() {...}
}
const DATABASE_CONNECTION_URL = 'mysql://user:password@localhost';

class ProductService {
	constructor(database) {
		this.database = database;
		...
	}
	list() {
		return this.database.query(...);
	}
}

const container = new Doser();

container.registerPrimitive('DATABASE_CONNECTION_URL', DATABASE_CONNECTION_URL, true);
container.register('database', (inject) => new DatabaseConnection(inject('DATABASE_CONNECTION_URL'), true));
container.register('product_service', (inject) => new ProductService(inject('database')));

container.has('product_service'); //true
container.has('unknown_key'); //false

const product_service = container.get('product_service');
product_service.list();

const proxy = container.makePublicProxy(); //returns a freezed object with getters for each registered public key
proxy.product_service.list();

```