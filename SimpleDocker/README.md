# Avvio di un container semplice

Conosciamo tutti la piattaforma, proviamo a lanciare un semplice container wordpress senza nessuna particolare attenzione alla sua configurazione

```bash
docker run --name ilnostrofiammantewordpress -p 80:80 -d wordpress

```

Comandi utili per vedere se è avviato

```bash
docker ps -a
```





