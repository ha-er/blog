# ResultMap映射

## 结果映射

解决属性名和字段名不一致的问题

`UserMapper.xml`

```xml
<select id="selectUserList" resultType="User">
       select id,name,pwd from user
</select>
```

实体类POJO`User`

```java
public class User {
    private int id;
    private String name;
    private String password;
    //...无参构造、有参构造、get set方法、toString方法
}
```

查询结果

```
User{id=1, name='哈儿', password='null'}
User{id=2, name='淼淼', password='null'}
User{id=3, name='娇娇', password='null'}
```

可以发现password查询不到，因为此时数据库的字段名为`pwd`，而POJO中为password

* 方法一： 起别名

```xml
<select id="selectUserList" resultType="User">
       select id,name,pwd as password from user
</select>
```

```
User{id=1, name='哈儿', password='123456'}
User{id=2, name='淼淼', password='123456'}
User{id=3, name='娇娇', password='123456'}
```

成功了。。但是在开发中，当不同字段过多，这种方法就显得笨拙了

* ResultMap映射`UserMapper.xml`

```xml
<mapper namespace="com.haer.dao.UserMapper">
    <resultMap id="UserResultMap" type="User" autoMapping="true">
        <result column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="pwd" property="password"/>
    </resultMap>

    <select id="selectUserList" resultMap="UserResultMap">
       select id,name,pwd from user
    </select>
</mapper>
```

1、写一个`resultMap`标签，设置一个`id`，`type`指向实体类User

2、用`result`标签给每一个字段进行映射`column`属性写入数据库字段名，`property`属性写入实体类名

3、我们将select标签中的`resultType`改为`resultMap` ，且属性值与上面resultMap的id值一致

这样成功实现resultMap映射，此时可能会想到相同名字的字段，是否可以不用手动映射呢，我测试了确实可以

`autoMapping="true"`这个属性默认为true，开启自动映射

## 高级结果映射

* `constructor` - 用于在实例化类时，注入结果到构造方法中
  * `idArg` - ID 参数；标记出作为 ID 的结果可以帮助提高整体性能
  * `arg` - 将被注入到构造方法的一个普通结果
* `id` – 一个 ID 结果；标记出作为 ID 的结果可以帮助提高整体性能
* `result` – 注入到字段或 JavaBean 属性的普通结果
* `association` – 一个复杂类型的关联；许多结果将包装成这种类型
  * 嵌套结果映射 – 关联可以是 resultMap 元素，或是对其它结果映射的引用
* `collection` – 一个复杂类型的集合
  * 嵌套结果映射 – 集合可以是 resultMap 元素，或是对其它结果映射的引用
* `discriminator` – 使用结果值来决定使用哪个 resultMap
  * `case` – 基于某些值的结果映射
    * 嵌套结果映射 – case 也是一个结果映射，因此具有相同的结构和元素；或者引用其它的结果映射
    
### id&result

```xml
<resultMap>
  <id column="id" property="id"/>
  <result column="name" property="name"/>
</resultMap>
```

id 元素对应的属性会被标记为对象的标识符，在比较对象实例时使用。 这样可以提高整体的性能，尤其是进行缓存和嵌套结果映射（也就是连接映射）的时候。

### 复杂查询

* **多对一**

对象使用`association`标签

`Student` `Teacher`实体类

```java
public class Student {
    private int id;
    private String name;
    private Teacher teacher;
    //...无参构造、有参构造、get set方法、toString方法
}
```
```java
public class Teacher {
    private int id;
    private String name;
    //...无参构造、有参构造、get set方法、toString方法
}
```

方法一：

```xml
<mapper namespace="com.haer.dao.StudentMapper">
    <resultMap id="StudentResultMap" type="Student">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <association property="teacher" column="tid" javaType="Teacher" select="getTeacher"/>
    </resultMap>
    <select id="selectStudentList" resultMap="StudentResultMap">
       select id,name,tid from student
    </select>
    <select id="getTeacher" resultType="Teacher">
       select id,name from teacher where id = #{tid}
    </select>
</mapper>
```

`property`: 写实体类属性名：teacher

`column`: 写要传入的id：tid

`javaType`: 指定属性的类型：Teacher

`select`: 传入的查询方法：getTeacher

方法二：

1、先写好sql语句，查询需要的数据

2、在`association`标签中使用`result`标签映射，映射的是Teacher的属性名和字段名（这里取了别名tname）

```xml
<mapper namespace="com.haer.dao.StudentMapper">
    <resultMap id="StudentResultMap" type="Student">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <association property="teacher" javaType="Teacher">
<!--这里的property="name" 对应的是Teacher类中的name       -->
            <result column="tname" property="name"/>
        </association>
    </resultMap>

    <select id="selectStudentList" resultMap="StudentResultMap">
       select s.id,s.name,t.name tname from student s, teacher t
       where s.tid = t.id
    </select>
</mapper>
```

* **一对多**

集合使用`collection`标签

`Student` `Teacher`实体类

```java
public class Student {
    private int id;
    private String name;
    //...无参构造、有参构造、get set方法、toString方法
}
```
```java
public class Teacher {
    private int id;
    private String name;
    private List<Student> studentList;
    //...无参构造、有参构造、get set方法、toString方法
}
```

方法一：

```xml
<mapper namespace="com.haer.dao.TeacherMapper">
    <resultMap id="TeacherResultMap" type="Teacher">
        <id property="id" column="id"/>
        <result property="name" column="name"/>
        <collection property="studentList" javaType="ArrayList" ofType="Student" column="id" select="getStudent"/>
    </resultMap>

    <select id="selectTeacherList" resultMap="TeacherResultMap">
       select id,name from teacher
    </select>

    <select id="getStudent" resultType="Student">
       select id,name,tid from student where tid = #{id}
    </select>
</mapper>  
```

`property`：Teacher类中的属性名：studentList

`javaType`：指定属性的类型：ArrayList(collection中可以不写)

`ofType`：集合中的泛型信息：Student


方法二：

```xml
<mapper namespace="com.haer.dao.TeacherMapper">
    <resultMap id="TeacherResultMap" type="Teacher">
        <id property="id" column="tid"/>
        <result property="name" column="tname"/>
        <collection property="studentList"  javaType="ArrayList" ofType="Student">
            <id property="id" column="sid"/>
            <result property="name" column="sname"/>
        </collection>
    </resultMap>

    <select id="selectTeacherList" resultMap="TeacherResultMap">
       select s.id sid, s.name sname, t.id tid, t.name tname from teacher t, student s
       where s.tid = t.id
    </select>
</mapper>
```

::: tip 
javaType：用来指定实体类中属性的类型

ofType：用来指定映射到List或者集合中的pojo类型，泛型中的约束类型
:::

