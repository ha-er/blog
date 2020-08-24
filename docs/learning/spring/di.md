# 依赖注入

* 依赖：bean对象的创建依赖于容器

* 注入：bean对象中的所有属性，由容器注入

## 构造器注入

`User`实体类

```java
public class User {
    private String name;

    public User() {
        System.out.println("无参构造");
    }
    
    public User(String name) {
            this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void show(){
        System.out.println("name="+name);
    }
}
```

* **无参构造创建对象**

`beans.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="user" class="com.haer.pojo.User">
        <property name="name" value="哈儿"/>
    </bean>

</beans>
```

测试

```java
public class UserTest {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        User user = context.getBean("user", User.class);
        user.show();
    }
}
```

控制台打印

```
无参构造
name=哈儿
```

* **有参构造创建对象**

1.下标赋值

```xml
<bean id="user" class="com.haer.pojo.User">
    <constructor-arg index="0" value="哈儿"/>
</bean>
```

2.参数类型

```xml
<bean id="user" class="com.haer.pojo.User">
    <constructor-arg type="java.lang.String" value="哈儿"/>
</bean>
```

3.参数名

```xml
<bean id="user" class="com.haer.pojo.User">
    <constructor-arg name="name" value="哈儿"/>
</bean>
```

::: tip 总结
在配置文件加载时，容器中管理的对象就**全部**已经初始化了
:::

## **Set方式注入**

实体类`Address`

```java
public class Address {
    private String address;
    //..get set方法 toString方法
}
```

实体类`Studen`t

```java
public class Student {
    private String name;
    private Address address;
    private String[] books;
    private List<String> hobbys;
    private Map<String,String> card;
    private Set<String> games;
    private String wife;
    private Properties properties;
    //...get set方法，toString方法
}
```

`beans.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="address" class="com.haer.pojo.Address"/>

    <bean id="student" class="com.haer.pojo.Student">
        <!-- 普通方式注入，value -->
        <property name="name" value="哈儿"/>
<!--        bean注入，ref-->
        <property name="address" ref="address"/>
<!--        数组注入 -->
        <property name="books">
            <array>
                <value>哈儿</value>
                <value>淼淼</value>
                <value>娇娇</value>
            </array>
        </property>
<!--        list-->
        <property name="hobbys">
            <list>
                <value>学习</value>
                <value>减肥</value>
                <value>敲代码</value>
            </list>
        </property>
<!--        map-->
        <property name="card">
            <map>
                <entry key="身份证" value="4444444"/>
                <entry key="银行卡" value="2123213"/>
            </map>
        </property>
<!--        set-->
        <property name="games">
            <set>
                <value>LOL</value>
                <value>王者</value>
            </set>
        </property>
<!--        null-->
        <property name="wife">
            <null/>
        </property>
<!--        properties-->
        <property name="properties">
            <props>
                <prop key="学号">20200823</prop>
                <prop key="姓名">哈儿</prop>
            </props>
        </property>
    </bean>

</beans>
```

测试

```java
public class MyTest {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        Student student = context.getBean("student", Student.class);
        System.out.println(student.toString());

    }
}
```

控制台打印

```
Student{name='哈儿', address=Address{address='null'}, books=[哈儿, 淼淼, 娇娇], hobbys=[学习, 减肥, 敲代码], card={身份证=4444444, 银行卡=2123213}, games=[LOL, 王者], wife='null', properties={学号=20200823, 姓名=哈儿}}

```


## 拓展方式注入

* p命名空间

在xml头中添加一行`xmlns:p="http://www.springframework.org/schema/p"`

* c命名空间

在xml头中添加一行`xmlns:c="http://www.springframework.org/schema/c"`

`User`实体

```java
public class User {
    private String name;
    private int age;
    //。get set方法，toString方法，无参构造，有参构造
}
```

`beans.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

<!--    p命名空间注入，可以直接注入属性的值：property-->
    <bean id="user" class="com.haer.pojo.User" p:name="哈儿" p:age="20"/>

<!--    c命名空间注入，通过构造器注入：construct-args-->
    <bean id="user2" class="com.haer.pojo.User" c:age="22" c:name="思思"/>
</beans>
```

测试

```java
public class MyTest {

    @Test
    public void UserTest(){
        ApplicationContext context = new ClassPathXmlApplicationContext("userbeans.xml");
//        User user = context.getBean("user", User.class);
        User user = context.getBean("user2", User.class);
        System.out.println(user);

    }
}
```

可以成功给属性注入值

## Bean的作用域

1.单例模式（Spring默认机制），使用同一个对象

```xml
<bean id="user" class="com.haer.pojo.User" p:name="哈儿" p:age="20" scope="singleton"/>
```

2.原型模式：每次从容器中get的时候，都会产生一个新的对象

```xml
<bean id="user" class="com.haer.pojo.User" p:name="哈儿" p:age="20" scope="prototype"/>
```

3.其余的request，session，application，这些只能在web开发使用

