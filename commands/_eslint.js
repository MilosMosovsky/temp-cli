import path from 'path';
import { CLIEngine } from 'eslint';

import Command from '../models/Command';

class EslintCommand extends Command {
  run() {
    this.usage('plasmatic lint');
    this.addOption('directory', 'lib', 'Directory to scan for lint errors')
    super.run();
    this.log('🔰 Running linter');
    this.progress_ = this.progress('Checking for errors');

    this.eslint_();
  }

  eslint_() {
    const engine = new CLIEngine({
      useEslintrc: false,
      configFile: this.program.getConfig('.eslintrc'),
    });

    const results = engine.executeOnFiles([
      path.resolve(process.cwd(), this.getOption('directory')),
    ]).results;

    let warnings = 0;
    let errors = 0;

    results.forEach((result) => {
      warnings += result.warningCount;
      errors += result.errorCount;
    });

    if (errors > 0) {
      this.progress_.text = `Found ${errors} errors and ${warnings} warnings`;
      this.progress_.fail();

      const formatter = engine.getFormatter('stylish');
      console.log(formatter(results)); // eslint-disable-line no-console
    } else {
      this.progress_.text = `Linting success ${results.length} files were checked`;
      this.progress_.succeed();
    }
  }
}


export default {
  name: 'lint',
  description: '🔰 Check application against linter',
  cb: EslintCommand,
};
