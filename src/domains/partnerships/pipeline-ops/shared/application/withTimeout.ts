export async function withTimeout<T>(promise: Promise<T>, ms: number, onTimeout: () => T): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(onTimeout()), ms);
  });

  return Promise.race([promise.finally(() => clearTimeout(timeoutId!)), timeoutPromise]);
}
