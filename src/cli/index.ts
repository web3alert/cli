import yargs from 'yargs';
import project from './project';
import trigger from './trigger';

yargs
  .command(project)
  .command(trigger)
  .demandCommand()
  .help()
  .version()
  .strict(true)
  .wrap(Math.min(100, yargs.terminalWidth()))
  .parse()
;
