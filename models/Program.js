import chalk from 'chalk';
import ejs from 'ejs';
import figlet from 'figlet';
import fs from 'fs';
import inquirer from 'inquirer';
import minimist from 'minimist';
import path from 'path';


/* eslint-disable no-console */
class Program {
  constructor(name, opts, args) {
    this.args = args || minimist(process.argv.slice(2));
    this.name = name;
    this.commands = [];
    this.paths = {};

    this.config(opts);
    return this;
  }

  config(opts = {}) {
    this.config = {
      colors: {
        main: opts.colorMain || chalk.magenta,
      },
    };
  }

  path(name, _path) {
    this.paths[name] = _path;
    return this;
  }

  getConfig(name) {
    return path.resolve(this.paths.configs, name);
  }

  getBluePrint(name) {
    return path.resolve(this.paths.blueprints, `${name}.ejs`);
  }

  async renderBluePrint(name, data = {}, options = {}) {
    const blueprint = this.getBluePrint(name);

    return new Promise((resolve, reject) => {
      ejs.renderFile(blueprint, data, options, (err, str) => {
        if (err) reject(err);
        resolve(str)
      });
    });
  }

  async fileExists(file) {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (stats) reject(stats);
        resolve(false);
      });
    });
  }

  async prompt(msg) {
    return new Promise(resolve => (
      inquirer.prompt([{
        message: msg,
        type: 'confirm',
        name: 'result',
      }]).then(answer => resolve(answer.result))
    ));
  }

  async writeFile(destination, data) {
    const dest = path.resolve(process.cwd(), destination);

    function writeToDisk(_dest, contents) {
      return new Promise((resolve, reject) => {
        fs.writeFile(_dest, contents, (err) => {
          if (err) reject(err);
          console.log(chalk.green(`     ⚡ File generated ${path.basename(destination)}`));
          resolve();
        });
      });
    }

    return new Promise(async () => {
      try {
        await this.fileExists(destination);
        await writeToDisk(dest, data);
      } catch (e) {
        console.log('\n⭕ File already exists ', this.config.colors.main(`${path.basename(destination)}`));
        const overwrite = await this.prompt('   Overwrite ?');
        if (overwrite) {
          await writeToDisk(dest, data);
        }
      }
    });
  }

  version(version) {
    this.version = version;
    return this;
  }

  command(command, description, cb) {
    this.commands.push({
      command,
      description,
      cb,
    });
  }

  banner() {
    this.clearConsole();
    const text = figlet.textSync(this.name, {
      font: 'Small Slant',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });

    text.split('\n').forEach((line) => {
      console.log(this.config.colors.main(`  ${line}`));
    });
    console.log('');
  }

  help() {
    this.banner();
    console.log('  🚀 Available commands: \n')

    this.commands.forEach((cmd) => {
      console.log(`    ✨ ${cmd.command} \t ${cmd.description}`);
    });
    console.log('');
  }

  findCommand() {
    const args = this.args._;
    let commandExists = false;

    if (args.length) {
      const command = args[0];

      this.commands.forEach((cmd) => {
        if (command === cmd.command) {
          // this.clearConsole();
          const app = new cmd.cb(this).run(); // eslint-disable-line new-cap
          commandExists = true;
        }
      });
    }

    return commandExists;
  }

  clearConsole() {
    process.stdout.write('\u001b[2J\u001b[0;0H');
  }

  run() {
    if (!this.findCommand()) {
      this.help();
    }
  }

  log(...args) { // eslint-disable-line class-methods-use-this
    console.log(...args); // eslint-disable-line no-console
  }
}

/* eslint-enable no-console */

export default Program
