# KubePrimer PowerApp

## docker-compose

To run the KubePrimer PowerApp with `docker-compose` execute

```bash
# Build the kubeprimer-web and kubeprimer-backed containers images
docker-compose build
# Run the services
docker-compose up -d
```

The services can be scaled with

```bash
docker-compose up scale web=3 backend=2
```

## Run on K8S with Kompose

[Kompose](https://github.com/kubernetes-incubator/kompose) converts `docker-compose` services definitions
into Kubernetes Services and Deployments.

You can convert to K8S the KubePrimer PowerApp with

```bash
kompose convert -f docker-compose.yml
```

To deploy and scale the KubePrimer PowerApp on a Kubernetes cluster do

```bash
kompose up
```

**NB:** Notice that Kompose will not build and automatically deploy to a Docker registry the Services Docker images.
        These should be built and deployed to a Docker Registry before deploying the services on K8S.
