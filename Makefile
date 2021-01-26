.PHONY: test

test:
	docker build -t tester ./tests
	docker run -v $(shell pwd)/library-chart:/var/apps/src/test-chart/charts/library-chart/ tester
