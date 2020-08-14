#include <algorithm>
#include <functional>
#include <iostream>
#include <map>
#include <utility>
#include <vector>

using std::cerr;
using std::cin;
using std::cout;
using std::endl;
using std::function;
using std::istream;
using std::map;
using std::ostream;
using std::vector;

class Pos {
  friend ostream& operator<<(ostream&, const Pos&);
  friend istream& operator>>(istream&, Pos&);
  friend bool operator==(const Pos&, const Pos&);
  friend bool operator!=(const Pos&, const Pos&);
  friend Pos operator+(const Pos&, const Pos&);
  friend Pos operator-(const Pos&, const Pos&);
  friend Pos operator*(const Pos&, const int&);
  friend Pos operator*(const int&, const Pos&);

 public:
  Pos(int x = 0, int y = 0) : x(x), y(y) {}
  Pos(const Pos&);
  Pos& operator=(const Pos&);
  Pos(Pos&&) noexcept;
  Pos& operator=(Pos&&) noexcept;
  Pos& operator+=(const Pos&);
  Pos& operator-=(const Pos&);
  Pos& operator*=(const int&);
  int& operator[](const char&);
  const int& operator[](const char&) const;
  Pos& operator++();
  Pos& operator--();
  Pos operator++(int);
  Pos operator--(int);

 private:
  int x;
  int y;
};

Pos::Pos(const Pos& rhs) {
  x = rhs.x;
  y = rhs.y;
}

Pos& Pos::operator=(const Pos& rhs) {
  auto newPos = rhs;
  x = newPos.x;
  y = newPos.y;
  return *this;
}

Pos::Pos(Pos&& rhs) noexcept : x(std::move(rhs.x)), y(std::move(rhs.y)) {}

Pos& Pos::operator=(Pos&& rhs) noexcept {
  if (this != &rhs) {
    x = std::move(rhs.x);
    y = std::move(rhs.y);
  }
  return *this;
}

ostream& operator<<(ostream& out, const Pos& pos) {
  out << '(' << pos.x << " , " << pos.y << ')';
  return out;
}

istream& operator>>(istream& in, Pos& pos) {
  auto copy = pos;
  in >> pos.x >> pos.y;

  // 输入失败时，恢复原状态
  if (!in) {
    pos = copy;
  }
  return in;
}

bool operator==(const Pos& lhs, const Pos& rhs) {
  return lhs.x == rhs.y && lhs.y == rhs.y;
}

bool operator!=(const Pos& lhs, const Pos& rhs) { return !(lhs == rhs); }

Pos& Pos::operator+=(const Pos& rhs) {
  x += rhs.x;
  y += rhs.y;
  return *this;
}

Pos operator+(const Pos& lhs, const Pos& rhs) {
  auto copy = lhs;
  copy += rhs;
  return copy;
}

Pos& Pos::operator-=(const Pos& rhs) {
  x -= rhs.x;
  y -= rhs.y;
  return *this;
}

Pos operator-(const Pos& lhs, const Pos& rhs) {
  auto copy = lhs;
  copy -= rhs;
  return copy;
}

Pos& Pos::operator*=(const int& coe) {
  x *= coe;
  y *= coe;
  return *this;
}

Pos operator*(const Pos& pos, const int& coe) {
  auto copy = pos;
  copy *= coe;
  return copy;
}

Pos operator*(const int& coe, const Pos& pos) {
  auto copy = pos;
  copy *= coe;
  return copy;
}

int& Pos::operator[](const char& ch) {
  if (ch == 'x' || ch == 'X') {
    return x;
  }
  if (ch == 'y' || ch == 'Y') {
    return y;
  }
  throw std::out_of_range("just x/X and y/Y");
}

const int& Pos::operator[](const char& ch) const {
  if (ch == 'x' || ch == 'X') {
    return x;
  }
  if (ch == 'y' || ch == 'Y') {
    return y;
  }
  throw std::out_of_range("just x/X and y/Y");
}

Pos& Pos::operator++() {
  ++x;
  ++y;
  return *this;
}

Pos& Pos::operator--() {
  --x;
  --y;
  return *this;
}

Pos Pos::operator++(int) {
  auto copy = *this;
  ++*this;
  return copy;
}

Pos Pos::operator--(int) {
  auto copy = *this;
  --*this;
  return copy;
}

class SmallInt {
 public:
  SmallInt(int i = 0) : val(i) {
    if (i < 0 || i > 255) {
      throw std::out_of_range("(0, 255)");
    }
  }
  // 类型转换运算符
  operator int() const { return val; }

 private:
  std::size_t val;
};

int main() {
  // 在泛型算法中使用标准库函数对象
  vector<int> vi = {24, 345, 564, 123, 654, 23, 3};
  // 升序
  std::sort(vi.begin(), vi.end());
  std::for_each(vi.begin(), vi.end(), [](const int& i) { cout << i << ' '; });
  cout << '\n';
  // 降序
  std::sort(vi.begin(), vi.end(), std::greater<int>());
  std::for_each(vi.begin(), vi.end(), [](const int& i) { cout << i << ' '; });
  cout << '\n';

  // 标准库 function 类型
  // 示例1：一个返回值为int，接受两个int参数的 function 对象
  function<int(int, int)> f1 = std::plus<int>();
  cout << f1(2, 2) << '\n';
  // 示例2：一个调用形式为 int(int, int) 的函数表
  map<char, function<int(int, int)>> binops = {
      {'+', std::plus<int>()},
      {'-', std::minus<int>()},
      {'*', std::multiplies<int>()},
      {'/', std::divides<int>()},
  };
  cout << binops['+'](10, 5) << ' ' << binops['-'](10, 5) << '\n';
  return 0;
}