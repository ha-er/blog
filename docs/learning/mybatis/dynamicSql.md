# 动态Sql

## IF

条件满足标签内的sql才会生效

```xml
<if test="title != null">
    AND title like #{title}
</if>
```

## choose、when、otherwise

类似于switch case语句，满足了一个条件，后面的都不会执行，都不满足执行otherwise

```xml
<choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
</choose>
```

## trim、where、set

* `where`标签只会在子元素返回任何内容的情况下才插入`WHERE`子句。而且，若子句的开头为`AND`或`OR`，where元素也会将它们去除。

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  <where>
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
  </where>
</select>
```

等价于

```xml
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  ...
</trim>
```

* `set`元素会动态地在行首插入`SET`关键字，并会删掉额外的逗号

```xml
<update id="updateAuthorIfNecessary">
  update Author
    <set>
      <if test="username != null">username=#{username},</if>
      <if test="password != null">password=#{password},</if>
      <if test="email != null">email=#{email},</if>
      <if test="bio != null">bio=#{bio}</if>
    </set>
  where id=#{id}
</update>
```

等价于

```xml
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>
```

## foreach

动态SQL的另一个常见使用场景是对集合进行遍历（尤其是在构建IN条件语句的时候）

```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  WHERE ID in
  <foreach item="item" index="index" collection="list"
      open="(" separator="," close=")">
        #{item}
  </foreach>
</select>
```

它允许你指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量。它也允许你指定开头与结尾的字符串以及集合项迭代之间的分隔符。

::: tip
你可以将任何可迭代对象（如 List、Set 等）、Map对象或者数组对象作为集合参数传递给foreach。当使用可迭代对象或者数组时，index是当前迭代的序号，
item的值是本次迭代获取到的元素。当使用Map对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。
:::