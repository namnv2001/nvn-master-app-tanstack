---
title: 'Hydration and React <Suspend />'
authors: ['vawnnam']
summary: "Recently, I've been working with CWV and bumped in this whole hydration thing"
date: '2026-03-01'
lastModified: '2026-03-01'
draft: false
tags: ['react', 'hydration', 'performance']
---

## What Is Hydration

In modern React web application, the web content is provided through the process:

- HTML and CSS content is served through SSR first on page load
- Client renders the layout using provided HTML and CSS -> Gives users the feeling of a fast website
- During that time, the client download the needed JS code for the website
- Web engine then bind the JS code with the current HTML, CSS
- The website became fully interactive and finish initial process

> The process where web engine bind JS with existing HTML, CSS is called hydration.

## Problem With Hydration In Middle-end Devices

The device needs to download every single bit of JS before hydration, and this process relies heavily on the CPU power. Says you're having a screen with 2 components navbar and comment. The comment component needs to call and API to display its content. Then before hydration, the device needs to wait for the API to complete, just for the comment component even though the navbar doesn't need it. During this whole waiting phase, the user interface is non-interactive. If the user for example, clicks a button during this time, the page won't be able to response, made the INP (Interaction to Next Paint) increase terrifically and reduce the user experience.

> - You have to fetch everything before you can show anything.
> - You have to load everything before you can hydrate anything.
> - You have to hydrate everything before you can interact with anything.

## React 18 <Suspend />

React 18 solved this problem by introducing the `<Suspend />` component. Details could be found in [this discussion](https://github.com/reactwg/react-18/discussions/37).

_What if we could do each of these stages for a part of a screen instead of the entire app?_ React 18 took that exact approach to solve the problem. By hydrate each component separately, the website could be interactive quickly while keeping the so called "slow" components in a waiting state. After rendering the layout, the device still downloads JS like before, but "slow" components are split to another thread. The hydrate process for "fast" component happens like normal, during that, "slow" component JS are kept downloaded. The UI then renders these "slow" component as some kind of wrapper layout, eg: spinning icon. After download complete, those code are mocked with the actual HTML -> Shows component UI as fully interactive.

This functionality is automatically wrapped inside React 18, you don't need to configure anything. Just wrap the "slow" component inside a `<Suspend />` tag, that's it!
