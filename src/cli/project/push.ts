import type yargs from 'yargs';
import { Client } from '../../client';
import { readConfig } from '../../config';
import {
  readYamlFile,
  readYamlDir,
} from '../../yaml';
import type {
  Me,
  Project,
  ProjectSource,
  ProjectSaveParams,
  Resource,
  ResourceSource,
  ResourceSaveParams,
  Trigger,
  TriggerSource,
  TriggerSaveParams,
} from '../../web3alert';

const command: yargs.CommandModule = {
  command: 'push',
  describe: 'Upload project data to server',
  builder: yargs => {
    return yargs;
  },
  handler: async args => {
    const config = await readConfig();
    
    const client = new Client({
      url: config.url,
      token: config.token,
    });
    
    const me = await client.request<void, Me>({
      method: 'get',
      path: '/v1/me',
    });
    const workspace = me.id;
    
    const project = await readYamlFile<ProjectSource>('project.yml');
    const projectFullname = `${workspace}.${project.name}`;
    
    await client.request<ProjectSaveParams, Project>({
      method: 'put',
      path: `/v2/projects/${projectFullname}`,
      data: {
        name: project.name,
        fullname: `${projectFullname}`,
        workspace,
        public: project.public,
        meta: project.meta,
      },
    });
    
    const prevResources = await client.request<void, Resource[]>({
      method: 'get',
      path: `/v2/resources?project=${projectFullname}`,
    });
    const nextResources = await readYamlDir<ResourceSource>('resources');
    
    for (const resource of nextResources) {
      const { name, ...rest } = resource;
      const project = `${projectFullname}`;
      const fullname = `${project}.${name}`;
      
      await client.request<ResourceSaveParams, Resource>({
        method: 'put',
        path: `/v2/resources/${fullname}`,
        data: {
          name,
          fullname,
          project,
          workspace,
          ...rest,
        },
      });
    }
    
    const resourcesToDelete = prevResources.filter(prevResource => {
      return !nextResources.find(nextResource => (nextResource.name == prevResource.name));
    });
    
    for (const resource of resourcesToDelete) {
      await client.request<void, void>({
        method: 'delete',
        path: `/v2/resources/${resource.fullname}`,
      });
    }
    
    const prevTriggers = await client.request<void, Trigger[]>({
      method: 'get',
      path: `/v2/triggers?project=${projectFullname}`,
    });
    const nextTriggers = await readYamlDir<TriggerSource>('triggers');
    
    for (const trigger of nextTriggers) {
      const { name, ...rest } = trigger;
      const project = `${projectFullname}`;
      const fullname = `${project}.${name}`;

      await client.request<TriggerSaveParams, Trigger>({
        method: 'put',
        path: `/v2/triggers/${fullname}`,
        data: {
          name,
          fullname,
          project,
          workspace,
          ...rest,
        },
      });
    }

    const triggersToDelete = prevTriggers.filter(prevTrigger => {
      return !nextTriggers.find(nextTrigger => (nextTrigger.name == prevTrigger.name));
    });

    for (const trigger of triggersToDelete) {
      await client.request<void, void>({
        method: 'delete',
        path: `/v2/triggers/${trigger.fullname}`,
      });
    }
  },
};

export default command;
