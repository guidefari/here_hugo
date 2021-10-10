---
date: "2021-02-10"
category: ["notes", "oop"]
title: "OOP basics"
tags: "A summary of some object orientation notes"
---

# Definitions

## Class
> In object-oriented programming, a class is a blueprint or a template definition from which the objects are created.
> Classes are models that define the state and behavior of an object.
- Classes are templates for objects

## Instances
 > Objects are also known as instances. For example, we can say each rectangle object is an instance of the rectangle class.
- Objects are instances of a class.

 # Misc 

 ## Attributes & fields
 > The variables defined in a class to encapsulate data for each instance of the class are known as attributes or fields. Each instance has its own independent value for the attributes or fields defined in the class.

 ## prototype-based programming
 > The object-oriented model known as prototype-based programing(as seen in Javascript) is also known by other names such as classless programming, instance-based programming, or prototype-oriented programming.

 > Both Python and C# support classes and inheritance.
 **question**: what do classes & inheritance look like for JS & TS today? any code snippets I can look at?

# Four principles
*mnemonic:*
> oops, i ate A PIE

## Abstraction
- refers to only showing essential details and keeping everything else hidden.
- **the interface** refers to the way sections of your code can **communicate with one another**.
  - this is typically done through methods that each class is able to access.
- **the implementation** of these methods, or how these methods are coded, should be hidden.


### aside
An [interesting article](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/) I read on abstractions, beyond how it's applied in OOP.

## Polymorphism
- describes methods that are able to take on many forms.
there are two kinds:
1. **Dynamic polymorphism** - occurs during runtime of the program.
2. **Static polymorphism** - occurs during compile-time. this is known as **method overloading**.

## Inheritance
- this is the principle that allows classes to derive from other classes.
- **access modifiers** change which classes have access to other classes, methods, or attributes.
  1. **public members** can be accessed from anywhere in your program
  2. **private members** can only be accessed from within the same class that the member is defined.  
  3. **protected members** can be accessed within the class it is defined, as well as any subclasses of that class.

## Encapsulation
- refers to **bundling data with methods** that can operate on that data within a class.
- essentially the idea of hiding data within a class, **preventing anything outside that class from directly interacting with it**.
- members of other classes can **interact with the attributes of another object through its methods**.

In practice, this is usually made feasible by making **Getting Methods**(retrieving information) & **Setting Methods**(changing information)

## Access Modifiers
- [Typescript docs](https://www.typescriptlang.org/docs/handbook/classes.html) explains it well, with easy to follow code snippets.

# References
1. [Intro to Object Oriented Programming - Crash Course (youtube video)](https://www.youtube.com/watch?v=SiBw7os-_zI&list=WL&index=6&ab_channel=freeCodeCamp.org)
2. [Learning Object-Oriented Programming Explore and crack the OOP code in Python, JavaScript, and C by Gaston C. Hillar (book)](https://www.amazon.com/Learning-Object-Oriented-Programming-Explore-JavaScript/dp/1785289632)