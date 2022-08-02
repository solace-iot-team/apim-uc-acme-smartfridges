# Acme SmartFridges: MyFridge Consumer Application

> Note: The parent directory of this README is referred to as `<CONSUMER_APP_HOME>`.

## Prerequisites

To use the MyFridge Consumer Application, the following is required:

* Node.js 16 or later

In addition, the **MyFridge App** application must have been created in Solace AsyncAPI Management.

## Installing the MyFridge Consumer Application

### Before you Begin

1. Install the required Node.js packages for the MyFridge Consumer Application backend:

```bash
cd <CONSUMER_APP_HOME>/backend
npm install
```

2. Install the required Node.js packages for the MyFridge Consumer Application frontend:

```bash
cd <CONSUMER_APP_HOME>/frontend
npm install
```

### Installation Procedure

1. Create the **.env** file for the MyFridge Consumer Application backend:

```bash
cd <CONSUMER_APP_HOME>/backend
cp template.env .env
```

2. Update the **.env** file for the MyFridge Consumer Application backend:

   * Replace `{broker-mqtt-endpoint}` with the MQTT connection endpoint of the **MyFridge App** application.
   * Replace `{broker-consumer-app-client-id}` with the consumer key of the **MyFridge App** application.
   * Replace `{broker-consumer-app-client-secret}` with the consumer secret of the **MyFridge App** application. 

> Notes:
> * If you want to change the port for the MyFridge Consumer Application backend, you also need to change the
    **CORS_ORIGIN** environment variable in the **.env** file of the MyFridge Consumer Application frontend.
> * If you want to change the port for the MyFridge Consumer Application frontend, you also need to change the
    **CORS_ORIGIN** environment variable in the **.env** file of the MyFridge Consumer Application backend.

## Running the MyFridge Consumer Application

1. Start the MyFridge Consumer Application backend:

```bash
cd <CONSUMER_APP_HOME>/backend
npm start
```

2. Start the MyFridge Consumer Application frontend:

```bash
cd <CONSUMER_APP_HOME>/frontend
npm start
```
