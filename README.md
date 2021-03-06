# GuillotineJS

- [GuillotineJS](#guillotine)
  - [Live demo](#live-demo)
  - [Installation](#installation)
  - [Controls](#controls)
  - [Caveats](#caveats)
  
  
Recording a presentation while showing your webcam is sometimes a bit tricky. You can get by with [OBS](https://obsproject.com), but it's a bit overkill when you just want to give a talk from time to time.

---

**GuillotineJS** is a bit of Javascript that allows you to have a floating HTML element with your webcam in web presentations.

<img src="resources/guillotinejs.png" width="760"/></a>

See also [Guillotine](https://github.com/rberenguel/Guillotine) for a cross-platform native (Electron) app. _GuillotineJS_ can solve the issue of _Guillotine_ not working for full-screen presentations.

---

_GuillotineJS_ shares the core ideas of _Guillotine_, but with simpler code. It uses the drag controls from my [generative sketches GUI helper](https://mostlymaths.net/2020/05/blot-painting-p5js-sketch.html/#the-gui), and since it lives in one window, doesn't need as much code.

## Live demo

You can try it with [this reveal.js presentation](https://mostlymaths.net/commoditisation-languages/commoditisation.html#/commoditisation-and-programming-languages). Press `Ctrl-Shift-V` to show the selection modal (see [controls](#controls)).

## Installation

#### For third party websites/slides
 
To use _GuillotineJS_ as a bookmarklet in _a_ website you need to use either Firefox or Chrome, since you need a browser where you can disable Content Security Policy. This is potentially risky, so be sure you only deactivate it temporarily.

- In Firefox, you need to disable `security.csp.enable` in the `about:config` menu. This is a global setting, so it is recommended to install a version of Firefox with this setting. 
- In Chrome, you should install an extension that lets you disable CSP (I have tried [this one](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden?hl=en)). Sometimes it seems to have issues applying the setting to a website, and a hard reload _seems_ to help. Check the Javascript console for CSP errors when pressing the bookmarklet to see if it is working or not.

Once you have any of these, you can add these bookmarklets:

- `GuillotineJS`: `javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://cdn.jsdelivr.net/gh/rberenguel/guillotinejs/src/guillotine.js';})();` After disabling CSP, press the bookmarklet.
- `GuillotineJS for Google Slides`: `javascript:(function(){document.querySelector(".punch-present-iframe").contentDocument.body.appendChild(document.createElement('script')).src='https://cdn.jsdelivr.net/gh/rberenguel/guillotinejs/src/guillotine.js';})();` To use it in Google Slides, activate `Present mode`, and move your mouse up so your `Bookmarks` menu shows, then click this bookmarklet.

The quickest way to create a bookmarklet from this code is to create a bookmark to this page and edit its destination with the code above in the link field.

#### For self-hosted presentations

For instance, presentations created with [reveal.js](https://revealjs.com), maybe using [Haskset](https://github.com/rberenguel/haskset). You only need to add [guillotine.js](src/guillotine.js) to your HTML presentation, by adding it an imported script. 

## Controls

After loading it (either as an import or via the bookmarklet), press `Ctrl-Shift-V`<sup>1</sup> to get a modal view of your camera (you can choose which camera if there are more than one, although on Mac OS this does not work in Safari). 

Click on the cutoff frame to give it keyboard focus, then
- Scroll wheel in the frame to resize it (larger or smaller),
- Drag it around to select what to capture,
- `+`/`-` to make it larger or smaller via keyboard,
- `S`/`R` to make the frame `S`quarer or `R`ounder,
- `Space` to create the floating element with the currently focused area
- All controls except `space` work after creating the element, so you can resize the frame, move it around or reshape it.

You can also use `?` to get help.

1: Turns out Chrome in MacOS converts `alt+v` into, well, what `alt+v` is, namely `√`, making the capture to fail unless I want to add explicit key codes. Likewise, `Ctrl-Shift-v` is processed as `Ctrl-V`, but this is at least easy to handle and cross-platform.

The font used is [Monoid](https://larsenwork.com/monoid/), inlined via base64 in the Javascript file. An interesting trick I learnt for [Glancer](https://github.com/rberenguel/glancer).

## Caveats

* Some websites _really_ take control of your keyboard, and mess with _GuillotineJS_ access to its trigger key. This happens for instance in twitter. You can add `?init` to the URL of `guillotine.js` to trigger the modal without the keyboard shortcut.
* Currently the keyboard controls do not work in the Google Slides version, since Google Slides in present mode works in an iFrame, keypresses are captured in a different scope. I need to think how to best address this.
* There are some usability improvements to add to the keyboard controls, as well as adding some kind of help.
* The code needs a good cleanup, there are many repeated and non-configurable constants.
* There are no tests, basically there is not a lot that is easily testable here. I'm open to ideas.
---

<a href="https://www.buymeacoffee.com/rberenguel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="51" width="217"></a>


