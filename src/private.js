'use strict';

export default function createPrivateStorage() {
	const WeakMap = ('WeakMap' in global ? global.WeakMap : require('weakmap'));
	const store = new WeakMap();
	
	return function privateStorage(o) {
		let v = store.get(o);
		
		if(!v) {
			store.set(o, v = {});
		}
		
		return v;
	};
}