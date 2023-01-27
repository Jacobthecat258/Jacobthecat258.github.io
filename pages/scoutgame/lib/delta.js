function getDelta() {
	var newTime = new Date().getTime();
	var old = getDelta.prev;
	getDelta.prev = newTime;
	return newTime - old;
}
getDelta.prev = new Date().getTime();