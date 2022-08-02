# Acme SmartFridges: Database Service

> Note: The parent directory of this README is referred to as `<DATABASE_HOME>`.

## Prerequisites

To use the database service, the following is required:

* Docker Engine and Docker Compose

## Installing the Database Service

### Installation Procedure

1. Create the **.env** file for the database service:

```bash
cd <DATABASE_HOME>
cp template.env .env
```

> Note: If you want to change the port for the database, change the corresponding value in the **.env** file.

2. Create and bootstrap the database service:

```bash
cd <DATABASE_HOME>
sh scripts/bootstrap.sh
```

## Starting and Stopping the Database Service

To start the database service:

```bash
cd <DATABASE_HOME>
sh scripts/start.sh
```

To stop the database service:

```bash
cd <DATABASE_HOME>
sh scripts/stop.sh
```

## Uninstalling the Database Service

To remove the database service:

```bash
cd <DATABASE_HOME>
sh scripts/cleanup.sh
```
