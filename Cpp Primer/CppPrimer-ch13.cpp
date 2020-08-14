#include <iostream>
#include <iterator>
#include <memory>
#include <set>
#include <string>
#include <utility>
#include <vector>

using std::allocator;
using std::cin;
using std::cout;
using std::endl;
using std::make_move_iterator;
using std::pair;
using std::set;
using std::size_t;
using std::string;
using std::uninitialized_copy;
using std::vector;

class foo {
 public:
  foo();  // 默认构造函数
  // 如果一个构造函数的第一个参数式自身类类型的引用，且任何额外参数都有默认值，则此构造函数是拷贝构造函数
  foo(const foo&);  // 拷贝构造函数

  // 重载拷贝赋值运算符：重载运算符本质上是函数，定义为成员函数时，左侧运算对象绑定为隐式的this参数，右侧运算对象需显示传递，通常返回一个指向左侧运算对象的引用（*this）
  foo& operator=(const foo& rhs) &;

  // 引用限定符（&、&&）：强制左侧运算对象是一个左值或右值，可与 const
  // 并存，但必须在其之后
  foo aMemFunc() const&;

  // 析构函数：构造函数的反面，释放对象使用的资源，销毁对象的非static数据成员，名字为
  // ~
  // 接类名组成，无参数，无返回值，没有重载，类内唯一，析构函数体自身并不直接销毁成员
  ~foo();

  // 三/五法则：
  // 1.需要析构函数的类也需要拷贝和赋值操作
  // 2.需要拷贝操作的类也需要赋值操作，反之亦然，但不一定需要析构函数

  // 使用 =default 显式要求编译器生成合成版本的，合成版本是隐式内联的

  // 阻止拷贝：
  // 1.定义为删除的函数：使用 =delete
  // 来定义为删除的函数（一种声明了但不能使用的函数）。ps：析构函数不能定义为删除的函数，=delete
  // 必须出现在函数第一次声明的时候，与 =default 不同，=delete
  // 可以应用于所有函数。 2.定义为 private：早期版本的操作，不建议使用
};

// 行为像值的类
class HasPtr {
  friend void swap(HasPtr&, HasPtr&);

 public:
  HasPtr(int _i, const string& s = string()) : i(_i), ps(new string(s)) {}
  HasPtr(const HasPtr& p) : i(p.i), ps(new string(*p.ps)) {}
  HasPtr& operator=(const HasPtr&);
  // 如果定义了swap函数
  // HasPtr& operator=(const HasPtr);
  ~HasPtr() { delete ps; }
  // test
  void print() { cout << i << ' ' << *ps << '\n'; }

 private:
  int i;
  string* ps;
};

HasPtr& HasPtr::operator=(const HasPtr& rhs) {
  // 使用临时指针正确处理自赋值操作
  auto newp = new string(*rhs.ps);
  delete ps;
  ps = newp;
  i = rhs.i;
  return *this;
}

// 如果定义了swap函数
// HasPtr& HasPtr::operator=(const HasPtr rhs) {
//     swap(*this, rhs);
//     return *this;
// }

inline void swap(HasPtr& lhs, HasPtr& rhs) {
  using std::swap;
  swap(lhs.ps, rhs.ps);
  swap(lhs.i, rhs.i);
}

// 行为像指针的类
class HasPtr1 {
 public:
  HasPtr1(int _i = 0, const string& s = string())
      : i(_i), ps(new string(s)), use(new size_t(1)) {}
  HasPtr1(const HasPtr1& p) : i(p.i), ps(p.ps), use(p.use) { ++*use; }
  HasPtr1& operator=(const HasPtr1&);
  ~HasPtr1();
  // test
  void print() { cout << i << ' ' << *ps << '\n'; }
  void useCount() { cout << *use << '\n'; }
  void setPs(const string& s) { *ps = s; }

 private:
  int i;
  string* ps;
  size_t* use;
};

HasPtr1::~HasPtr1() {
  if (--*use == 0) {
    delete ps;
    delete use;
  }
}

HasPtr1& HasPtr1::operator=(const HasPtr1& rhs) {
  ++*rhs.use;
  if (--*use == 0) {
    delete ps;
    delete use;
  }
  i = rhs.i;
  ps = rhs.ps;
  use = rhs.use;
  return *this;
}

class Folder;
class Message {
  friend class Folder;
  friend void swap(Message&, Message&);

 public:
  explicit Message(const string& s = "") : contents(s) {}
  Message(const Message&);
  Message& operator=(const Message&);
  // 移动构造函数
  Message(Message&&);
  // 移动赋值运算符
  Message& operator=(Message&&);
  ~Message();
  void save(Folder&);
  void remove(Folder&);

 private:
  string contents;
  set<Folder*> folders;
  void addToFolder(const Message&);
  void removeFromFolder();
  void move_folders(Message*);
};

class Folder {
 public:
  // Folder() = default;
  // Folder(const Folder&);
  // Folder& operator=(const Folder&);
  // ~Folder() = default;
  void addMsg(Message*);
  void remMsg(Message*);
  // test
  void print();

 private:
  set<Message*> s;
};

void Message::move_folders(Message* m) {
  folders = std::move(m->folders);
  for (auto f : folders) {
    f->remMsg(m);
    f->addMsg(this);
  }
  m->folders.clear();
}

void Message::save(Folder& f) {
  folders.insert(&f);
  f.addMsg(this);
}

void Message::remove(Folder& f) {
  folders.erase(&f);
  f.remMsg(this);
}

void Message::addToFolder(const Message& msg) {
  for (auto f : msg.folders) {
    f->addMsg(this);
  }
}

Message::Message(const Message& msg)
    : contents(msg.contents), folders(msg.folders) {
  addToFolder(msg);
}

Message::Message(Message&& msg) : contents(std::move(contents)) {
  move_folders(&msg);
}

void Message::removeFromFolder() {
  for (auto f : folders) {
    f->remMsg(this);
  }
}

Message::~Message() { removeFromFolder(); }

Message& Message::operator=(const Message& rhs) {
  removeFromFolder();
  contents = rhs.contents;
  folders = rhs.folders;
  addToFolder(rhs);
  return *this;
}

Message& Message::operator=(Message&& rhs) {
  if (this != &rhs) {
    removeFromFolder();
    contents = std::move(rhs.contents);
    move_folders(&rhs);
  }
  return *this;
}

void swap(Message& lhs, Message& rhs) {
  using std::swap;
  for (auto f : lhs.folders) {
    f->remMsg(&lhs);
  }
  for (auto f : rhs.folders) {
    f->remMsg(&rhs);
  }
  swap(lhs.contents, rhs.contents);
  swap(lhs.folders, rhs.folders);
  for (auto f : lhs.folders) {
    f->addMsg(&lhs);
  }
  for (auto f : rhs.folders) {
    f->addMsg(&rhs);
  }
}

void Folder::addMsg(Message* msg) { s.insert(msg); }

void Folder::remMsg(Message* msg) { s.erase(msg); }

void Folder::print() {
  for (auto msg : s) {
    cout << msg->contents << '\n';
  }
}

class StrVec {
 public:
  StrVec() : elements(nullptr), first_free(nullptr), cap(nullptr) {}
  // 移动构造函数
  StrVec(StrVec&& sv) noexcept
      : elements(sv.elements), first_free(sv.first_free), cap(sv.cap) {
    sv.elements = sv.first_free = sv.cap = nullptr;
  }
  // 移动赋值运算符
  StrVec& operator=(StrVec&&) noexcept;
  StrVec(const StrVec&);
  StrVec& operator=(const StrVec&);
  ~StrVec();
  // 拷贝
  void push_back(const string&);
  // 移动
  void push_back(string&&);
  size_t size() const { return first_free - elements; }
  size_t capacity() const { return cap - elements; }
  string* begin() const { return elements; }
  string* end() const { return first_free; }

 private:
  static allocator<string> alloc;
  pair<string*, string*> alloc_n_copy(const string*, const string*);
  void reallocate();
  void check_n_alloc() {
    if (size() == capacity()) reallocate();
  }
  void free();
  string* elements;
  string* first_free;
  string* cap;
};

void StrVec::push_back(const string& s) {
  check_n_alloc();
  alloc.construct(first_free++, s);
}

void StrVec::push_back(string&& s) {
  check_n_alloc();
  alloc.construct(first_free++, std::move(s));
}

pair<string*, string*> StrVec::alloc_n_copy(const string* b, const string* e) {
  auto data = alloc.allocate(e - b);
  return {data, uninitialized_copy(b, e, data)};
}

void StrVec::free() {
  if (elements) {
    for (auto p = first_free; p != elements;) {
      alloc.destroy(--p);
    }
    alloc.deallocate(elements, cap - elements);
  }
}

StrVec::StrVec(const StrVec& sv) {
  auto newdata = alloc_n_copy(sv.begin(), sv.end());
  elements = newdata.first;
  first_free = cap = newdata.second;
}

StrVec& StrVec::operator=(StrVec&& rhs) noexcept {
  if (this != &rhs) {
    free();
    elements = rhs.elements;
    first_free = rhs.first_free;
    cap = rhs.cap;
    rhs.elements = rhs.first_free = rhs.cap = nullptr;
  }
  return *this;
}

StrVec::~StrVec() { free(); }

StrVec& StrVec::operator=(const StrVec& rhs) {
  auto data = alloc_n_copy(rhs.begin(), rhs.end());
  free();
  elements = data.first;
  first_free = cap = data.second;
  return *this;
}

void StrVec::reallocate() {
  auto newcapacity = size() ? 2 * size() : 1;
  auto newdata = alloc.allocate(newcapacity);
  auto dest = newdata;
  auto elem = elements;
  for (size_t i = 0; i != size(); ++i) {
    alloc.construct(dest++, std::move(*elem++));
  }
  free();
  elements = newdata;
  first_free = dest;
  cap = elements + newcapacity;
}

// 使用移动迭代器的版本
/*
void StrVec::reallocate() {
  auto newcapacity = size() ? 2 * size() : 1;
  auto first = alloc.allocate(newcapacity);
  auto last = uninitialized_copy(make_move_iterator(begin()),
                                 make_move_iterator(end()), first);
  free();
  elements = first;
  first_free = last;
  cap = elements + newcapacity;
}
 */

int main() {
  string s1("aaaa");   // 直接初始化，使用构造函数
  string s2 = "aaaa";  // 拷贝初始化，使用拷贝构造函数
  // 其它发生拷贝初始化的情况：传参（非引用），返回对象（非引用），列表初始化数组或聚合类

  // 拷贝初始化的限制：
  vector<int> vi(10);
  // vector<int> vi = 10; // 错误，接受大小参数的构造函数是explicit的

  // 编译器可以绕过拷贝构造函数（但拷贝构造函数必须是存在且可访问的）：
  // 编译器可以将下列代码
  string s3 = "aaa";
  // 改写为
  // string s3("aaa");

  HasPtr hp1(3, "aaa");
  hp1.print();
  HasPtr hp2(1, "bbb");
  hp2.print();
  hp2 = hp1;
  hp2.print();

  HasPtr1 hp3(0, "a");
  HasPtr1 hp4;
  hp3.print();
  hp4.print();
  hp4 = hp3;
  hp4.print();
  hp4.setPs("b");
  hp4.print();
  hp3.print();

  Folder f1;
  Message msg1("aaaa");
  Message msg2;
  msg2 = msg1;
  msg1.save(f1);
  msg2.save(f1);
  f1.print();
  msg2.remove(f1);
  f1.print();

  return 0;
}