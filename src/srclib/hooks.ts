import {Ref, shallowReactive, shallowRef} from 'vue'

type AbstractFunction = (...args: any[]) => any

export enum TaskState {
  NOT_CALLED='NOT_CALLED',
  PENDING = 'PENDING',
  RESOLVED='RESOLVED',
  REJECTED='REJECTED',
}

export const useAsyncWrapper = <T extends AbstractFunction, E extends Error>(payloadGetter: T) => {
  let state = shallowReactive({
    isCalled: false,
    isPending: false,
    isResolved: false,
    isRejected: false,
    state: TaskState.NOT_CALLED,
    error: null as E | null,
    result: null as Awaited<ReturnType<T>> | null,
    run: (async () => undefined) as (...params: Parameters<T>) => Promise<void>,
  })

  const listeners: Ref<Array<[() => void, (err: E) => void]>> = shallowRef([])

  state.run = async (...params: Parameters<T>): Promise<void> => {
    state.isCalled = true

    state.isResolved = false
    state.isRejected = false

    try {
      if (state.isPending) {
        return new Promise((resolve, reject) => {
          listeners.value.push([resolve, reject])
        })
      }

      state.isPending = true
      state.state = TaskState.PENDING

      state.result = await payloadGetter(...params)
      state.isResolved = true
      state.state = TaskState.RESOLVED
      if (listeners.value.length) {
        listeners.value.forEach(([resolve, _]) => resolve())
      }
    } catch (err) {
      console.log(err)

      state.isRejected = true
      state.state = TaskState.REJECTED

      state.error = err as E
      if (listeners.value.length) {
        listeners.value.forEach(([_, reject]) => reject(err as E))
      }
    } finally {
      state.isPending = false
      listeners.value = []
    }
  }

  return state
}
