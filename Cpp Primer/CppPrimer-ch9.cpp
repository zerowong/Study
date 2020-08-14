#include<iostream>
#include<vector>
#include<string>
#include<array>
#include<forward_list>

using std::cin;
using std::cout;
using std::cerr;
using std::endl;
using std::vector;
using std::string;
using std::array;
using std::forward_list;

void print(vector<int>& vi) {
    for (auto i : vi) {
        cout << i << ' ';
    }
    cout << endl;
}

void print(string& s) {
    for (auto i : s) {
        cout << i << ' ';
    }
    cout << endl;
}

void print(forward_list<int>& fl) {
    for (auto i : fl) {
        cout << i << ' ';
    }
    cout << endl;
}

int main() {
    vector<int> v{1, 2, 3, 4, 5};
    // std::swap(*v.begin(), *(v.end() - 1));
    std::swap(v.front(), v.back());
    print(v);
    auto iter0 = v.begin() + 1;
    auto iter1 = v.end();
    // UB
    cout << *iter1 << endl;
    auto len = iter1 - iter0;
    cout << len << endl;
    // 迭代器范围初始化
    vector<int> a(iter0, iter1);
    print(a);
    v.swap(a);
    print(v);
    cout << a.size() << endl;
    if (v != a) {
        cout << "not equal" << endl;
    }
    cout << (v < a ? "v < a" : "v > a") << endl;
    string str(60, '-');
    print(str);
    array<int, 10> arr = {1};
    std::swap(arr[0], arr[1]);
    for (auto i : arr) {
        cout << i << ' ';
    }
    cout << endl;
    forward_list<int> fl = {0, 1, 2, 3, 4, 5};
    print(fl);
    auto precur = fl.before_begin();
    auto cur = fl.begin();
    while (cur != fl.end()) {
        if (*cur % 2) {
            cur = fl.erase_after(precur);
        } else {
            precur = cur++;
        }
    }
    print(fl);
    string s("aaaaaaaaa");
    auto i = s.find("b");
    if (i == string::npos) {
        cerr << "not found" << endl;
    }
    s = "pi = 3.14";
    double d = stod(s.substr(s.find_first_of("+-.1234567890")));
    cout << d << endl;
    return 0;
}