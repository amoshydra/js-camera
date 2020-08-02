import { ConfigurationStorage } from './ConfigurationStorage';

export const configStore = new ConfigurationStorage();

export const extractOrGetFirst = <T>(itemOrArrayOfItems: T | T[]): T => Array.isArray(itemOrArrayOfItems) ? itemOrArrayOfItems[0] : itemOrArrayOfItems;
