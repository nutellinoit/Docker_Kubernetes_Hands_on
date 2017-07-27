# Multi-node and fault-tolerance

In order to setup a new cluster with multi-node you will need `kubeadm`. `Kubeadm` is the default tool in Kubernetes to deploy new clusters, it is not yet production ready but nearly all projects to instantiate new clusters are migrating to it, there's a strong effort from the community to have a cohesive and homogenous method to instantiate kubernetes.

For an updated guide on how to use it with this example, see: [https://blog.alexellis.io/kubernetes-in-10-minutes/](https://blog.alexellis.io/kubernetes-in-10-minutes/)

This is **not** going to work out of the box as `kubeadm` will pick the wrong network interface due to how Vagrant/Virtualbox are configured. We can enforce the correct ip (which for this use-case works just fine) by adding the `--address` flag to the `Network Flags` in `/etc/systemd/system/kubectl-.../10-kubeadm.conf`. Enforcing this flag and reloading the daemon will fix things and make your cluster fully functional.
