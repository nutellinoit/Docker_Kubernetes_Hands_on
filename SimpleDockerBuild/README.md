# Avvio di un container semplice

In questa cartella è presente un file speciale, chiamato `Dockerfile`

Partiamo dall'esercitazione precedente, nel quale abbiamo installato un wordpress con l'immagine ufficiale. Quell'immagine però magari, non conteneva esattamente quello che serviva a noi. In questo caso possiamo scrivere il nostro Dockerfile ed estendere l'immagine installando altri pacchetti


```bash
docker-compose up
```

In questo caso, non verrà eseguito solamente il pull ma verranno anche eseguiti i comandi aggiuntivi del docker file. Creeremo quindi una nostra immagine che poi potremo decidere di pushare in un registro
