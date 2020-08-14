#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

using namespace std;

class strBlobPtr;
class strBlob {
  friend class strBlobPtr;

 public:
  typedef vector<string>::size_type size_type;
  strBlob() : data(make_shared<vector<string>>()) {}
  strBlob(std::initializer_list<string> il)
      : data(make_shared<vector<string>>(il)) {}
  size_type size() const { return data->size(); }
  bool empty() const { return data->empty(); }
  void push_back(const string& s) { data->push_back(s); }
  void pop_back();
  string& front();
  const string& front() const;
  string& back();
  const string& back() const;
  long use_count() const { return data.use_count(); }
  strBlobPtr begin();
  strBlobPtr end();

 private:
  shared_ptr<vector<string>> data;
  void check(size_type i, const string& msg) const;
};

class strBlobPtr {
 public:
  strBlobPtr() : curr(0) {}
  strBlobPtr(strBlob& a, size_t sz = 0) : wptr(a.data), curr(sz) {}
  string& deref() const;
  strBlobPtr& incr();

 private:
  weak_ptr<vector<string>> wptr;
  size_t curr;
  shared_ptr<vector<string>> check(size_t, const string&) const;
};

void strBlob::check(size_type i, const string& msg) const {
  if (i >= data->size()) {
    throw std::out_of_range(msg);
  }
}

string& strBlob::front() {
  check(0, "front on empty strBlob");
  return data->front();
}

const string& strBlob::front() const {
  check(0, "front on empty strBlob");
  return data->front();
}

string& strBlob::back() {
  check(0, "back on empty strBlob");
  return data->back();
}

const string& strBlob::back() const {
  check(0, "back on empty strBlob");
  return data->back();
}

void strBlob::pop_back() {
  check(0, "pop_back on empty strBlob");
  data->pop_back();
}

strBlobPtr strBlob::begin() { return strBlobPtr(*this); }

strBlobPtr strBlob::end() {
  auto ret = strBlobPtr(*this, data->size());
  return ret;
}

shared_ptr<vector<string>> strBlobPtr::check(size_t i,
                                             const string& msg) const {
  auto ret = wptr.lock();
  if (!ret) {
    throw std::runtime_error("unbound strBlobPtr");
  }
  if (i > ret->size()) {
    throw std::out_of_range(msg);
  }
  return ret;
}

string& strBlobPtr::deref() const {
  auto p = check(curr, "dereference past end");
  return (*p)[curr];
}

strBlobPtr& strBlobPtr::incr() {
  check(curr, "increment past end of strBlobPtr");
  ++curr;
  return *this;
}

int getSize(int n) { return n; }

int main() {
  ifstream in("input.txt");
  string temp;
  strBlob a;
  while (in >> temp) {
    a.push_back(temp);
  }
  auto beg = a.begin();
  for (vector<string>::size_type i = 0; i < a.size(); ++i) {
    cout << beg.deref() << endl;
    beg.incr();
  }

  // /* 动态数组(不是数组类型) */
  // // 动态数组初始化
  const int n = 10;
  int* pia = new int[getSize(n)]{
      1, 2, 4, 5};  // n为0时也合法，但不能解引用(类似尾后迭代器)
  for (int* i = pia; i != pia + n; ++i) {
    cout << *i << ' ';
  }
  cout << endl;
  // 释放动态数组，不加方括号将产生未定义行为
  delete[] pia;  // 按逆序销毁数组中的对象
  // 类型别名
  typedef int arrT[10];  // 类型别名不允许使用变长数组类型
  int* another_pia = new arrT;
  delete[] another_pia;
  // 用智能指针管理动态数组(unique_ptr)
  unique_ptr<int[]> upia(new int[getSize(n)]{1, 2});
  // 可用下标访问元素
  cout << upia[0] << endl;
  upia.release();
  // shared_ptr不直接支持管理动态数组，须提供删除器
  shared_ptr<int> spia(new int[getSize(n)]{1, 2},
                       [](int* p) { delete[] p; });  // 注意<int>没加方括号
  // shared_ptr未定义下标运算符，且不支持指针的算术运算
  for (int i = 0; i < getSize(n); ++i) {
    cout << *(spia.get() + i) << ' ';
  }
  cout << endl;
  spia.reset();

  /* allocator类 */
  allocator<int> alloc;
  auto p = alloc.allocate(n);
  auto q = p;  // q指向最后构造的元素之后的位置
  alloc.construct(q++, 1);
  alloc.construct(q++, 2);
  auto copy = p;
  while (copy != q) {
    cout << *copy++ << ' ';
  }
  cout << '\n';
  // 必须对每个构造的元素调用destroy()来销毁它们
  while (p != q) {
    alloc.destroy(--q);
  }
  // 释放内存
  alloc.deallocate(p, n);
  // 伴随算法
  int ar[n] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
  auto root = alloc.allocate(n * 2);
  auto mid = std::uninitialized_copy(std::begin(ar), std::end(ar), root);
  std::uninitialized_fill_n(mid, n, -1);
  auto last = root + n * 2;
  for (auto i = root; i != last; ++i) {
    cout << *i << ' ';
  }
  cout << '\n';
  while (last != root) {
    alloc.destroy(--last);
  }
  alloc.deallocate(root, n * 2);
  return 0;
}