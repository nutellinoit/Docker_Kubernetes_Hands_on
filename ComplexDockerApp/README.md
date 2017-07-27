# Node mailing amqp

Server smtp in ascolto sulla porta 25, (modificabile dal docker-compose.yml) per l'invio scaglionato nel tempo delle email


# Installazione e avvio

## Requisiti


1. Avere installato l'ambiente docker e il programma docker-compose. 

#### Ambiente docker

* docker Ubuntu Link al sito ufficiale: https://store.docker.com/editions/community/docker-ce-server-ubuntu
* docker per Mac: https://store.docker.com/editions/community/docker-ce-desktop-mac

#### Docker Compose

per installare docker-compose

```bash
#se non si ha python
apt-get install python python-pip
# Installazione di docker-compose
pip install docker-compose
```
#### Avvio e installazione

Posizionarsi nella cartella root del progetto e lanciare il sistema con:


```bash
docker-compose up
```

Se si vuole lanciare in background lanciarlo con

```bash
docker-compose up -d
```

## Configurazioni

### Account email:

Modificare il file [publisher/auth.json](publisher/auth.json) e aggiungere gli account che verranno utilizzati dal sistema

Esempio:

```json
{
	"users": [{
		"username": "test1",
		"password": "test1"
	}, {
		"username": "test2",
		"password": "test2"
	}, {
		"username": "test3",
		"password": "test3"
	}, {
		"username": "test4",
		"password": "test4"
	}, {
		"username": "test5",
		"password": "test5"
	}]
}
```

### Temporizzazione

Modificare il file [subscriber/config.json](subscriber/config.json) e cambiare la riga delay send con il valore in millisecondi voluto

```json
{
  "amqp": "amqp://rabbitmq",
  "delaysend": 20000, 
  "queue": "node-mailing-amqp",
  "relay": {
    "port": 25,
    "host": "postfix",
    "messagesize" : 10
  }
}
```

### Hostname di uscita

Modificare il file docker-compose.yml nel parametro SMTP_HOSTNAME