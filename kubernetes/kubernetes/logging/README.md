# Logging

The best supported logging stack for `Kubernetes` is composed by `fluentd`-`Elasticsearch`-`Kibana`.

`logging.yaml` contains all the parts required to deploy your stack. Note that this deployments was specifically done to work with `minikube`.

## Extracting useful data about `PowerApp`

After you have created your index, we can see some data about our running app. In order to do so, simply filter for `Chrome` and select `log` to remove a bit of noise. That should start to clearly show any request you'll be doing to our app.
