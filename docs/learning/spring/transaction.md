# 声明式事务

* 声明式事务：AOP
* 编程式事务：需要在代码中，进行事务的管理

`spring-dao.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans>

<!--    配置声明式事务-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <constructor-arg ref="dataSource" />
    </bean>
<!--    结合AOP实现事务的织入-->
<!--    配置事务通知-->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
<!--        给哪些方法配置事务-->
        <tx:attributes>
            <tx:method name="add" propagation="REQUIRED"/>
            <tx:method name="selectUser" read-only="true"/>
        </tx:attributes>
    </tx:advice>

<!--    配置事务切入-->
    <aop:config>
        <aop:pointcut id="txPointCut" expression="execution(* com.haer.mapper.*.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointCut"/>
    </aop:config>
</beans>
```

Spring中七种Propagation类的事务属性详解： 

* REQUIRED：支持当前事务，如果当前没有事务，就新建一个事务。这是最常见的选择。 

* SUPPORTS：支持当前事务，如果当前没有事务，就以非事务方式执行。 

* MANDATORY：支持当前事务，如果当前没有事务，就抛出异常。 

* REQUIRES_NEW：新建事务，如果当前存在事务，把当前事务挂起。 

* NOT_SUPPORTED：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。 

* NEVER：以非事务方式执行，如果当前存在事务，则抛出异常。 

* NESTED：支持当前事务，如果当前事务存在，则执行一个嵌套事务，如果当前没有事务，就新建一个事务。 