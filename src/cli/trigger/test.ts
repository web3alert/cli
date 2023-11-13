import type yargs from 'yargs';
import { Client } from '../../client';
import { readConfig } from '../../config';
import {
  stringify,
  readYamlFile,
} from '../../yaml';
import type {
  TriggerSource,
  EngineRunPipelineParams,
} from '../../web3alert';

const command: yargs.CommandModule = {
  command: 'test <trigger>',
  describe: 'Run pipeline test',
  builder: yargs => {
    return yargs
      .positional('trigger', {
        type: 'string',
        describe: 'Relative path to trigger source file',
        demandOption: true,
      })
    ;
  },
  handler: async args => {
    const config = await readConfig();
    
    const client = new Client({
      url: config.url,
      token: config.token,
    });
    
    const triggerFilename = args['trigger'] as string;
    const trigger = await readYamlFile<TriggerSource>(triggerFilename);
    
    const source = {
      name: trigger.name,
      nodes: trigger.pipeline.nodes,
    };
    const values = trigger.pipeline.test.values;
    const samples = trigger.pipeline.test.samples;
    
    const result = await client.request<EngineRunPipelineParams, object>({
      method: 'post',
      path: '/v1/engine/run/pipeline',
      data: {
        source,
        values,
        samples,
      },
    });
    
    console.log(stringify(result));
  },
};

export default command;
