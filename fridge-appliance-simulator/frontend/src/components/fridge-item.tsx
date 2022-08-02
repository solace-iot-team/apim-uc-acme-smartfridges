import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';
import { Fridge } from '../model/fridge';

import './fridge-item.css';

export interface FridgeItemProps {
  value: Fridge;
  onChangeDoorStatus?: (e: Fridge) => void;
  onChangeTemperatureSetting?: (e: Fridge) => void;
  onDelete?: (e: Fridge) => void;
}

export const FridgeItem = (props: FridgeItemProps): JSX.Element => {

  const menu = useRef<ContextMenu>(null);

  let menuItems: MenuItem[] = [];

  if (props.onChangeDoorStatus) {
    const fridge = props.value;
    if (fridge.doorStatus === 'open') {
      menuItems.push({ label: "Close Door", command: () => props.onChangeDoorStatus!({ ...fridge, doorStatus: Fridge.DoorStatus.CLOSED }) });
    } else {
      menuItems.push({ label: "Open Door", command: () => props.onChangeDoorStatus!({ ...fridge, doorStatus: Fridge.DoorStatus.OPEN }) });
    }
  }

  if (props.onChangeTemperatureSetting) {
    const items: MenuItem[] = [];
    for (let i = 1; i <= 5; i++) {
      items.push({
        label: `Level ${i}`,
        command: () => props.onChangeTemperatureSetting!({ ...props.value, temperatureSetting: i })
      });
    }
    menuItems.push({
      label: "Set Temperature",
      items: items,
    });
  }

  if (props.onDelete) {
    if (menuItems.length > 0) {
      menuItems.push({ separator: true });
    }
    menuItems.push({ label: "Delete", icon: "pi pi-fw pi-trash", command: () => props.onDelete!(props.value) });
  }

  const renderTemperatureSetting = (setting: number) => {
    const children = [];
    for (let i = 0; i < 5; i++) {
      if (i < setting) {
        children.push(<span key={i} className="temperature active">&nbsp;</span>);
      } else {
        children.push(<span key={i} className="temperature">&nbsp;</span>);
      }
    }
    return children;
  }

  return (
    <div className="fridge-item card">
      <div className="fridge-item-top">
        <span className="id">ID: {props.value.id}</span>
        <ContextMenu model={menuItems} ref={menu} />
        <Button icon="pi pi-bars" aria-label="Menu" onClick={(e) => menu.current?.show(e)} className="p-button-text p-button-plain" />
      </div>
      <div className="fridge-item-content">
        <div className="name">{props.value.name}</div>
        <div className="description">{props.value.description ?? ''}</div>
      </div>
      <div className="fridge-item-bottom">
        <div>
          <i title="Temperature Setting" className="pi pi-sun temperature-icon" />
          {renderTemperatureSetting(props.value.temperatureSetting)}
        </div>
        <div className={`door-status-badge status-${props.value.doorStatus}`}>{props.value.doorStatus}</div>
      </div>
    </div>
  );
}