# 依赖注入

* 依赖：bean对象的创建依赖于容器

* 注入：bean对象中的所有属性，由容器注入

## 构造器注入

User实体类

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

beans.xml

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
    <constructor-arg index="0" value="思思"/>
</bean>
```

2.参数类型

```xml
<bean id="user" class="com.haer.pojo.User">
    <constructor-arg type="java.lang.String" value="思思"/>
</bean>
```

3.参数名

```xml
<bean id="user" class="com.haer.pojo.User">
    <constructor-arg name="name" value="思思"/>
</bean>
```

::: tip 总结
在配置文件加载时，容器中管理的对象就**全部**已经初始化了
:::

## **Set方式注入**

实体类Address

```java
public class Address {
    private String address;
    //..get set方法
}
```

实体类Student

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



## 拓展方式注入