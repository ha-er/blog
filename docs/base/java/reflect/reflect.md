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
    
**Person类**

```java
package com.haer.domain;

public class Person {
    public String a;
    protected int b;
    String c;
    private String d;

    public Person() {
    }

    public Person(String a, int b, String c, String d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    private Person(int b) {
        this.b = b;
    }

    public String getA() {
        return a;
    }

    public void setA(String a) {
        this.a = a;
    }

    public int getB() {
        return b;
    }

    public void setB(int b) {
        this.b = b;
    }

    public String getC() {
        return c;
    }

    public void setC(String c) {
        this.c = c;
    }

    public String getD() {
        return d;
    }

    public void setD(String d) {
        this.d = d;
    }

    @Override
    public String toString() {
        return "Person{" +
                "a='" + a + '\'' +
                ", b=" + b +
                ", c='" + c + '\'' +
                ", d='" + d + '\'' +
                '}';
    }

    public void eat(String a){
        System.out.println("eat..."+a);
    }

    private void run(){
        System.out.println("run...");
    }
}
```

**ReflectDemo02主方法类**

```java
package com.haer.test;

import com.haer.domain.Person;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectDemo02 {
    public static void main(String[] args) throws Exception {
        //获取Class对象
        Class personClass = Class.forName("com.haer.domain.Person");

        //获取成员变量
        //Field[] getFields();
        //Field getField(String name)这俩个方法只能获取public修饰的成员变量
        //Field[] getDeclaredFields()
        //Field getDeclaredField(String name)可以获取所有的成员变量
        System.out.println("-------------getFields");
        Field[] fields = personClass.getFields();
        for (Field field : fields) {
            System.out.println(field);
        }
        System.out.println("-------------getField");
        //这里只能获取成员变量a，因为这里只有a是public修饰的，否则会报java.lang.NoSuchFieldException异常
        Field field = personClass.getField("a");
        Person person1 = new Person();
        //设置成员变量a的值
        field.set(person1, "哈儿");
        //获取成员变量a的值
        Object value = field.get(person1);
        System.out.println(value);
        System.out.println("-------------getDeclaredFields");

        Field[] declaredFields = personClass.getDeclaredFields();
        for (Field declaredField : declaredFields) {
            System.out.println(declaredField);
        }
        System.out.println("-------------getDeclaredField");
        //这里获取所有成员变量
        Field declaredField = personClass.getDeclaredField("d");
        Person person2 = new Person();
        //暴力反射，可以忽略访问权限修饰符的安全检查，如果没有它，
        // 在设置或者获取非public修饰的成员变量时，会报java.lang.IllegalAccessException异常
        declaredField.setAccessible(true);
        //设置成员变量a的值
        declaredField.set(person2, "Declared哈儿");
        //获取成员变量a的值
        Object value2 = declaredField.get(person2);
        System.out.println(value2);

        //获取构造器（构造方法）
        //Constructor<?>[] getConstructors()
        //Constructor<T> getConstructor(类<?>... parameterTypes)获取public修饰的构造器
        //Constructor<?>[] getConstructors()
        //Constructor<T> getConstructor(类<?>... parameterTypes)获取全部
        System.out.println("-------------getConstructors");
        Constructor[] constructors = personClass.getConstructors();
        for (Constructor constructor : constructors) {
            System.out.println(constructor);
        }
        System.out.println("-------------getConstructor");
        //传参数类型
        Constructor constructor = personClass.getConstructor(String.class, int.class, String.class, String.class);
        System.out.println(constructor);
        //创建对象
        Object person3 = constructor.newInstance("哈儿", 18, "c值", "d值");
        System.out.println(person3);
        System.out.println("-------------getConstructor获取无参构造");
        //获取无参构造时
        Constructor constructor1 = personClass.getConstructor();
        System.out.println(constructor1);
        //创建对象
        Object person4 = constructor1.newInstance();
        System.out.println(person4);
        //获取无参构造时可以直接使用Class对象的newInstance()方法,是一样的
        Object person5 = personClass.newInstance();
        System.out.println(person5);
        System.out.println("-------------getDeclaredConstructors");
        Constructor[] declaredConstructors = personClass.getDeclaredConstructors();
        for (Constructor declaredConstructor : declaredConstructors) {
            System.out.println(declaredConstructor);
        }
        System.out.println("-------------getDeclaredConstructor");
        //可以获取非public修饰的构造器
        Constructor declaredConstructor = personClass.getDeclaredConstructor(int.class);
        System.out.println(declaredConstructor);
        //暴力反射
        declaredConstructor.setAccessible(true);
        Object person6 = declaredConstructor.newInstance(200);
        System.out.println(person6);

        // 获取成员方法
        //Method[] getMethods()
        //Method getMethod(String name, 类<?>... parameterTypes)获取public修饰的方法
        //Method[] getDeclaredMethods()
        //Method getDeclaredMethod(String name, 类<?>... parameterTypes)获取全部方法
        System.out.println("-------------getMethods");
        Method[] methods = personClass.getMethods();
        //不仅仅有自己的方法，还有Object类的方法
        for (Method method : methods) {
            System.out.println(method);
        }
        System.out.println("-------------getMethods");
        //获取方法，传入方法名和参数
        Method method = personClass.getMethod("eat",String.class);
        System.out.println(method);
        Person person7 = new Person();
        //执行方法
        method.invoke(person7,"饭");
        System.out.println("-------------getDeclaredMethods");
        Method[] declaredMethods = personClass.getDeclaredMethods();
        for (Method declaredMethod : declaredMethods) {
            System.out.println(declaredMethod);
            //获取方法名的方法
            System.out.println(declaredMethod.getName());
        }
        System.out.println("-------------getDeclaredMethod");
        Method declaredMethod = personClass.getDeclaredMethod("run");
        System.out.println(declaredMethod);
        //暴力反射
        declaredMethod.setAccessible(true);
        //执行方法
        Person person8 = new Person();
        declaredMethod.invoke(person8);
        System.out.println("-------------获取类名（全类名）");
        System.out.println(personClass.getName());
    }
}

```

**控制台**

```
-------------getFields
public java.lang.String com.haer.domain.Person.a
-------------getField
哈儿
-------------getDeclaredFields
public java.lang.String com.haer.domain.Person.a
protected int com.haer.domain.Person.b
java.lang.String com.haer.domain.Person.c
private java.lang.String com.haer.domain.Person.d
-------------getDeclaredField
Declared哈儿
-------------getConstructors
public com.haer.domain.Person(java.lang.String,int,java.lang.String,java.lang.String)
public com.haer.domain.Person()
-------------getConstructor
public com.haer.domain.Person(java.lang.String,int,java.lang.String,java.lang.String)
Person{a='哈儿', b=18, c='c值', d='d值'}
-------------getConstructor获取无参构造
public com.haer.domain.Person()
Person{a='null', b=0, c='null', d='null'}
Person{a='null', b=0, c='null', d='null'}
-------------getDeclaredConstructors
private com.haer.domain.Person(int)
public com.haer.domain.Person(java.lang.String,int,java.lang.String,java.lang.String)
public com.haer.domain.Person()
-------------getDeclaredConstructor
private com.haer.domain.Person(int)
Person{a='null', b=200, c='null', d='null'}
-------------getMethods
public java.lang.String com.haer.domain.Person.toString()
public java.lang.String com.haer.domain.Person.getC()
public java.lang.String com.haer.domain.Person.getA()
public void com.haer.domain.Person.eat(java.lang.String)
public java.lang.String com.haer.domain.Person.getD()
public void com.haer.domain.Person.setB(int)
public void com.haer.domain.Person.setD(java.lang.String)
public void com.haer.domain.Person.setC(java.lang.String)
public int com.haer.domain.Person.getB()
public void com.haer.domain.Person.setA(java.lang.String)
public final void java.lang.Object.wait() throws java.lang.InterruptedException
public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException
public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException
public boolean java.lang.Object.equals(java.lang.Object)
public native int java.lang.Object.hashCode()
public final native java.lang.Class java.lang.Object.getClass()
public final native void java.lang.Object.notify()
public final native void java.lang.Object.notifyAll()
-------------getMethods
public void com.haer.domain.Person.eat(java.lang.String)
eat...饭
-------------getDeclaredMethods
private void com.haer.domain.Person.run()
run
public java.lang.String com.haer.domain.Person.toString()
toString
public java.lang.String com.haer.domain.Person.getC()
getC
public java.lang.String com.haer.domain.Person.getA()
getA
public void com.haer.domain.Person.eat(java.lang.String)
eat
public java.lang.String com.haer.domain.Person.getD()
getD
public void com.haer.domain.Person.setB(int)
setB
public void com.haer.domain.Person.setD(java.lang.String)
setD
public void com.haer.domain.Person.setC(java.lang.String)
setC
public int com.haer.domain.Person.getB()
getB
public void com.haer.domain.Person.setA(java.lang.String)
setA
-------------getDeclaredMethod
private void com.haer.domain.Person.run()
run...
-------------获取类名（全类名）
com.haer.domain.Person
```
      