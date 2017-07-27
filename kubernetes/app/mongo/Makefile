build:
	docker pull mongo:3.0.15
	docker tag mongo:3.0.15 sighup/kubeprimer-mongo

run:
	docker rm -f kubeprimer-mongo || true
	docker run -d --name kubeprimer-mongo --network=kubeprimer -p 27017:27017 sighup/kubeprimer-mongo
