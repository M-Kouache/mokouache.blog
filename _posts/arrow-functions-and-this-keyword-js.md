---
title: 'Arrow function and the "this" keyword in javascript'
excerpt: 'In JavaScript, arrow functions are a concise way to write functions. They were introduced in ECMAScript 6 (ES6) and have a different way of handling the "this" keyword compared to traditional function expressions.'
coverImage: '/assets/blog/arrow-function-and-this-keyword-js/cover.png'
date: '2023-12-04T05:35:07.322Z'
author:
  name: Mohamed Kouache
  picture: '/assets/blog/authors/mo.png'
ogImage:
  url: '/assets/blog/arrow-function-and-this-keyword-js/cover.png'
---


**In JavaScript, arrow functions are a concise way to write functions. They were introduced in ECMAScript 6 (ES6) and have a different way of handling the `this` keyword compared to traditional function expressions.**

## Traditional Function Expressions

In traditional function expressions, the `this` keyword refers to the object that called the function. For example, if you call a function as a method of an object, then `this` inside the function will refer to that object. However, if you call a function directly, without an object, then `this` will refer to the global object (or undefined in strict mode).

## Arrow Functions

Arrow functions, on the other hand, don't have their own `this` context. Instead, they borrow the `this` value from the surrounding scope, which is called lexical-scoping.<br><br> This means that the value of `this` inside an arrow function is the same as the value of `this` outside the function, regardless of how the arrow function is called.

## Why it Matters

This difference in behavior can be important when dealing with callbacks or when you want to preserve the "this" value from an outer context. For example, if you have a function that needs to access data from the object that called it, using an arrow function can help ensure that the function has access to the correct data.

**Example** :

Consider this example:

```javascript
function RegularFunction() {
  this.value = 1;

  setTimeout(function() {
    this.value++;
    console.log(this.value); // Logs undefined or (NaN)
  }, 1000);
}

function ArrowFunction() {
  this.value = 1;

  setTimeout(() => {
    this.value++;
    console.log(this.value); // Logs 2
  }, 1000);
}

const obj1 = new RegularFunction(); // Logs undefined or (NaN)
const obj2 = new ArrowFunction();   // Logs 2

```

In this example, the `RegularFunction` logs `undefined` ( or NaN in our example because we tried to increment `undefined` ) because the `this` keyword inside the callback is not bound to the `obj1` object. This is because traditional functions have their own "this" context, which is determined by how the function is called.

On the other hand, the `ArrowFunction` logs `2` because the arrow function borrows the "this" value from the surrounding scope, which is the `obj2` object.

## Conclusion

Arrow functions can be a helpful tool for managing the `this` keyword in JavaScript. They can help to avoid unexpected behavior and ensure that your code works as you intend.
