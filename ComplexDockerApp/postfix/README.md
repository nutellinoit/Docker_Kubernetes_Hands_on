# xadozuk/smtp-relay

Internal SMTP relay for docker containers.

You must configure your domain accordingly (reverse DNS, SPF, ...) for mail not to be considered as spam.

Docker : https://hub.docker.com/r/xadozuk/smtp-relay

Github : https://github.com/xadozuk/docker-smtp-relay

## Security Consideration

This image has **not** been extensively tested for security. 

*Only* containers from docker network can use the smtp relay.

You **shouldn't** expose the port 25 of this container directly on the Internet.

## Usage

1. First start the smtp relay container

  ```
  docker run -d --name smtp-relay -e SMTP_HOSTNAME=smtp.domain.tld xadozuk/smtp-relay
  ```
  
2. Link the smtp relay to another container

  ```
  docker run -d --link smtp-relay:smtp <image>
  ```
  
3. Connect to the smtp relay with `smtp:25` inside your container.
4. Enjoy !
