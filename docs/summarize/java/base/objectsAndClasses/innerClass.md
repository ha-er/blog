# Java 内部类
[:leftwards_arrow_with_hook:Java 对象和类](./objectsAndClasses.html#源文件声明规则)

Java 一个类中可以嵌套另外一个类，语法格式如下：
```java
class OuterClass {   // 外部类
    // ...
    class NestedClass { // 嵌套类，或称为内部类
        // ...
    }
}
```
要访问内部类，可以通过创建外部类的对象，然后创建内部类的对象来实现。

嵌套类有两种类型：

* 非静态内部类
* 静态内部类
## 非静态内部类
非静态内部类是一个类中嵌套着另外一个类。 它有访问外部类成员的权限， 通常被称为内部类。

由于内部类嵌套在外部类中，因此必须首先实例化外部类，然后创建内部类的对象来实现。

实例：
```java
class OuterClass {
  int x = 10;

  class InnerClass {
    int y = 5;
  }
}

public class MyMainClass {
  public static void main(String[] args) {
    OuterClass myOuter = new OuterClass();
    OuterClass.InnerClass myInner = myOuter.new InnerClass();
    System.out.println(myInner.y + myOuter.x);
  }
}
```
运行结果：`15`
## 私有的内部类
内部类可以使用 private 或 protected 来修饰，如果你不希望内部类被外部类访问可以使用 private 修饰符：
```java
class OuterClass {
  int x = 10;

  private class InnerClass {
    int y = 5;
  }
}

public class MyMainClass {
  public static void main(String[] args) {
    OuterClass myOuter = new OuterClass();
    OuterClass.InnerClass myInner = myOuter.new InnerClass();
    System.out.println(myInner.y + myOuter.x);
  }
}
```
以上实例 InnerClass 设置为私有内部类，执行会报错：
```java
MyMainClass.java:12: error: OuterClass.InnerClass has private access in OuterClass
    OuterClass.InnerClass myInner = myOuter.new InnerClass();
             ^
```
## 静态内部类
静态内部类可以使用 static 关键字定义，静态内部类我们不需要创建外部类来访问，可以直接访问它：
```java
class OuterClass {
  int x = 10;

  static class InnerClass {
    int y = 5;
  }
}

public class MyMainClass {
  public static void main(String[] args) {
    OuterClass.InnerClass myInner = new OuterClass.InnerClass();
    System.out.println(myInner.y);
  }
}
```
运行结果：`5`
::: tip 注意
静态内部类无法访问外部类的成员。
:::
## 从内部类访问外部类成员
内部类一个高级的用法就是可以访问外部类的属性和方法：
```java
class OuterClass {
  int x = 10;

  class InnerClass {
    public int myInnerMethod() {
      return x;
    }
  }
}

public class MyMainClass {
  public static void main(String[] args) {
    OuterClass myOuter = new OuterClass();
    OuterClass.InnerClass myInner = myOuter.new InnerClass();
    System.out.println(myInner.myInnerMethod());
  }
}
```
运行结果：`10`

[:leftwards_arrow_with_hook:Java 对象和类](./objectsAndClasses.html#源文件声明规则)
