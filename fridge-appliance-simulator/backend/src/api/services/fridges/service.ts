import path from 'path';
import fs from 'fs';
import { TypedEmitter } from 'tiny-typed-emitter';
import { v4 as uuid } from 'uuid';
import { ServerError } from '../../middleware/error-handler';
import { Fridge } from '../../../model/fridge';

const database = path.join(__dirname, '../../../../database/fridges.json');

/** The events emitted by the service. */
interface Events {
  created: (id: string, value: Fridge) => void;
  updated: (id: string, value: Fridge) => void;
  deleted: (id: string) => void;
}

/**
 * Service to manage a list of fridges using a file-based database.
 */
class FridgesService extends TypedEmitter<Events> {

  /**
   * Returns a list of all fridges.
   * 
   * @returns The list of fridges.
   */
  async all(): Promise<Fridge[]> {
    return this.#read();
  }

  /**
   * Returns a fridge by ID.
   * 
   * @param id The ID of the fridge to return.
   * 
   * @returns The fridge with the specified ID.
   */
  async byId(id: string): Promise<Fridge> {

    const fridges = await this.#read();
    const fridge = fridges.find((item) => item.id === id);

    if (fridge === undefined) {
      throw new ServerError(404, `The fridge with ID '${id}' is unknown`);
    }

    return fridge;
  }

  /**
   * Creates a new fridge.
   * 
   * @param fridge The fridge to create.
   * 
   * @returns The created fridge.
   */
  async create(fridge: Fridge): Promise<Fridge> {

    fridge.id = fridge.id ?? uuid();

    const fridges = await this.#read();
    if (fridges.find((item) => item.id === fridge.id)) {
      throw new ServerError(422, `A fridge with ID '${fridge.id}' already exists`);
    }

    fridges.push(fridge);
    this.#write(fridges);

    this.emit('created', fridge.id, fridge);
    return fridge;
  }

  /**
   * Updates an existing fridge.
   * 
   * @param id The ID of the fridge to update.
   * @param fridgePatch The information that should be updated.
   * 
   * @returns The updated fridge.
   */
  async update(id: string, fridgePatch: Partial<Fridge>): Promise<Fridge> {

    const fridges = await this.#read();

    const fridgeIndex = fridges.findIndex((item) => item.id === id);
    if (fridgeIndex === -1) {
      throw new ServerError(404, `The fridge with ID '${id}' is unknown`);
    }

    const current = fridges[fridgeIndex];
    const updated = fridges[fridgeIndex] = { ...current, ...fridgePatch, id: id };

    this.#write(fridges);

    this.emit('updated', id, updated);
    return updated;
  }

  /**
   * Deletes an existing fridge.
   * 
   * @param id The ID of the fridge to delete.
   */
  async delete(id: string): Promise<void> {

    const fridges = await this.#read();

    const fridgeIndex = fridges.findIndex((item) => item.id === id);
    if (fridgeIndex === -1) {
      throw new ServerError(404, `The fridge with ID '${id}' is unknown`);
    }

    fridges.splice(fridgeIndex, 1);
    this.#write(fridges);

    this.emit('deleted', id);
  }

  /**
   * Reads the list of fridges the a file-based database.
   * 
   * @returns The list of fridges.
   */
  async #read(): Promise<Fridge[]> {

    let fridges: Fridge[] = [];

    if (fs.existsSync(database)) {
      const data = fs.readFileSync(database);
      fridges = JSON.parse(data.toString());
    }

    return fridges;
  }

  /**
   * Writes a list of fridges to a file-based database.
   * 
   * @param fridges The list of fridges.
   */
  async #write(fridges: Fridge[]): Promise<void> {
    fs.writeFileSync(database, JSON.stringify(fridges));
  }

}

export default new FridgesService();
