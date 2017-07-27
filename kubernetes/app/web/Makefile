build:
	docker build -t sighup/kubeprimer-web .

run:
	docker rm -f kubeprimer-web || true
	docker run -d --name kubeprimer-web --network kubeprimer -e BACKEND_HOST=kubeprimer-backend -p 80:80 sighup/kubeprimer-web
