# Monitoring with Prometheus

There are a number of takeaways from this files. This is a good candidate example to show how a pod can contain multiple containers running as they are logically tied together.

Also, it is worth to point out that `node-exporter` is a pod of type `DaemonSet`, meaning that kubernetes will make sure that exactly one `node-exporter` is ran at all times on each node.

## Prometheus

In this example the `prometheus` pod contains exactly one instance of `prometheus, grafana and alertmanager`. While I won't get into detail, these components will always exist together in our infrastructure.

This is also a very concrete example of usage for `ConfigMaps` as we use one of them to store the prometheus configuration file, the configmap is then mounted as a `volume` and the prom configuration is made available to the pod as a mounted file.

## Grafana

Once Grafana is up & running, you can specify prometheus as datasource. Because they are all in the same pod, they share the same networking namespace and therefore Grafana will be able to access Prometheus on localhost.

Once the data-source is configured, we need to setup dashboards. The amazing k8s grafana/kubernetes communities provide a good number of ready-to-use dashboards.

To see an example of this, try to import the following dashboard: `https://grafana.com/dashboards/315`
