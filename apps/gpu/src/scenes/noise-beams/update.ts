import { Effect, Match as M, Predicate, Random } from 'effect'
import { Command, Runtime, Update } from 'foldkit'
import { modifyFields } from 'foldkit/struct'

import { CompletedGenerateNoiseSeed, Message } from './message'
import {
  DrawingNoiseBeams,
  FailedRenderer,
  GeneratingNoiseBeams,
  Model,
  UnsupportedRenderer,
  WaitingNoiseBeams,
} from './model'

const FRAME_DELTA_CAP_MS = 250

const MAXIMUM_NOISE_SEED = 2_147_483_647

export const GenerateNoiseSeed = Command.define('GenerateNoiseSeed', {
  messages: [CompletedGenerateNoiseSeed],
  execute: Random.nextIntBetween(0, MAXIMUM_NOISE_SEED).pipe(
    Effect.map(seed => CompletedGenerateNoiseSeed({ seed })),
    Effect.catch(() => Effect.succeed(CompletedGenerateNoiseSeed({ seed: 0 }))),
  ),
})

export const init: Runtime.ApplicationInit<Model, Message> = () => ({
  model: GeneratingNoiseBeams(),
  commands: [GenerateNoiseSeed()],
})

type UpdateReturn = Update.Return<Model, Message>

const withUpdateReturn = M.withReturnType<UpdateReturn>()

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      TickedFrame: ({ deltaTimeMs }) =>
        M.value(model).pipe(
          withUpdateReturn,
          M.tagsExhaustive({
            GeneratingNoiseBeams: () => ({ model }),
            WaitingNoiseBeams: () => ({ model }),
            DrawingNoiseBeams: drawingModel => ({
              model: modifyFields(drawingModel, {
                elapsedSeconds: elapsedSeconds =>
                  elapsedSeconds +
                  Math.min(deltaTimeMs, FRAME_DELTA_CAP_MS) / 1_000,
              }),
            }),
            UnsupportedRenderer: () => ({ model }),
            FailedRenderer: () => ({ model }),
          }),
        ),
      CompletedGenerateNoiseSeed: ({ seed }) =>
        Predicate.isTagged('GeneratingNoiseBeams')(model)
          ? { model: WaitingNoiseBeams({ seed }) }
          : { model },
      CompletedInitializeRenderer: () =>
        Predicate.isTagged('WaitingNoiseBeams')(model)
          ? {
              model: DrawingNoiseBeams({
                seed: model.seed,
                elapsedSeconds: 0,
              }),
            }
          : { model },
      DetectedUnsupportedRenderer: () =>
        Predicate.isTagged('UnsupportedRenderer')(model) ||
        Predicate.isTagged('FailedRenderer')(model)
          ? { model }
          : { model: UnsupportedRenderer() },
      FailedInitializeRenderer: ({ reason }) =>
        Predicate.isTagged('UnsupportedRenderer')(model) ||
        Predicate.isTagged('FailedRenderer')(model)
          ? { model }
          : { model: FailedRenderer({ reason }) },
    }),
  )
