# 声明式事务

* 声明式事务：AOP
* 编程式事务：需要在代码中，进行事务的管理

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