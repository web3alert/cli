import fs from 'fs/promises';
import type yargs from 'yargs';
import { Client } from '../../client';
import { readConfig } from '../../config';
import {
  readYamlFile,
  readYamlDir,
} from '../../yaml';
import type {
  Project,
  ProjectSource,
  ProjectSaveParams,
  App,
  AppSource,
  AppSaveParams,
  Blueprint,
  BlueprintSource,
  BlueprintSaveParams,
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
    
    const workspace = config.workspace;
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
        tags: project.tags,
        labels: project.labels,
        meta: project.meta,
      },
    });
    
    let hasApps = false;
    
    try {
      const stat = await fs.stat('apps');
      
      hasApps = stat.isDirectory();
    } catch (err) {
      // nooop
    }
    
    if (hasApps) {
      const prevApps = await client.request<void, App[]>({
        method: 'get',
        path: `/v2/apps?project=${projectFullname}`,
      });
      const nextApps = await readYamlDir<AppSource>('apps');
      
      for (const app of nextApps) {
        const { name, blueprints, ...rest } = app;
        const project = `${projectFullname}`;
        const appFullname = `${project}.${name}`;
        
        await client.request<AppSaveParams, App>({
          method: 'put',
          path: `/v2/apps/${appFullname}`,
          data: {
            name,
            fullname: appFullname,
            project,
            workspace,
            ...rest,
          },
        });
        
        const prevBlueprints = await client.request<void, Blueprint[]>({
          method: 'get',
          path: `/v2/blueprints?app=${appFullname}`,
        });
        const nextBlueprints = blueprints;
        
        for (const blueprint of nextBlueprints) {
          const { name, ...rest } = blueprint;
          const blueprintFullname = `${appFullname}.${name}`;
          
          await client.request<BlueprintSaveParams, Blueprint>({
            method: 'put',
            path: `/v2/blueprints/${blueprintFullname}`,
            data: {
              name,
              fullname: blueprintFullname,
              app: appFullname,
              project,
              workspace,
              ...rest,
            },
          });
        }
        
        const blueprintsToDelete = prevBlueprints.filter(prevBlueprint => {
          return !nextBlueprints.find(nextBlueprint => (nextBlueprint.name == prevBlueprint.name));
        });
        
        for (const blueprint of blueprintsToDelete) {
          await client.request<void, void>({
            method: 'delete',
            path: `/v2/blueprints/${blueprint.fullname}`,
          });
        }
      }
      
      const appsToDelete = prevApps.filter(prevApp => {
        return !nextApps.find(nextApp => (nextApp.name == prevApp.name));
      });
      
      for (const app of appsToDelete) {
        await client.request<void, void>({
          method: 'delete',
          path: `/v2/apps/${app.fullname}`,
        });
      }
    }
    
    let hasResources = false;
    
    try {
      const stat = await fs.stat('resources');
      
      hasResources = stat.isDirectory();
    } catch (err) {
      // nooop
    }
    
    if (hasResources) {
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
    }
    
    let hasTriggers = false;
    
    try {
      const stat = await fs.stat('triggers');
      
      hasTriggers = stat.isDirectory();
    } catch (err) {
      // nooop
    }
    
    if (hasTriggers) {
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
    }
  },
};

export default command;
