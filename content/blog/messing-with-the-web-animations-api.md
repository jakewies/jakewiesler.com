---
title: "Messing with the Web Animations API"
date: 2017-11-21T20:24:37-05:00
slug: "messing-with-the-web-animations-api"
description: "The Web Animations API is an experimental technology that allows developers to take advantage of the browser animation engine. This post walks through a real world example of the Web Animations API in action."
keywords: ["Web Animations API", "keyframes"]
draft: false
stylesheet: "post.css"
---

The [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API#Browser_compatibility) is still a very "experimental" technology that I've been trying to find an excuse to play with for some time. It's not something I can really use in my day job because of browser compatibility and general project requirements. 

However, during the last couple of days I broke ground on a new side project and an opportunity to _get creative_ arose. The idea behind the project is to visualize some running 👟 statistics of mine that I'm collecting from the [Strava API](https://strava.github.io/api/). What can I say? I'm a data junkie.

One of the app's main functions is to filter these statistics by a certain time frame, currently `week`, `month`, and `year`. I tossed around a few ideas as to how this filter component would look and function. The process started in Sketch and eventually moved over to Codepen. 

I decided that I'd like to have a filter switch that would allow the user to move between different filter states. This is where the Web Animation API (WAAPI) idea started to come through. 

Here's the end result:

{{% pen id="gXvqMo" title="Slide Filter" caption="Open it up in a new tab and poke around. There isn't all that much too it, ~40 lines of JavaScript." %}}

I didn't dive too far into the WAAPI, but what I learned definitely warrants a small post about it. So let's jump in!

{{< h2 >}}Browser compatibility{{</ h2 >}}

Before we begin, it's important to note that the WAAPI is still very new. So much so that most browsers don't even support it. As of writing this, [CanIUse](https://caniuse.com/#search=web%20animations) shows that Firefox v52+ and Chrome v49+ have partial support, but all other major browsers such as IE, Edge, and Safari lack any support at all 😢.

There are some solutions to this issue. GitHub repos such as [web-animations-js](https://github.com/web-animations/web-animations-js) exist to provide polyfills that bring WAAPI features to browsers that don't support them natively.

{{< h2 >}}HTML structure{{</ h2 >}}

If you view the Codepen embed, or "pen" from this point on, you will see that the HTML making up the filter is _very_ simple. I'm a fan of [pug templates](https://pugjs.org/api/getting-started.html) when working in Codepen but I will outline the structure in pure HTML just for reference:

```html
<div class="filter">
  <div class="filter__item filter__item--active">week</div>
  <div class="filter__item">month</div>
  <div class="filter__item">year</div>
  <div class="filter__switch"></div>
</div>
```

The `.filter` container holds the structure of the component. The 3 `.filter__item` elements represent each time frame. And finally the `.filter__switch` element will be an absolutely positioned "switch".

{{< h2 >}}CSS{{</ h2 >}}

I love flexbox. It's the most used CSS property in my toolbag. The `.filter` element is a flex container holding three `.filter__item` elements that are flex children, each one taking up the same width as the others. Let's take a look at the styles that make this work:

```css
.filter {

  /* define structure */

  width: 500px;
  height: 200px;
  border-radius: 100px;
  background: #373b56;



  /* allows for absolute positioning of 
     the .filter__switch element */

  position: relative;



  /* flex styles to align .filter__item elements */

  display: flex;
  justify-content: space-between;
  align-items: center;

}


.filter__item {

  width: 33.33%;
  z-index: 2;

}


.filter__switch {

  /* define structure */

  height: calc(100% - 10px);
  width: calc(33.33% - 10px);
  border-radius: 100px;
  background: #5a6be8;

  

  /* absolute positioning provides
     the ability to place the switch wherever
     we want it */

  position: absolute;
  top: 5px;
  left: 5px;

}
```

### `.filter`

The `.filter` element defines the entire structure using hardcoded values for its dimensions. All children elements will use percentage values for `width` based on the explicit `width` set here. It is also a flex container, spreading its `.filter__item` children evenly within. 

### `.filter__item`

The `.filter__item` element receives a percentage width of one third that of its parent's. When it is active, the `z-index` property allows it to appear over the `.filter__switch`. Without it, the `.filter__switch` would be absolutely positioned _over_ the active `.filter__item` text, and we don't want that.

### `.filter__switch`

The `.filter__switch` dimensions are calculated based on the dimensions of its parent container, namely `.filter`. It's important to note that the subtraction of 10px is to provide what I refer to as _absolute padding_. 

Why is this being done? There needs to be some space between `.filter__switch` and the inner wall of `.filter`. Normally this would be solved using some padding. The problem is that padding has no affect on absolutely positioned elements. 

In order to solve this we can set `.filter__switch` to be 100% of its parent's height and 33.33% of its width (the same as `.filter__item`), and then subtract 10px. This effectively leaves 10px of empty space that can be used as _absolute padding_ around the switch. 

The final piece to the puzzle is the directional properties `top` and `left`. By specifying `top: 5px` and `left: 5px` we are pushing `.filter__switch` into the middle of `.filter`, giving us 5px of that sweet _absolute padding_. 

If you're wondering how we got 5px, just think about it like this. We have 10px of empty space. To center the switch we put 5px on top and 5px on the left. 5 + 5 = 10. Maths.

{{< h2 >}}JS: The meat and potatoes{{</ h2 >}}

We now have a structurally and stylistically complete filter, but we're still missing the functionality. This is the most important part of the component _and_ this post. Let's get right to it.

### The goal

Identify the position of the clicked `.filter__item` and move the `.filter__switch` directly behind it. Not too difficult, right? In fact, it's really not. The Document Object Model exposes a handy method for us to determine the coordinates and dimensions of any element. We'll talk about it shortly.

### The implementation

Before we jump into the JavaScript I want to stop real quick and break away from the terminology used in the CSS section. I have been referring to three elements: `.filter`, `.filter__item`, and `.filter__switch` by their class names. In this section we'll be stepping through some JavaScript and there will be variable names that may clash with the class names used in the CSS. From this point on I'll refer to:

- `.filter` as _the filter_ 
- `.filter__item` as _filter item_ 
- `.filter__switch` as _switch_ 

Moving on.


We need a click event on each filter item to let us know where to move the switch. The best way to handle this is to add the event listener to the filter and only perform an action if a filter item triggered the event. This is called **event delegation**.


```javascript
document.querySelector('.filter').addEventListener('click', e => {
  e.stopPropagation()

  if (e.target.classList.contains('filter__item') && !e.target.classList.contains('filter__item--active')) {
    // do something...
  }
})
```

Event delegation usually requires the `stopPropagation()` method of the event to prevent it from bubbling up the DOM. When the event is fired we can check if the element that triggered it was a filter item but not one that was already active.

The next step is to identify the position of the filter item that was clicked. This is possible using a method named `getBoundingClientRect()`. This method can be called on any element in the DOM and will return some dimensions and positional data about it.

```javascript
document.querySelector('.filter').addEventListener('click', e => {
  e.stopPropagation()

  const el = e.target

  if (el.classList.contains('filter__item') && !el.classList.contains('filter__item--active')) {
    const filterItemData = el.getBoundingClientRect()
    const switchData = document.querySelector('.filter__switch').getBoundingClientRect()
  }
})
```

The `filterItemData` variable contains information regarding the clicked filter item's whereabouts in the DOM. We'll also do the same for the switch, storing its data in the aptly named variable `switchData`.

{{< h2 >}}The maths{{</ h2 >}}

At the heart of this animation is a mathematical formula that calculates the new `x` coordinate for the switch. The goal is to move the switch directly behind the filter item so that the text of the filter item sits in the middle of the switch. If we can calculate the `x` coordinate that lies directly in the middle of the filter item, then we can use it to determine where to move the switch such that the two elements will line up perfectly.

### Finding the mid point

The `filterItemData` variable includes an `x` coordinate and a `width` property. The `x` coordinate signifies where the element _starts_ on the x axis. If we cut the `width` in half and add it to `x` we'll get a new value representing the _mid point_. 

Notice that I'm not calling it the mid point of the filter item. Technically it is, but it's also the _new_ mid point of the switch. If they are going to sit perfectly on top of each other in the DOM then they must share mid points.

### Finding the new x coordinate of the switch

We've found the mid point but we still need to find the new `x` coordinate of the switch. How can this be done? 

> Think about how we found the mid point.

We knew the `x` coordinate and the `width` of the filter item. By adding half of the `width` to `x` we calculated the mid point. This time the situation is reversed. We have the mid point and the switch's `width`. All that needs to be done is to _subtract_ half of the switch's `width` from the mid point!

```javascript
document.querySelector('.filter').addEventListener('click', e => {
  e.stopPropagation()

  const el = e.target

  if (el.classList.contains('filter__item') && !el.classList.contains('filter__item--active')) {
    const filterItemData = el.getBoundingClientRect()
    const switchData = document.querySelector('.filter__switch').getBoundingClientRect()

    const midPoint = filterItemData.x + (filterItemData.width / 2)
    const newSwitchX = midPoint - (switchData.width / 2)
  }
})
```

Not too much math and pretty straight forward. Take a few minutes to look over the current code before moving on.

### Animating the switch

Now that the new `x` coordinate for the switch has been calculated, all that's left to do is move the sucker. This is where the WAAPI comes in to play. If you've ever used CSS animations and transitions then this next step will feel pretty familiar to you. The WAAPI allows us to tap in to the browser animation engine using JavaScript.

You may say to yourself, "Can't I just keep doing this in CSS?". Sure you can, but moving animations from CSS to JavaScript has a number of benefits. It keeps behavior with behavior and style with style. It allows us to dynamically update animations using calculated values like the above. And it's a more performant way to animate in the browser. 

In CSS animations there is this concept of **@keyframes**, or sequential steps defined by the developer that control the animation of an element on the page. The WAAPI allows for defining keyframes in JavaScript using an array of keyframe objects.

```javascript
const keyframes = [
  { keyframeOne }
  { keyframeTwo }
  { keyframeThree }
]
```

Let's update the event listener with an array of keyframes that defines the switch's animation from its current position to its new position.. We'll do this using CSS transforms:

```javascript
document.querySelector('.filter').addEventListener('click', e => {
  e.stopPropagation()

  const el = e.target

  if (el.classList.contains('filter__item') && !el.classList.contains('filter__item--active')) {
    const filterItemData = el.getBoundingClientRect()
    const switchData = document.querySelector('.filter__switch').getBoundingClientRect()

    const midPoint = filterItemData.x + (filterItemData.width / 2)
    const newSwitchX = midPoint - (switchData.width / 2)

    const keyframes = [
      { transform: `translateX(${switchData.x}px)`},
      { transform: `translateX(${newSwitchX}px)`}
    ]
  }
})
```

There is one hiccup to the keyframes defined above? Can you spot it? I'll give you a hint: It has to do with the nature of the CSS `translateX` function. 

The problem is that the `translateX` function moves the element `x` pixels away from the _origin_ of the element on the screen. It doesn't move the element to the exact value specified. 

If we calculated that the future `x` coordinate of the switch is `452`, and we pass that value in a keyframe object as `translateX(452px)`, the switch would move 452px forward from its current position on the x axis. That's clearly not what we want.

Instead, we should be passing the difference in pixels between the switch's origin and its current and future `x` coordinates. Make sense? In order to accomplish this we'll need to define the origin of the switch and keep a reference to that throughout the life of the filter.

### Defining the switch origin

At first glance this seems like a pretty simple task. Let's just reach for that handy `getBoundingClientRect()` method and call it on the switch, grab its initial `x` coordinate and call it a day, right? Well not exactly. There are two caveats to defining the origin. 

Number one being that the origin may change if the user adjusts the browser window size. Without taking this into account our math would be using an out of date origin that could potentially result in our switch flying off the screen. This means that we'll have to recalculate the origin every time the event listener runs.


The second issue is that recalculating the origin of the switch every time the event listener runs will undoubtedly break our animation because we're calculating a value that's constantly changing! The origin will never stay static because the switch is always moving.

However, there is an elegant solution to these two problems. Instead of calculating the origin of the switch, we can calculate the origin of the first filter item. This is perfect because the filter items themselves don't move. Just the switch. By calculating the origin of the first filter item we're essentially calculating the origin of the switch because it begins in the same place. On subsequent triggers to the event we'll always have the correct value, no matter where the switch lies in the DOM.

Let's update the code to reflect this:


```javascript
document.querySelector('.filter').addEventListener('click', e => {
  e.stopPropagation()

  const el = e.target

  if (el.classList.contains('filter__item') && !el.classList.contains('filter__item--active')) {
    const filterItemData = el.getBoundingClientRect()
    const switchData = document.querySelector('.filter__switch').getBoundingClientRect()
    const origin = document.querySelector('.filter__item').getBoundingClientRect().x + 5

    const midPoint = filterItemData.x + (filterItemData.width / 2)
    const newSwitchX = midPoint - (switchData.width / 2)

    const keyframes = [
      { transform: `translateX(${switchData.x - origin}px)`},
      { transform: `translateX(${newSwitchX - origin}px)`}
    ]
  }
})
```

Note that by add 5 to the `x` coordinate of the first filter item we're defining the correct point of origin for the switch. The switch was absolutely positioned 5px to the left in the CSS section and we're compensating for that here.

The keyframe objects have also been updated to receive the difference of the current and future `x` coordinates and the origin, giving us the correct pixel values needed to animate the switch.

Excellent, now that the leg work has been taken care of, the last part is to define some timing options and animate the switch!

The WAAPI requires that we define some timing properties to be used in conjunction with the keyframe objects. Things like `duration` and `easing`. Another important property we'll define is the `fill` property, which is similar to the CSS `animation-fill-mode` property. It specifies how the element should be styled before and after the animation. 

We want the switch to retain its position once it's been moved, therefore we'll pass a value of `forwards` to the `fill` property, which tells the element to stay where it is after its done animating.

```javascript
const filterSwitch = document.querySelector('.filter__switch')

document.querySelector('.filter').addEventListener('click', e => {
  e.stopPropagation()

  const el = e.target

  if (el.classList.contains('filter__item') && !el.classList.contains('filter__item--active')) {
    const filterItemData = el.getBoundingClientRect()
    const switchData = filterSwitch.getBoundingClientRect()
    const origin = document.querySelector('.filter__item').getBoundingClientRect().x + 5

    const midPoint = filterItemData.x + (filterItemData.width / 2)
    const newSwitchX = midPoint - (switchData.width / 2)

    const keyframes = [
      { transform: `translateX(${switchData.x - origin}px)`},
      { transform: `translateX(${newSwitchX - origin}px)`}
    ]

    const options = {
      duration: 300,
      easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
      fill: 'forwards'
    }

    filterSwitch.animate(keyframes, options)
		
    document.querySelector('.filter__item--active').classList.remove('filter__item--active')
    el.classList.add('filter__item--active')
  }
})
```

There it is. We've detected a click event on a filter item, determined the new position of the switch relative to the clicked item, and animated it accordingly. The switch is also responsive to dynamic changes in browser window width.

It was a fun component to work on and adds some nice UI/UX touches to an otherwise boring part of a larger app. You can check out the [final version here](https://codepen.io/jakewies/pen/gXvqMo/), fork and play around with it. If you have any questions regarding the Web Animations API or the code above please feel free to reach out on [Twitter](https://twitter.com/jakewies). Thanks for reading!

👾