// Core module loader - mark files resolved without an error as loaded.
// Files that aren't loaded will be cleared from the cache to allow new require with new dependencies.
module.exports = function(source) {
  return source + '\n' + 'require.cache[module.id].loaded = true;';
};
