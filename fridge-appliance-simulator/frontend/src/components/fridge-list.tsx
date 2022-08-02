import React from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Fridge } from '../model/fridge';
import { FridgeItem } from './fridge-item';

import './fridge-list.css';

interface SearchParams {
  value: string;
}

export interface FridgeListProps {
  value: Fridge[];
  onSearchChange?: (e: SearchParams) => void;
  onRefresh?: () => void;
  onAddFridge?: () => void;
  onDeleteFridge?: (e: Fridge) => void;
  onChangeDoorStatus?: (e: Fridge) => void;
  onChangeTemperatureSetting?: (e: Fridge) => void;
}

export const FridgeList = (props: FridgeListProps): JSX.Element => {

  const onSearchChange = (e: SearchParams) => {
    props.onSearchChange && props.onSearchChange(e);
  }

  const onRefresh = () => {
    props.onRefresh && props.onRefresh();
  }

  const onAddFridge = () => {
    props.onAddFridge && props.onAddFridge();
  }

  const toolbarLeft = (
    <React.Fragment>
      <span className='p-input-icon-left'>
        <i className="pi pi-search" />
        <InputText placeholder="Search" type="text" onChange={(e) => onSearchChange({ value: e.target.value })} />
      </span>
    </React.Fragment>
  );

  const toolbarRight = (
    <React.Fragment>
      <Button className='p-button-text p-button-plain' icon='pi pi-plus' onClick={() => onAddFridge()} />
      <Button className='p-button-text p-button-plain' icon='pi pi-refresh' onClick={() => onRefresh()} />
    </React.Fragment>
  );

  const fridgeItemTemplate = (item: Fridge): React.ReactNode => {
    return (
      <div className='col-12 md:col-4'>
        <FridgeItem
          value={item}
          onChangeDoorStatus={props.onChangeDoorStatus}
          onChangeTemperatureSetting={props.onChangeTemperatureSetting}
          onDelete={props.onDeleteFridge}
        />
      </div>
    );
  }

  return (
    <div className='fridgelist'>
      <Toolbar left={toolbarLeft} right={toolbarRight} />
      <DataView value={props.value} itemTemplate={fridgeItemTemplate} layout='grid' emptyMessage='No fridge found.' />
    </div>
  );
}
