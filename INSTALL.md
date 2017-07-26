
![logo](logo-1-2.png)

# Preparazione dell'ambiente

Avrete bisogno un portatile, mac windows o linux.

Sono richiesti i seguenti software installati nella macchina
- [Docker](https://store.docker.com/search?type=edition&offering=community)
- [Docker Compose](https://docs.docker.com/compose/install/#alternative-install-options)
- [Virtualbox](https://www.virtualbox.org/)
- [Minikube](https://github.com/kubernetes/minikube#installation)

E' bene arrivare con tutto già installato in modo di partire velocemente con le esercitazioni e i test

### Installare Kubectl

Kubectl è il l'applicativo CLI per gestire e connettersi ad un cluster kubernetes. 

E' richiesto per poter eseguire *qualsiasi* comando durante il corso 

[Come installarlo](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Avviare impostare minikube

Minikube e' un installazione del cluster kubernetes in un singolo nodo, utile per eseguire test nella propria macchina senza disporre di un cluster. Andremo ad installare anche quello nella seconda parte del corso.

Eseguire i comandi seguenti per fare il setup di minikube.

1. `minikube start`, Avvia la VM di minikube 
2. `minikube ssh` per entrare all'interno della macchina virtuale in ssh
3. Da dentro la macchina minikube, lanciate i seguenti comandi `docker pull sighup/kubeprimer-web`, `docker pull sighup/kubeprimer-backend`, `docker pull mongo:3.0.15`
4. Spegnete minukube senza distruggerlo con `minikube stop`

Non preoccupatevi se non vi sono chiari questi comandi, li spiegheremo

## Ringraziamenti

Jacopo Nardiello [Sighup](https://gist.github.com/jnardiello/da3f902cd9b30f7045a471702ded57f1)
