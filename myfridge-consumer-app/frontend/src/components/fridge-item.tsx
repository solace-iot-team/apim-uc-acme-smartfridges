import React from 'react';
import { Fieldset } from 'primereact/fieldset';
import { SelectButton } from 'primereact/selectbutton';
import { Fridge } from '../model/fridge';

import './fridge-item.css';

export interface FridgeItemProps {
  value: Fridge;
  onChangeTemperatureSetting?: (e: { value: number; }) => void;
}

export const FridgeItem = (props: FridgeItemProps): JSX.Element => {

  const temperatureSettings = [1, 2, 3, 4, 5];

  const formatLastUpdated = (value: Date | undefined): string => {
    return value ? value.toLocaleString() : '-';
  }

  const onChangeTemperatureSetting = (value: number) => {
    props.onChangeTemperatureSetting && props.onChangeTemperatureSetting({ value });
  }

  return (
    <div className="fridge-item-container card">
      <div className="fridge-item flex flex-column">
        <div className="fridge-item-top flex align-items-center">
          <div className="name">MyFride</div>
        </div>
        <div className="fridge-item-content flex-grow-1">
          <Fieldset legend="Status">
            <div className="grid">
              <label className="col-4">Temperature:</label>
              <div className="col-8">{props.value.temperature.value + " °" + props.value.temperature.unit}</div>
              <label className="col-4">Door:</label>
              <div className="col-8">
                <div className={`door-status-badge status-${props.value.doorStatus}`}>{props.value.doorStatus}</div>
              </div>
            </div>
          </Fieldset>
          <Fieldset legend="Settings">
            <div className="grid align-items-center">
              <label className="col-4">Temperature:</label>
              <div className="col-8">
                <SelectButton
                  value={props.value.temperatureSetting}
                  options={temperatureSettings}
                  onChange={(e) => onChangeTemperatureSetting(e.value)}
                  min={1}
                  max={5}
                />
              </div>
            </div>
          </Fieldset>
        </div>
        <div className="fridge-item-bottom flex align-items-center">
          <div>
            <span>Last Updated:</span>
            <span>{formatLastUpdated(props.value.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}