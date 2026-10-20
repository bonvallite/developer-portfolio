// Retry transient failures with capped exponential delay and jitter.
export async function retry(operation, { attempts = 4, baseMs = 200 } = {}) {
  for (let i = 0; i < attempts; i++) {
    try { return await operation(); }
    catch (error) {
      if (i === attempts - 1) throw error;
      const delay = Math.min(baseMs * 2 ** i, 5000) + Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
