# 使用注解开发

在Spring4之后，要使用注解开发，必须要保证aop的包导入

要使用注解需要导入context约束，增加注解支持

## 注册bean，赋值

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

<!--    指定要扫描的包，这个包下的注解就会生效-->
    <context:component-scan base-package="com.haer"/>
    <!--    开启注解的支持-->
    <context:annotation-config/>


</beans>
```

实体类

```java
//等价于 <bean id="user" class="com.haer.pojo.User"/>
//@Component 组件,放在类上，说明这个类被Spring管理了，就是bean
@Component
@Scope("singleton")
public class User {

    //相当于<property name="name" value="哈儿"/>，也可以放到set方法上
    @Value("哈儿")
    public String name;
}
```



## @Component衍生的注解

@Component：按照mvc三层架构分层

* dao【@Repository】
* service【@Service】
* controller【@Controller】

这四个注解功能都是一样，装配bean

## 自动装配

上一节已经介绍过了

## 作用域

@Scope("singleton")设置单例模式

```java
@Component
@Scope("singleton")
public class User {

    //相当于<property name="name" value="哈儿"/>，也可以放到set方法上
    @Value("哈儿")
    public String name;
}
```

总结：

xml与注解的区别

* zml更加万能，适用于任何场合，维护简单
* 注解不是自己类使用不了，维护复杂

xml与注解最佳实践

* xml用来管理bean
* 注解只负责完成属性注入
* 我们在使用过程，需要注意：必须人注解生效，那么就需要开启注解的支持

```xml
<!--    指定要扫描的包，这个包下的注解就会生效-->
    <context:component-scan base-package="com.haer"/>
    <!--    开启注解的支持-->
    <context:annotation-config/>
```

## 使用Java的方式配置

完全不使用Spring的xml配置

实体类

```java
//等价于 <bean id="user" class="com.haer.pojo.User"/>
//@Component 组件,放在类上，说明这个类被Spring管理了，就是bean
@Component
@Scope("singleton")
public class User {

    //相当于<property name="name" value="哈儿"/>，也可以放到set方法上
    @Value("哈儿")
    public String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

配置类

```java
//相当于<beans></beans>
@Configuration//也会被注册到容器中，本身也是@Component
@ComponentScan("com.haer")//融合其他配置文件
@Import(HaerConfig2.class)
public class HaerConfig {

    //注册一个bean就相当于，之前写的一个bean
    //方法的名字，就相当于bean的id属性值
    //方法返回值，就相当于bean标签的class属性值
    @Bean
    public User getUser() {
        return new User();//就是返回要注入到bena的对象
    }
}
```

测试

```java
public class MyTest {
    @Test
    public void test(){
        //如果完全使用了配置类方式去做，就只能通过AnnotationConfigApplicationContext来获取容器，通过配置类的class对象加载！
        ApplicationContext context = new AnnotationConfigApplicationContext(HaerConfig.class);
        User getUser = context.getBean("getUser", User.class);
        System.out.println(getUser.getName());
    }
}

```

