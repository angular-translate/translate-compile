// STRING
String.prototype.contains = function(string) {
	return this.indexOf(string) >= 0;
};
String.prototype.beginsWith = function(string) {
    return this.indexOf(string) === 0;
};
String.prototype.indexesOf = function(searchStr, isCaseInsensitive) {
	var startIndex = 0,
		searchStrLen = searchStr.length;
	var index, indices = [];
	var str = this;
	if (isCaseInsensitive) {
		str = str.toLowerCase();
		searchStr = searchStr.toLowerCase();
	}
	while ((index = str.indexOf(searchStr, startIndex)) > -1) {
		indices.push(index);
		startIndex = index + searchStrLen;
	}
	return indices;
};
String.prototype.replaceAll = function(oldStr, newStr, escape) {
	if (escape) {
		oldStr = oldStr.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	return this.replace(new RegExp(oldStr, 'g'), newStr);
};

// ARRAY
Array.prototype.contains = function(val) {
	return !!~this.indexOf(val);
};
Array.prototype.isEmpty = function() {
	return this.length === 0;
};
Array.prototype.pushAll = function(array) {
	this.push.apply(this, array);
};