---
title: 'Deep copy and shallow copy in javascript'
excerpt: 'In JavaScript, when you copy objects or arrays, you might encounter the concepts of "deep copy" and "shallow copy". These terms refer to different ways of copying data structures and have implications for how changes to the copied structure affect the original one.'
coverImage: '/assets/blog/deep-copy-and-shallow-copy-in-javascript/cover.png'
date: '2023-12-05T05:35:07.322Z'
author:
  name: Mohamed Kouache
  picture: '/assets/blog/authors/mo.png'
ogImage:
  url: '/assets/blog/deep-copy-and-shallow-copy-in-javascript/cover.png'
---


**Copying data structures is a fundamental aspect in the world of programming. But have you ever wondered what happens under the hood when you copy an object or an array? This is where the concepts of shallow copy and deep copy come into play. These seemingly simple terms can have a significant impact on the behavior of your code and prevent unexpected surprises.**

## Shallow Copy

A shallow copy creates a new object or array, but it does not create copies of the nested objects or arrays within the original structure. Instead, it copies references to those nested objects or arrays. Therefore, changes made to the nested structures will be reflected in both the original and the copied objects.

```javascript
const originalObject = {
  user: {
    firstname: "Muhammed",
    lastname: "Ali",
  },
};

// Shallow copy using spread operator
const shallowCopyObject = { ...originalObject };

// Modify the nested object in the copied structure
shallowCopyObject.user.lastname = "Nasir";

console.log(originalObject); // { user: { firstname: "Muhammed", lastname: "Nasir" } }
console.log(shallowCopyObject); // { user: { firstname: "Muhammed", lastname: "Nasir" } }
```

## Deep Copy

A deep copy creates a completely independent copy of the original object or array, including all nested objects and arrays. Changes made to the copied structure will not affect the original one.

```javascript
const originalObject = {
  user: {
    firstname: "Muhammed",
    lastname: "Ali",
  },
};

// Shallow copy using spread operator
const shallowCopyObject = structuredClone(originalObject);

// Modify the nested object in the copied structure
shallowCopyObject.user.lastname = "Nasir";

console.log(originalObject); // { user: { firstname: "Muhammed", lastname: "Ali" } }
console.log(shallowCopyObject); // { user: { firstname: "Muhammed", lastname: "Nasir" } }
```

In this example, the modification to the nested array in the copied structure does not affect the original array.

> `JSON.parse( JSON.stringify(obj) )` is a common way to achieve deep copy, it has some limitations. It won't work with objects that have functions or non-JSON-safe values (such as undefined or NaN). Additionally, it won't preserve special object properties like prototypes.

For a more robust deep copy in JavaScript, you might want to use specialized libraries such as `lodash.cloneDeep` or implement a custom deep copy function tailored to your specific use case.

