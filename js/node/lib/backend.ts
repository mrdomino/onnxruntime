// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {Backend, InferenceSession, InferenceSessionHandler, SessionHandler} from 'onnxruntime-common';

import {Binding, binding} from './binding';

class OnnxruntimeSessionHandler implements InferenceSessionHandler {
  constructor(private inferenceSession: Binding.InferenceSession) {
    this.inputNames = this.inferenceSession.inputNames;
    this.outputNames = this.inferenceSession.outputNames;
  }

  async dispose(): Promise<void> {
    return Promise.resolve();
  }

  readonly inputNames: string[];
  readonly outputNames: string[];

  startProfiling(): void {
    // TODO: implement profiling
  }
  endProfiling(): void {
    // TODO: implement profiling
  }

  async run(feeds: SessionHandler.FeedsType, fetches: SessionHandler.FetchesType, options: InferenceSession.RunOptions):
      Promise<SessionHandler.ReturnType> {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        try {
          resolve(this.inferenceSession.run(feeds, fetches, options));
        } catch (e) {
          // reject if any error is thrown
          reject(e);
        }
      });
    });
  }
}

class OnnxruntimeBackend implements Backend {
  async init(): Promise<void> {
    return Promise.resolve();
  }

  async createInferenceSessionHandler(
      pathOrPromise: string|Promise<Uint8Array>,
      options?: InferenceSession.SessionOptions): Promise<InferenceSessionHandler> {
    await Promise.resolve();
    const inferenceSession = new binding.InferenceSession();
    const finalOptions = options || {};
    if (typeof pathOrPromise === 'string') {
      inferenceSession.loadModel(pathOrPromise, finalOptions);
    } else {
      const array = await pathOrPromise;
      inferenceSession.loadModel(array.buffer, array.byteOffset, array.byteLength, finalOptions);
    }
    return new OnnxruntimeSessionHandler(inferenceSession);
  }
}

export const onnxruntimeBackend = new OnnxruntimeBackend();
export const listSupportedBackends = binding.listSupportedBackends;
