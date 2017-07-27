# Avvio di una soluzione con docker compose

Bene, abbiamo lanciato in precedenza un container wordpress, ora dobbiamo lanciare un ambiente completo utilizzabile veramente. Avremo bisogno di un container wordpress e un container mysql.

All'interno di questa cartella è presente un file chiamato `docker-compose.yml`. Per eseguire le direttive ci basta fare

```bash
docker-compose up
```

In questo modo vedremo i container avviati e il loro STDOUT in console. Se vogliamo avviarlo in background dobbiamo lanciare

```bash
docker-compose up -d
```

Comandi utili per vedere se è avviato

```bash
docker ps -a
```





