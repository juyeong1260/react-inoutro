# react-inoutro

The `Inoutro` component is a versatile component designed to manage the transition states of child elements. It provides a controlled way to handle animations and transitions, ensuring smooth entry and exit animations for the elements it wraps.

## Inoutro

### Props

| Prop         | Type                                                                                                    | Required | Default | Description                                                                                                 |
|--------------|---------------------------------------------------------------------------------------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------|
| `render`     | `InoutroRenderProps` | Yes      | -       | A render prop function that receives the current transition status, duration, type, and visibility status. It should return a React node that represents the component to be rendered. |
| `open`       | `boolean`                                                                                               | Yes      | -       | A boolean value that determines whether the child component should be shown or hidden. |
| `duration`   | `number`                                                                                                | No       | `250`   | The duration of the transition in milliseconds. This defines how long the enter and exit transitions should take. |
| `initial`    | `TransitionStatus`                                                                                      | No       | `undefined` | The initial transition status of the component. It can be used to set the component's state at the start. |
| `onEnter`    | `() => void`                                                                                            | No       | -       | A callback function that is called when the component completes the enter transition.                          |
| `onExit`   | `() => void`                                                                                            | No       | -       | A callback function that is called when the component completes the exit transition and is fully closed.    |
| `ignoreIntro`| `boolean`                                                                                               | No       | `false` | A boolean flag to ignore the intro transition. When `true`, the component does not perform the enter animation. |
| `ignoreOutro`| `boolean`                                                                                               | No       | `false` | A boolean flag to ignore the outro transition. When `true`, the component does not perform the exit animation. |
| `safeMode`   | `boolean`                                                                                               | No       | `false` | A boolean flag that determines whether to keep rendering the child component after onExit. |
