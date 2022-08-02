# Acme SmartFridges: Fridge Appliance Simulator

> Note: The parent directory of this README is referred to as `<SIMULATOR_HOME>`.

## Prerequisites

To use the Fridge Appliance Simulator, the following is required:

* Node.js 16 or later

In addition, the **Fridge Appliance** application must have been created via Solace AsyncAPI Management.

## Installing the Fridge Appliance Simulator

### Before you Begin

1. Install the required Node.js packages for the Fridge Appliance Simulator backend:

```bash
cd <SIMULATOR_HOME>/backend
npm install
```

2. Install the required Node.js packages for the Fridge Appliance Simulator frontend:

```bash
cd <SIMULATOR_HOME>/frontend
npm install
```

### Installation Procedure

1. Create the **.env** file for the Fridge Appliance Simulator backend:

```bash
cd <SIMULATOR_HOME>/backend
cp template.env .env
```

2. Update the **.env** file for the Fridge Appliance Simulator backend:

   * Replace `{broker-mqtt-endpoint}` with the MQTT connection endpoint of the **Fridge Appliance** application.
   * Replace `{broker-appliance-client-id}` with the consumer key of the **Fridge Appliance** application.
   * Replace `{broker-appliance-client-secret}` with the consumer secret of the **Fridge Appliance** application. 

> Notes:
> * If you want to change the port for the Fridge Appliance Simulator backend, you also need to change the
    **CORS_ORIGIN** environment variable in the **.env** file of the Fridge Appliance Simulator frontend.
> * If you want to change the port for the Fridge Appliance Simulator frontend, you also need to change the
    **CORS_ORIGIN** environment variable in the **.env** file of the Fridge Appliance Simulator backend.

3. Create the default set of fridges for the Fridge Appliance Simulator:

```bash
cd <SIMULATOR_HOME>/backend
mkdir -p database
cp resources/fridges.json database/.
```

## Running the Fridge Appliance Simulator

1. Start the Fridge Appliance Simulator backend:

```bash
cd <SIMULATOR_HOME>/backend
npm start
```

2. Start the Fridge Appliance Simulator frontend:

```bash
cd <SIMULATOR_HOME>/frontend
npm start
```
