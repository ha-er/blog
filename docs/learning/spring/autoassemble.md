# Bean的自动装配

* 自动装配Spring满足bean依赖一种方式
* Spring会在上下文中自动寻找，并自动给bean装配属性

在Spring中有三种装配方式

1.在xml中显示的配置

2.在java中显示配置

3.隐式的自动装配bean【重要】

## xml自动装配

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="cat" class="com.haer.pojo.Cat"/>
    <bean id="dog" class="com.haer.pojo.Dog"/>

<!--
byName:会自动在容器上下文中查找，和自己对象set方法后面的值对应的beanid
byType：会自动在容器上下文中查找，和自己对象属性类型相同的bean
-->
    <bean id="person" class="com.haer.pojo.Person" autowire="byName">
        <property name="name" value="哈儿"/>
    </bean>
</beans>
```

* byName: 需要保证所有的bean的id唯一，并且这个bean需要和自动注入的属性的set方法的值一致
* byType: 需要保证所有的bean的class唯一，并且这个bean需要和自动注入的属性的类型一致

## 使用注解自动装配

jdk1.5以上，spring2.5以上

使用注解须知：

1.导入约束，context约束,beans标签头加`xmlns:context`，在`xsi:schemaLocation`加配置

2.配置注解支持，`<context:annotation-config/>`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

<!--    开启注解的支持-->
    <context:annotation-config/>

</beans>
```

@Autowired

直接在属性上使用即可，也可以在set方法上使用

```java
public class Person {

    @Autowired
    private Cat cat;
    @Autowired
    private Dog dog;
    private String name;
}
```

使用Autowired我们可以不用编写set方法，前提是你这个自动装配的属性在IOC容器中存在，且符合名字byName

* 拓展：

字段标记这个标注俩种注解的一种，标识这个字段或者对象可以为null，否则不能为空

```
@Nullable 
@Autowired(required = false) 
```

如果`@Autowired`自动装配的环境比较复杂，自动装配无法通过一个注解`@Autowired`
完成时，我们可以使用@Qualifler(value="xxx")去配合`@Autowired`使用，指定一个唯一的bean对象注入

```java
public class Person {

    @Autowired
    @Qualifier(value = "cat")
    private Cat cat;
}
```

@Resource

```java
public class Person {

    @Resource(name = "dog")
    private Dog dog;
}
```

@Resource和@Autowired：

* 都是用来自动装配的，都可以防止属性字段上
* @Autowired通过byType的方式实现，必须保证这个对象存在，配合@Qualifler(value="xxx")使用byName实现
* @Resource默认通过buName的方式实现，如果找不到名字，则通过byType实现，俩个都找不到就报错
* 执行顺序不同：@Autowired通过byType的方式实现，@Resource默认通过buName的方式实现



