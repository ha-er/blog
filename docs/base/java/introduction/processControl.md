# 流程控制

## 顺序结构

* Java的基本结构计算顺序结构，未特别指明，否则就按照顺序一句一句执行
* 顺序结构是最简单的算法结构
* **它是任何一个算法都离不开的一种基本算法结构**

## 条件语句

* if

```
if(布尔表达式)
{
   //如果布尔表达式为true将执行的语句
}
```

* if...else

```
if(布尔表达式){
   //如果布尔表达式的值为true
}else{
   //如果布尔表达式的值为false
}
```

* if...else if...else

```
if(布尔表达式 1){
   //如果布尔表达式 1的值为true执行代码
}else if(布尔表达式 2){
   //如果布尔表达式 2的值为true执行代码
}else if(布尔表达式 3){
   //如果布尔表达式 3的值为true执行代码
}else {
   //如果以上布尔表达式都不为true执行代码
}
```

## 循环结构

* while

```
while( 布尔表达式 ) {
  //循环内容
}
```

* do…while

```
do {
       //代码语句
}while(布尔表达式);
```

* for

```
for(初始化; 布尔表达式; 更新) {
    //代码语句
}
```

* Java 增强 for 循环

```
for(声明语句 : 表达式)
{
   //代码句子
}
```

* break 关键字

break 主要用在循环语句或者 switch 语句中，用来跳出整个语句块。

break 跳出最里层的循环，并且继续执行该循环下面的语句。

```
break;
```

* continue 关键字

continue 适用于任何循环控制结构中。作用是让程序立刻跳转到下一次循环的迭代。

在 for 循环中，continue 语句使程序立即跳转到更新语句。

在 while 或者 do…while 循环中，程序立即跳转到布尔表达式的判断语句

```
continue;
```

## Java switch case 语句

switch case 语句判断一个变量与一系列值中某个值是否相等，每个值称为一个分支。

```
switch(expression){
    case value :
       //语句
       break; //可选
    case value :
       //语句
       break; //可选
    //你可以有任意数量的case语句
    default : //可选
       //语句
}
```