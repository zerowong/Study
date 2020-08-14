/* 模板是泛型编程的基础 */

/*
模板参数(template parameter)
模板实参(template argument)
实例化(instantiate)
实例(instantiation)
类型参数(type parameter)
显式模板实参(explicit template argument)
默认模板实参(default template argument)
模板实参推断(template argument deduction)
类型转换模板(type transformation template)
可变参数模板(variadic template)
参数包(parameter packet)
模板参数包(template parameter packet)
函数参数包(function parameter packet)
包扩展(pack expansion)
模式(pattern)
模板特例化(template specialization)
部分特例化(partial specialization)
*/

/*
函数模板可以声明为 inline 和 constexpr 的
语法：把以上说明符放在模板参数列表之后，返回类型之前
*/

/*
编写泛型代码的两个原则：
1.模板的函数参数是 const 的引用：保证函数能用于不能拷贝的类型
2.条件判断仅使用 < 运算符：大多数类都定义了 < 运算符
*/

/*
模板直到实例化才生成代码，为了实例化模板，编译器需要模板定义，因此，模板的头文件通常即包括声明也包括定义
*/

/*
定义在类模板之外的成员函数必须以关键字 template 开始，后跟类模板参数列表
*/

/*
默认情况下，对于一个实例化了的类模板，其成员只有在使用时才被实例化
*/

/*
在类模板自己的作用域中时，可以直接使用模板名(类名)而不提供实参
*/

/*
如果一个类模板包含一个非模板友元，则友元被授权为可以访问所有模板实例
如果友元自身是模板，类可以授权给所有友元模板实例，也可以授权给特定实例
*/

/*
模板参数遵循普通的作用域规则。一个模板参数名的可用范围是其声明之后，至模板声明或定义结束之前
与其它名字一样，模板参数名会屏蔽外层作用域的相同名字
模板内不能重用模板参数名(包括模板参数列表中)，所以一般大写
与函数相同，模板声明和定义可以分开，且模板参数名可以不同
*/

/*
显式实例化：extern template declaration
*/

/* 模板类型参数的自动类型转换：1.const转换；2.数组或函数指针转换 */

/*
函数模板参数如果是引用，其应用正常的引用绑定规则，const是底层的，不是顶层的
1.参数类型是普通左值引用时(T&)：只能传递一个左值(如一个变量或返回引用类型的表达式)
2.参数类型是(const
T&)时：可以传递任何类型的实参(一个const/非const对象，一个临时对象，一个字面常量值)
3.参数类型时右值引用时(T&&)：原则上只能传递右值，因为引用折叠(见书)实际上可以传递任何类型
*/

#include <cstring>
#include <functional>
#include <initializer_list>
#include <iostream>
#include <list>
#include <memory>
#include <sstream>
#include <string>
#include <type_traits>
#include <utility>
#include <vector>

using namespace std;

// 友元所需的前置声明也需是模板声明
template <typename>
class BlobPtr;
template <typename>
class Blob;
template <typename T>
bool operator==(const Blob<T>&, const Blob<T>&);

template <typename T>
class Blob {
  // 一对一友好关系：每个Blob实例将访问权限授予用相同类型实例化的BlobPtr和相等运算符
  friend class BlobPtr<T>;
  friend bool operator==<T>(const Blob<T>&, const Blob<T>&);

 public:
  typedef T value_type;
  typedef typename vector<T>::size_type size_type;
  Blob();
  Blob(initializer_list<T> il);
  size_type size() const { return data->size(); }
  bool empty() const { return data->empty(); }
  void push_back(const T& t) { data->push_back(t); }
  void push_back(T&& t) { data->push_back(std::move(t)); }
  void pop_back();
  T& back();
  const T& back() const;
  T& front();
  const T& front() const;
  T& operator[](size_type i);
  void print();

  template <typename iter>
  Blob(iter, iter);

 private:
  shared_ptr<vector<T>> data;
  void check(size_type, const string&) const;
};

template <typename T>
Blob<T>::Blob() : data(make_shared<vector<T>>()) {}

template <typename T>
Blob<T>::Blob(initializer_list<T> il) : data(make_shared<vector<T>>(il)) {}

template <typename T>
void Blob<T>::check(size_type i, const string& msg) const {
  if (i >= data->size()) {
    throw out_of_range(msg);
  }
}

template <typename T>
T& Blob<T>::back() {
  check(0, "back on empty Blob");
  return data->back();
}

template <typename T>
const T& Blob<T>::back() const {
  check(0, "back on empty Blob");
  return data->back();
}

template <typename T>
T& Blob<T>::front() {
  check(0, "front on empty Blob");
  return data->front();
}

template <typename T>
const T& Blob<T>::front() const {
  check(0, "front on empty Blob");
  return data->front();
}

template <typename T>
T& Blob<T>::operator[](size_type i) {
  check(i, "Out of range");
  return (*data)[i];
}

template <typename T>
void Blob<T>::print() {
  for (auto i : *(this->data)) {
    cout << i << " ";
  }
  cout << endl;
}

template <typename T>
class BlobPtr {
 public:
  BlobPtr() : curr(0){};
  BlobPtr(Blob<T>& b, size_t sz = 0) : wptr(b.data), curr(sz) {}
  T& operator*() const {
    auto p = check(curr, "dereference past end");
    return *(p)[curr];
  }
  BlobPtr& operator++();
  BlobPtr& operator--();

 private:
  shared_ptr<vector<T>> check(size_t, const string&) const;
  weak_ptr<vector<T>> wptr;
  size_t curr;
};

// 通用的和特定模板友好关系：
// 前置声明，在将一个模板的特定实例声明为友元时用到
template <typename T>
class Pal;
// 非模板类
class C {
  // 用类C实例化的Pal是C的一个友元
  friend class Pal<C>;
  // Pal2的所有实例都是C的友元，这种情况无需前置声明
  template <typename T>
  friend class Pal2;
};
// 自身为类模板
template <typename T>
class C2 {
  // C2的每个实例将相同实例化的Pal声明为友元
  friend class Pal<T>;
  // Pal2的每个实例都是C2的每个实例的友元，不需要前置声明，注意模板参数不能同名
  template <typename X>
  friend class Pal2;
  // Pal3是非模板类，它是C2的所有实例的友元，不需要前置声明
  friend class Pal3;
};

// 令模板自己的类型参数称为友元：假设一个类型名为Foo，则Foo将成为Bar<Foo>的友元，内置类型同样有效
template <typename Type>
class Bar {
  friend Type;
};

/* 模板类型别名： */
typedef Blob<string> strBlob;
template <typename T>
using twin = pair<T, T>;
twin<string> authors;  // authors是一个pair<string, string>
// 可固定一个或多个模板参数
template <typename T>
using partN0 = pair<T, int>;
partN0<string> books;  // books是一个pair<string, int>

/*
类模板的static成员：相同类型实例化的对象共享static成员，但不同类型实例化的对象分开算
static成员的定义也需模板声明，static成员同样只有使用时才实例化
*/
template <typename T>
class Foo {
 public:
  static size_t foo() { return ctr; };

 private:
  static size_t ctr;
};
template <typename T>
size_t Foo<T>::ctr = 0;
// fs.foo()不等于fi.foo()
Foo<string> fs;
Foo<int> fi1;

/*
类模板的作用域运算符：默认情况下，C++语言假定通过作用域运算符访问的名字不是类型，如果我们希望使用应该模板类型参数的类型成员，
就必须显式告诉编译器该名字是一个类型
*/
template <typename T>
typename T::value_type top(const T& c) {
  if (c.empty()) {
    return typename T::value_type();
  }
  return c.back();
}

// 函数模板语法：关键字 template 后跟 < 模板参数列表 >
// 类型参数：参数前必须使用关键字 typename 或 class，两者没有区别
template <typename T, typename U>
inline int compare(const T& a, const U& b) {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
}

// 非类型参数：参数可以是整型、指向对象或函数的指针或(左值)引用，对应实参必须是常量表达式且具有静态生命周期
// template <unsigned N, unsigned M>
// int compare(const char (&p1)[N], const char (&p2)[M]) {
//   return strcmp(p1, p2);
// }

/* 模板函数的默认模板实参 */
template <typename T, typename F = less<T>>
int compareV2(const T& v1, const T& v2, F f = F()) {
  if (f(v1, v2)) return -1;
  if (f(v2, v1)) return 1;
  return 0;
}

/* 类模板的默认模板实参：即使一个类模板为所有模板参数提供了默认实参，也必须在模板名后跟一个空尖括号对
 */
template <typename T = int>
class Numbers {
 public:
  Numbers(T v = 0) : val(v) {}

 private:
  T val;
};
Numbers<> n;

/*
成员模板：一个类(无论是普通类还类模板)可以包含本身是模板的成员函数，这种成员被称为成员模板
成员模板不能是虚函数
*/
// 普通类的成员模板
class DebugDelete {
 public:
  DebugDelete(ostream& s = cerr) : out(s) {}
  template <typename T>
  void operator()(T* p) const {
    delete p;
    out << "Deleted" << endl;
  }

 private:
  ostream& out;
};

// 类模板的成员模板：当在类模板外定义一个成员模板时，必须同时为类模板(前)和成员模板(后)提供模板参数列表，
template <typename T>
template <typename iter>
Blob<T>::Blob(iter begin, iter end)
    : data(make_shared<vector<T>>(begin, end)) {}

// 指定显式模板实参：T1是无法推断的，因此调用时必须显式指定
template <typename T1, typename T2, typename T3>
T1 sum(T2 v1, T3 v2) {
  return v1 + v2;
}

// 函数模板的尾置返回类型
// 返回元素引用
template <typename iter>
auto fcn(iter beg, iter end) -> decltype(*beg) {
  return *beg;
}

// 标准库的类型转换模板。在头文件type_traits中
// 返回元素值拷贝
template <typename iter>
auto fcnV2(iter beg, iter end) ->
    typename remove_reference<decltype(*beg)>::type {
  return *beg;
}

// 函数指针：pf1指向 int compare(cosnt int&, const int&)
int (*pf1)(const int&, const int&) = compare;
// 有重载时必须显式指定模板实参
void func(const string& s1, const string& s2,
          int (*fn)(const string&, const string&)) {
  cout << fn(s1, s2) << endl;
}
void func(const double& v1, const double& v2,
          int (*fn)(const double&, const double&)) {
  cout << fn(v1, v2) << endl;
}

// std::move：获得一个绑定到左值上的右值引用
// 标准库的std::move定义
template <typename T>
typename remove_reference<T>::type&& myMove(T&& t) {
  return static_cast<typename remove_reference<T>::type&&>(t);
}

// 实参转发：函数将实参连同类型不变的转发给其它函数，保持被转发实参的所有性质
// 如果实参为右值，forward<tyep>返回type&&
// 如果实参为左值，forward<type>返回一个指向左值类型的右值引用，然后其被折叠成左值引用类型，进而达到性质不变
template <typename F, typename T1, typename T2>
void flip(F f, T1&& t1, T2&& t2) {
  f(std::forward<T2>(t2), std::forward<T1>(t1));
}

// 函数模板的重载：函数模板可以被另一个模板或一个普通函数重载，规则见书
template <typename T>
string debug_rep(const T& t) {
  ostringstream ret;
  ret << t;
  return ret.str();
}
template <typename T>
string debug_rep(T* p) {
  ostringstream ret;
  ret << "pointer: " << p;
  if (p) {
    ret << " " << debug_rep(*p);
  } else {
    ret << "null pointer";
  }
  return ret.str();
}
string debug_rep(const string& s) { return '"' + s + '"'; }
string debug_rep(char* p) { return debug_rep(string(p)); }
string debug_rep(const char* p) { return debug_rep(string(p)); }

/*
可变参数模板：一个接受可变数目参数的模板函数或模板类，可变数目的参数称为参数包
参数包分两种：模板参数包(表示多个模板参数)；函数参数包(表示多个函数参数)
语法：省略号
*/
// Args为模板参数包，rest为函数参数包
template <typename T, typename... Args>
void foo(const T& t, const Args&... rest) {
  // 使用sizeof...运算符取得包中元素数目，返回一个常量表达式
  cout << sizeof...(Args) << endl;
  cout << sizeof...(rest) << endl;
}

// 用来终止递归的非可变参数模板函数
template <typename T>
ostream& print(ostream& out, const T& t) {
  return out << t << endl;
}
template <typename T, typename... Args>
ostream& print(ostream& out, const T& t, const Args&... rest) {
  out << t << ", ";
  // 接受3个参数，却只传递2个参数。rest包中第一个参数被移除并绑定到t的实参，剩余的形成下一个调用的包
  return print(out, rest...);
}
// 包扩展
template <typename T, typename... Args>
ostream& error_msg(ostream& out, const T& t, const Args&... rest) {
  return print(out, debug_rep(rest)...);
}

// 函数模板特例化。函数模板特例化不是重载
template <>
int compare(const char* const& p1, const char* const& p2) {
  return strcmp(p1, p2);
}

// 类模板特例化：略

// 类模板部分特例化：略

int main() {
  // 调用一个模板函数时，编译器实例化模板
  cout << compare(1, 0) << endl;

  // 带有非类型参数的模板实例化
  cout << compare("bar", "foo") << endl;
  cout << compare("hi", "world") << endl;

  // 实例化类模板时使用显式模板实参列表，即尖括号里的类型。一个类模板的每个实例都是独立的类
  Blob<int> b1 = {1, 2, 3, 4};
  b1.print();
  for (size_t i = 0; i != b1.size(); ++i) {
    b1[i] *= b1[i];
  }
  b1.print();

  cout << compareV2(1, 2) << endl;
  cout << compareV2(1, 2, compare<int, int>) << endl;

  vector<int> vi;
  cout << top(vi) << endl;

  DebugDelete myDelete;
  double* p = new double;
  myDelete(p);
  int* p2 = new int;
  DebugDelete()(p2);  // 临时对象
  // 用作unique_ptr的删除器
  unique_ptr<string, DebugDelete> p3(new string, DebugDelete());

  int ia[] = {0, 1, 2, 3, 4};
  vector<short> vs = {0, 1, 2, 3, 4};
  list<const char*> ls = {"wdfjl", "djf", "djf", "djfk"};
  Blob<int> b2(begin(ia), end(ia));
  Blob<int> b3(vs.begin(), vs.end());
  Blob<string> b4(ls.begin(), ls.end());
  b2.print();
  b3.print();
  b4.print();

  // 显式指定模板实参
  cout << sum<int>(1.2, 2.5) << endl;

  fcn(vs.begin(), vs.end()) = 9;
  cout << vs[0] << endl;

  auto ret = fcnV2(vs.begin(), vs.end());
  ret = -1;
  cout << vs[0] << endl;

  cout << pf1(1, 2) << endl;
  func("foo", "bar", compare<string>);
  func(1.1, 2.2, compare<double>);

  string s("hi");
  cout << debug_rep(s) << endl;
  cout << debug_rep(&s) << endl;
  const string* sp = &s;
  cout << debug_rep(sp) << endl;
  cout << debug_rep("foo") << endl;

  foo(1, 2.3, "djfk", true, false);

  print(cout, 1, 5.34, "foo", "bar");
  error_msg(cout, 1, 5.34, "foo", "bar");

  const char* sp1 = "foo";
  const char* sp2 = "bar";
  cout << compare(sp1, sp2) << endl;

  return 0;
}