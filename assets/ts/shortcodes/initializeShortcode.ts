interface ShortcodeConfig<T, SCR> {
  name: string;
  getParams: (params: URLSearchParams) => T;
  mount: (
    params: T,
    runtimeContext: ShortCodeRuntime<T, SCR>
  ) => void | Promise<void>;
  onError?: (error: Error) => void;
}

export type ShortCodeRuntime<TParams, SCR = TParams> = ShortcodeConfig<TParams, SCR> & SCR;

const shortCodeRuntimes: Record<string, ShortCodeRuntime<unknown>> = {};

export async function initializeShortcode<T, SCR>(config: ShortcodeConfig<T, SCR>) {
  const searchParams = new URLSearchParams(location.search);

  const shortcodeType = searchParams.get("type");

  if (!shortcodeType) {
    return;
  }

  const shortcode = config.name;
  const runtime = shortCodeRuntimes[shortcode];

  if (runtime) {
    throw new Error(`Shortcode ${shortcode} is already initialized`);
  }

  const runtimeContext = {
    ...config
  }

  shortCodeRuntimes[shortcode] = runtimeContext;

  if (shortcode === shortcodeType) {
    try {
      const params = config.getParams(searchParams);
      await config.mount(params, runtimeContext as ShortCodeRuntime<T, SCR>);
    } catch (error) {
      config?.onError(error);
    }
  }
}

// @ts-expect-error - Expose shortCodeRuntimes to the window object
window.shortCodeRuntimes = shortCodeRuntimes;
