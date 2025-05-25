export async function loop(
  func: () => any,
  func_catch: (e: Error) => void,
  delay?: number
): Promise<void> {
  try {
    await func()
  } catch (e) {
    await func_catch(e)
  }
  setTimeout(() => loop(func, func_catch), delay)
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function Throw(error: Error, error2?: Error): never {
  if (error2) {
    error.stack = error.stack + '\n' + error2.stack
    throw error
  }
  throw error
}

export function env(env: string): string {
  const envvar = process.env[env]
  if (envvar == null || envvar === '') {
    console.warn(`[Config.${env}] Not set in .env`)
  }
  return envvar as string
}
