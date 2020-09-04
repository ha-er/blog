# 常用类

## String

> 了解String类

简单看下String源码，发现String的构造方法都给这个变量`value[]`赋值，这时我们发现这个变量是使用`final`
修饰的，说明是不可改变的。

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
    //....
}
```

在开发环境中，字符串是需要经常访问的，所以在程序中使用了类似“缓存”的技术，Java中所有使用双引号括起来的
字符串都会在“字符串常量池”中创建一份，在方法区中被存储。

所以当你使用`String s1 = "haer";`时，是首先去字符串常量池寻找，如果有，就将s1指向`"haer"`，就不需要再去创建
一个字符串了，如果没有的话，就会在字符串常量池中创建一份。

```java
public class StringTest01 {
    public static void main(String[] args) {
        //创建一个"haer"字符串对象，该对象的内存地址，让变量s1保存
        //si只是一个引用，指向"haer"对象
        String s1 = "haer";
        //si并没有使用final修饰，所以可以让s1重新指向"sb"字符串
        //但是"haer","sb"字符串本身是不可以改变的
        s1 = "sb";
        System.out.println(s1);//sb

        String s2 = "哈儿";//第一次创建，会在常量池中新建一个"哈儿"字符串对象,该对象不可变
        String s3 = "哈儿";//第二次，就会直接从字符串常量池拿来用
        System.out.println(s2==s3);//true。s2的指向是和s3一致的

        //使用new 创建俩个对象
        String s4 = new String("娇娇");
        String s5 = new String("娇娇");
        System.out.println(s4==s5);//false
        //所以比较俩个字符串是否相等，必须使用字符串的equals方法
        System.out.println(s4.equals(s5));//true
        //本来Object类的equals方法是和==一样的，但是字符串重写了equals方法
        //所以是比较俩个字符串是否一样
        
        //一下程序执行结束后，会在字符串常量池创建三个字符串对象
        String s6 = "淼淼";
        String s7 = "憨批";
        String s8 = s6 + s7;
        //因为字符串拼接会创建对象，所以在使用时要注意要频繁使用拼接操作，
        //会在字符串常量池中创建大量对象，给垃圾回收带来问题
    }
}
```

比较俩种创建字符串对象的区别

* `String s1 = "haer"`只会在字符串常量池中寻找或创建一个字符串对象

* `String s2 = new String("haer");`会在字符串常量池中寻找或创建字符串对象，还会在堆（heap）中再创建一个字符串对象，并且指向堆中的字符串对象

**堆区内存是运行期分配，常量池是编译器分配的**

> 创建String的常用方法

```java
package com.haer.string;

public class StringTest02 {
    public static void main(String[] args) {
        //1
        String s1 = "haer";
        //2
        String s2 = new String("haer");
        //3
        byte[] bytes = {97,98,99,100};
        String s3 = new String(bytes);
        System.out.println(s3);//abcd,String已经重写了Object的toString方法
        System.out.println(s3.toString());//相当于
        //4：从下标为1的位置开始，输出长度为2的字符串
        String s4 = new String(bytes, 1, 2);
        System.out.println(s4);//bc
        //5
        char[] c1 = {'我','是','哈','儿'};
        String s5 = new String(c1);
        System.out.println(s5);//我是哈儿
        //6  从下标为2的位置开始，输出长度为2的字符串
        String s6 = new String(c1, 2, 2);
        System.out.println(s6);//哈儿
    }
}
```
