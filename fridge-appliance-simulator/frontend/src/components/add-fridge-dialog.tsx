import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'

import './add-fridge-dialog.css';

export interface AddFridgeDialogProps {
  visible: boolean;
  onHide(): void;
  onAdd?(e: { name: string, description?: string }): Promise<void>;
  onCancel?(): Promise<void>;
}

export const AddFridgeDialog = (props: AddFridgeDialogProps): JSX.Element => {

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();

  const reset = () => {
    setName(undefined);
    setDescription(undefined);
  }

  const onCancel = async () => {
    if (props.onCancel) {
      await props.onCancel();
    }
    reset();
    props.onHide();
  }

  const onAdd = async () => {
    if (props.onAdd) {
      await props.onAdd({
        name: name!,
        description: description,
      });
    }
    reset();
    props.onHide();
  }

  const footer = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={onCancel} className="p-button-plain p-button-text" />
      <Button label="Add" icon="pi pi-plus" onClick={onAdd} className="p-button-plain p-button-outlined" />
    </div>
  );

  return (
    <Dialog header="Add Fridge" visible={props.visible} style={{ width: '50vw' }} footer={footer} onHide={onCancel}>
      <div className="grid">
        <div className="field col-12">
          <label htmlFor="name">*Name</label>
          <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" autoFocus />
        </div>
        <div className="field col-12">
          <label htmlFor="description">Description</label>
          <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full" />
        </div>
      </div>
    </Dialog>
  );
}