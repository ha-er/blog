# Java反射

## 反射：框架设计的灵魂

* 框架：半成品软件。可以在框架的基础上开发，简化编码
* 反射：将类的各个组成部分封装为其他对象，这就是反射机制

**好处：**
  
* 可以在程序运行过程中，操作这些对象。
  
* 可以解耦，提高程序的可扩展性
  
## 获取Class对象的方式：

* `Class.forName("全类名")`:将字节码文件加载进内存，返回class对象
   
   多用于配置文件，将类名定义在配置文件中。读取文件，加载类
   
* `类名.class`：通过类名的属性class获取

   多用于参数的传递

* `对象.getClass()`:getClass()方法在Object类中定义

   多用于对象的获取字节码的方式

**Person类**
```java
package com.haer.domain;

public class Person {
    private String name;
    private int age;
}
```

**Student类**
```java
package com.haer.domain;

public class Student {
    private String name;
    private int age;
}
```

**ReflectDemo01主方法类**
```java
package com.haer.test;

import com.haer.domain.Person;

public class ReflectDemo01 {
    public static void main(String[] args) throws ClassNotFoundException {
        //1.Class.forName("全类名")
        Class cls1 = Class.forName("com.haer.domain.Person");
        System.out.println(cls1);
        //2.类名.class
        Class cls2 = Person.class;
        System.out.println(cls2);
        //3.对象.getClass()
        Person person = new Person();
        Class<? extends Person> cls3 = person.getClass();
        System.out.println(cls3);

        //比较发现同一个类的Class对象是一样的
        System.out.println(cls1 == cls2);
        System.out.println(cls1 == cls3);
        System.out.println(cls2 == cls3);

        Class cls4 = Class.forName("com.haer.domain.Student");
        System.out.println(cls4);

        //不同类的的Class对象是不同的
        System.out.println(cls1 == cls4);
    }
}
```

**控制台结果**
```
class com.haer.domain.Person
class com.haer.domain.Person
class com.haer.domain.Person
true
true
true
class com.haer.domain.Student
false
```
 
::: tip 结论
同一个字节码文件(*.class)再一次程序运行过程中，只会被加载一次，不论通过哪一种方式获取的Class对象都是同一个
:::

## Class对象的功能

* 获取功能（返回值 方法名）

  * 获取成员变量
  
    **方法**
    
    * `Field[]` `getFields()`获取public修饰的成员变量
    
    * `Field` `getField(String name)`根据变量名获取public修饰的成员变量
    
    * `Field[]` `getDeclaredFields()`获取全部成员变量
    
    * `Field` `getDeclaredField(String name)`根据变量名获取全部成员变量
    
    **操作**
    
    * 1.设置值
      `void` `set(Object obj, Object value)`
    * 2.获取值
      `void` `get(Object obj)`
    * 3.暴力反射，可以忽略访问权限修饰符的安全检查
      `void` `setAccessible(true)`
  * 获取构造器（构造方法）
  
    **方法**
    
    * `Constructor<?>[]` `getConstructors()`获取public修饰的构造器
    
    * `Constructor<T>` `getConstructor(类<?>... parameterTypes)`根据参数类型获取public修饰的构造器
    
    * `Constructor<?>[]` `getDeclaredConstructors()`获取全部构造器
    
    * `Constructor<T>` `getDeclaredConstructor(类<?>... parameterTypes)`根据参数类型获取全部构造器
    
    **创建对象**
    
    * `T` `newInstance(Object... initargs)`
    
    * 如果使用空参数构造方法创建对象，操作可以简化：Class对象的`newInstance()`方法
    
    ```
  * 获取成员方法
  
    **方法**
    
    * `Method[]` `getMethods()`获取public修饰的成员方法
    
    * `Method` `getMethod(String name, 类<?>... parameterTypes)`根据方法名和参数类型获取public修饰的成员方法
    
    * `Method[]` `getDeclaredMethods()`获取全部的成员方法
    
    * `Method` `getDeclaredMethod(String name, 类<?>... parameterTypes)`根据方法名和参数类型获取全部的成员方法
    
    **执行方法**
    
    * `Object` `invoke(Object obj, Object... args)`
    
    **获取方法名称**
    
    * `String` `getName()`
    
  * 获取类名
    
    **方法**
    
    * `String` `getName()`获取全类名
      