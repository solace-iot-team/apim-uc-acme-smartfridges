import express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/:customerId/:fridgeId/events', controller.waitForEvents)
  .put('/:customerId/:fridgeId/tcu', controller.updateTemperatureSetting)
