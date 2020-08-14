#include <algorithm>
#include <bitset>
#include <iostream>
#include <list>
#include <numeric>
#include <string>
#include <tuple>
#include <vector>

using namespace std;

class Sales_data {
  friend bool operator<(const Sales_data&, const Sales_data&);

 public:
  Sales_data(const string& s) : isbn(s) {}

 private:
  string isbn;
};

bool operator<(const Sales_data& lhs, const Sales_data& rhs) { return lhs.isbn < rhs.isbn; }

typedef tuple<vector<Sales_data>::size_type, vector<Sales_data>::const_iterator,
              vector<Sales_data>::const_iterator>
    matches;

vector<matches> findBook(const vector<vector<Sales_data>>& files, const string& isbn) {
  vector<matches> ret;
  for (auto it = files.cbegin(); it != files.cend(); ++it) {
    auto found = equal_range(it->begin(), it->end(), isbn);
    if (found.first != found.second) {
      ret.push_back(make_tuple(it - files.cbegin(), found.first, found.second));
    }
  }
  return ret;
}

void reportResults(istream& in, ostream& out, const vector<vector<Sales_data>>& files) {
  string book;
  while (in >> book) {
    auto trans = findBook(files, book);
    if (trans.empty()) {
      cout << book << " not found in any stores" << endl;
      continue;
    }
    for (const auto& store : trans) {
      out << "store " << get<0>(store) << endl;
    }
  }
}

int main() {
  // 定义tuple
  tuple<size_t, size_t, size_t> threeD(1, 2, 3);
  tuple<string, vector<double>, int, list<int>> somVal("foo", {1.1, 2.2}, 99, {0, 1, 2, 3});
  auto item = make_tuple("0-344-32433-1", 3, 20.0);

  // 访问tuple成员
  cout << get<0>(item) << endl;

  // 查询tuple成员数量和类型
  typedef decltype(item) trans;
  cout << tuple_size<trans>::value << endl;
  tuple_element<0, trans>::type item_0_type = get<0>(item);

  // 比较tuple：只有两个tuple的成员数量相同时才可以比较，对每对成员使用==或<运算符必须是合法的
  // 由于tuple定义了<和==运算符，所有可以用于泛型算法和无序容器
  tuple<int, int> ti2(1, 2);
  tuple<double, double> td2(1.1, 2.2);
  cout << (ti2 == td2) << endl;
  cout << (ti2 < td2) << endl;

  // 使用tuple返回多个值
  vector<vector<Sales_data>> files;

  // 定义bitset
  // 使用整型值初始化bitset
  bitset<32> bitvec(1U);
  bitset<13> bitvec1(0xbeef);
  bitset<20> bitvec2(0xbeef);
  bitset<128> bitvec3(~0ULL);
  // 使用string初始化bitset
  bitset<32> bitvec4("1100");  // 对bitset：0位在最右边；对string：0位在最左边
  string str("10101011110011011110111110101011");  // 0xabcdefab
  bitset<32> bitvec5(str, 5, 4);
  bitset<32> bitvec6(str, str.size() - 4);

  // 操作bitset：除内置方法，bitset同样支持位运算符
  cout << "any: " << bitvec.any() << '\n';
  cout << "all: " << bitvec.all() << '\n';
  cout << "none: " << bitvec.none() << '\n';
  cout << "count: " << bitvec.count() << '\n';
  cout << "size: " << bitvec.size() << '\n';
  // 不传参，对整个bitset
  bitvec.flip();
  bitvec.reset();
  bitvec.set();
  // 对特定位
  bitvec.flip(0);
  bitvec.set(bitvec.size() - 1);
  bitvec.set(0, 0);
  bitvec.reset(0);
  bitvec.test(0);
  // 重载了下标运算符
  bitvec[0] = 0;
  bitvec[31] = bitvec[0];
  bitvec[0].flip();
  ~bitvec[0];
  // 提取bitset的值
  cout << "ull_value: " << bitvec.to_ullong() << '\n';
  cout << "str_of_value: " << bitvec.to_string() << '\n';
  // bitset的IO运算符
  bitset<8> bits;
  cin >> bits;
  cout << "bits: " << bits << '\n';

  // 位运算
  unsigned long quizA = 0;
  quizA |= 1UL << 27;
  bool status = quizA & (1UL << 27);
  cout << status << '\n';
  quizA &= ~(1UL << 27);
  // 等价的bitset：更易于理解
  bitset<30> quizB;
  quizB.set(27);
  cout << quizB[27] << '\n';
  quizB.reset(27);

  return 0;
}