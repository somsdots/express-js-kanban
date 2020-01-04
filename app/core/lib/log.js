/* eslint no-console: 0 */

const setDate = (args) => {
  args.unshift(`[Kanban: ${(new Date()).toLocaleString()}]`);
  return args;
};

module.exports = {
  info: (...args) => console.log.apply(null, setDate(args)),

  error: (...args) => console.error.apply(null, setDate(args))
};
