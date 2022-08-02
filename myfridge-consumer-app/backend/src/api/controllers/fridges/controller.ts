import { v4 as uuid } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import { Constants } from '../../../common/constants';
import FridgesService, { FridgeEvents } from '../../services/fridges/service';

const cookieForClientId = Constants.COOKIE_CLIENT_ID;

class Controller {

  updateTemperatureSetting(req: Request, res: Response, next: NextFunction): void {

    const clientId = req.cookies[cookieForClientId] || uuid();

    const customerId = Number(req.params['customerId']);
    const fridgeId = req.params['fridgeId'];
    const setting = req.body.temperature;

    FridgesService.updateTemperatureSetting(clientId, customerId, fridgeId, setting).then(() => {
      res.cookie(cookieForClientId, clientId);
      res.status(200).json({});
    }).catch((error: any) => { next(error); });;
  }

  waitForEvents(req: Request, res: Response): void {

    const clientId = req.cookies[cookieForClientId] || uuid();

    if (req.headers.accept === 'text/event-stream') {

      res.cookie(cookieForClientId, clientId);
      res.writeHead(200, {
        'Cache-Control': 'no-transform',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
      });

      const sendMessage = (data: string) => { res.write(`data: ${data}\n\n`); };

      const customerId = Number(req.params['customerId']);
      const fridgeId = req.params['fridgeId'];

      FridgesService.addEventListener(clientId, customerId, fridgeId, (event: FridgeEvents, message: any) => {
        switch (event) {
          case FridgeEvents.TEMPERATURE_MEASURED:
            sendMessage(JSON.stringify({ event: Constants.EVENT_TEMPERATURE_MEASURED, message: message }));
            break;
          case FridgeEvents.DOOR_OPENED:
            sendMessage(JSON.stringify({ event: Constants.EVENT_DOOR_OPENED, message: message }));
            break;
          case FridgeEvents.DOOR_CLOSED:
            sendMessage(JSON.stringify({ event: Constants.EVENT_DOOR_CLOSED, message: message }));
            break;
          case FridgeEvents.TEMPERATURE_SETTING_UPDATED:
            sendMessage(JSON.stringify({ event: Constants.EVENT_TEMPERATURE_SETTING_UPDATED, message: message }));
            break;
        }
      });

      res.on('close', () => {
        FridgesService.disconnect(clientId);
      });

    } else {

      res.json({ message: 'Ok' });
    }
  }
}

export default new Controller();
