# `@expo/html-elements`: on Android and iOS, headings scale with the system text size twice

`@expo/html-elements` 58.0.3 (`main` at 7f5e6a7cf8 has the same
`src/css/units.ts`), Expo SDK 58 (expo 58.0.19) with React Native 0.88.0, Android 17
emulator (x86_64).

1. `npm install`, then `npx expo run:android`.
2. The screen shows two frames, each holding one line of bold text and
   reporting its height from `onLayout`: an `<H4>`, whose size the library
   gives as h4's 1em, 16 px, and a `<Text>` at `fontSize: 16`, bold.
3. Set the system text size to its largest, in Settings > Display > Font size,
   or with `adb shell settings put system font_scale 2.0`, then reload the
   app. The reload matters: the library reads the scale when its module
   loads.

Expected: the two frames are the same height at every text size, since
React Native scales both by the same setting.

Actual, after a reload at 200% (`PixelRatio.getFontScale()` 2):

| Case | 100% | 200% |
| --- | --- | --- |
| `<H4>` | 24 | 55 |
| `<Text>` at 16, bold | 24 | 40 |

Set back to 100% without a reload, the `<H4>` still measures 45 and the
`<Text>` 24, so a heading keeps the size of whatever text setting the app was
started with.

Why: on Android and iOS, `rem()` in `src/css/units.ts` returns
`PixelRatio.getFontScale() * 16 * value`, and `em()` returns `rem()`. A `Text`
has `allowFontScaling` on by default, so React Native multiplies that already
scaled number by the font scale again. The style is created once, when
`Headings` loads, so the first multiplication also stays at the scale the app
started with.

Returning `16 * value` instead lets React Native apply the scale once, as it
does for any other `fontSize`. With that change made to the installed
`build/css/units.js` and Metro's cache cleared, both frames measure 40 at 200%
and 24 when set back to 100% without a reload.
