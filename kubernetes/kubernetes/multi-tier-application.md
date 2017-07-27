# Deploying a multi-tier application

In questo capitolo andremo a deployare nel cluster un applicazione multi tier di più microservizi chiamata  `PowerApp`,  l'applicazione è stata creata per questo corso. L'applicazione è composta da un frontend in php servito da apche, un backend in nodejs e un database mongodb.
E' una semplice app che inserisce in una lista delle stringhe. 

## Obbiettivi

Gli obbiettivi sono di avere l'applicazione funzionante. Per poterlo fare dobbiamo deployare tutti i servizi con le loro configurazioni e segreti. Una volta fatto dobbiamo impostare la comunicazione tra loro

L'unic pod esposto verso il mondo esterno è il `frontend`. Lo faemo in due modi, con la NodePort e con un Ingress.


## Prerequisiti: ConfigMaps & Secrets

Se diamo un occhiata a `deployments/web-deployment.yaml` vedremo quanto segue:

```yaml
…
- name: COMPANY
  valueFrom:
    configMapKeyRef:
      name: web
      key: COMPANY
# How to use a Secret
- name: SOME_PASSWORD
  valueFrom:
    secretKeyRef:
      name: web
      key: some-password
…
```

Significa che il deployment dipende da una ConfigMap chiamata `web` e un Secret chiamato `web`.

Se proviamo a lanciare `kubectl create -f deployments/web-deployment.yaml` senza aver creato segreti e configmap, otteniamo un fault.

```bash
NAME                            READY     STATUS                       RESTARTS   AGE
powerapp-web-1507534023-4fff2   0/1       configmaps "web" not found   0          1m
powerapp-web-1507534023-54tpb   0/1       configmaps "web" not found   0          1m
powerapp-web-1507534023-cc9f4   0/1       configmaps "web" not found   0          1m
```

come prima cosa **dobbiamo** creare la `ConfigMaps` e il `Secrets`.

```bash
kubectl create -f configmaps/powerapp-configmap.yaml
configmap "web" created

kubectl create -f secrets/powerapp-secrets.yaml
secret "web" created
kubectl get configmaps
NAME      DATA      AGE
web       2         15s

kubectl get secrets
NAME                  TYPE                                  DATA      AGE
default-token-p5g8v   kubernetes.io/service-account-token   3         26s
web                   Opaque                                1         11s
```

## Deploy della nostra applicazione

Possiamo procedere al deploy con i comandi seguenti

```bash
kubectl create -f deployments/web-deployment.yaml
kubectl create -f deployments/backend-deployment.yaml
kubectl create -f deployments/mongo-deployment.yaml

NAME                                READY     STATUS              RESTARTS   AGE
powerapp-backend-106957089-jcw91    0/1       ContainerCreating   0          1m
powerapp-mongodb-2965042848-blp9z   0/1       ContainerCreating   0          43s
powerapp-web-1507534023-d7dvb       0/1       ContainerCreating   0          2m
powerapp-web-1507534023-nxz6c       0/1       ContainerCreating   0          2m
powerapp-web-1507534023-rndj6       0/1       ContainerCreating   0          2m
```

Tutti i deploy con il tempo saranno avviati **tranne per mongodb**. 

## Cosa sta succedendo?

Per controllare lo stato del nostro cluster dobbiamo usare:  

`kubectl describe pod <pod_name>`  
`kubectl describe deployment <deployment_name>`  
`kubectl rollout status deployment/<deployment_name>`  

Perchè allora mongodb non funziona?

## Volumes

Mongodb non funziona perchè ci siamo dimenticati una delle sue dipendente: `il volume`. 

Una delle caratteristiche di Kubernetes è quella di poter gestire lo storage in termini di volumi, che i pod possono reclamare quando vengono schedulati. In questo caso `mongodb` richiede un volume disponibile, che ancora non esiste.


Lo possiamo creare:  

`kubectl create -f volumes/kubeprimer-db-persistentvolumeclaim.yaml`

##### Postilla, c'è un esempio anche con un volume nfs

*Non usatelo nel corso*

```bash
kubectl create -f volumes/kubeprimer-db-nfs-pv.yaml
kubectl create -f volumes/kubeprimer-db-nfs-pvc.yaml
```



La stessa cosa si può utilizzare con Ceph, Glusterfs, o altre tipologie di volumi.

##### fine postilla.

Ottimo! ora abbiamo tutti i deployments correttamente lanciati e se non ci sono problemi dovremo vedere tutti i pods `Running`.

Ancora però non sappiamo e la nostra applicazione sia funzionante o meno, e non sappiamo se i container si vedono tra di loro.




## Services

Ora possiamo iniziare a esporre i pods al mondo esterno e tra di loro.

Iniziamo con `web` . Come detto in precedenza è l'unico pod che sarà raggiungibile dall'esterno del cluster.


```bash
kubectl create -f services/web-service-nodeport.yaml
```

Facendo `minikube ip` avrete l'ip del vostro nodo che sta esponendo il servizio.

Per sapere in quale porta, possiamo usare `kubectl get services`.



Visitando `<minikube_ip>:<port>` dovreste ora vedere l'applicazione funzionare.

In questo momento stiamo vedendo il servizio `NodePort` in azione dove tutti i nodi del cluster espongono una porta random e servono il traffico dei pod

Possiamo ora lanciare i servizi `backend` e `mongodb`. Una volta fatto, la pagina di frontend dovrebbe funzionare correttamente senza errori.

```bash
kubectl create -f services/backend-service.yaml
kubectl create -f services/mongo-service.yaml
```


## Esporre i servizi con Ingress

Fin'ora abbiamo esposto il frontendo utilizzando il servizio di tipo `NodePort` ma accedere al servizio con la combinazione `<ip>:<port>` non è proprio ideale

E' ora di vedere qualcosa di più avanzato, `Ingress`

Abilitiamolo con il comando:

`minikube addons enable ingress`

passiamo quindi al deploy del nostro ingress:

```bash
kubectl create -f ingress/powerapp-ingress.yaml
```