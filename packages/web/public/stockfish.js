/*!
 * Stockfish.js (http://github.com/nmrugg/stockfish.js)
 * License: GPL
 */
var Stockfish;
function INIT_ENGINE() {
  var STOCKFISH = function (console, wasmPath, isInitializer) {
    var Stockfish = (function () {
      var _scriptDir =
        typeof document !== 'undefined' && document.currentScript
          ? document.currentScript.src
          : undefined;
      if (typeof __filename !== 'undefined')
        _scriptDir = _scriptDir || __filename;
      return function (Stockfish) {
        Stockfish = Stockfish || {};

        var Module = typeof Stockfish !== 'undefined' ? Stockfish : {};
        var readyPromiseResolve, readyPromiseReject;
        Module['ready'] = new Promise(function (resolve, reject) {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        (function () {
          var listeners = [];
          var queue = [];
          if (typeof importScripts === 'function') {
            _scriptDir = self.location.origin + self.location.pathname;
          }
          Module.wasmBinaryFile = wasmPath;
          Module.print = function (line) {
            if (listeners.length === 0) {
              console.log(line);
            } else {
              for (var i in listeners) {
                listeners[i](line);
              }
            }
          };
          Module.addMessageListener = function (listener) {
            listeners.push(listener);
          };
          Module.removeMessageListener = function (listener) {
            var idx = listeners.indexOf(listener);
            if (idx >= 0) listeners.splice(idx, 1);
          };
          function poll() {
            var command = queue.shift();
            if (!command) {
              return;
            }
            if (Module.ccall('uci_command', 'number', ['string'], [command])) {
              queue.unshift(command);
            }
            if (queue.length) {
              setTimeout(poll, 10);
            }
          }
          Module.postMessage = function (command) {
            queue.push(command);
          };
          Module.postRun = function () {
            Module.postMessage = function (command) {
              queue.push(command);
              if (queue.length === 1) {
                poll();
              }
            };
            poll();
          };
        })();
        (function () {
          var listeners = [];
          var queue = [];
          if (typeof importScripts === 'function') {
            _scriptDir = self.location.origin + self.location.pathname;
          }
          Module.wasmBinaryFile = wasmPath;
          Module.print = function (line) {
            if (listeners.length === 0) {
              console.log(line);
            } else {
              for (var i in listeners) {
                listeners[i](line);
              }
            }
          };
          Module.addMessageListener = function (listener) {
            listeners.push(listener);
          };
          Module.removeMessageListener = function (listener) {
            var idx = listeners.indexOf(listener);
            if (idx >= 0) listeners.splice(idx, 1);
          };
          function poll() {
            var command = queue.shift();
            if (!command) {
              return;
            }
            if (Module.ccall('uci_command', 'number', ['string'], [command])) {
              queue.unshift(command);
            }
            if (queue.length) {
              setTimeout(poll, 10);
            }
          }
          Module.postMessage = function (command) {
            queue.push(command);
          };
          Module.postRun = function () {
            Module.postMessage = function (command) {
              queue.push(command);
              if (queue.length === 1) {
                poll();
              }
            };
            poll();
          };
        })();
        var moduleOverrides = {};
        var key;
        for (key in Module) {
          if (Module.hasOwnProperty(key)) {
            moduleOverrides[key] = Module[key];
          }
        }
        var arguments_ = [];
        var thisProgram = './this.program';
        var quit_ = function (status, toThrow) {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = false;
        var ENVIRONMENT_IS_WORKER = false;
        var ENVIRONMENT_IS_NODE = false;
        var ENVIRONMENT_IS_SHELL = false;
        ENVIRONMENT_IS_WEB = typeof window === 'object';
        ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
        ENVIRONMENT_IS_NODE =
          typeof process === 'object' &&
          typeof process.versions === 'object' &&
          typeof process.versions.node === 'string';
        ENVIRONMENT_IS_SHELL =
          !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        var ENVIRONMENT_IS_PTHREAD = Module['ENVIRONMENT_IS_PTHREAD'] || false;
        if (ENVIRONMENT_IS_PTHREAD) {
          buffer = Module['buffer'];
        }
        var scriptDirectory = '';
        function locateFile(path) {
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary, setWindowTitle;
        var nodeFS;
        var nodePath;
        if (ENVIRONMENT_IS_NODE) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = require('path').dirname(scriptDirectory) + '/';
          } else {
            scriptDirectory = __dirname + '/';
          }
          read_ = function shell_read(filename, binary) {
            if (!nodeFS) nodeFS = require('fs');
            if (!nodePath) nodePath = require('path');
            filename = nodePath['normalize'](filename);
            return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
          };
          readBinary = function readBinary(filename) {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            assert(ret.buffer);
            return ret;
          };
          if (process['argv'].length > 1) {
            thisProgram = process['argv'][1].replace(/\\/g, '/');
          }
          arguments_ = process['argv'].slice(2);
          process['on']('uncaughtException', function (ex) {
            if (!(ex instanceof ExitStatus)) {
              throw ex;
            }
          });
          process['on']('unhandledRejection', abort);
          quit_ = function (status) {
            process['exit'](status);
          };
          Module['inspect'] = function () {
            return '[Emscripten Module object]';
          };
          var nodeWorkerThreads;
          try {
            nodeWorkerThreads = require('worker_threads');
          } catch (e) {
            console.error(
              'The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?',
            );
            throw e;
          }
          global.Worker = nodeWorkerThreads.Worker;
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.indexOf('blob:') !== 0) {
            scriptDirectory = scriptDirectory.substr(
              0,
              scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/') + 1,
            );
          } else {
            scriptDirectory = '';
          }
          if (ENVIRONMENT_IS_NODE) {
            read_ = function shell_read(filename, binary) {
              if (!nodeFS) nodeFS = require('fs');
              if (!nodePath) nodePath = require('path');
              filename = nodePath['normalize'](filename);
              return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
            };
            readBinary = function readBinary(filename) {
              var ret = read_(filename, true);
              if (!ret.buffer) {
                ret = new Uint8Array(ret);
              }
              assert(ret.buffer);
              return ret;
            };
          } else {
            read_ = function shell_read(url) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = function readBinary(url) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.responseType = 'arraybuffer';
                xhr.send(null);
                return new Uint8Array(xhr.response);
              };
            }
            readAsync = function readAsync(url, onload, onerror) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, true);
              xhr.responseType = 'arraybuffer';
              xhr.onload = function xhr_onload() {
                if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
          setWindowTitle = function (title) {
            document.title = title;
          };
        } else {
        }
        if (ENVIRONMENT_IS_NODE) {
          if (typeof performance === 'undefined') {
            global.performance = require('perf_hooks').performance;
          }
        }
        var out = Module['print'] || console.log.bind(console);
        var err = console.warn.bind(console);
        for (key in moduleOverrides) {
          if (moduleOverrides.hasOwnProperty(key)) {
            Module[key] = moduleOverrides[key];
          }
        }
        moduleOverrides = null;
        function warnOnce(text) {
          if (!warnOnce.shown) warnOnce.shown = {};
          if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            err(text);
          }
        }
        var tempRet0 = 0;
        var setTempRet0 = function (value) {
          tempRet0 = value;
        };
        var Atomics_load = Atomics.load;
        var Atomics_store = Atomics.store;
        var Atomics_compareExchange = Atomics.compareExchange;
        var wasmBinary;
        var noExitRuntime;
        if (typeof WebAssembly !== 'object') {
          abort('no native wasm support detected');
        }
        var wasmMemory;
        var wasmTable = new WebAssembly.Table({
          initial: 475,
          maximum: 475,
          element: 'anyfunc',
        });
        var wasmModule;
        var threadInfoStruct = 0;
        var selfThreadId = 0;
        var ABORT = false;
        var EXITSTATUS = 0;
        function assert(condition, text) {
          if (!condition) {
            abort('Assertion failed: ' + text);
          }
        }
        function getCFunc(ident) {
          var func = Module['_' + ident];
          assert(
            func,
            'Cannot call unknown function ' +
              ident +
              ', make sure it is exported',
          );
          return func;
        }
        function ccall(ident, returnType, argTypes, args, opts) {
          var toC = {
            string: function (str) {
              var ret = 0;
              if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = stackAlloc(len);
                stringToUTF8(str, ret, len);
              }
              return ret;
            },
            array: function (arr) {
              var ret = stackAlloc(arr.length);
              writeArrayToMemory(arr, ret);
              return ret;
            },
          };
          function convertReturnValue(ret) {
            if (returnType === 'string') return UTF8ToString(ret);
            if (returnType === 'boolean') return Boolean(ret);
            return ret;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0) stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var ret = func.apply(null, cArgs);
          ret = convertReturnValue(ret);
          if (stack !== 0) stackRestore(stack);
          return ret;
        }
        function UTF8ArrayToString(heap, idx, maxBytesToRead) {
          var endIdx = idx + maxBytesToRead;
          var str = '';
          while (!(idx >= endIdx)) {
            var u0 = heap[idx++];
            if (!u0) return str;
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode(((u0 & 31) << 6) | u1);
              continue;
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
            } else {
              u0 =
                ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(
                55296 | (ch >> 10),
                56320 | (ch & 1023),
              );
            }
          }
          return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
        }
        function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
            }
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++] = 192 | (u >> 6);
              heap[outIdx++] = 128 | (u & 63);
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++] = 224 | (u >> 12);
              heap[outIdx++] = 128 | ((u >> 6) & 63);
              heap[outIdx++] = 128 | (u & 63);
            } else {
              if (outIdx + 3 >= endIdx) break;
              heap[outIdx++] = 240 | (u >> 18);
              heap[outIdx++] = 128 | ((u >> 12) & 63);
              heap[outIdx++] = 128 | ((u >> 6) & 63);
              heap[outIdx++] = 128 | (u & 63);
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343)
              u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
            if (u <= 127) ++len;
            else if (u <= 2047) len += 2;
            else if (u <= 65535) len += 3;
            else len += 4;
          }
          return len;
        }
        function allocateUTF8OnStack(str) {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8Array(str, HEAP8, ret, size);
          return ret;
        }
        function writeArrayToMemory(array, buffer) {
          HEAP8.set(array, buffer);
        }
        function writeAsciiToMemory(str, buffer, dontAddNull) {
          for (var i = 0; i < str.length; ++i) {
            HEAP8[buffer++ >> 0] = str.charCodeAt(i);
          }
          if (!dontAddNull) HEAP8[buffer >> 0] = 0;
        }
        var WASM_PAGE_SIZE = 65536;
        var buffer,
          HEAP8,
          HEAPU8,
          HEAP16,
          HEAPU16,
          HEAP32,
          HEAPU32,
          HEAPF32,
          HEAPF64;
        function updateGlobalBufferAndViews(buf) {
          buffer = buf;
          Module['HEAP8'] = HEAP8 = new Int8Array(buf);
          Module['HEAP16'] = HEAP16 = new Int16Array(buf);
          Module['HEAP32'] = HEAP32 = new Int32Array(buf);
          Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
          Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
          Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
          Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
          Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
        }
        var STACK_BASE = 6341136,
          STACKTOP = STACK_BASE,
          STACK_MAX = 1098256;
        if (ENVIRONMENT_IS_PTHREAD) {
        }
        var INITIAL_INITIAL_MEMORY = 1073741824;
        if (ENVIRONMENT_IS_PTHREAD) {
          wasmMemory = Module['wasmMemory'];
          buffer = Module['buffer'];
        } else {
          {
            wasmMemory = new WebAssembly.Memory({
              initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
              maximum: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
              shared: true,
            });
            if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
              err(
                'requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag',
              );
              if (ENVIRONMENT_IS_NODE) {
                console.log(
                  '(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)',
                );
              }
              throw Error('bad memory');
            }
          }
        }
        if (wasmMemory) {
          buffer = wasmMemory.buffer;
        }
        INITIAL_INITIAL_MEMORY = buffer.byteLength;
        updateGlobalBufferAndViews(buffer);
        if (!ENVIRONMENT_IS_PTHREAD) {
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;
        if (ENVIRONMENT_IS_PTHREAD) runtimeInitialized = true;
        function preRun() {
          if (ENVIRONMENT_IS_PTHREAD) return;
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = true;
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          if (ENVIRONMENT_IS_PTHREAD) return;
          callRuntimeCallbacks(__ATMAIN__);
        }
        function exitRuntime() {
          if (ENVIRONMENT_IS_PTHREAD) return;
          runtimeExited = true;
        }
        function postRun() {
          if (ENVIRONMENT_IS_PTHREAD) return;
          if (Module['postRun']) {
            if (typeof Module['postRun'] == 'function')
              Module['postRun'] = [Module['postRun']];
            while (Module['postRun'].length) {
              addOnPostRun(Module['postRun'].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function addRunDependency(id) {
          assert(
            !ENVIRONMENT_IS_PTHREAD,
            'addRunDependency cannot be used in a pthread worker',
          );
          runDependencies++;
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        Module['preloadedImages'] = {};
        Module['preloadedAudios'] = {};
        function abort(what) {
          if (Module['onAbort']) {
            Module['onAbort'](what);
          }
          if (ENVIRONMENT_IS_PTHREAD)
            console.error('Pthread aborting at ' + new Error().stack);
          what += '';
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          what =
            'abort(' + what + '). Build with -s ASSERTIONS=1 for more info.';
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        function hasPrefix(str, prefix) {
          return String.prototype.startsWith
            ? str.startsWith(prefix)
            : str.indexOf(prefix) === 0;
        }
        var dataURIPrefix = 'data:application/octet-stream;base64,';
        function isDataURI(filename) {
          return hasPrefix(filename, dataURIPrefix);
        }
        var wasmBinaryFile = 'stockfish.wasm';
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        wasmBinaryFile = Module.wasmBinaryFile || wasmBinaryFile;
        function getBinary() {
          try {
            if (wasmBinary) {
              return new Uint8Array(wasmBinary);
            }
            if (readBinary) {
              return readBinary(wasmBinaryFile);
            } else {
              throw 'both async and sync fetching of the wasm failed';
            }
          } catch (err) {
            abort(err);
          }
        }
        function getBinaryPromise() {
          if (
            !wasmBinary &&
            (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
            typeof fetch === 'function'
          ) {
            return fetch(wasmBinaryFile, { credentials: 'same-origin' })
              .then(function (response) {
                if (!response['ok']) {
                  throw (
                    "failed to load wasm binary file at '" +
                    wasmBinaryFile +
                    "'"
                  );
                }
                return response['arrayBuffer']();
              })
              .catch(function () {
                return getBinary();
              });
          }
          return Promise.resolve().then(getBinary);
        }
        function createWasm() {
          var info = { a: asmLibraryArg };
          function receiveInstance(instance, module) {
            var exports = instance.exports;
            Module['asm'] = exports;
            wasmModule = module;
            if (!ENVIRONMENT_IS_PTHREAD) {
              var numWorkersToLoad = PThread.unusedWorkers.length;
              PThread.unusedWorkers.forEach(function (w) {
                PThread.loadWasmModuleToWorker(w, function () {
                  if (!--numWorkersToLoad)
                    removeRunDependency('wasm-instantiate');
                });
              });
            }
          }
          if (!ENVIRONMENT_IS_PTHREAD) {
            addRunDependency('wasm-instantiate');
          }
          function receiveInstantiatedSource(output) {
            receiveInstance(output['instance'], output['module']);
          }
          function instantiateArrayBuffer(receiver) {
            return getBinaryPromise()
              .then(function (binary) {
                return WebAssembly.instantiate(binary, info);
              })
              .then(receiver, function (reason) {
                err('failed to asynchronously prepare wasm: ' + reason);
                abort(reason);
              });
          }
          function instantiateAsync() {
            if (
              !wasmBinary &&
              typeof WebAssembly.instantiateStreaming === 'function' &&
              !isDataURI(wasmBinaryFile) &&
              typeof fetch === 'function'
            ) {
              fetch(wasmBinaryFile, { credentials: 'same-origin' })
                .then(function (response) {
                  var result = WebAssembly.instantiateStreaming(response, info);
                  return result.then(
                    receiveInstantiatedSource,
                    function (reason) {
                      err('wasm streaming compile failed: ' + reason);
                      err('falling back to ArrayBuffer instantiation');
                      return instantiateArrayBuffer(receiveInstantiatedSource);
                    },
                  );
                })
                .catch(function (e) {
                  setTimeout(function () {
                    throw e;
                  }, 0);
                  console.error(e);
                });
            } else {
              return instantiateArrayBuffer(receiveInstantiatedSource);
            }
          }
          if (Module['instantiateWasm']) {
            try {
              var exports = Module['instantiateWasm'](info, receiveInstance);
              return exports;
            } catch (e) {
              err('Module.instantiateWasm callback failed with error: ' + e);
              return false;
            }
          }
          instantiateAsync();
          return {};
        }
        var ASM_CONSTS = {
          27316: function () {
            throw 'Canceled!';
          },
          27550: function ($0, $1) {
            setTimeout(function () {
              _do_emscripten_dispatch_to_thread($0, $1);
            }, 0);
          },
        };
        function initPthreadsJS() {
          PThread.initRuntime();
        }
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == 'function') {
              callback(Module);
              continue;
            }
            var func = callback.func;
            if (typeof func === 'number') {
              if (callback.arg === undefined) {
                wasmTable.get(func)();
              } else {
                wasmTable.get(func)(callback.arg);
              }
            } else {
              func(callback.arg === undefined ? null : callback.arg);
            }
          }
        }
        function dynCallLegacy(sig, ptr, args) {
          if (args && args.length) {
            return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
          }
          return Module['dynCall_' + sig].call(null, ptr);
        }
        function dynCall(sig, ptr, args) {
          if (sig.indexOf('j') != -1) {
            return dynCallLegacy(sig, ptr, args);
          }
          return wasmTable.get(ptr).apply(null, args);
        }
        Module['dynCall'] = dynCall;
        var __pthread_ptr = 0;
        var __pthread_is_main_runtime_thread = 0;
        var __pthread_is_main_browser_thread = 0;
        function registerPthreadPtr(
          pthreadPtr,
          isMainBrowserThread,
          isMainRuntimeThread,
        ) {
          pthreadPtr = pthreadPtr | 0;
          isMainBrowserThread = isMainBrowserThread | 0;
          isMainRuntimeThread = isMainRuntimeThread | 0;
          __pthread_ptr = pthreadPtr;
          __pthread_is_main_browser_thread = isMainBrowserThread;
          __pthread_is_main_runtime_thread = isMainRuntimeThread;
        }
        Module['registerPthreadPtr'] = registerPthreadPtr;
        var ERRNO_CODES = {
          EPERM: 63,
          ENOENT: 44,
          ESRCH: 71,
          EINTR: 27,
          EIO: 29,
          ENXIO: 60,
          E2BIG: 1,
          ENOEXEC: 45,
          EBADF: 8,
          ECHILD: 12,
          EAGAIN: 6,
          EWOULDBLOCK: 6,
          ENOMEM: 48,
          EACCES: 2,
          EFAULT: 21,
          ENOTBLK: 105,
          EBUSY: 10,
          EEXIST: 20,
          EXDEV: 75,
          ENODEV: 43,
          ENOTDIR: 54,
          EISDIR: 31,
          EINVAL: 28,
          ENFILE: 41,
          EMFILE: 33,
          ENOTTY: 59,
          ETXTBSY: 74,
          EFBIG: 22,
          ENOSPC: 51,
          ESPIPE: 70,
          EROFS: 69,
          EMLINK: 34,
          EPIPE: 64,
          EDOM: 18,
          ERANGE: 68,
          ENOMSG: 49,
          EIDRM: 24,
          ECHRNG: 106,
          EL2NSYNC: 156,
          EL3HLT: 107,
          EL3RST: 108,
          ELNRNG: 109,
          EUNATCH: 110,
          ENOCSI: 111,
          EL2HLT: 112,
          EDEADLK: 16,
          ENOLCK: 46,
          EBADE: 113,
          EBADR: 114,
          EXFULL: 115,
          ENOANO: 104,
          EBADRQC: 103,
          EBADSLT: 102,
          EDEADLOCK: 16,
          EBFONT: 101,
          ENOSTR: 100,
          ENODATA: 116,
          ETIME: 117,
          ENOSR: 118,
          ENONET: 119,
          ENOPKG: 120,
          EREMOTE: 121,
          ENOLINK: 47,
          EADV: 122,
          ESRMNT: 123,
          ECOMM: 124,
          EPROTO: 65,
          EMULTIHOP: 36,
          EDOTDOT: 125,
          EBADMSG: 9,
          ENOTUNIQ: 126,
          EBADFD: 127,
          EREMCHG: 128,
          ELIBACC: 129,
          ELIBBAD: 130,
          ELIBSCN: 131,
          ELIBMAX: 132,
          ELIBEXEC: 133,
          ENOSYS: 52,
          ENOTEMPTY: 55,
          ENAMETOOLONG: 37,
          ELOOP: 32,
          EOPNOTSUPP: 138,
          EPFNOSUPPORT: 139,
          ECONNRESET: 15,
          ENOBUFS: 42,
          EAFNOSUPPORT: 5,
          EPROTOTYPE: 67,
          ENOTSOCK: 57,
          ENOPROTOOPT: 50,
          ESHUTDOWN: 140,
          ECONNREFUSED: 14,
          EADDRINUSE: 3,
          ECONNABORTED: 13,
          ENETUNREACH: 40,
          ENETDOWN: 38,
          ETIMEDOUT: 73,
          EHOSTDOWN: 142,
          EHOSTUNREACH: 23,
          EINPROGRESS: 26,
          EALREADY: 7,
          EDESTADDRREQ: 17,
          EMSGSIZE: 35,
          EPROTONOSUPPORT: 66,
          ESOCKTNOSUPPORT: 137,
          EADDRNOTAVAIL: 4,
          ENETRESET: 39,
          EISCONN: 30,
          ENOTCONN: 53,
          ETOOMANYREFS: 141,
          EUSERS: 136,
          EDQUOT: 19,
          ESTALE: 72,
          ENOTSUP: 138,
          ENOMEDIUM: 148,
          EILSEQ: 25,
          EOVERFLOW: 61,
          ECANCELED: 11,
          ENOTRECOVERABLE: 56,
          EOWNERDEAD: 62,
          ESTRPIPE: 135,
        };
        var __main_thread_futex_wait_address = 0;
        function _emscripten_futex_wake(addr, count) {
          if (addr <= 0 || addr > HEAP8.length || addr & (3 != 0) || count < 0)
            return -28;
          if (count == 0) return 0;
          if (count >= 2147483647) count = Infinity;
          var mainThreadWaitAddress = Atomics.load(
            HEAP32,
            __main_thread_futex_wait_address >> 2,
          );
          var mainThreadWoken = 0;
          if (mainThreadWaitAddress == addr) {
            var loadedAddr = Atomics.compareExchange(
              HEAP32,
              __main_thread_futex_wait_address >> 2,
              mainThreadWaitAddress,
              0,
            );
            if (loadedAddr == mainThreadWaitAddress) {
              --count;
              mainThreadWoken = 1;
              if (count <= 0) return 1;
            }
          }
          var ret = Atomics.notify(HEAP32, addr >> 2, count);
          if (ret >= 0) return ret + mainThreadWoken;
          throw 'Atomics.notify returned an unexpected value ' + ret;
        }
        Module['_emscripten_futex_wake'] = _emscripten_futex_wake;
        function killThread(pthread_ptr) {
          if (ENVIRONMENT_IS_PTHREAD)
            throw 'Internal Error! killThread() can only ever be called from main application thread!';
          if (!pthread_ptr)
            throw 'Internal Error! Null pthread_ptr in killThread!';
          HEAP32[(pthread_ptr + 12) >> 2] = 0;
          var pthread = PThread.pthreads[pthread_ptr];
          pthread.worker.terminate();
          PThread.freeThreadData(pthread);
          PThread.runningWorkers.splice(
            PThread.runningWorkers.indexOf(pthread.worker),
            1,
          );
          pthread.worker.pthread = undefined;
        }
        function cancelThread(pthread_ptr) {
          if (ENVIRONMENT_IS_PTHREAD)
            throw 'Internal Error! cancelThread() can only ever be called from main application thread!';
          if (!pthread_ptr)
            throw 'Internal Error! Null pthread_ptr in cancelThread!';
          var pthread = PThread.pthreads[pthread_ptr];
          pthread.worker.postMessage({ cmd: 'cancel' });
        }
        function cleanupThread(pthread_ptr) {
          if (ENVIRONMENT_IS_PTHREAD)
            throw 'Internal Error! cleanupThread() can only ever be called from main application thread!';
          if (!pthread_ptr)
            throw 'Internal Error! Null pthread_ptr in cleanupThread!';
          HEAP32[(pthread_ptr + 12) >> 2] = 0;
          var pthread = PThread.pthreads[pthread_ptr];
          if (pthread) {
            var worker = pthread.worker;
            PThread.returnWorkerToPool(worker);
          }
        }
        var PThread = {
          MAIN_THREAD_ID: 1,
          mainThreadInfo: { schedPolicy: 0, schedPrio: 0 },
          unusedWorkers: [],
          runningWorkers: [],
          initMainThreadBlock: function () {
            var pthreadPoolSize = 1;
            for (var i = 0; i < pthreadPoolSize; ++i) {
              PThread.allocateUnusedWorker();
            }
          },
          initRuntime: function () {
            PThread.mainThreadBlock = _malloc(232);
            for (var i = 0; i < 232 / 4; ++i)
              HEAPU32[PThread.mainThreadBlock / 4 + i] = 0;
            HEAP32[(PThread.mainThreadBlock + 12) >> 2] =
              PThread.mainThreadBlock;
            var headPtr = PThread.mainThreadBlock + 156;
            HEAP32[headPtr >> 2] = headPtr;
            var tlsMemory = _malloc(512);
            for (var i = 0; i < 128; ++i) HEAPU32[tlsMemory / 4 + i] = 0;
            Atomics.store(
              HEAPU32,
              (PThread.mainThreadBlock + 104) >> 2,
              tlsMemory,
            );
            Atomics.store(
              HEAPU32,
              (PThread.mainThreadBlock + 40) >> 2,
              PThread.mainThreadBlock,
            );
            Atomics.store(HEAPU32, (PThread.mainThreadBlock + 44) >> 2, 42);
            __main_thread_futex_wait_address = _malloc(4);
            registerPthreadPtr(
              PThread.mainThreadBlock,
              !ENVIRONMENT_IS_WORKER,
              1,
            );
            _emscripten_register_main_browser_thread_id(
              PThread.mainThreadBlock,
            );
          },
          initWorker: function () {},
          pthreads: {},
          threadExitHandlers: [],
          setThreadStatus: function () {},
          runExitHandlers: function () {
            while (PThread.threadExitHandlers.length > 0) {
              PThread.threadExitHandlers.pop()();
            }
            if (ENVIRONMENT_IS_PTHREAD && threadInfoStruct)
              ___pthread_tsd_run_dtors();
          },
          threadExit: function (exitCode) {
            var tb = _pthread_self();
            if (tb) {
              Atomics.store(HEAPU32, (tb + 4) >> 2, exitCode);
              Atomics.store(HEAPU32, (tb + 0) >> 2, 1);
              Atomics.store(HEAPU32, (tb + 60) >> 2, 1);
              Atomics.store(HEAPU32, (tb + 64) >> 2, 0);
              PThread.runExitHandlers();
              _emscripten_futex_wake(tb + 0, 2147483647);
              registerPthreadPtr(0, 0, 0);
              threadInfoStruct = 0;
              if (ENVIRONMENT_IS_PTHREAD) {
                postMessage({ cmd: 'exit' });
              }
            }
          },
          threadCancel: function () {
            PThread.runExitHandlers();
            Atomics.store(HEAPU32, (threadInfoStruct + 4) >> 2, -1);
            Atomics.store(HEAPU32, (threadInfoStruct + 0) >> 2, 1);
            _emscripten_futex_wake(threadInfoStruct + 0, 2147483647);
            threadInfoStruct = selfThreadId = 0;
            registerPthreadPtr(0, 0, 0);
            postMessage({ cmd: 'cancelDone' });
          },
          terminateAllThreads: function () {
            for (var t in PThread.pthreads) {
              var pthread = PThread.pthreads[t];
              if (pthread && pthread.worker) {
                PThread.returnWorkerToPool(pthread.worker);
              }
            }
            PThread.pthreads = {};
            for (var i = 0; i < PThread.unusedWorkers.length; ++i) {
              var worker = PThread.unusedWorkers[i];
              worker.terminate();
            }
            PThread.unusedWorkers = [];
            for (var i = 0; i < PThread.runningWorkers.length; ++i) {
              var worker = PThread.runningWorkers[i];
              var pthread = worker.pthread;
              PThread.freeThreadData(pthread);
              worker.terminate();
            }
            PThread.runningWorkers = [];
          },
          freeThreadData: function (pthread) {
            if (!pthread) return;
            if (pthread.threadInfoStruct) {
              var tlsMemory = HEAP32[(pthread.threadInfoStruct + 104) >> 2];
              HEAP32[(pthread.threadInfoStruct + 104) >> 2] = 0;
              _free(tlsMemory);
              _free(pthread.threadInfoStruct);
            }
            pthread.threadInfoStruct = 0;
            if (pthread.allocatedOwnStack && pthread.stackBase)
              _free(pthread.stackBase);
            pthread.stackBase = 0;
            if (pthread.worker) pthread.worker.pthread = null;
          },
          returnWorkerToPool: function (worker) {
            delete PThread.pthreads[worker.pthread.thread];
            PThread.unusedWorkers.push(worker);
            PThread.runningWorkers.splice(
              PThread.runningWorkers.indexOf(worker),
              1,
            );
            PThread.freeThreadData(worker.pthread);
            worker.pthread = undefined;
          },
          receiveObjectTransfer: function (data) {},
          loadWasmModuleToWorker: function (worker, onFinishedLoading) {
            worker.onmessage = function (e) {
              var d = e['data'];
              var cmd = d['cmd'];
              if (worker.pthread)
                PThread.currentProxiedOperationCallerThread =
                  worker.pthread.threadInfoStruct;
              if (d['targetThread'] && d['targetThread'] != _pthread_self()) {
                var thread = PThread.pthreads[d.targetThread];
                if (thread) {
                  thread.worker.postMessage(e.data, d['transferList']);
                } else {
                  console.error(
                    'Internal error! Worker sent a message "' +
                      cmd +
                      '" to target pthread ' +
                      d['targetThread'] +
                      ', but that thread no longer exists!',
                  );
                }
                PThread.currentProxiedOperationCallerThread = undefined;
                return;
              }
              if (cmd === 'processQueuedMainThreadWork') {
                _emscripten_main_thread_process_queued_calls();
              } else if (cmd === 'spawnThread') {
                spawnThread(e.data);
              } else if (cmd === 'cleanupThread') {
                cleanupThread(d['thread']);
              } else if (cmd === 'killThread') {
                killThread(d['thread']);
              } else if (cmd === 'cancelThread') {
                cancelThread(d['thread']);
              } else if (cmd === 'loaded') {
                worker.loaded = true;
                if (onFinishedLoading) onFinishedLoading(worker);
                if (worker.runPthread) {
                  worker.runPthread();
                  delete worker.runPthread;
                }
              } else if (cmd === 'print') {
                out('Thread ' + d['threadId'] + ': ' + d['text']);
              } else if (cmd === 'printErr') {
                err('Thread ' + d['threadId'] + ': ' + d['text']);
              } else if (cmd === 'alert') {
                alert('Thread ' + d['threadId'] + ': ' + d['text']);
              } else if (cmd === 'exit') {
                var detached =
                  worker.pthread &&
                  Atomics.load(HEAPU32, (worker.pthread.thread + 68) >> 2);
                if (detached) {
                  PThread.returnWorkerToPool(worker);
                }
              } else if (cmd === 'cancelDone') {
                PThread.returnWorkerToPool(worker);
              } else if (cmd === 'objectTransfer') {
                PThread.receiveObjectTransfer(e.data);
              } else if (e.data.target === 'setimmediate') {
                worker.postMessage(e.data);
              } else {
                err('worker sent an unknown command ' + cmd);
              }
              PThread.currentProxiedOperationCallerThread = undefined;
            };
            worker.onerror = function (e) {
              err(
                'pthread sent an error! ' +
                  e.filename +
                  ':' +
                  e.lineno +
                  ': ' +
                  e.message,
              );
            };
            if (ENVIRONMENT_IS_NODE) {
              worker.on('message', function (data) {
                worker.onmessage({ data: data });
              });
              worker.on('error', function (data) {
                worker.onerror(data);
              });
              worker.on('exit', function (data) {});
            }
            worker.postMessage({
              cmd: 'load',
              urlOrBlob: Module['mainScriptUrlOrBlob'] || _scriptDir,
              wasmMemory: wasmMemory,
              wasmModule: wasmModule,
            });
          },
          allocateUnusedWorker: function () {
            var pthreadMainJs;
            if (ENVIRONMENT_IS_NODE) pthreadMainJs = __filename;
            else
              pthreadMainJs =
                self.location.origin +
                self.location.pathname +
                '#' +
                (wasmPath || wasmBinaryFile) +
                ',1';
            PThread.unusedWorkers.push(new Worker(pthreadMainJs));
          },
          getNewWorker: function () {
            if (PThread.unusedWorkers.length == 0) {
              PThread.allocateUnusedWorker();
              PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
            }
            if (PThread.unusedWorkers.length > 0)
              return PThread.unusedWorkers.pop();
            else return null;
          },
          busySpinWait: function (msecs) {
            var t = performance.now() + msecs;
            while (performance.now() < t) {}
          },
        };
        function establishStackSpace(stackTop, stackMax) {
          STACK_BASE = STACKTOP = stackTop;
          STACK_MAX = stackMax;
          stackRestore(stackTop);
        }
        Module['establishStackSpace'] = establishStackSpace;
        function getNoExitRuntime() {
          return noExitRuntime;
        }
        Module['getNoExitRuntime'] = getNoExitRuntime;
        function ___assert_fail(condition, filename, line, func) {
          abort(
            'Assertion failed: ' +
              UTF8ToString(condition) +
              ', at: ' +
              [
                filename ? UTF8ToString(filename) : 'unknown filename',
                line,
                func ? UTF8ToString(func) : 'unknown function',
              ],
          );
        }
        var _emscripten_get_now;
        if (ENVIRONMENT_IS_NODE) {
          _emscripten_get_now = function () {
            var t = process['hrtime']();
            return t[0] * 1e3 + t[1] / 1e6;
          };
        } else if (ENVIRONMENT_IS_PTHREAD) {
          _emscripten_get_now = function () {
            return performance.now() - Module['__performance_now_clock_drift'];
          };
        } else
          _emscripten_get_now = function () {
            return performance.now();
          };
        var _emscripten_get_now_is_monotonic = true;
        function setErrNo(value) {
          HEAP32[___errno_location() >> 2] = value;
          return value;
        }
        function _clock_gettime(clk_id, tp) {
          var now;
          if (clk_id === 0) {
            now = Date.now();
          } else if (
            (clk_id === 1 || clk_id === 4) &&
            _emscripten_get_now_is_monotonic
          ) {
            now = _emscripten_get_now();
          } else {
            setErrNo(28);
            return -1;
          }
          HEAP32[tp >> 2] = (now / 1e3) | 0;
          HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
          return 0;
        }
        function _atexit(func, arg) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(1, 1, func, arg);
        }
        var PATH = {
          splitPath: function (filename) {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1);
          },
          normalizeArray: function (parts, allowAboveRoot) {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === '.') {
                parts.splice(i, 1);
              } else if (last === '..') {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up; up--) {
                parts.unshift('..');
              }
            }
            return parts;
          },
          normalize: function (path) {
            var isAbsolute = path.charAt(0) === '/',
              trailingSlash = path.substr(-1) === '/';
            path = PATH.normalizeArray(
              path.split('/').filter(function (p) {
                return !!p;
              }),
              !isAbsolute,
            ).join('/');
            if (!path && !isAbsolute) {
              path = '.';
            }
            if (path && trailingSlash) {
              path += '/';
            }
            return (isAbsolute ? '/' : '') + path;
          },
          dirname: function (path) {
            var result = PATH.splitPath(path),
              root = result[0],
              dir = result[1];
            if (!root && !dir) {
              return '.';
            }
            if (dir) {
              dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
          },
          basename: function (path) {
            if (path === '/') return '/';
            path = PATH.normalize(path);
            path = path.replace(/\/$/, '');
            var lastSlash = path.lastIndexOf('/');
            if (lastSlash === -1) return path;
            return path.substr(lastSlash + 1);
          },
          extname: function (path) {
            return PATH.splitPath(path)[3];
          },
          join: function () {
            var paths = Array.prototype.slice.call(arguments, 0);
            return PATH.normalize(paths.join('/'));
          },
          join2: function (l, r) {
            return PATH.normalize(l + '/' + r);
          },
        };
        var SYSCALLS = {
          mappings: {},
          buffers: [null, [], []],
          printChar: function (stream, curr) {
            var buffer = SYSCALLS.buffers[stream];
            if (curr === 0 || curr === 10) {
              (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
              buffer.length = 0;
            } else {
              buffer.push(curr);
            }
          },
          varargs: undefined,
          get: function () {
            SYSCALLS.varargs += 4;
            var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
            return ret;
          },
          getStr: function (ptr) {
            var ret = UTF8ToString(ptr);
            return ret;
          },
          get64: function (low, high) {
            return low;
          },
        };
        function ___sys_fcntl64(fd, cmd, varargs) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(2, 1, fd, cmd, varargs);
          SYSCALLS.varargs = varargs;
          return 0;
        }
        function ___sys_ioctl(fd, op, varargs) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(3, 1, fd, op, varargs);
          SYSCALLS.varargs = varargs;
          return 0;
        }
        function ___sys_open(path, flags, varargs) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(
              4,
              1,
              path,
              flags,
              varargs,
            );
          SYSCALLS.varargs = varargs;
        }
        function __emscripten_fetch_free(id) {
          delete Fetch.xhrs[id - 1];
        }
        function __emscripten_notify_thread_queue(
          targetThreadId,
          mainThreadId,
        ) {
          if (targetThreadId == mainThreadId) {
            postMessage({ cmd: 'processQueuedMainThreadWork' });
          } else if (ENVIRONMENT_IS_PTHREAD) {
            postMessage({
              targetThread: targetThreadId,
              cmd: 'processThreadQueue',
            });
          } else {
            var pthread = PThread.pthreads[targetThreadId];
            var worker = pthread && pthread.worker;
            if (!worker) {
              return;
            }
            worker.postMessage({ cmd: 'processThreadQueue' });
          }
          return 1;
        }
        function _abort() {
          abort();
        }
        function _emscripten_asm_const_int(code, sigPtr, argbuf) {
          var args = readAsmConstArgs(sigPtr, argbuf);
          return ASM_CONSTS[code].apply(null, args);
        }
        function _emscripten_check_blocking_allowed() {
          if (ENVIRONMENT_IS_NODE) return;
          if (ENVIRONMENT_IS_WORKER) return;
          warnOnce(
            'Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread',
          );
        }
        function _emscripten_conditional_set_current_thread_status(
          expectedStatus,
          newStatus,
        ) {
          expectedStatus = expectedStatus | 0;
          newStatus = newStatus | 0;
        }
        function _emscripten_futex_wait(addr, val, timeout) {
          if (addr <= 0 || addr > HEAP8.length || addr & (3 != 0)) return -28;
          if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_WORKER) {
            var ret = Atomics.wait(HEAP32, addr >> 2, val, timeout);
            if (ret === 'timed-out') return -73;
            if (ret === 'not-equal') return -6;
            if (ret === 'ok') return 0;
            throw 'Atomics.wait returned an unexpected value ' + ret;
          } else {
            var loadedVal = Atomics.load(HEAP32, addr >> 2);
            if (val != loadedVal) return -6;
            var tNow = performance.now();
            var tEnd = tNow + timeout;
            Atomics.store(HEAP32, __main_thread_futex_wait_address >> 2, addr);
            var ourWaitAddress = addr;
            while (addr == ourWaitAddress) {
              tNow = performance.now();
              if (tNow > tEnd) {
                return -73;
              }
              _emscripten_main_thread_process_queued_calls();
              addr = Atomics.load(
                HEAP32,
                __main_thread_futex_wait_address >> 2,
              );
            }
            return 0;
          }
        }
        function _emscripten_is_main_browser_thread() {
          return __pthread_is_main_browser_thread | 0;
        }
        function _emscripten_is_main_runtime_thread() {
          return __pthread_is_main_runtime_thread | 0;
        }
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.copyWithin(dest, src, src + num);
        }
        function _emscripten_proxy_to_main_thread_js(index, sync) {
          var numCallArgs = arguments.length - 2;
          var stack = stackSave();
          var args = stackAlloc(numCallArgs * 8);
          var b = args >> 3;
          for (var i = 0; i < numCallArgs; i++) {
            HEAPF64[b + i] = arguments[2 + i];
          }
          var ret = _emscripten_run_in_main_runtime_thread_js(
            index,
            numCallArgs,
            args,
            sync,
          );
          stackRestore(stack);
          return ret;
        }
        var _emscripten_receive_on_main_thread_js_callArgs = [];
        var readAsmConstArgsArray = [];
        function readAsmConstArgs(sigPtr, buf) {
          readAsmConstArgsArray.length = 0;
          var ch;
          buf >>= 2;
          while ((ch = HEAPU8[sigPtr++])) {
            var double = ch < 105;
            if (double && buf & 1) buf++;
            readAsmConstArgsArray.push(
              double ? HEAPF64[buf++ >> 1] : HEAP32[buf],
            );
            ++buf;
          }
          return readAsmConstArgsArray;
        }
        function _emscripten_receive_on_main_thread_js(
          index,
          numCallArgs,
          args,
        ) {
          _emscripten_receive_on_main_thread_js_callArgs.length = numCallArgs;
          var b = args >> 3;
          for (var i = 0; i < numCallArgs; i++) {
            _emscripten_receive_on_main_thread_js_callArgs[i] = HEAPF64[b + i];
          }
          var isEmAsmConst = index < 0;
          var func = !isEmAsmConst
            ? proxiedFunctionTable[index]
            : ASM_CONSTS[-index - 1];
          return func.apply(
            null,
            _emscripten_receive_on_main_thread_js_callArgs,
          );
        }
        function abortOnCannotGrowMemory(requestedSize) {
          abort('OOM');
        }
        function _emscripten_resize_heap(requestedSize) {
          requestedSize = requestedSize >>> 0;
          abortOnCannotGrowMemory(requestedSize);
        }
        var JSEvents = {
          inEventHandler: 0,
          removeAllEventListeners: function () {
            for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
              JSEvents._removeHandler(i);
            }
            JSEvents.eventHandlers = [];
            JSEvents.deferredCalls = [];
          },
          registerRemoveEventListeners: function () {
            if (!JSEvents.removeEventListenersRegistered) {
              __ATEXIT__.push(JSEvents.removeAllEventListeners);
              JSEvents.removeEventListenersRegistered = true;
            }
          },
          deferredCalls: [],
          deferCall: function (targetFunction, precedence, argsList) {
            function arraysHaveEqualContent(arrA, arrB) {
              if (arrA.length != arrB.length) return false;
              for (var i in arrA) {
                if (arrA[i] != arrB[i]) return false;
              }
              return true;
            }
            for (var i in JSEvents.deferredCalls) {
              var call = JSEvents.deferredCalls[i];
              if (
                call.targetFunction == targetFunction &&
                arraysHaveEqualContent(call.argsList, argsList)
              ) {
                return;
              }
            }
            JSEvents.deferredCalls.push({
              targetFunction: targetFunction,
              precedence: precedence,
              argsList: argsList,
            });
            JSEvents.deferredCalls.sort(function (x, y) {
              return x.precedence < y.precedence;
            });
          },
          removeDeferredCalls: function (targetFunction) {
            for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
              if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
                JSEvents.deferredCalls.splice(i, 1);
                --i;
              }
            }
          },
          canPerformEventHandlerRequests: function () {
            return (
              JSEvents.inEventHandler &&
              JSEvents.currentEventHandler.allowsDeferredCalls
            );
          },
          runDeferredCalls: function () {
            if (!JSEvents.canPerformEventHandlerRequests()) {
              return;
            }
            for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
              var call = JSEvents.deferredCalls[i];
              JSEvents.deferredCalls.splice(i, 1);
              --i;
              call.targetFunction.apply(null, call.argsList);
            }
          },
          eventHandlers: [],
          removeAllHandlersOnTarget: function (target, eventTypeString) {
            for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
              if (
                JSEvents.eventHandlers[i].target == target &&
                (!eventTypeString ||
                  eventTypeString == JSEvents.eventHandlers[i].eventTypeString)
              ) {
                JSEvents._removeHandler(i--);
              }
            }
          },
          _removeHandler: function (i) {
            var h = JSEvents.eventHandlers[i];
            h.target.removeEventListener(
              h.eventTypeString,
              h.eventListenerFunc,
              h.useCapture,
            );
            JSEvents.eventHandlers.splice(i, 1);
          },
          registerOrRemoveHandler: function (eventHandler) {
            var jsEventHandler = function jsEventHandler(event) {
              ++JSEvents.inEventHandler;
              JSEvents.currentEventHandler = eventHandler;
              JSEvents.runDeferredCalls();
              eventHandler.handlerFunc(event);
              JSEvents.runDeferredCalls();
              --JSEvents.inEventHandler;
            };
            if (eventHandler.callbackfunc) {
              eventHandler.eventListenerFunc = jsEventHandler;
              eventHandler.target.addEventListener(
                eventHandler.eventTypeString,
                jsEventHandler,
                eventHandler.useCapture,
              );
              JSEvents.eventHandlers.push(eventHandler);
              JSEvents.registerRemoveEventListeners();
            } else {
              for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                if (
                  JSEvents.eventHandlers[i].target == eventHandler.target &&
                  JSEvents.eventHandlers[i].eventTypeString ==
                    eventHandler.eventTypeString
                ) {
                  JSEvents._removeHandler(i--);
                }
              }
            }
          },
          queueEventHandlerOnThread_iiii: function (
            targetThread,
            eventHandlerFunc,
            eventTypeId,
            eventData,
            userData,
          ) {
            var stackTop = stackSave();
            var varargs = stackAlloc(12);
            HEAP32[varargs >> 2] = eventTypeId;
            HEAP32[(varargs + 4) >> 2] = eventData;
            HEAP32[(varargs + 8) >> 2] = userData;
            __emscripten_call_on_thread(
              0,
              targetThread,
              637534208,
              eventHandlerFunc,
              eventData,
              varargs,
            );
            stackRestore(stackTop);
          },
          getTargetThreadForEventCallback: function (targetThread) {
            switch (targetThread) {
              case 1:
                return 0;
              case 2:
                return PThread.currentProxiedOperationCallerThread;
              default:
                return targetThread;
            }
          },
          getNodeNameForTarget: function (target) {
            if (!target) return '';
            if (target == window) return '#window';
            if (target == screen) return '#screen';
            return target && target.nodeName ? target.nodeName : '';
          },
          fullscreenEnabled: function () {
            return (
              document.fullscreenEnabled || document.webkitFullscreenEnabled
            );
          },
        };
        function stringToNewUTF8(jsString) {
          var length = lengthBytesUTF8(jsString) + 1;
          var cString = _malloc(length);
          stringToUTF8(jsString, cString, length);
          return cString;
        }
        function _emscripten_set_offscreencanvas_size_on_target_thread_js(
          targetThread,
          targetCanvas,
          width,
          height,
        ) {
          var stackTop = stackSave();
          var varargs = stackAlloc(12);
          var targetCanvasPtr = 0;
          if (targetCanvas) {
            targetCanvasPtr = stringToNewUTF8(targetCanvas);
          }
          HEAP32[varargs >> 2] = targetCanvasPtr;
          HEAP32[(varargs + 4) >> 2] = width;
          HEAP32[(varargs + 8) >> 2] = height;
          __emscripten_call_on_thread(
            0,
            targetThread,
            657457152,
            0,
            targetCanvasPtr,
            varargs,
          );
          stackRestore(stackTop);
        }
        function _emscripten_set_offscreencanvas_size_on_target_thread(
          targetThread,
          targetCanvas,
          width,
          height,
        ) {
          targetCanvas = targetCanvas ? UTF8ToString(targetCanvas) : '';
          _emscripten_set_offscreencanvas_size_on_target_thread_js(
            targetThread,
            targetCanvas,
            width,
            height,
          );
        }
        function maybeCStringToJsString(cString) {
          return cString > 2 ? UTF8ToString(cString) : cString;
        }
        var specialHTMLTargets = [
          0,
          typeof document !== 'undefined' ? document : 0,
          typeof window !== 'undefined' ? window : 0,
        ];
        function findEventTarget(target) {
          target = maybeCStringToJsString(target);
          var domElement =
            specialHTMLTargets[target] ||
            (typeof document !== 'undefined'
              ? document.querySelector(target)
              : undefined);
          return domElement;
        }
        function findCanvasEventTarget(target) {
          return findEventTarget(target);
        }
        function _emscripten_set_canvas_element_size_calling_thread(
          target,
          width,
          height,
        ) {
          var canvas = findCanvasEventTarget(target);
          if (!canvas) return -4;
          if (canvas.canvasSharedPtr) {
            HEAP32[canvas.canvasSharedPtr >> 2] = width;
            HEAP32[(canvas.canvasSharedPtr + 4) >> 2] = height;
          }
          if (canvas.offscreenCanvas || !canvas.controlTransferredOffscreen) {
            if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
            var autoResizeViewport = false;
            if (canvas.GLctxObject && canvas.GLctxObject.GLctx) {
              var prevViewport = canvas.GLctxObject.GLctx.getParameter(2978);
              autoResizeViewport =
                prevViewport[0] === 0 &&
                prevViewport[1] === 0 &&
                prevViewport[2] === canvas.width &&
                prevViewport[3] === canvas.height;
            }
            canvas.width = width;
            canvas.height = height;
            if (autoResizeViewport) {
              canvas.GLctxObject.GLctx.viewport(0, 0, width, height);
            }
          } else if (canvas.canvasSharedPtr) {
            var targetThread = HEAP32[(canvas.canvasSharedPtr + 8) >> 2];
            _emscripten_set_offscreencanvas_size_on_target_thread(
              targetThread,
              target,
              width,
              height,
            );
            return 1;
          } else {
            return -4;
          }
          return 0;
        }
        function _emscripten_set_canvas_element_size_main_thread(
          target,
          width,
          height,
        ) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(
              5,
              1,
              target,
              width,
              height,
            );
          return _emscripten_set_canvas_element_size_calling_thread(
            target,
            width,
            height,
          );
        }
        function _emscripten_set_canvas_element_size(target, width, height) {
          var canvas = findCanvasEventTarget(target);
          if (canvas) {
            return _emscripten_set_canvas_element_size_calling_thread(
              target,
              width,
              height,
            );
          } else {
            return _emscripten_set_canvas_element_size_main_thread(
              target,
              width,
              height,
            );
          }
        }
        function _emscripten_set_current_thread_status(newStatus) {
          newStatus = newStatus | 0;
        }
        var Fetch = {
          xhrs: [],
          setu64: function (addr, val) {
            HEAPU32[addr >> 2] = val;
            HEAPU32[(addr + 4) >> 2] = (val / 4294967296) | 0;
          },
          openDatabase: function (dbname, dbversion, onsuccess, onerror) {
            try {
              var openRequest = indexedDB.open(dbname, dbversion);
            } catch (e) {
              return onerror(e);
            }
            openRequest.onupgradeneeded = function (event) {
              var db = event.target.result;
              if (db.objectStoreNames.contains('FILES')) {
                db.deleteObjectStore('FILES');
              }
              db.createObjectStore('FILES');
            };
            openRequest.onsuccess = function (event) {
              onsuccess(event.target.result);
            };
            openRequest.onerror = function (error) {
              onerror(error);
            };
          },
          staticInit: function () {
            var isMainThread = true;
            var onsuccess = function (db) {
              Fetch.dbInstance = db;
              if (isMainThread) {
                removeRunDependency('library_fetch_init');
              }
            };
            var onerror = function () {
              Fetch.dbInstance = false;
              if (isMainThread) {
                removeRunDependency('library_fetch_init');
              }
            };
            Fetch.openDatabase('emscripten_filesystem', 1, onsuccess, onerror);
            if (
              typeof ENVIRONMENT_IS_FETCH_WORKER === 'undefined' ||
              !ENVIRONMENT_IS_FETCH_WORKER
            )
              addRunDependency('library_fetch_init');
          },
        };
        function __emscripten_fetch_xhr(
          fetch,
          onsuccess,
          onerror,
          onprogress,
          onreadystatechange,
        ) {
          var url = HEAPU32[(fetch + 8) >> 2];
          if (!url) {
            onerror(fetch, 0, 'no url specified!');
            return;
          }
          var url_ = UTF8ToString(url);
          var fetch_attr = fetch + 112;
          var requestMethod = UTF8ToString(fetch_attr);
          if (!requestMethod) requestMethod = 'GET';
          var userData = HEAPU32[(fetch + 4) >> 2];
          var fetchAttributes = HEAPU32[(fetch_attr + 52) >> 2];
          var timeoutMsecs = HEAPU32[(fetch_attr + 56) >> 2];
          var withCredentials = !!HEAPU32[(fetch_attr + 60) >> 2];
          var destinationPath = HEAPU32[(fetch_attr + 64) >> 2];
          var userName = HEAPU32[(fetch_attr + 68) >> 2];
          var password = HEAPU32[(fetch_attr + 72) >> 2];
          var requestHeaders = HEAPU32[(fetch_attr + 76) >> 2];
          var overriddenMimeType = HEAPU32[(fetch_attr + 80) >> 2];
          var dataPtr = HEAPU32[(fetch_attr + 84) >> 2];
          var dataLength = HEAPU32[(fetch_attr + 88) >> 2];
          var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
          var fetchAttrStreamData = !!(fetchAttributes & 2);
          var fetchAttrSynchronous = !!(fetchAttributes & 64);
          var userNameStr = userName ? UTF8ToString(userName) : undefined;
          var passwordStr = password ? UTF8ToString(password) : undefined;
          var overriddenMimeTypeStr = overriddenMimeType
            ? UTF8ToString(overriddenMimeType)
            : undefined;
          var xhr = new XMLHttpRequest();
          xhr.withCredentials = withCredentials;
          xhr.open(
            requestMethod,
            url_,
            !fetchAttrSynchronous,
            userNameStr,
            passwordStr,
          );
          if (!fetchAttrSynchronous) xhr.timeout = timeoutMsecs;
          xhr.url_ = url_;
          xhr.responseType = 'arraybuffer';
          if (overriddenMimeType) {
            xhr.overrideMimeType(overriddenMimeTypeStr);
          }
          if (requestHeaders) {
            for (;;) {
              var key = HEAPU32[requestHeaders >> 2];
              if (!key) break;
              var value = HEAPU32[(requestHeaders + 4) >> 2];
              if (!value) break;
              requestHeaders += 8;
              var keyStr = UTF8ToString(key);
              var valueStr = UTF8ToString(value);
              xhr.setRequestHeader(keyStr, valueStr);
            }
          }
          Fetch.xhrs.push(xhr);
          var id = Fetch.xhrs.length;
          HEAPU32[(fetch + 0) >> 2] = id;
          var data =
            dataPtr && dataLength
              ? HEAPU8.slice(dataPtr, dataPtr + dataLength)
              : null;
          function saveResponse(condition) {
            var ptr = 0;
            var ptrLen = 0;
            if (condition) {
              ptrLen = xhr.response ? xhr.response.byteLength : 0;
              ptr = _malloc(ptrLen);
              HEAPU8.set(new Uint8Array(xhr.response), ptr);
            }
            HEAPU32[(fetch + 12) >> 2] = ptr;
            Fetch.setu64(fetch + 16, ptrLen);
          }
          xhr.onload = function (e) {
            saveResponse(fetchAttrLoadToMemory && !fetchAttrStreamData);
            var len = xhr.response ? xhr.response.byteLength : 0;
            Fetch.setu64(fetch + 24, 0);
            if (len) {
              Fetch.setu64(fetch + 32, len);
            }
            HEAPU16[(fetch + 40) >> 1] = xhr.readyState;
            HEAPU16[(fetch + 42) >> 1] = xhr.status;
            if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
            if (xhr.status >= 200 && xhr.status < 300) {
              if (onsuccess) onsuccess(fetch, xhr, e);
            } else {
              if (onerror) onerror(fetch, xhr, e);
            }
          };
          xhr.onerror = function (e) {
            saveResponse(fetchAttrLoadToMemory);
            var status = xhr.status;
            Fetch.setu64(fetch + 24, 0);
            Fetch.setu64(
              fetch + 32,
              xhr.response ? xhr.response.byteLength : 0,
            );
            HEAPU16[(fetch + 40) >> 1] = xhr.readyState;
            HEAPU16[(fetch + 42) >> 1] = status;
            if (onerror) onerror(fetch, xhr, e);
          };
          xhr.ontimeout = function (e) {
            if (onerror) onerror(fetch, xhr, e);
          };
          xhr.onprogress = function (e) {
            var ptrLen =
              fetchAttrLoadToMemory && fetchAttrStreamData && xhr.response
                ? xhr.response.byteLength
                : 0;
            var ptr = 0;
            if (fetchAttrLoadToMemory && fetchAttrStreamData) {
              ptr = _malloc(ptrLen);
              HEAPU8.set(new Uint8Array(xhr.response), ptr);
            }
            HEAPU32[(fetch + 12) >> 2] = ptr;
            Fetch.setu64(fetch + 16, ptrLen);
            Fetch.setu64(fetch + 24, e.loaded - ptrLen);
            Fetch.setu64(fetch + 32, e.total);
            HEAPU16[(fetch + 40) >> 1] = xhr.readyState;
            if (xhr.readyState >= 3 && xhr.status === 0 && e.loaded > 0)
              xhr.status = 200;
            HEAPU16[(fetch + 42) >> 1] = xhr.status;
            if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
            if (onprogress) onprogress(fetch, xhr, e);
            if (ptr) {
              _free(ptr);
            }
          };
          xhr.onreadystatechange = function (e) {
            HEAPU16[(fetch + 40) >> 1] = xhr.readyState;
            if (xhr.readyState >= 2) {
              HEAPU16[(fetch + 42) >> 1] = xhr.status;
            }
            if (onreadystatechange) onreadystatechange(fetch, xhr, e);
          };
          try {
            xhr.send(data);
          } catch (e) {
            if (onerror) onerror(fetch, xhr, e);
          }
        }
        function __emscripten_fetch_cache_data(
          db,
          fetch,
          data,
          onsuccess,
          onerror,
        ) {
          if (!db) {
            onerror(fetch, 0, 'IndexedDB not available!');
            return;
          }
          var fetch_attr = fetch + 112;
          var destinationPath = HEAPU32[(fetch_attr + 64) >> 2];
          if (!destinationPath) destinationPath = HEAPU32[(fetch + 8) >> 2];
          var destinationPathStr = UTF8ToString(destinationPath);
          try {
            var transaction = db.transaction(['FILES'], 'readwrite');
            var packages = transaction.objectStore('FILES');
            var putRequest = packages.put(data, destinationPathStr);
            putRequest.onsuccess = function (event) {
              HEAPU16[(fetch + 40) >> 1] = 4;
              HEAPU16[(fetch + 42) >> 1] = 200;
              stringToUTF8('OK', fetch + 44, 64);
              onsuccess(fetch, 0, destinationPathStr);
            };
            putRequest.onerror = function (error) {
              HEAPU16[(fetch + 40) >> 1] = 4;
              HEAPU16[(fetch + 42) >> 1] = 413;
              stringToUTF8('Payload Too Large', fetch + 44, 64);
              onerror(fetch, 0, error);
            };
          } catch (e) {
            onerror(fetch, 0, e);
          }
        }
        function __emscripten_fetch_load_cached_data(
          db,
          fetch,
          onsuccess,
          onerror,
        ) {
          if (!db) {
            onerror(fetch, 0, 'IndexedDB not available!');
            return;
          }
          var fetch_attr = fetch + 112;
          var path = HEAPU32[(fetch_attr + 64) >> 2];
          if (!path) path = HEAPU32[(fetch + 8) >> 2];
          var pathStr = UTF8ToString(path);
          try {
            var transaction = db.transaction(['FILES'], 'readonly');
            var packages = transaction.objectStore('FILES');
            var getRequest = packages.get(pathStr);
            getRequest.onsuccess = function (event) {
              if (event.target.result) {
                var value = event.target.result;
                var len = value.byteLength || value.length;
                var ptr = _malloc(len);
                HEAPU8.set(new Uint8Array(value), ptr);
                HEAPU32[(fetch + 12) >> 2] = ptr;
                Fetch.setu64(fetch + 16, len);
                Fetch.setu64(fetch + 24, 0);
                Fetch.setu64(fetch + 32, len);
                HEAPU16[(fetch + 40) >> 1] = 4;
                HEAPU16[(fetch + 42) >> 1] = 200;
                stringToUTF8('OK', fetch + 44, 64);
                onsuccess(fetch, 0, value);
              } else {
                HEAPU16[(fetch + 40) >> 1] = 4;
                HEAPU16[(fetch + 42) >> 1] = 404;
                stringToUTF8('Not Found', fetch + 44, 64);
                onerror(fetch, 0, 'no data');
              }
            };
            getRequest.onerror = function (error) {
              HEAPU16[(fetch + 40) >> 1] = 4;
              HEAPU16[(fetch + 42) >> 1] = 404;
              stringToUTF8('Not Found', fetch + 44, 64);
              onerror(fetch, 0, error);
            };
          } catch (e) {
            onerror(fetch, 0, e);
          }
        }
        function __emscripten_fetch_delete_cached_data(
          db,
          fetch,
          onsuccess,
          onerror,
        ) {
          if (!db) {
            onerror(fetch, 0, 'IndexedDB not available!');
            return;
          }
          var fetch_attr = fetch + 112;
          var path = HEAPU32[(fetch_attr + 64) >> 2];
          if (!path) path = HEAPU32[(fetch + 8) >> 2];
          var pathStr = UTF8ToString(path);
          try {
            var transaction = db.transaction(['FILES'], 'readwrite');
            var packages = transaction.objectStore('FILES');
            var request = packages.delete(pathStr);
            request.onsuccess = function (event) {
              var value = event.target.result;
              HEAPU32[(fetch + 12) >> 2] = 0;
              Fetch.setu64(fetch + 16, 0);
              Fetch.setu64(fetch + 24, 0);
              Fetch.setu64(fetch + 32, 0);
              HEAPU16[(fetch + 40) >> 1] = 4;
              HEAPU16[(fetch + 42) >> 1] = 200;
              stringToUTF8('OK', fetch + 44, 64);
              onsuccess(fetch, 0, value);
            };
            request.onerror = function (error) {
              HEAPU16[(fetch + 40) >> 1] = 4;
              HEAPU16[(fetch + 42) >> 1] = 404;
              stringToUTF8('Not Found', fetch + 44, 64);
              onerror(fetch, 0, error);
            };
          } catch (e) {
            onerror(fetch, 0, e);
          }
        }
        function _emscripten_start_fetch(
          fetch,
          successcb,
          errorcb,
          progresscb,
          readystatechangecb,
        ) {
          if (typeof noExitRuntime !== 'undefined') noExitRuntime = true;
          var fetch_attr = fetch + 112;
          var requestMethod = UTF8ToString(fetch_attr);
          var onsuccess = HEAPU32[(fetch_attr + 36) >> 2];
          var onerror = HEAPU32[(fetch_attr + 40) >> 2];
          var onprogress = HEAPU32[(fetch_attr + 44) >> 2];
          var onreadystatechange = HEAPU32[(fetch_attr + 48) >> 2];
          var fetchAttributes = HEAPU32[(fetch_attr + 52) >> 2];
          var fetchAttrPersistFile = !!(fetchAttributes & 4);
          var fetchAttrNoDownload = !!(fetchAttributes & 32);
          var fetchAttrReplace = !!(fetchAttributes & 16);
          var reportSuccess = function (fetch, xhr, e) {
            if (onsuccess) wasmTable.get(onsuccess)(fetch);
            else if (successcb) successcb(fetch);
          };
          var reportProgress = function (fetch, xhr, e) {
            if (onprogress) wasmTable.get(onprogress)(fetch);
            else if (progresscb) progresscb(fetch);
          };
          var reportError = function (fetch, xhr, e) {
            if (onerror) wasmTable.get(onerror)(fetch);
            else if (errorcb) errorcb(fetch);
          };
          var reportReadyStateChange = function (fetch, xhr, e) {
            if (onreadystatechange) wasmTable.get(onreadystatechange)(fetch);
            else if (readystatechangecb) readystatechangecb(fetch);
          };
          var performUncachedXhr = function (fetch, xhr, e) {
            __emscripten_fetch_xhr(
              fetch,
              reportSuccess,
              reportError,
              reportProgress,
              reportReadyStateChange,
            );
          };
          var cacheResultAndReportSuccess = function (fetch, xhr, e) {
            var storeSuccess = function (fetch, xhr, e) {
              if (onsuccess) wasmTable.get(onsuccess)(fetch);
              else if (successcb) successcb(fetch);
            };
            var storeError = function (fetch, xhr, e) {
              if (onsuccess) wasmTable.get(onsuccess)(fetch);
              else if (successcb) successcb(fetch);
            };
            __emscripten_fetch_cache_data(
              Fetch.dbInstance,
              fetch,
              xhr.response,
              storeSuccess,
              storeError,
            );
          };
          var performCachedXhr = function (fetch, xhr, e) {
            __emscripten_fetch_xhr(
              fetch,
              cacheResultAndReportSuccess,
              reportError,
              reportProgress,
              reportReadyStateChange,
            );
          };
          if (requestMethod === 'EM_IDB_STORE') {
            var ptr = HEAPU32[(fetch_attr + 84) >> 2];
            __emscripten_fetch_cache_data(
              Fetch.dbInstance,
              fetch,
              HEAPU8.slice(ptr, ptr + HEAPU32[(fetch_attr + 88) >> 2]),
              reportSuccess,
              reportError,
            );
          } else if (requestMethod === 'EM_IDB_DELETE') {
            __emscripten_fetch_delete_cached_data(
              Fetch.dbInstance,
              fetch,
              reportSuccess,
              reportError,
            );
          } else if (!fetchAttrReplace) {
            __emscripten_fetch_load_cached_data(
              Fetch.dbInstance,
              fetch,
              reportSuccess,
              fetchAttrNoDownload
                ? reportError
                : fetchAttrPersistFile
                ? performCachedXhr
                : performUncachedXhr,
            );
          } else if (!fetchAttrNoDownload) {
            __emscripten_fetch_xhr(
              fetch,
              fetchAttrPersistFile
                ? cacheResultAndReportSuccess
                : reportSuccess,
              reportError,
              reportProgress,
              reportReadyStateChange,
            );
          } else {
            return 0;
          }
          return fetch;
        }
        function __webgl_enable_ANGLE_instanced_arrays(ctx) {
          var ext = ctx.getExtension('ANGLE_instanced_arrays');
          if (ext) {
            ctx['vertexAttribDivisor'] = function (index, divisor) {
              ext['vertexAttribDivisorANGLE'](index, divisor);
            };
            ctx['drawArraysInstanced'] = function (
              mode,
              first,
              count,
              primcount,
            ) {
              ext['drawArraysInstancedANGLE'](mode, first, count, primcount);
            };
            ctx['drawElementsInstanced'] = function (
              mode,
              count,
              type,
              indices,
              primcount,
            ) {
              ext['drawElementsInstancedANGLE'](
                mode,
                count,
                type,
                indices,
                primcount,
              );
            };
            return 1;
          }
        }
        function __webgl_enable_OES_vertex_array_object(ctx) {
          var ext = ctx.getExtension('OES_vertex_array_object');
          if (ext) {
            ctx['createVertexArray'] = function () {
              return ext['createVertexArrayOES']();
            };
            ctx['deleteVertexArray'] = function (vao) {
              ext['deleteVertexArrayOES'](vao);
            };
            ctx['bindVertexArray'] = function (vao) {
              ext['bindVertexArrayOES'](vao);
            };
            ctx['isVertexArray'] = function (vao) {
              return ext['isVertexArrayOES'](vao);
            };
            return 1;
          }
        }
        function __webgl_enable_WEBGL_draw_buffers(ctx) {
          var ext = ctx.getExtension('WEBGL_draw_buffers');
          if (ext) {
            ctx['drawBuffers'] = function (n, bufs) {
              ext['drawBuffersWEBGL'](n, bufs);
            };
            return 1;
          }
        }
        function __webgl_enable_WEBGL_multi_draw(ctx) {
          return !!(ctx.multiDrawWebgl = ctx.getExtension('WEBGL_multi_draw'));
        }
        var GL = {
          counter: 1,
          buffers: [],
          programs: [],
          framebuffers: [],
          renderbuffers: [],
          textures: [],
          uniforms: [],
          shaders: [],
          vaos: [],
          contexts: {},
          offscreenCanvases: {},
          timerQueriesEXT: [],
          programInfos: {},
          stringCache: {},
          unpackAlignment: 4,
          recordError: function recordError(errorCode) {
            if (!GL.lastError) {
              GL.lastError = errorCode;
            }
          },
          getNewId: function (table) {
            var ret = GL.counter++;
            for (var i = table.length; i < ret; i++) {
              table[i] = null;
            }
            return ret;
          },
          getSource: function (shader, count, string, length) {
            var source = '';
            for (var i = 0; i < count; ++i) {
              var len = length ? HEAP32[(length + i * 4) >> 2] : -1;
              source += UTF8ToString(
                HEAP32[(string + i * 4) >> 2],
                len < 0 ? undefined : len,
              );
            }
            return source;
          },
          createContext: function (canvas, webGLContextAttributes) {
            var ctx = canvas.getContext('webgl', webGLContextAttributes);
            if (!ctx) return 0;
            var handle = GL.registerContext(ctx, webGLContextAttributes);
            return handle;
          },
          registerContext: function (ctx, webGLContextAttributes) {
            var handle = _malloc(8);
            HEAP32[(handle + 4) >> 2] = _pthread_self();
            var context = {
              handle: handle,
              attributes: webGLContextAttributes,
              version: webGLContextAttributes.majorVersion,
              GLctx: ctx,
            };
            if (ctx.canvas) ctx.canvas.GLctxObject = context;
            GL.contexts[handle] = context;
            if (
              typeof webGLContextAttributes.enableExtensionsByDefault ===
                'undefined' ||
              webGLContextAttributes.enableExtensionsByDefault
            ) {
              GL.initExtensions(context);
            }
            return handle;
          },
          makeContextCurrent: function (contextHandle) {
            GL.currentContext = GL.contexts[contextHandle];
            Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
            return !(contextHandle && !GLctx);
          },
          getContext: function (contextHandle) {
            return GL.contexts[contextHandle];
          },
          deleteContext: function (contextHandle) {
            if (GL.currentContext === GL.contexts[contextHandle])
              GL.currentContext = null;
            if (typeof JSEvents === 'object')
              JSEvents.removeAllHandlersOnTarget(
                GL.contexts[contextHandle].GLctx.canvas,
              );
            if (
              GL.contexts[contextHandle] &&
              GL.contexts[contextHandle].GLctx.canvas
            )
              GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
            _free(GL.contexts[contextHandle].handle);
            GL.contexts[contextHandle] = null;
          },
          initExtensions: function (context) {
            if (!context) context = GL.currentContext;
            if (context.initExtensionsDone) return;
            context.initExtensionsDone = true;
            var GLctx = context.GLctx;
            __webgl_enable_ANGLE_instanced_arrays(GLctx);
            __webgl_enable_OES_vertex_array_object(GLctx);
            __webgl_enable_WEBGL_draw_buffers(GLctx);
            GLctx.disjointTimerQueryExt = GLctx.getExtension(
              'EXT_disjoint_timer_query',
            );
            __webgl_enable_WEBGL_multi_draw(GLctx);
            var automaticallyEnabledExtensions = [
              'OES_texture_float',
              'OES_texture_half_float',
              'OES_standard_derivatives',
              'OES_vertex_array_object',
              'WEBGL_compressed_texture_s3tc',
              'WEBGL_depth_texture',
              'OES_element_index_uint',
              'EXT_texture_filter_anisotropic',
              'EXT_frag_depth',
              'WEBGL_draw_buffers',
              'ANGLE_instanced_arrays',
              'OES_texture_float_linear',
              'OES_texture_half_float_linear',
              'EXT_blend_minmax',
              'EXT_shader_texture_lod',
              'EXT_texture_norm16',
              'WEBGL_compressed_texture_pvrtc',
              'EXT_color_buffer_half_float',
              'WEBGL_color_buffer_float',
              'EXT_sRGB',
              'WEBGL_compressed_texture_etc1',
              'EXT_disjoint_timer_query',
              'WEBGL_compressed_texture_etc',
              'WEBGL_compressed_texture_astc',
              'EXT_color_buffer_float',
              'WEBGL_compressed_texture_s3tc_srgb',
              'EXT_disjoint_timer_query_webgl2',
              'WEBKIT_WEBGL_compressed_texture_pvrtc',
            ];
            var exts = GLctx.getSupportedExtensions() || [];
            exts.forEach(function (ext) {
              if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
                GLctx.getExtension(ext);
              }
            });
          },
          populateUniformTable: function (program) {
            var p = GL.programs[program];
            var ptable = (GL.programInfos[program] = {
              uniforms: {},
              maxUniformLength: 0,
              maxAttributeLength: -1,
              maxUniformBlockNameLength: -1,
            });
            var utable = ptable.uniforms;
            var numUniforms = GLctx.getProgramParameter(p, 35718);
            for (var i = 0; i < numUniforms; ++i) {
              var u = GLctx.getActiveUniform(p, i);
              var name = u.name;
              ptable.maxUniformLength = Math.max(
                ptable.maxUniformLength,
                name.length + 1,
              );
              if (name.slice(-1) == ']') {
                name = name.slice(0, name.lastIndexOf('['));
              }
              var loc = GLctx.getUniformLocation(p, name);
              if (loc) {
                var id = GL.getNewId(GL.uniforms);
                utable[name] = [u.size, id];
                GL.uniforms[id] = loc;
                for (var j = 1; j < u.size; ++j) {
                  var n = name + '[' + j + ']';
                  loc = GLctx.getUniformLocation(p, n);
                  id = GL.getNewId(GL.uniforms);
                  GL.uniforms[id] = loc;
                }
              }
            }
          },
        };
        var __emscripten_webgl_power_preferences = [
          'default',
          'low-power',
          'high-performance',
        ];
        function _emscripten_webgl_do_create_context(target, attributes) {
          var contextAttributes = {};
          var a = attributes >> 2;
          contextAttributes['alpha'] = !!HEAP32[a + (0 >> 2)];
          contextAttributes['depth'] = !!HEAP32[a + (4 >> 2)];
          contextAttributes['stencil'] = !!HEAP32[a + (8 >> 2)];
          contextAttributes['antialias'] = !!HEAP32[a + (12 >> 2)];
          contextAttributes['premultipliedAlpha'] = !!HEAP32[a + (16 >> 2)];
          contextAttributes['preserveDrawingBuffer'] = !!HEAP32[a + (20 >> 2)];
          var powerPreference = HEAP32[a + (24 >> 2)];
          contextAttributes['powerPreference'] =
            __emscripten_webgl_power_preferences[powerPreference];
          contextAttributes['failIfMajorPerformanceCaveat'] = !!HEAP32[
            a + (28 >> 2)
          ];
          contextAttributes.majorVersion = HEAP32[a + (32 >> 2)];
          contextAttributes.minorVersion = HEAP32[a + (36 >> 2)];
          contextAttributes.enableExtensionsByDefault = HEAP32[a + (40 >> 2)];
          contextAttributes.explicitSwapControl = HEAP32[a + (44 >> 2)];
          contextAttributes.proxyContextToMainThread = HEAP32[a + (48 >> 2)];
          contextAttributes.renderViaOffscreenBackBuffer =
            HEAP32[a + (52 >> 2)];
          var canvas = findCanvasEventTarget(target);
          if (!canvas) {
            return 0;
          }
          if (contextAttributes.explicitSwapControl) {
            return 0;
          }
          var contextHandle = GL.createContext(canvas, contextAttributes);
          return contextHandle;
        }
        function _emscripten_webgl_create_context(a0, a1) {
          return _emscripten_webgl_do_create_context(a0, a1);
        }
        var ENV = {};
        function getExecutableName() {
          return thisProgram || './this.program';
        }
        function getEnvStrings() {
          if (!getEnvStrings.strings) {
            var lang =
              (
                (typeof navigator === 'object' &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                'C'
              ).replace('-', '_') + '.UTF-8';
            var env = {
              USER: 'web_user',
              LOGNAME: 'web_user',
              PATH: '/',
              PWD: '/',
              HOME: '/home/web_user',
              LANG: lang,
              _: getExecutableName(),
            };
            for (var x in ENV) {
              env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(x + '=' + env[x]);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        }
        function _environ_get(__environ, environ_buf) {
          var bufSize = 0;
          getEnvStrings().forEach(function (string, i) {
            var ptr = environ_buf + bufSize;
            HEAP32[(__environ + i * 4) >> 2] = ptr;
            writeAsciiToMemory(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        }
        function _environ_sizes_get(penviron_count, penviron_buf_size) {
          var strings = getEnvStrings();
          HEAP32[penviron_count >> 2] = strings.length;
          var bufSize = 0;
          strings.forEach(function (string) {
            bufSize += string.length + 1;
          });
          HEAP32[penviron_buf_size >> 2] = bufSize;
          return 0;
        }
        function _exit(status) {
          exit(status);
        }
        function _fd_close(fd) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(6, 1, fd);
          return 0;
        }
        function _fd_read(fd, iov, iovcnt, pnum) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(
              7,
              1,
              fd,
              iov,
              iovcnt,
              pnum,
            );
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doReadv(stream, iov, iovcnt);
          HEAP32[pnum >> 2] = num;
          return 0;
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(
              8,
              1,
              fd,
              offset_low,
              offset_high,
              whence,
              newOffset,
            );
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
          if (ENVIRONMENT_IS_PTHREAD)
            return _emscripten_proxy_to_main_thread_js(
              9,
              1,
              fd,
              iov,
              iovcnt,
              pnum,
            );
          var num = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(iov + i * 8) >> 2];
            var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
            for (var j = 0; j < len; j++) {
              SYSCALLS.printChar(fd, HEAPU8[ptr + j]);
            }
            num += len;
          }
          HEAP32[pnum >> 2] = num;
          return 0;
        }
        function spawnThread(threadParams) {
          if (ENVIRONMENT_IS_PTHREAD)
            throw 'Internal Error! spawnThread() can only ever be called from main application thread!';
          var worker = PThread.getNewWorker();
          if (worker.pthread !== undefined) throw 'Internal error!';
          if (!threadParams.pthread_ptr)
            throw 'Internal error, no pthread ptr!';
          PThread.runningWorkers.push(worker);
          var tlsMemory = _malloc(128 * 4);
          for (var i = 0; i < 128; ++i) {
            HEAP32[(tlsMemory + i * 4) >> 2] = 0;
          }
          var stackHigh = threadParams.stackBase + threadParams.stackSize;
          var pthread = (PThread.pthreads[threadParams.pthread_ptr] = {
            worker: worker,
            stackBase: threadParams.stackBase,
            stackSize: threadParams.stackSize,
            allocatedOwnStack: threadParams.allocatedOwnStack,
            thread: threadParams.pthread_ptr,
            threadInfoStruct: threadParams.pthread_ptr,
          });
          var tis = pthread.threadInfoStruct >> 2;
          Atomics.store(HEAPU32, tis + (0 >> 2), 0);
          Atomics.store(HEAPU32, tis + (4 >> 2), 0);
          Atomics.store(HEAPU32, tis + (8 >> 2), 0);
          Atomics.store(HEAPU32, tis + (68 >> 2), threadParams.detached);
          Atomics.store(HEAPU32, tis + (104 >> 2), tlsMemory);
          Atomics.store(HEAPU32, tis + (48 >> 2), 0);
          Atomics.store(HEAPU32, tis + (40 >> 2), pthread.threadInfoStruct);
          Atomics.store(HEAPU32, tis + (44 >> 2), 42);
          Atomics.store(HEAPU32, tis + (108 >> 2), threadParams.stackSize);
          Atomics.store(HEAPU32, tis + (84 >> 2), threadParams.stackSize);
          Atomics.store(HEAPU32, tis + (80 >> 2), stackHigh);
          Atomics.store(HEAPU32, tis + ((108 + 8) >> 2), stackHigh);
          Atomics.store(
            HEAPU32,
            tis + ((108 + 12) >> 2),
            threadParams.detached,
          );
          Atomics.store(
            HEAPU32,
            tis + ((108 + 20) >> 2),
            threadParams.schedPolicy,
          );
          Atomics.store(
            HEAPU32,
            tis + ((108 + 24) >> 2),
            threadParams.schedPrio,
          );
          var global_libc = _emscripten_get_global_libc();
          var global_locale = global_libc + 40;
          Atomics.store(HEAPU32, tis + (176 >> 2), global_locale);
          worker.pthread = pthread;
          var msg = {
            cmd: 'run',
            start_routine: threadParams.startRoutine,
            arg: threadParams.arg,
            threadInfoStruct: threadParams.pthread_ptr,
            selfThreadId: threadParams.pthread_ptr,
            parentThreadId: threadParams.parent_pthread_ptr,
            stackBase: threadParams.stackBase,
            stackSize: threadParams.stackSize,
          };
          worker.runPthread = function () {
            msg.time = performance.now();
            worker.postMessage(msg, threadParams.transferList);
          };
          if (worker.loaded) {
            worker.runPthread();
            delete worker.runPthread;
          }
        }
        function _pthread_getschedparam(thread, policy, schedparam) {
          if (!policy && !schedparam) return ERRNO_CODES.EINVAL;
          if (!thread) {
            err('pthread_getschedparam called with a null thread pointer!');
            return ERRNO_CODES.ESRCH;
          }
          var self = HEAP32[(thread + 12) >> 2];
          if (self !== thread) {
            err(
              'pthread_getschedparam attempted on thread ' +
                thread +
                ', which does not point to a valid thread, or does not exist anymore!',
            );
            return ERRNO_CODES.ESRCH;
          }
          var schedPolicy = Atomics.load(HEAPU32, (thread + 108 + 20) >> 2);
          var schedPrio = Atomics.load(HEAPU32, (thread + 108 + 24) >> 2);
          if (policy) HEAP32[policy >> 2] = schedPolicy;
          if (schedparam) HEAP32[schedparam >> 2] = schedPrio;
          return 0;
        }
        function _pthread_self() {
          return __pthread_ptr | 0;
        }
        Module['_pthread_self'] = _pthread_self;
        function _pthread_create(pthread_ptr, attr, start_routine, arg) {
          if (typeof SharedArrayBuffer === 'undefined') {
            err(
              'Current environment does not support SharedArrayBuffer, pthreads are not available!',
            );
            return 6;
          }
          if (!pthread_ptr) {
            err('pthread_create called with a null thread pointer!');
            return 28;
          }
          var transferList = [];
          var error = 0;
          if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
            return _emscripten_sync_run_in_main_thread_4(
              687865856,
              pthread_ptr,
              attr,
              start_routine,
              arg,
            );
          }
          if (error) return error;
          var stackSize = 0;
          var stackBase = 0;
          var detached = 0;
          var schedPolicy = 0;
          var schedPrio = 0;
          if (attr) {
            stackSize = HEAP32[attr >> 2];
            stackSize += 81920;
            stackBase = HEAP32[(attr + 8) >> 2];
            detached = HEAP32[(attr + 12) >> 2] !== 0;
            var inheritSched = HEAP32[(attr + 16) >> 2] === 0;
            if (inheritSched) {
              var prevSchedPolicy = HEAP32[(attr + 20) >> 2];
              var prevSchedPrio = HEAP32[(attr + 24) >> 2];
              var parentThreadPtr = PThread.currentProxiedOperationCallerThread
                ? PThread.currentProxiedOperationCallerThread
                : _pthread_self();
              _pthread_getschedparam(parentThreadPtr, attr + 20, attr + 24);
              schedPolicy = HEAP32[(attr + 20) >> 2];
              schedPrio = HEAP32[(attr + 24) >> 2];
              HEAP32[(attr + 20) >> 2] = prevSchedPolicy;
              HEAP32[(attr + 24) >> 2] = prevSchedPrio;
            } else {
              schedPolicy = HEAP32[(attr + 20) >> 2];
              schedPrio = HEAP32[(attr + 24) >> 2];
            }
          } else {
            stackSize = 2097152;
          }
          var allocatedOwnStack = stackBase == 0;
          if (allocatedOwnStack) {
            stackBase = _memalign(16, stackSize);
          } else {
            stackBase -= stackSize;
            assert(stackBase > 0);
          }
          var threadInfoStruct = _malloc(232);
          for (var i = 0; i < 232 >> 2; ++i)
            HEAPU32[(threadInfoStruct >> 2) + i] = 0;
          HEAP32[pthread_ptr >> 2] = threadInfoStruct;
          HEAP32[(threadInfoStruct + 12) >> 2] = threadInfoStruct;
          var headPtr = threadInfoStruct + 156;
          HEAP32[headPtr >> 2] = headPtr;
          var threadParams = {
            stackBase: stackBase,
            stackSize: stackSize,
            allocatedOwnStack: allocatedOwnStack,
            schedPolicy: schedPolicy,
            schedPrio: schedPrio,
            detached: detached,
            startRoutine: start_routine,
            pthread_ptr: threadInfoStruct,
            parent_pthread_ptr: _pthread_self(),
            arg: arg,
            transferList: transferList,
          };
          if (ENVIRONMENT_IS_PTHREAD) {
            threadParams.cmd = 'spawnThread';
            postMessage(threadParams, transferList);
          } else {
            spawnThread(threadParams);
          }
          return 0;
        }
        function __pthread_testcancel_js() {
          if (!ENVIRONMENT_IS_PTHREAD) return;
          if (!threadInfoStruct) return;
          var cancelDisabled = Atomics.load(
            HEAPU32,
            (threadInfoStruct + 60) >> 2,
          );
          if (cancelDisabled) return;
          var canceled = Atomics.load(HEAPU32, (threadInfoStruct + 0) >> 2);
          if (canceled == 2) throw 'Canceled!';
        }
        function __emscripten_do_pthread_join(thread, status, block) {
          if (!thread) {
            err('pthread_join attempted on a null thread pointer!');
            return ERRNO_CODES.ESRCH;
          }
          if (ENVIRONMENT_IS_PTHREAD && selfThreadId == thread) {
            err('PThread ' + thread + ' is attempting to join to itself!');
            return ERRNO_CODES.EDEADLK;
          } else if (
            !ENVIRONMENT_IS_PTHREAD &&
            PThread.mainThreadBlock == thread
          ) {
            err('Main thread ' + thread + ' is attempting to join to itself!');
            return ERRNO_CODES.EDEADLK;
          }
          var self = HEAP32[(thread + 12) >> 2];
          if (self !== thread) {
            err(
              'pthread_join attempted on thread ' +
                thread +
                ', which does not point to a valid thread, or does not exist anymore!',
            );
            return ERRNO_CODES.ESRCH;
          }
          var detached = Atomics.load(HEAPU32, (thread + 68) >> 2);
          if (detached) {
            err(
              'Attempted to join thread ' +
                thread +
                ', which was already detached!',
            );
            return ERRNO_CODES.EINVAL;
          }
          if (block) {
            _emscripten_check_blocking_allowed();
          }
          for (;;) {
            var threadStatus = Atomics.load(HEAPU32, (thread + 0) >> 2);
            if (threadStatus == 1) {
              var threadExitCode = Atomics.load(HEAPU32, (thread + 4) >> 2);
              if (status) HEAP32[status >> 2] = threadExitCode;
              Atomics.store(HEAPU32, (thread + 68) >> 2, 1);
              if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread);
              else postMessage({ cmd: 'cleanupThread', thread: thread });
              return 0;
            }
            if (!block) {
              return ERRNO_CODES.EBUSY;
            }
            __pthread_testcancel_js();
            if (!ENVIRONMENT_IS_PTHREAD)
              _emscripten_main_thread_process_queued_calls();
            _emscripten_futex_wait(
              thread + 0,
              threadStatus,
              ENVIRONMENT_IS_PTHREAD ? 100 : 1,
            );
          }
        }
        function _pthread_join(thread, status) {
          return __emscripten_do_pthread_join(thread, status, true);
        }
        function _setTempRet0($i) {
          setTempRet0($i | 0);
        }
        function __isLeapYear(year) {
          return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        function __arraySum(array, index) {
          var sum = 0;
          for (var i = 0; i <= index; sum += array[i++]) {}
          return sum;
        }
        var __MONTH_DAYS_LEAP = [
          31,
          29,
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ];
        var __MONTH_DAYS_REGULAR = [
          31,
          28,
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ];
        function __addDays(date, days) {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = __isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        }
        function _strftime(s, maxsize, format, tm) {
          var tm_zone = HEAP32[(tm + 40) >> 2];
          var date = {
            tm_sec: HEAP32[tm >> 2],
            tm_min: HEAP32[(tm + 4) >> 2],
            tm_hour: HEAP32[(tm + 8) >> 2],
            tm_mday: HEAP32[(tm + 12) >> 2],
            tm_mon: HEAP32[(tm + 16) >> 2],
            tm_year: HEAP32[(tm + 20) >> 2],
            tm_wday: HEAP32[(tm + 24) >> 2],
            tm_yday: HEAP32[(tm + 28) >> 2],
            tm_isdst: HEAP32[(tm + 32) >> 2],
            tm_gmtoff: HEAP32[(tm + 36) >> 2],
            tm_zone: tm_zone ? UTF8ToString(tm_zone) : '',
          };
          var pattern = UTF8ToString(format);
          var EXPANSION_RULES_1 = {
            '%c': '%a %b %d %H:%M:%S %Y',
            '%D': '%m/%d/%y',
            '%F': '%Y-%m-%d',
            '%h': '%b',
            '%r': '%I:%M:%S %p',
            '%R': '%H:%M',
            '%T': '%H:%M:%S',
            '%x': '%m/%d/%y',
            '%X': '%H:%M:%S',
            '%Ec': '%c',
            '%EC': '%C',
            '%Ex': '%m/%d/%y',
            '%EX': '%H:%M:%S',
            '%Ey': '%y',
            '%EY': '%Y',
            '%Od': '%d',
            '%Oe': '%e',
            '%OH': '%H',
            '%OI': '%I',
            '%Om': '%m',
            '%OM': '%M',
            '%OS': '%S',
            '%Ou': '%u',
            '%OU': '%U',
            '%OV': '%V',
            '%Ow': '%w',
            '%OW': '%W',
            '%Oy': '%y',
          };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(
              new RegExp(rule, 'g'),
              EXPANSION_RULES_1[rule],
            );
          }
          var WEEKDAYS = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];
          var MONTHS = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          function leadingSomething(value, digits, character) {
            var str =
              typeof value === 'number' ? value.toString() : value || '';
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, '0');
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if (
              (compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0
            ) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date) {
            var thisDate = __addDays(
              new Date(date.tm_year + 1900, 0, 1),
              date.tm_yday,
            );
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(
              janFourthThisYear,
            );
            var firstWeekStartNextYear = getFirstWeekStartDate(
              janFourthNextYear,
            );
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              } else {
                return thisDate.getFullYear();
              }
            } else {
              return thisDate.getFullYear() - 1;
            }
          }
          var EXPANSION_RULES_2 = {
            '%a': function (date) {
              return WEEKDAYS[date.tm_wday].substring(0, 3);
            },
            '%A': function (date) {
              return WEEKDAYS[date.tm_wday];
            },
            '%b': function (date) {
              return MONTHS[date.tm_mon].substring(0, 3);
            },
            '%B': function (date) {
              return MONTHS[date.tm_mon];
            },
            '%C': function (date) {
              var year = date.tm_year + 1900;
              return leadingNulls((year / 100) | 0, 2);
            },
            '%d': function (date) {
              return leadingNulls(date.tm_mday, 2);
            },
            '%e': function (date) {
              return leadingSomething(date.tm_mday, 2, ' ');
            },
            '%g': function (date) {
              return getWeekBasedYear(date).toString().substring(2);
            },
            '%G': function (date) {
              return getWeekBasedYear(date);
            },
            '%H': function (date) {
              return leadingNulls(date.tm_hour, 2);
            },
            '%I': function (date) {
              var twelveHour = date.tm_hour;
              if (twelveHour == 0) twelveHour = 12;
              else if (twelveHour > 12) twelveHour -= 12;
              return leadingNulls(twelveHour, 2);
            },
            '%j': function (date) {
              return leadingNulls(
                date.tm_mday +
                  __arraySum(
                    __isLeapYear(date.tm_year + 1900)
                      ? __MONTH_DAYS_LEAP
                      : __MONTH_DAYS_REGULAR,
                    date.tm_mon - 1,
                  ),
                3,
              );
            },
            '%m': function (date) {
              return leadingNulls(date.tm_mon + 1, 2);
            },
            '%M': function (date) {
              return leadingNulls(date.tm_min, 2);
            },
            '%n': function () {
              return '\n';
            },
            '%p': function (date) {
              if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return 'AM';
              } else {
                return 'PM';
              }
            },
            '%S': function (date) {
              return leadingNulls(date.tm_sec, 2);
            },
            '%t': function () {
              return '\t';
            },
            '%u': function (date) {
              return date.tm_wday || 7;
            },
            '%U': function (date) {
              var janFirst = new Date(date.tm_year + 1900, 0, 1);
              var firstSunday =
                janFirst.getDay() === 0
                  ? janFirst
                  : __addDays(janFirst, 7 - janFirst.getDay());
              var endDate = new Date(
                date.tm_year + 1900,
                date.tm_mon,
                date.tm_mday,
              );
              if (compareByDay(firstSunday, endDate) < 0) {
                var februaryFirstUntilEndMonth =
                  __arraySum(
                    __isLeapYear(endDate.getFullYear())
                      ? __MONTH_DAYS_LEAP
                      : __MONTH_DAYS_REGULAR,
                    endDate.getMonth() - 1,
                  ) - 31;
                var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                var days =
                  firstSundayUntilEndJanuary +
                  februaryFirstUntilEndMonth +
                  endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2);
              }
              return compareByDay(firstSunday, janFirst) === 0 ? '01' : '00';
            },
            '%V': function (date) {
              var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
              var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
              var firstWeekStartThisYear = getFirstWeekStartDate(
                janFourthThisYear,
              );
              var firstWeekStartNextYear = getFirstWeekStartDate(
                janFourthNextYear,
              );
              var endDate = __addDays(
                new Date(date.tm_year + 1900, 0, 1),
                date.tm_yday,
              );
              if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                return '53';
              }
              if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                return '01';
              }
              var daysDifference;
              if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                daysDifference =
                  date.tm_yday + 32 - firstWeekStartThisYear.getDate();
              } else {
                daysDifference =
                  date.tm_yday + 1 - firstWeekStartThisYear.getDate();
              }
              return leadingNulls(Math.ceil(daysDifference / 7), 2);
            },
            '%w': function (date) {
              return date.tm_wday;
            },
            '%W': function (date) {
              var janFirst = new Date(date.tm_year, 0, 1);
              var firstMonday =
                janFirst.getDay() === 1
                  ? janFirst
                  : __addDays(
                      janFirst,
                      janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1,
                    );
              var endDate = new Date(
                date.tm_year + 1900,
                date.tm_mon,
                date.tm_mday,
              );
              if (compareByDay(firstMonday, endDate) < 0) {
                var februaryFirstUntilEndMonth =
                  __arraySum(
                    __isLeapYear(endDate.getFullYear())
                      ? __MONTH_DAYS_LEAP
                      : __MONTH_DAYS_REGULAR,
                    endDate.getMonth() - 1,
                  ) - 31;
                var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                var days =
                  firstMondayUntilEndJanuary +
                  februaryFirstUntilEndMonth +
                  endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2);
              }
              return compareByDay(firstMonday, janFirst) === 0 ? '01' : '00';
            },
            '%y': function (date) {
              return (date.tm_year + 1900).toString().substring(2);
            },
            '%Y': function (date) {
              return date.tm_year + 1900;
            },
            '%z': function (date) {
              var off = date.tm_gmtoff;
              var ahead = off >= 0;
              off = Math.abs(off) / 60;
              off = (off / 60) * 100 + (off % 60);
              return (ahead ? '+' : '-') + String('0000' + off).slice(-4);
            },
            '%Z': function (date) {
              return date.tm_zone;
            },
            '%%': function () {
              return '%';
            },
          };
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.indexOf(rule) >= 0) {
              pattern = pattern.replace(
                new RegExp(rule, 'g'),
                EXPANSION_RULES_2[rule](date),
              );
            }
          }
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        }
        function _strftime_l(s, maxsize, format, tm) {
          return _strftime(s, maxsize, format, tm);
        }
        if (!ENVIRONMENT_IS_PTHREAD) PThread.initMainThreadBlock();
        else PThread.initWorker();
        if (!ENVIRONMENT_IS_PTHREAD) Fetch.staticInit();
        var GLctx;
        var proxiedFunctionTable = [
          null,
          _atexit,
          ___sys_fcntl64,
          ___sys_ioctl,
          ___sys_open,
          _emscripten_set_canvas_element_size_main_thread,
          _fd_close,
          _fd_read,
          _fd_seek,
          _fd_write,
        ];
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(
            stringy,
            u8array,
            0,
            u8array.length,
          );
          if (dontAddNull) u8array.length = numBytesWritten;
          return u8array;
        }
        if (!ENVIRONMENT_IS_PTHREAD)
          __ATINIT__.push({
            func: function () {
              ___wasm_call_ctors();
            },
          });
        var asmLibraryArg = {
          i: ___assert_fail,
          b: wasmTable,
          s: ___sys_fcntl64,
          K: ___sys_ioctl,
          L: ___sys_open,
          t: __emscripten_fetch_free,
          C: __emscripten_notify_thread_queue,
          f: _abort,
          I: _clock_gettime,
          l: _emscripten_asm_const_int,
          D: _emscripten_check_blocking_allowed,
          p: _emscripten_conditional_set_current_thread_status,
          g: _emscripten_futex_wait,
          h: _emscripten_futex_wake,
          d: _emscripten_get_now,
          k: _emscripten_is_main_browser_thread,
          m: _emscripten_is_main_runtime_thread,
          y: _emscripten_memcpy_big,
          z: _emscripten_receive_on_main_thread_js,
          j: _emscripten_resize_heap,
          A: _emscripten_set_canvas_element_size,
          e: _emscripten_set_current_thread_status,
          u: _emscripten_start_fetch,
          B: _emscripten_webgl_create_context,
          G: _environ_get,
          H: _environ_sizes_get,
          n: _exit,
          q: _fd_close,
          J: _fd_read,
          v: _fd_seek,
          r: _fd_write,
          x: initPthreadsJS,
          a: wasmMemory || Module['wasmMemory'],
          o: _pthread_create,
          E: _pthread_join,
          c: _pthread_self,
          w: _setTempRet0,
          F: _strftime_l,
        };
        var asm = createWasm();
        var ___wasm_call_ctors = (Module['___wasm_call_ctors'] = function () {
          return (___wasm_call_ctors = Module['___wasm_call_ctors'] =
            Module['asm']['M']).apply(null, arguments);
        });
        var _main = (Module['_main'] = function () {
          return (_main = Module['_main'] = Module['asm']['N']).apply(
            null,
            arguments,
          );
        });
        var _free = (Module['_free'] = function () {
          return (_free = Module['_free'] = Module['asm']['O']).apply(
            null,
            arguments,
          );
        });
        var _malloc = (Module['_malloc'] = function () {
          return (_malloc = Module['_malloc'] = Module['asm']['P']).apply(
            null,
            arguments,
          );
        });
        var _uci_command = (Module['_uci_command'] = function () {
          return (_uci_command = Module['_uci_command'] =
            Module['asm']['Q']).apply(null, arguments);
        });
        var ___errno_location = (Module['___errno_location'] = function () {
          return (___errno_location = Module['___errno_location'] =
            Module['asm']['R']).apply(null, arguments);
        });
        var _emscripten_get_global_libc = (Module[
          '_emscripten_get_global_libc'
        ] = function () {
          return (_emscripten_get_global_libc = Module[
            '_emscripten_get_global_libc'
          ] = Module['asm']['S']).apply(null, arguments);
        });
        var ___em_js__initPthreadsJS = (Module[
          '___em_js__initPthreadsJS'
        ] = function () {
          return (___em_js__initPthreadsJS = Module[
            '___em_js__initPthreadsJS'
          ] = Module['asm']['T']).apply(null, arguments);
        });
        var stackSave = (Module['stackSave'] = function () {
          return (stackSave = Module['stackSave'] = Module['asm']['U']).apply(
            null,
            arguments,
          );
        });
        var stackRestore = (Module['stackRestore'] = function () {
          return (stackRestore = Module['stackRestore'] =
            Module['asm']['V']).apply(null, arguments);
        });
        var stackAlloc = (Module['stackAlloc'] = function () {
          return (stackAlloc = Module['stackAlloc'] = Module['asm']['W']).apply(
            null,
            arguments,
          );
        });
        var _memalign = (Module['_memalign'] = function () {
          return (_memalign = Module['_memalign'] = Module['asm']['X']).apply(
            null,
            arguments,
          );
        });
        var _emscripten_main_browser_thread_id = (Module[
          '_emscripten_main_browser_thread_id'
        ] = function () {
          return (_emscripten_main_browser_thread_id = Module[
            '_emscripten_main_browser_thread_id'
          ] = Module['asm']['Y']).apply(null, arguments);
        });
        var ___pthread_tsd_run_dtors = (Module[
          '___pthread_tsd_run_dtors'
        ] = function () {
          return (___pthread_tsd_run_dtors = Module[
            '___pthread_tsd_run_dtors'
          ] = Module['asm']['Z']).apply(null, arguments);
        });
        var _emscripten_main_thread_process_queued_calls = (Module[
          '_emscripten_main_thread_process_queued_calls'
        ] = function () {
          return (_emscripten_main_thread_process_queued_calls = Module[
            '_emscripten_main_thread_process_queued_calls'
          ] = Module['asm']['_']).apply(null, arguments);
        });
        var _emscripten_current_thread_process_queued_calls = (Module[
          '_emscripten_current_thread_process_queued_calls'
        ] = function () {
          return (_emscripten_current_thread_process_queued_calls = Module[
            '_emscripten_current_thread_process_queued_calls'
          ] = Module['asm']['$']).apply(null, arguments);
        });
        var _emscripten_register_main_browser_thread_id = (Module[
          '_emscripten_register_main_browser_thread_id'
        ] = function () {
          return (_emscripten_register_main_browser_thread_id = Module[
            '_emscripten_register_main_browser_thread_id'
          ] = Module['asm']['aa']).apply(null, arguments);
        });
        var _do_emscripten_dispatch_to_thread = (Module[
          '_do_emscripten_dispatch_to_thread'
        ] = function () {
          return (_do_emscripten_dispatch_to_thread = Module[
            '_do_emscripten_dispatch_to_thread'
          ] = Module['asm']['ba']).apply(null, arguments);
        });
        var _emscripten_async_run_in_main_thread = (Module[
          '_emscripten_async_run_in_main_thread'
        ] = function () {
          return (_emscripten_async_run_in_main_thread = Module[
            '_emscripten_async_run_in_main_thread'
          ] = Module['asm']['ca']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread = (Module[
          '_emscripten_sync_run_in_main_thread'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread = Module[
            '_emscripten_sync_run_in_main_thread'
          ] = Module['asm']['da']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_0 = (Module[
          '_emscripten_sync_run_in_main_thread_0'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_0 = Module[
            '_emscripten_sync_run_in_main_thread_0'
          ] = Module['asm']['ea']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_1 = (Module[
          '_emscripten_sync_run_in_main_thread_1'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_1 = Module[
            '_emscripten_sync_run_in_main_thread_1'
          ] = Module['asm']['fa']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_2 = (Module[
          '_emscripten_sync_run_in_main_thread_2'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_2 = Module[
            '_emscripten_sync_run_in_main_thread_2'
          ] = Module['asm']['ga']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_xprintf_varargs = (Module[
          '_emscripten_sync_run_in_main_thread_xprintf_varargs'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_xprintf_varargs = Module[
            '_emscripten_sync_run_in_main_thread_xprintf_varargs'
          ] = Module['asm']['ha']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_3 = (Module[
          '_emscripten_sync_run_in_main_thread_3'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_3 = Module[
            '_emscripten_sync_run_in_main_thread_3'
          ] = Module['asm']['ia']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_4 = (Module[
          '_emscripten_sync_run_in_main_thread_4'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_4 = Module[
            '_emscripten_sync_run_in_main_thread_4'
          ] = Module['asm']['ja']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_5 = (Module[
          '_emscripten_sync_run_in_main_thread_5'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_5 = Module[
            '_emscripten_sync_run_in_main_thread_5'
          ] = Module['asm']['ka']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_6 = (Module[
          '_emscripten_sync_run_in_main_thread_6'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_6 = Module[
            '_emscripten_sync_run_in_main_thread_6'
          ] = Module['asm']['la']).apply(null, arguments);
        });
        var _emscripten_sync_run_in_main_thread_7 = (Module[
          '_emscripten_sync_run_in_main_thread_7'
        ] = function () {
          return (_emscripten_sync_run_in_main_thread_7 = Module[
            '_emscripten_sync_run_in_main_thread_7'
          ] = Module['asm']['ma']).apply(null, arguments);
        });
        var _emscripten_run_in_main_runtime_thread_js = (Module[
          '_emscripten_run_in_main_runtime_thread_js'
        ] = function () {
          return (_emscripten_run_in_main_runtime_thread_js = Module[
            '_emscripten_run_in_main_runtime_thread_js'
          ] = Module['asm']['na']).apply(null, arguments);
        });
        var __emscripten_call_on_thread = (Module[
          '__emscripten_call_on_thread'
        ] = function () {
          return (__emscripten_call_on_thread = Module[
            '__emscripten_call_on_thread'
          ] = Module['asm']['oa']).apply(null, arguments);
        });
        var _emscripten_tls_init = (Module[
          '_emscripten_tls_init'
        ] = function () {
          return (_emscripten_tls_init = Module['_emscripten_tls_init'] =
            Module['asm']['pa']).apply(null, arguments);
        });
        var dynCall_viijii = (Module['dynCall_viijii'] = function () {
          return (dynCall_viijii = Module['dynCall_viijii'] =
            Module['asm']['qa']).apply(null, arguments);
        });
        var dynCall_jiji = (Module['dynCall_jiji'] = function () {
          return (dynCall_jiji = Module['dynCall_jiji'] =
            Module['asm']['ra']).apply(null, arguments);
        });
        var dynCall_iiiiij = (Module['dynCall_iiiiij'] = function () {
          return (dynCall_iiiiij = Module['dynCall_iiiiij'] =
            Module['asm']['sa']).apply(null, arguments);
        });
        var dynCall_iiiiijj = (Module['dynCall_iiiiijj'] = function () {
          return (dynCall_iiiiijj = Module['dynCall_iiiiijj'] =
            Module['asm']['ta']).apply(null, arguments);
        });
        var dynCall_iiiiiijj = (Module['dynCall_iiiiiijj'] = function () {
          return (dynCall_iiiiiijj = Module['dynCall_iiiiiijj'] =
            Module['asm']['ua']).apply(null, arguments);
        });
        Module['ccall'] = ccall;
        Module['PThread'] = PThread;
        Module['PThread'] = PThread;
        Module['_pthread_self'] = _pthread_self;
        Module['wasmMemory'] = wasmMemory;
        Module['ExitStatus'] = ExitStatus;
        var calledRun;
        function ExitStatus(status) {
          this.name = 'ExitStatus';
          this.message = 'Program terminated with exit(' + status + ')';
          this.status = status;
        }
        var calledMain = false;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun) run();
          if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function callMain(args) {
          var entryFunction = Module['_main'];
          args = args || [];
          var argc = args.length + 1;
          var argv = stackAlloc((argc + 1) * 4);
          HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
          for (var i = 1; i < argc; i++) {
            HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
          }
          HEAP32[(argv >> 2) + argc] = 0;
          try {
            var ret = entryFunction(argc, argv);
            exit(ret, true);
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else if (e == 'unwind') {
              noExitRuntime = true;
              return;
            } else {
              var toLog = e;
              if (e && typeof e === 'object' && e.stack) {
                toLog = [e, e.stack];
              }
              err('exception thrown: ' + toLog);
              quit_(1, e);
            }
          } finally {
            calledMain = true;
          }
        }
        function run(args) {
          args = args || arguments_;
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0) return;
          function doRun() {
            if (calledRun) return;
            calledRun = true;
            Module['calledRun'] = true;
            if (ABORT) return;
            initRuntime();
            preMain();
            readyPromiseResolve(Module);
            if (Module['onRuntimeInitialized'])
              Module['onRuntimeInitialized']();
            if (shouldRunNow) callMain(args);
            postRun();
          }
          {
            doRun();
          }
        }
        Module['run'] = run;
        function exit(status, implicit) {
          if (implicit && noExitRuntime && status === 0) {
            return;
          }
          if (noExitRuntime) {
          } else {
            PThread.terminateAllThreads();
            EXITSTATUS = status;
            exitRuntime();
            ABORT = true;
          }
          quit_(status, new ExitStatus(status));
        }
        var shouldRunNow = true;
        if (!ENVIRONMENT_IS_PTHREAD) noExitRuntime = true;
        if (!ENVIRONMENT_IS_PTHREAD) {
          run();
        } else {
          readyPromiseResolve(Module);
        }

        return Stockfish.ready;
      };
    })();
    if (typeof exports === 'object' && typeof module === 'object')
      module.exports = Stockfish;
    else if (typeof define === 'function' && define['amd'])
      define([], function () {
        return Stockfish;
      });
    else if (typeof exports === 'object') exports['Stockfish'] = Stockfish;
    return Stockfish;
    /// End of STOCKFISH()
  };

  (function () {
    var isNode;
    var args;
    var myEngine;
    var queue = [];

    var myConsole = {
      log: log,
      error: log,
      warn: log,
    };

    function log(line) {}

    function completer(line) {
      var completions = [
        'd',
        'eval',
        'exit',
        'flip',
        'go',
        'isready',
        'ponderhit',
        'position fen ',
        'position startpos',
        'position startpos moves',
        'quit',
        'setoption name Clear Hash value ',
        'setoption name Contempt value ',
        'setoption name Hash value ',
        'setoption name Minimum Thinking Time value ',
        'setoption name Move Overhead value ',
        'setoption name MultiPV value ',
        'setoption name Ponder value ',
        'setoption name Skill Level Maximum Error value ',
        'setoption name Skill Level Probability value ',
        'setoption name Skill Level value ',
        'setoption name Slow Mover value ',
        'setoption name Threads value ',
        'setoption name UCI_Chess960 value false',
        'setoption name UCI_Chess960 value true',
        'setoption name UCI_Variant value chess',
        'setoption name UCI_Variant value atomic',
        'setoption name UCI_Variant value crazyhouse',
        'setoption name UCI_Variant value giveaway',
        'setoption name UCI_Variant value horde',
        'setoption name UCI_Variant value kingofthehill',
        'setoption name UCI_Variant value racingkings',
        'setoption name UCI_Variant value relay',
        'setoption name UCI_Variant value threecheck',
        'setoption name Use NNUE value true',
        'setoption name Use NNUE value false',
        'setoption name nodestime value ',
        'stop',
        'uci',
        'ucinewgame',
      ];
      var completionsMid = [
        'binc ',
        'btime ',
        'confidence ',
        'depth ',
        'infinite ',
        'mate ',
        'maxdepth ',
        'maxtime ',
        'mindepth ',
        'mintime ',
        'moves ', /// for position fen ... moves
        'movestogo ',
        'movetime ',
        'ponder ',
        'searchmoves ',
        'shallow ',
        'winc ',
        'wtime ',
      ];

      function filter(c) {
        return c.indexOf(line) === 0;
      }

      /// This looks for completions starting at the very beginning of the line.
      /// If the user has typed nothing, it will match everything.
      var hits = completions.filter(filter);

      if (!hits.length) {
        /// Just get the last word.
        line = line.replace(/^.*\s/, '');
        if (line) {
          /// Find completion mid line too.
          hits = completionsMid.filter(filter);
        } else {
          /// If no word has been typed, show all options.
          hits = completionsMid;
        }
      }

      return [hits, line];
    }

    isNode =
      typeof global !== 'undefined' &&
      Object.prototype.toString.call(global.process) === '[object process]';

    if (isNode) {
      global.XMLHttpRequest = function () {
        var xhr = {
          open: function (_, url) {
            xhr._path = url;
          },
          send: function () {
            xhr.response = require('fs').readFileSync(
              require('path').join(__dirname, xhr._path),
            );
            xhr.status = 200;
            setImmediate(xhr.onload);
          },
        };
        return xhr;
      };
      /// Is it a pThread or was it called directly?
      if (typeof module === 'undefined' || require.main === module) {
        Stockfish = STOCKFISH(
          myConsole,
          require('path').join(require.main.path, 'stockfish.wasm'),
        );

        if (require('worker_threads').isMainThread) {
          myConsole.log = console.log;

          require('readline')
            .createInterface({
              input: process.stdin,
              output: process.stdout,
              completer: completer,
            })
            .on('line', function online(line) {
              if (line) {
                if (line === 'quit' || line === 'exit') {
                  process.exit();
                }
                if (myEngine) {
                  myEngine.postMessage(line, true);
                } else {
                  queue.push(line);
                }
              }
            })
            .on('SIGINT', process.exit)
            .on('close', process.exit)
            .setPrompt('');

          process.stdin.on('end', process.exit);
        }

        Stockfish().then(function (sf) {
          myEngine = sf;

          sf.addMessageListener(function onlog(line) {
            console.log(line);
          });

          if (queue.length) {
            queue.forEach(function (line) {
              sf.postMessage(line, true);
            });
          }
          queue = null;
        });

        /// Is this a node module?
      } else {
        module.exports = STOCKFISH;
      }

      /// Is it a web worker?
    } else if (
      typeof onmessage !== 'undefined' &&
      (typeof window === 'undefined' || typeof window.document === 'undefined')
    ) {
      if (self && self.location && self.location.hash) {
        args = self.location.hash.substr(1).split(',');
        Stockfish = STOCKFISH(myConsole, args[0], !Number(args[1]));

        /// If this is a pthread, then we need to stop here.
        if (args[1]) {
          return;
        }
      } else {
        Stockfish = STOCKFISH(myConsole, '', true);
      }

      /// Make sure that this is only added once.
      if (!onmessage) {
        onmessage = function (event) {
          if (myEngine) {
            myEngine.postMessage(event.data, true);
          } else {
            queue.push(event.data);
          }
        };
      }

      Stockfish().then(function (sf) {
        ///NOTE: To get the number of loaded threads loop through the sf.PThread.runningWorkers array and check for .loaded.

        myEngine = sf;

        sf.addMessageListener(function onlog(line) {
          postMessage(line);
        });

        if (queue.length) {
          queue.forEach(function (line) {
            sf.postMessage(line, true);
          });
        }
        queue = null;
      });
    }
    ///NOTE: If it's a normal browser, we don't need to do anything. The client can use the INIT_ENGINE() function directly.
  })();

  /// End of init();
}

if (
  (typeof self !== 'undefined' && self.location.hash.split(',')[1] === '1') ||
  (typeof global !== 'undefined' &&
    Object.prototype.toString.call(global.process) === '[object process]' &&
    !require('worker_threads').isMainThread)
) {
  (function () {
    var threadInfoStruct = 0;
    var selfThreadId = 0;
    var parentThreadId = 0;
    var Module = {};
    function threadPrintErr() {
      var text = Array.prototype.slice.call(arguments).join(' ');
      console.error(text);
    }
    function threadAlert() {
      var text = Array.prototype.slice.call(arguments).join(' ');
      postMessage({ cmd: 'alert', text: text, threadId: selfThreadId });
    }
    var err = threadPrintErr;
    this.alert = threadAlert;
    Module['instantiateWasm'] = function (info, receiveInstance) {
      var instance = new WebAssembly.Instance(Module['wasmModule'], info);
      Module['wasmModule'] = null;
      receiveInstance(instance);
      return instance.exports;
    };
    this.onmessage = function (e) {
      try {
        if (e.data.cmd === 'load') {
          Module['wasmModule'] = e.data.wasmModule;
          Module['wasmMemory'] = e.data.wasmMemory;
          Module['buffer'] = Module['wasmMemory'].buffer;
          Module['ENVIRONMENT_IS_PTHREAD'] = true;
          INIT_ENGINE();
          Stockfish(Module).then(function (instance) {
            Module = instance;
            postMessage({ cmd: 'loaded' });
          });
        } else if (e.data.cmd === 'objectTransfer') {
          Module['PThread'].receiveObjectTransfer(e.data);
        } else if (e.data.cmd === 'run') {
          Module['__performance_now_clock_drift'] =
            performance.now() - e.data.time;
          threadInfoStruct = e.data.threadInfoStruct;
          Module['registerPthreadPtr'](threadInfoStruct, 0, 0);
          selfThreadId = e.data.selfThreadId;
          parentThreadId = e.data.parentThreadId;
          var max = e.data.stackBase;
          var top = e.data.stackBase + e.data.stackSize;
          Module['establishStackSpace'](top, max);
          Module['_emscripten_tls_init']();
          Module['PThread'].receiveObjectTransfer(e.data);
          Module['PThread'].setThreadStatus(Module['_pthread_self'](), 1);
          try {
            var result = Module['dynCall']('ii', e.data.start_routine, [
              e.data.arg,
            ]);
            if (!Module['getNoExitRuntime']())
              Module['PThread'].threadExit(result);
          } catch (ex) {
            if (ex === 'Canceled!') {
              Module['PThread'].threadCancel();
            } else if (ex != 'unwind') {
              Atomics.store(
                Module['HEAPU32'],
                (threadInfoStruct + 4) >> 2,
                ex instanceof Module['ExitStatus'] ? ex.status : -2,
              );
              Atomics.store(Module['HEAPU32'], (threadInfoStruct + 0) >> 2, 1);
              Module['_emscripten_futex_wake'](
                threadInfoStruct + 0,
                2147483647,
              );
              if (!(ex instanceof Module['ExitStatus'])) throw ex;
            }
          }
        } else if (e.data.cmd === 'cancel') {
          if (threadInfoStruct) {
            Module['PThread'].threadCancel();
          }
        } else if (e.data.target === 'setimmediate') {
        } else if (e.data.cmd === 'processThreadQueue') {
          if (threadInfoStruct) {
            Module['_emscripten_current_thread_process_queued_calls']();
          }
        } else {
          err('worker.js received unknown command ' + e.data.cmd);
          err(e.data);
        }
      } catch (ex) {
        err('worker.js onmessage() captured an uncaught exception: ' + ex);
        if (ex.stack) err(ex.stack);
        throw ex;
      }
    };
    if (
      typeof process === 'object' &&
      typeof process.versions === 'object' &&
      typeof process.versions.node === 'string'
    ) {
      self = { location: { href: __filename } };
      var onmessage = this.onmessage;
      var nodeWorkerThreads = require('worker_threads');
      global.Worker = nodeWorkerThreads.Worker;
      var parentPort = nodeWorkerThreads.parentPort;
      parentPort.on('message', function (data) {
        onmessage({ data: data });
      });
      var nodeFS = require('fs');
      var nodeRead = function (filename) {
        return nodeFS.readFileSync(filename, 'utf8');
      };
      function globalEval(x) {
        global.require = require;
        global.Module = Module;
        eval.call(null, x);
      }
      importScripts = function (f) {
        globalEval(nodeRead(f));
      };
      postMessage = function (msg) {
        parentPort.postMessage(msg);
      };
      if (typeof performance === 'undefined') {
        performance = {
          now: function () {
            return Date.now();
          },
        };
      }
    }
  })();
} else {
  INIT_ENGINE();
}
