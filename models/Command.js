import minimist from 'minimist';
import ora from 'ora';

class Command {
  constructor(program) {
    this.args = minimist(process.argv.slice(3));
    this.program = program;
    this.ensuredArguments = [];
    this.options = [];
  }

  run() {
    this.printHelp();
    this.ensureAllArguments();
  }

  ensureAllArguments() {
    this.ensuredArguments.forEach((arg, index) => {
      let isArgumentPassed = this.args._[index]

      if (!isArgumentPassed) {
        this.printUsage(arg);
        process.exit(1);
      }
    })
  }

  printHelp() {
    if (this.args.help) {
      this.printUsage();
      process.exit(0);
    }
  }
  printUsage(missingArgument) {
    if(missingArgument) {
      console.log(`\n  ⛔  [${missingArgument.description}] is missing`)
    }
    console.log('\n  Usage:\n')
    console.log(`      $ ${this.usage}\n`)

    if (this.options.length > 0) {
      console.log('  Options:\n')

      this.options.forEach(option => {
        console.log(`      --${option.name} \t ${option.description}\n`)
      })
    }
  }

  log(...args) { // eslint-disable-line class-methods-use-this
    console.log(...args); // eslint-disable-line no-console
  }

  usage(text) {
    this.usage = text;
  }

  progress(text) { // eslint-disable-line class-methods-use-this
    const progress = ora({
      text,
      column: 5,
    }).start();

    return progress;
  }

  ensureArgument(name, description) {
    this.ensuredArguments.push({name, description});
  }

  addOption(name, defaultValue, description) {
    this.options.push({name, defaultValue, description});
  }

  getArgument(name) {
    let index = 0;
    this.ensuredArguments.forEach((arg, idx) => {
      if (arg.name === name) {
        index = idx;
      }
    })

    return this.args._[index];
  }

  getOption(name) {
    let option = this.args[name];
    if (!option) {
      this.options.forEach(_option => {
        if (_option.name === name) {
          option = _option.defaultValue;
        }
      })
    }

    return option;
  }
}

export default Command;
