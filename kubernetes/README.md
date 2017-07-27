# Comandi utili


```shell
watch kubectl get pods
minikube start
minikube stop
minikube ssh
kubectl get nodes
kubectl get pods
minikube addons enable ingress
kubectl create -f deployments/nginx-deployment.yaml
kubectl apply -f deployments/nginx-deployment.yaml
kubectl get rs
kubectl get deployments
kubectl describe deployment nginx-deployment
kubectl rollout history deployment/nginx-deployment --revision 2
kubect rollout undo deployment/nginx-deployment --to-revision=2
kubectl scale deployment nginx-deployment --replicas=10
kubectl delete deployment nginx-deployment
kubectl get configmaps
kubectl create -f configmaps/powerapp-configmap.yaml 
kubectl describe configmaps/web
kubectl get configmaps web
kubectl get configmaps web -o yaml
kubectl get configmaps web -o json
kubectl create -f secrets/powerapp-secrets.yaml
kubectl describe secrets/web
kubectl get pods --namespace=kube-system
kubectl get namespaces
kubectl create -f deployments/mongo-deployment.yaml
kubectl create -f deployments/backend-deployment.yaml 
kubectl create -f deployments/web-deployment.yaml 
kubectl delete deployments powerapp-mongodb
kubectl get volumes
kubectl create -f deployments/mongo-deployment.yaml
kubectl create -f services/mongo-service.yaml
kubectl create -f services/web-service-nodeport.yaml 
kubectl create -f services/backend-service.yaml 
kubectl get services
kubectl delete deployments powerapp-mongodb
kubectl create -f volumes/kubeprimer-db-persistentvolumeclaim.yaml
kubectl create -f services/mongo-service.yaml 
kubectl create -f deployments/mongo-deployment.yaml
kubectl create -f ingress/powerapp-ingress.yaml
kubectl get services
kubectl get ingresses
kubectl create -f jobs/job.yaml 
kubectl get jobs
kubectl create -f jobs/job_10.yaml
kubectl delete job pi

```