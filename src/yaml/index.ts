import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';

export function parse<T>(str: string): T {
  return yaml.load(str) as T;
}

export function stringify<T>(object: T): string {
  return yaml.dump(object, {
    lineWidth: 100,
    noRefs: true,
    quotingType: '"',
  });
}

export async function readYamlFile<T>(path: string): Promise<T> {
  const data = await fs.readFile(path, { encoding: 'utf8' });
  
  return parse<T>(data);
}

export async function readYamlDir<T>(path: string): Promise<T[]> {
  const objects: T[] = [];
  const filenames = await fs.readdir(path);
  
  for (const filename of filenames) {
    const object = await readYamlFile<T>(`${path}/${filename}`);
    
    objects.push(object);
  }
  
  return objects;
}

export async function writeYamlFile<T>(path: string, object: T): Promise<void> {
  const data = stringify<T>(object);
  
  await fs.writeFile(path, data);
}
