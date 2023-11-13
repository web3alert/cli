import type yargs from 'yargs';
import test from './test';

const command: yargs.CommandModule = {
  command: 'trigger',
  describe: 'Manage triggers',
  builder: yargs => {
    return yargs
      .command(test)
      .demandCommand()
    ;
  },
  handler: async args => {},
};

export default command;
