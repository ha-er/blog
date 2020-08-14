# Java protected 关键字详解

[:leftwards_arrow_with_hook:Java 修饰符](./qualifier.html#受保护的访问修饰符-protected)

很多介绍Java语言的书籍(包括《Java编程思想》)都对protected介绍的比较的简单，基本都是一句话，就是: **被 protected 修饰的成员对于本包和其子类可见**。这种说法有点太过含糊，常常会对大家造成误解。实际上，protected的可见性在于两点：

* 基类的 protected 成员是包内可见的，并且对子类可见；
* 若子类与基类不在同一包中，那么在子类中，子类实例可以访问其从基类继承而来的protected方法，而不能访问基类实例的protected方法。

我们可以通过以下几个关于protected方法可见性的例子来进一步掌握protected关键字。在碰到涉及protected成员的调用时，首先要确定出该protected成员来自何方，其可见性范围是什么，然后就可以判断出当前用法是否可行了，看下面七个例子：

实例 1
```java
package p1;
public class Father1 {
    protected void f() {}    // 父类Father1中的protected方法
}
 
package p1;
public class Son1 extends Father1 {}
 
package p11;
public class Son11 extends Father1{}
 
package p1;
public class Test1 {
    public static void main(String[] args) {
        Son1 son1 = new Son1();
        son1.f(); // Compile OK     ----（1）
        son1.clone(); // Compile Error     ----（2）
 
        Son11 son = new Son11();    
        son11.f(); // Compile OK     ----（3）
        son11.clone(); // Compile Error     ----（4）
    }
}
```
对于上面的示例，首先看(1)(3)，其中的f()方法从类Father1继承而来，其可见性是包p1及其子类Son1和Son11，而由于调用f()方法的类Test1所在的包也是p1，因此（1）(3)处编译通过。其次看(2)(4)，其中的clone()方法的可见性是java.lang包及其所有子类，对于语句"son1.clone();"和"son11.clone();"，二者的clone()在类Son1、Son11中是可见的，但对Test1是不可见的，因此（2）(4)处编译不通过。

实例 2
```java
package p2;
class MyObject2 {
    protected Object clone() throws CloneNotSupportedException{
       return super.clone();
    }
}
 
package p22;
public class Test2 extends MyObject2 {
    public static void main(String args[]) {
       MyObject2 obj = new MyObject2();
       obj.clone(); // Compile Error         ----（1）
 
       Test2 tobj = new Test2();
       tobj.clone(); // Complie OK         ----（2）
    }
}
```
对于(1)而言，clone()方法来自于类MyObject2本身，因此其可见性为包p2及MyObject2的子类，虽然Test2是MyObject2的子类，但在Test2中不能访问基类MyObject2的protected方法clone()，因此编译不通过;对于(2)而言，由于在Test2中访问的是其本身实例的从基类MyObject2继承来的的clone()，因此编译通过。

实例 3
```java
package p3;
class MyObject3 extends Test3 {
}
 
package p33;
public class Test3 {
  public static void main(String args[]) {
    MyObject3 obj = new MyObject3();
    obj.clone();   // Compile OK     ------（1）
  }
}
```
对于(1)而言，clone()方法来自于类Test3，因此其可见性为包p33及其子类MyObject3，而（1）正是在p33的类Test3中调用，属于同一包，编译通过。

实例 4
```java
package p4;
class MyObject4 extends Test4 {
  protected Object clone() throws CloneNotSupportedException {
    return super.clone();
  }
}
 
package p44;
public class Test4 {
  public static void main(String args[]) {
    MyObject4 obj = new MyObject4();
    obj.clone(); // Compile Error      -----（1）
  }
}
```
对于(1)而言，clone()方法来自于类MyObject4，因此其可见性为包p4及其子类(此处没有子类)，而类Test4却在包p44中，因此不满足可见性，编译不通过。

实例 5
```
package p5;
 
class MyObject5 {
    protected Object clone() throws CloneNotSupportedException{
       return super.clone();
    }
}
public class Test5 {
    public static void main(String[] args) throws CloneNotSupportedException {
       MyObject5 obj = new MyObject5();
       obj.clone(); // Compile OK        ----(1)
    }
}
```
对于(1)而言，clone()方法来自于类MyObject5，因此其可见性为包p5及其子类(此处没有子类)，而类Test5也在包p5中，因此满足可见性，编译通过。

实例 6
```java
package p6;
 
class MyObject6 extends Test6{}
public class Test6 {
  public static void main(String[] args) {
    MyObject6 obj = new MyObject6();
    obj.clone();        // Compile OK   -------（1）
  }
}
```
对于(1)而言，clone()方法来自于类Test6，因此其可见性为包p6及其子类MyObject6，而类Test6也在包p6中，因此满足可见性，编译通过。

实例 7
```java
package p7;
 
class MyObject7 extends Test7 {
    public static void main(String[] args) {
        Test7 test = new Test7();
        test.clone(); // Compile Error   ----- (1)
  }
}
 
public class Test7 {
}
```
对于(1)而言，clone()方法来自于类Object，因此该clone()方法可见性为包java.lang及其子类Test7，由于类MyObject7不在此范围内，因此不满足可见性，编译不通过。

文章来源：[http://blog.csdn.net/justloveyou_/article/details/61672133](http://blog.csdn.net/justloveyou_/article/details/61672133)

[:leftwards_arrow_with_hook:Java 修饰符](./qualifier.html#受保护的访问修饰符-protected)