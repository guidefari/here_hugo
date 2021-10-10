---
date: "2021-02-14"
tags: ["notes", "oop"]
title: "SOLID principles"
summary: "A summary of SOLID principles - for Object Oriented design"
---

- S: The single-responsibility principle
- O: The open-closed principle
- L: The Liskov substitution principle
- I: The interface segregation principle
- D: The dependency inversion principle

## why SOLID?
> The SOLID principle helps in reducing tight coupling. Tight coupling means a group of classes are highly dependent on one another which you should avoid in your code. Opposite of tight coupling is loose coupling and your code is considered as a good code when it has loosely-coupled classes. Loosely coupled classes minimize changes in your code, helps in making code more reusable, maintainable, flexible and stable. Now let’s discuss one by one these principles… -[src](https://www.geeksforgeeks.org/solid-principle-in-programming-understand-with-real-life-examples/)

# single-responsibility principle (SRP)
each class should have only a single responsibility.

### SRP in a Typescript environment
> - Module Level: SRP also applies in module level. Means, while creating the module and classes inside this, we should take care that classes should logically perform the similar tasks [Which perform the similar functionality].

> - Class Level: SRP also applies in class level, here it says that a class should contain the methods which have similar nature. If a class is a User specific then it’s methods should be performed only user-specific action, not any other.

> - Method Level: In the method level, SRP says that a method performs only one task at a time. If there should require performing multiple tasks, then it should be separated to create new methods.

[src](http://www.mukeshkumar.net/articles/typescript/solid-single-responsibility-principal-in-typescript) of the quotes above.

### code snippets
this violates SRP:

```ts
class Statistics {
  public computeSalesStatistics() {
    // ...
  }
  public generateReport() {
    // ...
  }
}
```

it'd need to be split into:


```ts
class Statistics {
  public computeSalesStatistics() {
    // ...
  }
}
```

```ts
class ReportGenerator {
  public generateReport() {
    // ...
  }
}
```

### further reading
- [Tim Corey on SRP](https://youtu.be/5RwhyZnVRS8)
- [Single responsibility theory in Typescript](http://www.mukeshkumar.net/articles/typescript/solid-single-responsibility-principal-in-typescript)

# open-closed principle
> Simply put, classes should be open for extension, but closed for modification. In doing so, we stop ourselves from modifying existing code and causing potential new bugs in an otherwise happy application. Of course, the one exception to the rule is when fixing bugs in existing code. - [src](https://www.baeldung.com/solid-principles)

> imagine we've implemented a Guitar class. It's fully fledged and even has a volume knob:

```java
public class Guitar {

    private String make;
    private String model;
    private int volume;

    //Constructors, getters & setters
}
```

now imagine the app has been released for a bit, and everyone's been happy with it, but the guitar just needs: 
![one more thing](https://media1.tenor.com/images/fb4fcf18f6d052bd1bd5c97f2fa7d64b/tenor.gif?itemid=18346899)
*one more thing.*

it may be tempting to directly edit the existing guitar class, but who knows what errors that will introduce.

> Instead, let's stick to the open-closed principle and simply extend our Guitar class:

```java
public class SuperCoolGuitarWithFlames extends Guitar {

    private String flameColor;

    //constructor, getters + setters
}
```

### further reading
- the code snippets & explanations on the *open-closed principle* from this [src](https://www.baeldung.com/solid-principles) have been the simplest to understand so far.
- [Reflectoring.io](https://reflectoring.io/open-closed-principle-explained/) - The Open-Closed Principle Explained

# Liskov substitution principle
> if S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program (correctness, task performed, etc.). - [src](https://en.wikipedia.org/wiki/Liskov_substitution_principle)

```java
public interface Car {

    void turnOnEngine();
    void accelerate();
}
```

now we define a motor car, that implements the `Car` interface above.

```java
public class MotorCar implements Car {

    private Engine engine;

    //Constructors, getters + setters

    public void turnOnEngine() {
        //turn on the engine!
        engine.on();
    }

    public void accelerate() {
        //move forward!
        engine.powerOn(1000);
    }
}
```

![but wait](https://media.tenor.com/images/d28278af7266d7c0164e2d9ef5d250f3/tenor.gif)

it gets a bit weird when an electric car has to use the same interface:

```java
public class ElectricCar implements Car {

    public void turnOnEngine() {
        throw new AssertionError("I don't have an engine!");
    }

    public void accelerate() {
        //this acceleration is crazy!
    }
}
```

a "blatant violation" of Liskov's substitution principle. this principle in my understanding, ensures that you give interfaces 'the right level of abstraction' -  which can be very subjective, but still worthwhile to keep in mind.

### further reading
- [brief explanation](https://youtu.be/dJQMqNOC4Pc) by Kyle.

# Interface segregation principle
> larger interfaces should be split into smaller ones. By doing so, we can ensure that implementing classes only need to be concerned about the methods that are of interest to them.

this is what a large bear keeper interface would look like

```java
public interface BearKeeper {
    void washTheBear();
    void feedTheBear();
    void petTheBear();
}
```

maybe not every bear keeper would like to participate in petting the bear. fixing this is pretty simple.

```java
public interface BearCleaner {
    void washTheBear();
}

public interface BearFeeder {
    void feedTheBear();
}

public interface BearPetter {
    void petTheBear();
}
```

> Now, thanks to interface segregation, we're free to implement only the methods that matter to us:

```java
public class BearCarer implements BearCleaner, BearFeeder {

    public void washTheBear() {
        //I think we missed a spot...
    }

    public void feedTheBear() {
        //Tuna Tuesdays...
    }
}
```

> And finally, we can leave the dangerous stuff to the crazy people:

```java
public class CrazyPerson implements BearPetter {

    public void petTheBear() {
        //Good luck with that!
    }
}
```

# Dependency Inversion
> The principle of Dependency Inversion refers to the decoupling of software modules. This way, instead of high-level modules depending on low-level modules & implementations, both will depend on abstractions.

### further reading
- too many code snippets to paste here. [src](https://wanago.io/2020/02/03/applying-solid-principles-to-your-typescript-code/) goes through it in a Typescript context
- [video explanation](https://youtu.be/9oHY5TllWaU) by Kyle. done in Javascript. implementation doesn't make too much sense for me(just haven't written much object oriented code yet), but the concept is explained well.