/*
面向对象程序设计(object-oriented programming)：简称OOP
核心思想：
1.数据抽象：将类的接口和实现分离
2.继承：可以定义相似的类型，并对相似关系建模
3.动态绑定(dynamic
binding)：可以在一定程度上忽略相似类型之间的区别，以统一的方式使用它们的对象
*/

/*
继承(inheritance)
基类(base class)
派生类(derived class)
覆盖(override)
直接基类(direct base)
间接基类(indirect base)
静态类型(static type)
动态类型(dynamic type)
多态性(polymorphism)
重构(refactoring)
*/

/*
虚函数(virtual
function)：对应某些函数，基类希望派生类各自定义适合自身的版本，此时基类就将这些函数声明成虚函数
语法：virtual 关键字后跟函数声明
*/

/*
类派生列表(class derivation list)：指出继承自哪个基类
语法：首先是一个冒号，后面紧跟以逗号分割的基类列表，其中每个基类前面可以有访问说明符
*/

/*
派生类到基类(derived-to-base)的类型转换：因为在派生类对象中含有与其基类对应的组成部分，所以能把派生类对象当成基类对象来使用，
而且也能将基类的指针或引用绑定到派生类对象的基类部分上
*/

/*
继承与静态成员：如果基类定义了一个静态成员，则在继承体系中只存在该成员的唯一定义，不论从基类派生出多少派生类，对于每个静态成员都只存
在唯一的实例。静态成员也遵循通用的访问控制规则
*/

/*
仅声明派生类时不需要包含派生列表
作为基类的类必须是已定义的，这隐式地阻止了一个类派生它本身
一个类可以同时是基类和派生类
*/

/*
阻止继承：不允许其它类继承它
语法：类名后跟 final 关键字。例：class foo final/class bar final : base。foo 和
bar 都是不允许继承的类
*/

/*
阻止覆盖：对一个成员函数，不允许派生类函数覆盖它
语法：函数声明后跟 final 关键字。例：void f1() const & final
*/

/*
派生类的函数如果覆盖了继承而来的虚函数，则函数名，形参类型和数量必须与基类的对于函数相同
对于返回类型，默认也应相同，但虚函数的返回类型是类本身的指针或引用时可以不同(即可以返回各自的类本身的引用或指针)
*/

/*
虚函数可以有默认实参，但实参值由本次调用的静态类型决定，如用基类引用或指针调用，即使实际是派生类调用，依然用基类函数定义的默认实参
*/

/*
阻止虚函数的动态绑定：使用作用域运算符
*/

/*
纯虚函数(pure virtual function)：无需定义(但可以定义在外部)，没有实际意义
语法：函数声明后跟 =0。注意：没有 virtual 关键字
*/

/*
抽象基类(abstract base
class)：含有(或未覆盖直接继承)纯虚函数的类是抽象基类，抽象基类负责定义接口，而其派生类可以覆盖该这些接口。不能直接创建一个抽象基类的对象
*/

/*
proteced
成员的一个特殊规则：派生类成员(及其友元)只能通过派生类对象来访问基类的受保护成员，而不能直接通过基类对象访问其受保护
成员
*/

/*
类派生列表的访问说明符的规则：对派生类的成员(及友元)能否访问其直接基类的成员没有影响。其作用是控制派生类用户(该类的对象实例和其派生
类)对于基类成员的访问权限
*/

/*
友元不能继承
*/

/*
改变个别成员的可访问性：解除某个成员受类派生列表的访问说明符的影响，而只受类内部访问说明符影响
语法：成员名前跟 using 和基类作用域
例：using Base::mem;
*/

/*
覆盖重载的函数：成员函数无论是否是虚函数都能被重载，派生类可以覆盖基类重载函数的0个或多个实例
语法：using声明一个有重载的基类成员函数名，一条using声明可以把该函数的所有重载实例添加到派生类作用域种，然后再根据需要覆盖其中的
某几个版本
例：using Base::overloadFN;
*/

#include <iostream>
#include <memory>
#include <set>
#include <string>
#include <utility>
#include <vector>

using namespace std;

class Quote {
 public:
  Quote() = default;
  Quote(const Quote&) = default;
  Quote(Quote&&) = default;
  Quote& operator=(const Quote&) = default;
  Quote& operator=(Quote&&) = default;
  Quote(const string& book, double sales_price)
      : bookNo(book), price(sales_price) {}

  string isbn() const { return bookNo; }
  virtual double net_price(size_t n) const { return n * price; }
  virtual Quote* clone() const& { return new Quote(*this); }
  virtual Quote* clone() && { return new Quote(std::move(*this)); }

  // 对析构函数进行动态绑定。基类通常都应该定义一个虚析构函数
  virtual ~Quote() = default;

  //派生类和其它用户(非友元)都不能访问。
 private:
  string bookNo;

  // 派生类可以访问，其它用户(非友元)不能访问
 protected:
  double price = 0.0;
};

class Disc_quote : public Quote {
 public:
  Disc_quote() = default;
  Disc_quote(const Disc_quote&) = default;
  Disc_quote(Disc_quote&&) = default;
  Disc_quote& operator=(const Disc_quote&) = default;
  Disc_quote& operator=(Disc_quote&&) = default;
  Disc_quote(const string& book, double sales_price, size_t qty, double disc)
      : Quote(book, sales_price), quantity(qty), discount(disc) {}
  pair<size_t, double> discount_policy() const { return {quantity, discount}; }
  double net_price(size_t) const = 0;
  Quote* clone() const& = 0;
  Quote* clone() && = 0;

 private:
  size_t quantity = 0;
  double discount = 0.0;
};

class Bulk_quote : public Disc_quote {
 public:
  Bulk_quote() = default;
  Bulk_quote(const Bulk_quote&) = default;
  Bulk_quote(Bulk_quote&&) = default;
  Bulk_quote& operator=(const Bulk_quote&) = default;
  Bulk_quote& operator=(Bulk_quote&&) = default;

  // 每个类控制自己的初始化过程，首先初始化基类部分，然后按顺序初始化派生类自己的成员，派生类构造函数只初始化它的直接基类
  Bulk_quote(const string& book, double sales_price, size_t qty, double disc)
      : Disc_quote(book, sales_price, qty, disc) {}

  // 派生类继承基类的构造函数：提供一条注明了直接基类名的using声明。不改变访问级别，不能指定explicit和constexpr(因为继承了)
  // 如果基类构造函数有默认实参，派生类将获得多个继承的构造函数，每个构造函数分别省略掉一个含有默认实参的形参
  // 如果基类构造函数有多个，大多数派生类会继承所以这些构造函数，除非：1.派生类替换了一部分；2.默认、移动、拷贝构造函数不继承
  // 语法：using Disc_quote::Disc_quote;

  // override：显式注明它将使用该成员函数改写基类的虚函数。放在 const
  // 限定符和引用限定符之后
  double net_price(size_t) const override;
  Bulk_quote* clone() const& { return new Bulk_quote(*this); }
  Bulk_quote* clone() && { return new Bulk_quote(std::move(*this)); }

 private:
  size_t min_qty = 0;
  double discount = 0.0;
};

double Bulk_quote::net_price(size_t cnt) const {
  if (cnt >= min_qty) {
    return cnt * (1 - discount) * price;
  } else {
    return cnt * price;
  }
}

double print_total(ostream& out, const Quote& item, size_t n) {
  // 根据传入item形参的对象类型调用不同对象上的成员函数。使用基类的引用或指针调用一个虚函数时将发生动态绑定
  double ret = item.net_price(n);
  out << "ISBN: " << item.isbn() << " # sold: " << n << " total due: " << ret
      << endl;
  return ret;
}

class Basket {
 public:
  void add_item(const Quote& sale) {
    item.insert(shared_ptr<Quote>(sale.clone()));
  }
  void add_item(Quote&& sale) {
    item.insert(shared_ptr<Quote>(std::move(sale.clone())));
  }
  double total_reciept(ostream&) const;

 private:
  static bool comp(const shared_ptr<Quote>& lhs, const shared_ptr<Quote>& rhs) {
    return lhs->isbn() < rhs->isbn();
  }
  multiset<shared_ptr<Quote>, decltype(comp)*> item{comp};
};

double Basket::total_reciept(ostream& out) const {
  double sum = 0.0;
  for (auto iter = item.cbegin(); iter != item.cend();
       iter = item.upper_bound(*iter)) {
    sum += print_total(out, **iter, item.count(*iter));
  }
  out << "Total Sale: " << sum << endl;
  return sum;
}

int main() {
  Bulk_quote bulk1("0-234-32424-1", 54.5, 20, 0.2);
  Bulk_quote bulk2(bulk1);
  cout << bulk2.isbn() << endl;

  vector<Quote> vq;
  vq.push_back(Quote("1-354-45345-5", 50));
  // 只有 Quote 部分被拷贝了，Bulk_quote 被切掉了
  vq.push_back(Bulk_quote("2-454-58382-7", 50, 10, 0.25));
  // 调用了 Quote 版本
  cout << vq.back().net_price(15) << endl;

  // 智能指针的版本也一样
  vector<shared_ptr<Quote>> vsq;
  vsq.push_back(make_shared<Quote>("1-354-45345-5", 50));
  vsq.push_back(make_shared<Bulk_quote>("2-454-58382-7", 50, 10, 0.25));
  cout << vsq.back()->net_price(15) << endl;

  Basket basket;
  basket.add_item(bulk1);
  basket.add_item(bulk2);
  basket.add_item(vq[0]);
  basket.add_item(vq[1]);
  basket.total_reciept(cout);

  return 0;
}