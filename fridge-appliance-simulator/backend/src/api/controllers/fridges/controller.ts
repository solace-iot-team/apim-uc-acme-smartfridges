import { NextFunction, Request, Response } from 'express';
import FridgesService from '../../services/fridges/service';

class Controller {

  all(_req: Request, res: Response, next: NextFunction): void {
    FridgesService.all().then((fridges) => {
      res.status(200).json(fridges);
    }).catch((error: any) => { next(error); });
  }

  byId(req: Request, res: Response, next: NextFunction): void {
    const id = req.params['id'];
    FridgesService.byId(id).then((fridge) => {
      if (fridge) {
        res.status(200).json(fridge);
      } else {
        res.status(404).json({ message: 'The fridge does not exist' });
      }
    }).catch((error: any) => { next(error); });
  }

  create(req: Request, res: Response, next: NextFunction): void {
    const data = req.body;
    FridgesService.create(data).then((fridge) => {
      res.status(201).json(fridge);
    }).catch((error: any) => { next(error); });
  }

  update(req: Request, res: Response, next: NextFunction): void {
    const id = req.params['id'];
    const data = req.body;
    FridgesService.update(id, data).then((fridge) => {
      res.status(200).json(fridge);
    }).catch((error: any) => { next(error); });
  }

  delete(req: Request, res: Response, next: NextFunction): void {
    const id = req.params['id'];
    FridgesService.delete(id).then(() => {
      res.status(204).end();
    }).catch((error: any) => { next(error); });
  }

  /** Stream server-side events to a client. */
  eventStream(req: Request, res: Response): void {

    if (req.headers.accept === 'text/event-stream') {

      res.writeHead(200, {
        'Cache-Control': 'no-transform',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
      });

      const sendMessage = (data: string) => {
        res.write(`data: ${data}\n\n`);
      };

      const fridgeCreatedListener = () => { sendMessage('fridge-created'); }
      const fridgeUpdatedListener = () => { sendMessage('fridge-updated'); }
      const fridgeDeletedListener = () => { sendMessage('fridge-deleted'); }

      FridgesService.addListener('created', fridgeCreatedListener);
      FridgesService.addListener('updated', fridgeUpdatedListener);
      FridgesService.addListener('deleted', fridgeDeletedListener);

      res.on('close', () => {
        FridgesService.removeListener('created', fridgeCreatedListener);
        FridgesService.removeListener('updated', fridgeUpdatedListener);
        FridgesService.removeListener('deleted', fridgeDeletedListener);
      });

    } else {

      res.json({ message: 'Ok' });
    }
  }
}

export default new Controller();
