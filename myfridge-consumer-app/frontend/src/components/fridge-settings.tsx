import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';

import './fridge-settings.css';

export interface FridgeSettingsProps {
  customerId: number | null;
  fridgeId: string;
  onChangeCustomerId?: (customerId: number | null) => void;
  onChangeFridgeId?: (fridgeId: string) => void;
}

export const FridgeSettings = (props: FridgeSettingsProps): JSX.Element => {

  const onChangeCustomerId = (customerId: number | null) => {
    props.onChangeCustomerId && props.onChangeCustomerId(customerId);
  }

  const onChangeFridgeId = (fridgeId: string) => {
    props.onChangeFridgeId && props.onChangeFridgeId(fridgeId);
  }

  return (
    <div className='fridge-settings'>
      <div className="grid">
        <div className="field col-12">
          <label htmlFor="customerId">Customer ID</label>
          <InputNumber
            id="customerId"
            value={props.customerId}
            onChange={(e) => onChangeCustomerId(e.value)}
            mode="decimal"
            useGrouping={false}
            className="w-full"
            autoFocus
          />
        </div>
        <div className="field col-12">
          <label htmlFor="fridgeId">Fridge ID</label>
          <InputText
            id="fridgeId"
            value={props.fridgeId}
            onChange={(e) => onChangeFridgeId(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

}