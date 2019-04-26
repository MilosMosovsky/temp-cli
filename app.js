// import path from 'path';
// import Program from './models/Program';
// import commands from './commands/*'; // eslint-disable-line import/no-unresolved, import/extensions
//
// const app = new Program('plasmatic').version('1.0.0');
//
// Object.keys(commands).forEach((cmd) => {
//   const command = commands[cmd].default;
//   app.command(command.name, command.description, command.cb);
// });
//
// app.path('configs', path.resolve(__dirname, 'configs'));
// app.path('blueprints', path.resolve(__dirname, 'blueprints'));
//
// app.run();

require(process.cwd() + '/module.js')
