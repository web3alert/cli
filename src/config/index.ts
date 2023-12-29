import untildify from 'untildify';
import { readYamlFile } from '../yaml';

export type Config = {
  url: string;
  token: string;
  workspace: string;
};

export const DEFAULT_PATH: string = '~/.web3alert/config.yml';

export async function readConfig(): Promise<Config> {
  return await readYamlFile<Config>(untildify(DEFAULT_PATH));
}
