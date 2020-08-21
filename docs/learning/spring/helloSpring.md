# HelloSpring

实体类

```java
public class Hello {
    private String str;
    //get set方法，toString方法
}
```

resources目录下，新建beans.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 使用Spring创建对象，在Spring中这些都称为Bean

    java：
      类型 变量名 = new 类型()；
      Hello helli = new Hello();

    xml
      id = 变量名
      class = new 的对象
      property 相当于给对象中的属性设置一个值
      name：属性名
      value：具体的值，基本数据类型
      ref：引用Spring容器创建好的对象
    -->
    <bean id="hello" class="com.haer.pojo.Hello">
        <property name="str" value="Spring"/>
    </bean>

</beans>
```

测试

```java
public class MyTest {
    public static void main(String[] args) {
        //获取Spring的上下文对象
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        //我们的对象现在都在Spring容器中管理了，我们要使用，直接去里取出来就可以了
        Hello hello = context.getBean("hello",Hello.class);
        System.out.println(hello.toString());
    }
}
```

控制台打印

```
Hello{str='Spring'}
```
::: tip 思考
* Hello对象是谁创建的？**Spring**
* Hello对象的属性是怎么设置的？**Spring容器**
:::

这个过程就叫控制反转：

* 控制：谁来控制对象的创建，传统的应用程序是由程序本身控制创建的使用Spring后，对象是由Spring来创建

* 反转：程序本身不创建对象，而是被接收对象

* 依赖注入：就是利用set方法来进行注入

* IOC是一种编程思想，由主动的编程变成被动的接收

到了现在我们彻底不用在程序中改动了，实现不同的操作，需要在xml配置文件中进行修改
所谓IOC：**对象由Spring来创建、管理、装配**
