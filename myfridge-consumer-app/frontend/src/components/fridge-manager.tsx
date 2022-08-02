import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { Constants } from '../common/constants';
import config from '../common/config';
import { FridgeSettings } from './fridge-settings';
import { FridgeItem } from './fridge-item';
import { Fridge } from '../model/fridge';

const cookieForClientId = Constants.COOKIE_CLIENT_ID;
const apiServerHost = config.apiServerHost

const initialFridgeData: Partial<Fridge> = {
  temperatureSetting: 3,
  doorStatus: Fridge.DoorStatus.CLOSED,
};

export const FridgeManager = () => {

  const [, , removeCookies] = useCookies([cookieForClientId]);

  const [customerId, setCustomerId] = useState<number | null>(null);
  const [fridgeId, setFridgeId] = useState<string>('');
  const [fridgeData, setFridgeData] = useState<Partial<Fridge>>(initialFridgeData);

  const doorStatusUpdatedAt = useRef<Date>();

  const resetFridgeData = () => {
    setFridgeData(initialFridgeData);
    doorStatusUpdatedAt.current = undefined;
  };

  const handleUpdateFromServer = useCallback((event: string, message: any) => {

    const sentAt = new Date(message.sentAt);

    switch (event) {
      case Constants.EVENT_TEMPERATURE_MEASURED:
        setFridgeData(values => ({ ...values, temperature: message.temperature, lastUpdated: sentAt }));
        break;
      case Constants.EVENT_DOOR_OPENED:
        if (doorStatusUpdatedAt.current === undefined || doorStatusUpdatedAt.current < sentAt) {
          setFridgeData(values => ({ ...values, doorStatus: Fridge.DoorStatus.OPEN, lastUpdated: sentAt }));
          doorStatusUpdatedAt.current = sentAt;
        }
        break;
      case Constants.EVENT_DOOR_CLOSED:
        if (doorStatusUpdatedAt.current === undefined || doorStatusUpdatedAt.current < sentAt) {
          setFridgeData(values => ({ ...values, doorStatus: Fridge.DoorStatus.CLOSED, lastUpdated: sentAt }));
          doorStatusUpdatedAt.current = sentAt;
        }
        break;
      case Constants.EVENT_TEMPERATURE_SETTING_UPDATED:
        setFridgeData(values => ({ ...values, temperatureSetting: message.temperature, lastUpdated: sentAt }));
        break;
    }

  }, []);

  useEffect(() => {
    const onUnload = () => {
      removeCookies(cookieForClientId);
      window.removeEventListener('beforeunload', onUnload);
    };
    window.addEventListener('beforeunload', onUnload);
  }, [removeCookies]);

  useEffect(() => {

    if (customerId && fridgeId) {

      const source = new EventSource(`${apiServerHost}/api/v1/fridges/${customerId}/${fridgeId}/events`, { withCredentials: true });
      source.addEventListener('message', (message: MessageEvent<string>) => {
        const data = JSON.parse(message.data);
        handleUpdateFromServer(data.event, data.message);
      });
      source.addEventListener('error', (error) => {
        console.log('Error: ', error);
      });

      return () => {
        source.close();
      }

    } else {

      return () => { /* noop */ };
    }

  }, [customerId, fridgeId, handleUpdateFromServer]);

  const onChangeCustomerId = (customerId: number | null) => {
    resetFridgeData();
    setCustomerId(customerId);
  }

  const onChangeFridgeId = (fridgeId: string) => {
    resetFridgeData();
    setFridgeId(fridgeId);
  }

  const updateTemperatureSetting = async (value: number) => {

    await fetch(`${apiServerHost}/api/v1/fridges/${customerId}/${fridgeId}/tcu`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ temperature: value }),
    });

    setFridgeData(values => ({ ...values, temperatureSetting: value }));
  }

  return (
    <React.Fragment>
      <FridgeSettings customerId={customerId} fridgeId={fridgeId} onChangeCustomerId={onChangeCustomerId} onChangeFridgeId={onChangeFridgeId} />
      {fridgeId && fridgeData.temperatureSetting && fridgeData.temperature && fridgeData.doorStatus &&
        <FridgeItem
          value={{
            id: fridgeId,
            temperatureSetting: fridgeData.temperatureSetting,
            temperature: fridgeData.temperature,
            doorStatus: fridgeData.doorStatus,
            lastUpdated: fridgeData.lastUpdated,
          }}
          onChangeTemperatureSetting={(e) => updateTemperatureSetting(e.value)}
        />
      }
    </React.Fragment>

  );
}
