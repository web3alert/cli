import type yargs from 'yargs';
import push from './push';

const command: yargs.CommandModule = {
  command: 'project',
  describe: 'Manage projects',
  builder: yargs => {
    return yargs
      .command(push)
      .demandCommand()
    ;
  },
  handler: async args => {},
};

export default command;
