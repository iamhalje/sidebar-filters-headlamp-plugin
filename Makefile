all: build

build:
	DOCKER_BUILDKIT=1 docker buildx build --push \
		-f Dockerfile \
		-t halje/sidebar-filters-headlamp-plugin:latest \
		-t halje/sidebar-filters-headlamp-plugin:$(VERSION) \
		.
