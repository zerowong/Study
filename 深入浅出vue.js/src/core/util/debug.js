import { noop } from '../../shared/util'

export let warn = noop

if (process.env.NODE_ENV !== 'production') {
  warn = (msg, vm) => {
    console.error(`[Vue warn]: ${msg}`)
  }
}
