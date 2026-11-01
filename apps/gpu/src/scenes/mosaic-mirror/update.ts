import { Array, Match, Option, Predicate, Schema } from 'effect'
import { Update } from 'foldkit'
import { modifyFields } from 'foldkit/struct'

import { layout, tileLevels } from './engine/grid'
import { Message } from './message'
import {
  Density,
  Failed,
  HexColor,
  Idle,
  Model,
  Paused,
  Percentage,
  Running,
  Starting,
  defaultSettings,
} from './model'

const emptyGrid = (density: number, width = 256, height = 192) => {
  const { columns, rows } = layout(width, height, density)

  return {
    width,
    height,
    columns,
    rows,
    coverage: Array.makeBy(columns * rows, () => 0),
  }
}

type UpdateReturn = Update.Return<Model, Message>

const withUpdateReturn = Match.withReturnType<UpdateReturn>()

export const init = (): UpdateReturn => ({
  model: {
    state: Idle(),
    session: 0,
    settings: defaultSettings,
    grid: emptyGrid(defaultSettings.density),
    levels: [],
    timeMs: 0,
    lastMaskMs: 0,
  },
})

export const isActive = (model: Model): boolean =>
  Predicate.isTagged('Starting')(model.state) ||
  Predicate.isTagged('Running')(model.state)

export const update = (model: Model, message: Message): UpdateReturn =>
  Match.value(message).pipe(
    withUpdateReturn,
    Match.tagsExhaustive({
      ClickedStart: () =>
        isActive(model)
          ? { model: model }
          : {
              model: modifyFields(model, {
                state: () => Starting(),
                session: session => session + 1,
                levels: () => [],
                timeMs: () => 0,
                lastMaskMs: () => 0,
              }),
            },
      ClickedStop: () => ({
        model: modifyFields(model, { state: () => Idle(), levels: () => [] }),
      }),
      CompletedStartCamera: ({ session }) =>
        session === model.session && Predicate.isTagged('Starting')(model.state)
          ? { model: modifyFields(model, { state: () => Running() }) }
          : { model: model },
      FailedCamera: ({ session, reason }) =>
        session === model.session && isActive(model)
          ? {
              model: modifyFields(model, {
                state: () => Failed({ reason }),
                levels: () => [],
              }),
            }
          : { model: model },
      PausedCamera: ({ session }) =>
        session === model.session && isActive(model)
          ? {
              model: modifyFields(model, {
                state: () => Paused(),
                levels: () => [],
              }),
            }
          : { model: model },
      TickedFrame: ({ deltaTimeMs }) =>
        isActive(model)
          ? {
              model: modifyFields(model, {
                timeMs: time => time + Math.max(0, Math.min(deltaTimeMs, 100)),
              }),
            }
          : { model: model },
      ReceivedMask: ({ session, density, grid }) => {
        if (
          session !== model.session ||
          density !== model.settings.density ||
          !Predicate.isTagged('Running')(model.state)
        ) {
          return { model: model }
        }

        const sameLayout =
          grid.columns === model.grid.columns &&
          grid.rows === model.grid.rows &&
          grid.width === model.grid.width &&
          grid.height === model.grid.height

        const levels = tileLevels(
          grid,
          sameLayout ? model.levels : [],
          model.settings.sensitivity,
          model.settings.smoothing,
          Math.max(1, model.timeMs - model.lastMaskMs),
        )

        return {
          model: modifyFields(model, {
            grid: () => grid,
            levels: () => levels,
            lastMaskMs: () => model.timeMs,
          }),
        }
      },
      UpdatedControl: ({ control, value }) => {
        if (value.trim() === '') {
          return { model: model }
        }

        const maybeValue = Schema.decodeUnknownOption(Schema.NumberFromString)(
          value,
        )

        return Option.match(maybeValue, {
          onNone: () => ({ model: model }),
          onSome: number => {
            if (control === 'Density') {
              if (!Schema.is(Density)(number)) {
                return { model: model }
              }

              return {
                model: modifyFields(model, {
                  settings: settings =>
                    modifyFields(settings, { density: () => number }),
                  grid: () =>
                    emptyGrid(number, model.grid.width, model.grid.height),
                  levels: () => [],
                }),
              }
            }

            if (!Schema.is(Percentage)(number)) {
              return { model: model }
            }

            return {
              model: modifyFields(model, {
                settings: settings =>
                  control === 'Sensitivity'
                    ? modifyFields(settings, { sensitivity: () => number })
                    : modifyFields(settings, { smoothing: () => number }),
              }),
            }
          },
        })
      },
      UpdatedColor: ({ control, value }) =>
        Option.match(Schema.decodeUnknownOption(HexColor)(value), {
          onNone: () => ({ model: model }),
          onSome: color => ({
            model: modifyFields(model, {
              settings: settings =>
                control === 'Base'
                  ? modifyFields(settings, { base: () => color })
                  : modifyFields(settings, { subject: () => color }),
            }),
          }),
        }),
      SelectedMirror: ({ mode }) => ({
        model: modifyFields(model, {
          settings: settings => modifyFields(settings, { mirror: () => mode }),
        }),
      }),
      ClickedPalette: ({ base, subject }) =>
        Schema.is(HexColor)(base) && Schema.is(HexColor)(subject)
          ? {
              model: modifyFields(model, {
                settings: settings =>
                  modifyFields(settings, {
                    base: () => base,
                    subject: () => subject,
                  }),
              }),
            }
          : { model: model },
    }),
  )
