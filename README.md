<h1 align="center">react-sortful</h1>

<h4 align="center">🔃 Sortable components for horizontal and vertical, nested, and tree forms. 🔄</h4>

<img src="./.docs/main.png" width="896" alt="Simple Vertical List, Nested Horizontal List, File Tree, Kanban, and Layers Panel">

```tsx
<List renderDropLine={renderDropLine} renderGhost={renderGhost} onDragEnd={onDragEnd}>
  <Item identifier="a" index={0}>Item A</Item>
  <Item identifier="b" index={1} isGroup>
    <div>Item B (Group)</div>
    <Item identifier="b-1" index={0}>Nested Item B - 1</Item>
    <Item identifier="b-2" index={1}>Nested Item B - 2</Item>
  </Item>
  <Item identifier="c" index={2}>Item C</Item>
</List>
```

<div align="center">
<a href="https://www.npmjs.com/package/react-sortful"><img src="https://img.shields.io/npm/v/react-sortful.svg" alt="npm"></a>
<a href="https://circleci.com/gh/jagaapple/react-sortful"><img src="https://img.shields.io/circleci/project/github/jagaapple/react-sortful/master.svg" alt="CircleCI"></a>
<a href="https://codecov.io/gh/jagaapple/react-sortful"><img src="https://img.shields.io/codecov/c/github/jagaapple/react-sortful.svg"></a>
<a href="https://www.chromaticqa.com/library?appId=5e6025bcf2b5b700222c2c33"><img src="https://img.shields.io/static/v1?label=catalogs&message=storybook&color=ff69b4"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/jagaapple/react-sortful.svg" alt="license"></a>
<a href="https://twitter.com/jagaapple_tech"><img src="https://img.shields.io/badge/contact-%40jagaapple_tech-blue.svg" alt="@jagaapple_tech"></a>
</div>

## Table of Contents

<!-- TOC depthFrom:2 -->

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup](#setup)
- [Contributing to react-sortful](#contributing-to-react-sortful)
- [License](#license)

<!-- /TOC -->


## Features
| FEATURES                                   | WHAT YOU CAN DO                                                           |
|--------------------------------------------|---------------------------------------------------------------------------|
| ⚛️ **Designed for React**                   | Get sortable components for your React project                            |
| ✨ **Simple API**                           | All you need is to know props of two components                           |
| 🔄 **Support for vertical and horizontal** | You can create vertical and horizontal lists                              |
| 👨‍👩‍👧‍👦 **Support for nested lists**         | You can stack lists in lists                                              |
| 🌴 **Creatable any forms**                 | Easy to create a draggable file tree, TODO lists, layers panel, and so on |
| 🎩 **Type Safe**                           | You can use with TypeScript                                               |

When you become interested in react-sortful, see [online catalogs (Storybook)](https://www.chromaticqa.com/library?appId=5e6025bcf2b5b700222c2c33)!

> ❗️ **react-sortful is currently in beta.**
> You can use react-sortful right now, but you might need to create pull requests for advanced use cases or fix for some bugs.
> Some of APIs will have breaking changes over time.

> 🙇🏻‍♂️ **Send me pull requests.**
> This was created to develop author's project and I don't have much time, please send me pull requests instead of issues.
> I will fix any bugs as soon as possible, but will not add new features for a while.


## Quick Start
### Requirements
- npm or Yarn
- React 16.8.0 or higher ( `react` and `react-dom` packages )

### Installation
```bash
$ npm install react-sortful
```

If you are using Yarn, use the following command.

```bash
$ yarn add react-sortful
```

### Setup
Firstly you have to do.

TODO


## Contributing to react-sortful
Bug reports and pull requests are welcome on GitHub at
[https://github.com/jagaapple/react-sortful](https://github.com/jagaapple/react-sortful). This project
is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the
[Contributor Covenant](http://contributor-covenant.org) code of conduct.

Please read [Contributing Guidelines](./.github/CONTRIBUTING.md) before development and contributing.


## License
The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright 2020 Jaga Apple. All rights reserved.
