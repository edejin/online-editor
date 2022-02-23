(() => {
  const f = ['log', 'info', 'warn', 'error', 'clear'];
  window.infinityLoopError = () => {
    window.parent.postMessage(JSON.stringify({
      type: 'infinityLoopError'
    }), '*');
  };
  for (const r of f) {
    ((r) => {
      const z = r + '_';
      console[z] = console[r];
      console[r] = (...args) => {
        window.parent.postMessage(JSON.stringify({
          type: r,
          data: args
        }), '*');
        console[z](...args);
      }
    })(r);
  }
  const timeStore = new Map();
  console.time_ = console.time;
  console.time = (key) => {
    const time = Date.now();
    timeStore.set(key, time);
  }
  console.timeEnd_ = console.timeEnd;
  console.timeEnd = (key) => {
    const v = timeStore.get(key);
    if (!v) {
      console.log(`Timer '${key}' does not exist`);
      return;
    }
    const time = Date.now();
    console.log(`${key}: ${time - v} ms`);
    timeStore.delete(key);
  }
})();
