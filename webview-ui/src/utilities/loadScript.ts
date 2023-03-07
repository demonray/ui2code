type CallbackFunction = (context: null | Error, script: any) => void;

const callbacks: {
  [propName: string]: CallbackFunction[];
} = {};

/**
 * 加载一个远程脚本
 * @param {String} src 一个远程脚本
 * @param {Function} cb 回调
 */
function loadScript(src: string, cb: CallbackFunction) {
  const existingScript = document.getElementById(src);
  if (!existingScript) {
    callbacks[src] = [];
    const $script = document.createElement("script");
    $script.src = src;
    $script.id = src;
    $script.async = true;
    document.body.appendChild($script);
    $script.onload = () => {
      $script.onerror = $script.onload = null;
      callbacks[src].forEach((item) => {
        item(null, $script);
      });
      delete callbacks[src];
    };
    $script.onerror = () => {
      $script.onerror = $script.onload = null;
      cb(new Error(`Failed to load ${src}`), $script);
    };
  }
  callbacks[src].push(cb);
}

export default loadScript;
