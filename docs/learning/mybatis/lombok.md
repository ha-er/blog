# Lombok

## 安装插件

Idea：File->settings->plugins->Marketplace

搜索Lombok插件安装，重启即可，一般搜不到是已经安装了。


导入包
```xml
<!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.12</version>
    <scope>provided</scope>
</dependency>

```

* 在实体类上加注解就可以使用了

@Getter and @Setter

@FieldNameConstants

@ToString

@EqualsAndHashCode

@AllArgsConstructor, @RequiredArgsConstructor and @NoArgsConstructor

@Log, @Log4j, @Log4j2, @Slf4j, @XSlf4j, @CommonsLog, @JBossLog, @Flogger, @CustomLog

@Data ：无参构造 get set方法 equals方法 hashcode方法 toString方法

@Builder

@SuperBuilder

@Singular

@Delegate

@Value

@Accessors

@Wither

@With

@SneakyThrows

@val

@var
