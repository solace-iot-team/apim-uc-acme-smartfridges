# Acme SmartFridges: Provider Services

## Prerequisites

To use the Provider Services, the following is required:

* Anypoint Studio 7 and Mule 4

In addition,the **Provider Services** application must have been created in Solace AsyncAPI Management and
the [database](../database/README.md) must be up and running.

## Installing the Provider Services

### Installation Procedure

1. Import the **Provider Services** project into Anypoint Studio

2. Update the **local.yaml** file in the **src/main/resources** directory:

   * Replace `{broker-mqtt-endpoint}` with the MQTT connection endpoint of the **Provider Services** application.
   * Replace `{broker-provider-services-client-id}` with the consumer key of the **Provider Services** application.
   * Replace `{broker-provider-services-client-secret}` with the consumer secret of the **Provider Services** application. 

> Note: If you changed the port of the database, you need to update the **database.port** value accordingly.

## Running the Provider Services

Run the **Provider Services** as Mule Application.
