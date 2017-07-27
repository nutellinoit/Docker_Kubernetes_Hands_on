build:
	docker build -t sighup/kubeprimer-backend .

run:
	docker rm -f kubeprimer-backend || true
	docker run -d --name kubeprimer-backend -e MONGO_HOST=kubeprimer-mongo --network=kubeprimer sighup/kubeprimer-backend
