# Restful CRUD API for devices and gateways using Node.js, Express and MongoDB.

## Steps to Setup

1. Install dependencies

- npm install

2. Run Server

- node server.js

## Database configuration

`./config/dbConfig.json file`

- `{ "host": "localhost", "port": "27017" }`

## Routes

### Gatewy

- [GET] /api/gateway/ `List all gateways`
- [GET] /api/gateway/:serial `get a gateway by serial number`
- [POST] /api/gateway/ `Create a gateways`
- [PUT] /api/gateway/:serial `Update a gateway. Need to receive data to update in the body `
- [DELETE] /api/gateway/:serial `Delete a gateway`

### Device

- [GET] /api/device/ `List all devices`
- [GET] /api/device/:serial `get a device by uid number`
- [POST] /api/device/ `Create a device`
- [PUT] /api/device/:serial `Update a device. Need to receive data to update in the body `
- [DELETE] /api/device/:serial `Delete a device`
