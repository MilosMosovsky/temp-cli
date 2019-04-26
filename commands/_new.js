import Command from '../models/Command';
import fs from 'fs';
import path from 'path';

class NewCommand extends Command {
  run() {
    this.ensureArgument('name', 'Application name');
    this.addOption('directory', './', 'Set directory where to create new application')
    this.usage('plasmatic new <name> [opts]')
    super.run();

    this.log(`🚀 Creating new application [${this.getArgument('name')}]`);
    // this.getOption('directory');

    this.createPackage();
  }

  async createPackage() {
    let directory = this.getOption('directory');

    if (!directory) {
      directory = this.getArgument('name');
    }

    try {
      fs.mkdirSync(`${directory}`);
    } catch(e) {
      if ( e.code != 'EEXIST' ) throw e;
    }
    // const file = 'package.json';
    //
    // const blueprint = await this.program.renderBluePrint(`app/${file}`, {
    //   name: this.getArgument('name'),
    // });
    //
    // await this.program.writeFile('testpackage.json', blueprint);
  }
}

export default {
  name: 'new',
  description: '🚀 Create new Plasmatic application',
  cb: NewCommand,
};
