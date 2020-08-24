# Spring配置

## 别名

```xml
<beans>
    <alias name="user" alias="haer"/>
</beans>
```

## Bean的配置

name在这里也是别名，且可以配置多个

```xml
<beans>
    <bean id="user" class="com.haer.pojo.User" name="haer,sisi">
        <constructor-arg name="name" value="哈儿"/>
    </bean>
</beans>
```

## import

合并多个配置文件

```xml
<beans>
    <import resource="beans2.xml"/>
</beans>
```