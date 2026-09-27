declare module 'cmdz' {
  export interface CommandOptions {
    readonly command: string
    readonly cwd?: string
    readonly title?: string
    readonly env?: Readonly<Record<string, string>>
    readonly autostart?: boolean
  }

  export interface CommandDefinition extends CommandOptions {
    readonly name: string
  }

  export function Command(name: string, options: CommandOptions): CommandDefinition
}
