import React, { useEffect, useState } from 'react';
import config from '../common/config';
import { FridgeList } from './fridge-list';
import { AddFridgeDialog } from './add-fridge-dialog';
import { Fridge } from '../model/fridge';

const apiServerHost = config.apiServerHost;

export const FridgeManager = () => {

  const [fridges, setFridges] = useState<Fridge[]>([]);
  const [filter, setFilter] = useState<string>();
  const [addDialogVisible, setAddDialogVisible] = useState<boolean>(false);

  useEffect(() => {

    fetchFridgesFromServer();

    const source = new EventSource(`${apiServerHost}/api/v1/fridges/events`);
    source.addEventListener('message', () => {
      fetchFridgesFromServer();
    });
    source.addEventListener('error', (error) => {
      console.log('Error: ', error);
    });

    return () => {
      source.close();
    }
  }, []);

  const fetchFridgesFromServer = () => {
    fetch(`${apiServerHost}/api/v1/fridges`).then(rsp => rsp.json()).then(items => setFridges(items));
  }

  const filterFridges = () => {

    if (!filter) return fridges;

    const filteredFridges: Fridge[] = fridges.filter((fridge: Fridge) => {
      const re = new RegExp(filter, 'ig');
      return re.test(fridge.id) || re.test(fridge.name) || (!!fridge.description && re.test(fridge.description));
    });

    return filteredFridges;
  }

  const createFridge = async (e: { name: string, description?: string }) => {
    const fridge: Omit<Fridge, 'id'> = {
      name: e.name,
      description: e.description,
      temperatureSetting: 3,
      doorStatus: Fridge.DoorStatus.CLOSED,
    };
    await fetch(`${apiServerHost}/api/v1/fridges`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fridge) });
  }

  const updateFridge = async (id: string, fridgePatch: Partial<Fridge>) => {
    await fetch(`${apiServerHost}/api/v1/fridges/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fridgePatch) });
  }

  const deleteFridge = async (id: string) => {
    await fetch(`${apiServerHost}/api/v1/fridges/${id}`, { method: 'DELETE' });
  }

  return (
    <React.Fragment>
      <AddFridgeDialog visible={addDialogVisible} onAdd={createFridge} onHide={() => setAddDialogVisible(false)} />
      <FridgeList
        value={filterFridges()}
        onSearchChange={(e) => setFilter(e.value)}
        onRefresh={fetchFridgesFromServer}
        onAddFridge={() => setAddDialogVisible(true)}
        onDeleteFridge={(e) => deleteFridge(e.id)}
        onChangeDoorStatus={(e) => updateFridge(e.id, { doorStatus: e.doorStatus })}
        onChangeTemperatureSetting={(e) => updateFridge(e.id, { temperatureSetting: e.temperatureSetting })}
      />
    </React.Fragment>

  );
}