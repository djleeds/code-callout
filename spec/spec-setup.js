jasmine.getFixtures().fixturesPath = "spec/fixtures";

initializePlugin = function() {
	jQuery().codeCallout({ exposeForTest: true });
};

getClass = function(name) {
	return window.__codeCallout[name];
};
