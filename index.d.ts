interface Add<TProto extends object, TFunction, TOuterSyntax extends boolean = false> {
  (target: TProto, f: TFunction, outerSyntax?: TOuterSyntax): TFunction extends (this: TProto) => unknown
    ? ReturnType<AddSimple<TProto>>
    : TFunction extends (this: TProto, ...args: infer TArgs) => unknown
      ? TOuterSyntax extends true
        ? ReturnType<AddProperty<TProto>>
        : ReturnType<AddWithParams<TProto, TArgs>>
      : never
}
export function add<TProto extends object, TFunction, TOuterSyntax extends boolean = false>(
  ...args: Parameters<Add<TProto, TFunction, TOuterSyntax>>
): ReturnType<Add<TProto, TFunction, TOuterSyntax>>

interface AddProperty<TProto extends object> {
  (target: TProto, f: (this: TProto, ...args: unknown[]) => unknown): symbol
}
export function addProperty<TProto extends object>(
  ...args: Parameters<AddProperty<TProto>>
): ReturnType<AddProperty<TProto>>

interface AddWithParams<TProto extends object, TArgs extends unknown[]> {
  (target: TProto, f: (this: TProto, ...args: TArgs) => unknown): (...args: TArgs) => symbol
}
export function addWithParams<TProto extends object, TArgs extends unknown[]>(
  ...args: Parameters<AddWithParams<TProto, TArgs>>
): ReturnType<AddWithParams<TProto, TArgs>>

interface AddSimple<TProto extends object> {
  (target: TProto, f: (this: TProto) => unknown): symbol
}
export function addSimple<TProto extends object>(
  ...args: Parameters<AddSimple<TProto>>
): ReturnType<AddSimple<TProto>>
