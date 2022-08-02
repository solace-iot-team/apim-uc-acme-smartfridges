import express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/', controller.all)
  .get('/events', controller.eventStream)
  .get('/:id', controller.byId)
  .post('/', controller.create)
  .patch('/:id', controller.update)
  .delete('/:id', controller.delete);
