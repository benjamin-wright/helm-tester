.PHONY: docker-test test

docker-test:
	docker build -t tester ./tests
	docker run \
		-v $(shell pwd)/library-chart:/var/apps/chart \
		-e TEST_CHART=/var/apps/chart \
		tester

test:
	cd tests && TEST_CHART=$(shell pwd)/library-chart npm run test
