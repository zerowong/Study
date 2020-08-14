#include<iostream>
#include<vector>
#include<string>
#include<algorithm>
#include<numeric>
#include<iterator>
#include<functional>
#include<list>

using std::cin;
using std::cout;
using std::endl;
using std::vector;
using std::string;
using std::list;
using namespace std::placeholders;

void print(const vector<string>& vs) {
    for (const auto& i : vs) {
        cout << i << ' ';
    }
    cout << endl;
}

void print(const vector<int>& vi) {
    for (const auto& i : vi) {
        cout << i << ' ';
    }
    cout << endl;
}

void print(int ai[], const int* target) {
    for (int* i = ai; i != target; ++i) {
        cout << *i << ' ';
    }
    cout << endl;
}

void print(const list<int>& li) {
    for (auto i : li) {
        cout << i << ' ';
    }
    cout << endl;
}

void print(vector<string>::iterator first, vector<string>::iterator last) {
    // for_each() + lambda
    for_each(first, last, [] (const string& s) {cout << s << ' ';});
    cout << endl;
}

// 二元谓词：接受两个参数
bool isShorter(const string& s1, const string& s2) {
    return s1.size() < s2.size();
}

// 一元谓词：接受一个参数
bool isEven(const int& a) {
    return a % 2;
}

bool checkSize(const string& s, size_t sz) {
    return s.size() >= sz;
}

int main() {
    /* read-only algorithms */
    // find()
    vector<string> vs = {"a", "b", "c", "a"};
    auto iter = find(vs.cbegin(), vs.cend(), "a");
    cout << *iter << endl;
    // count()
    cout << count(vs.cbegin(), vs.cend(), "a") << endl;
    // accumulate()
    string t = accumulate(vs.cbegin(), vs.cend(), string(""));
    cout << t << endl;
    // equal()
    string tt[4] = {"a", "b", "c", "a"};
    cout << (equal(vs.cbegin(), vs.cend(), begin(tt)) ? "equal" : "not equal") << endl;

    /* write */
    // fill() & fill_n()
    fill(vs.begin(), vs.end(), "a");
    print(vs);
    fill_n(vs.begin(), 2, "b");
    print(vs);
    // back_inserter()
    vector<int> vi;
    fill_n(back_inserter(vi), 5, 1);
    print(vi);
    // copy()
    int ai1[] = {0, 1, 2, 3, 4};
    int ai2[sizeof(ai1) / sizeof(*ai1)];
    auto ret = std::copy(std::begin(ai1), std::end(ai1), ai2);
    print(ai2, ret);
    // replace() & replace_copy()
    replace(vi.begin(), vi.end(), 1, 10);
    print(vi);
    vector<int> vi2;
    replace_copy(vi.begin(), vi.end(), back_inserter(vi2), 10, 20);
    print(vi);
    print(vi2);

    /* reorder */
    // sort() & unique()
    vector<string> vs2 = {"I", "am", "a", "a", "loser"};
    sort(vs2.begin(), vs2.end());
    auto end_unique = unique(vs2.begin(), vs2.end());
    vs2.erase(end_unique, vs2.end());
    print(vs2);

    /* 谓词(predicate) */
    // stable_sort()
    stable_sort(vs2.begin(), vs2.end(), isShorter);
    print(vs2);
    // partition()
    vi = {0, 1, 2, 3, 4};
    // for (int i = 0; i < 5; ++i) {
    //     vi[i] = i;
    // }
    partition(vi.begin(), vi.end(), isEven);
    print(vi);

    /* Lambda: [捕获列表] (参数列表) -> 返回类型 {函数体} */
    // find_if() + lambda
    size_t sz = 4;
    // 显式捕获
    auto f = [sz] (const string& s) {return s.size() >= sz;};
    // 隐式捕获：[=] (...) {...} or [&] (...) {...}
    // 可变lambda：[...] (...) matuble {...}
    // 非单一return语句需指定返回值：[...] (...) -> type {...}
    auto iter1 = find_if(vs2.begin(), vs2.end(), f);
    print(iter1, vs2.end());
    // transform()
    // ...
    // count_if()
    // ...

    /* bind(): auto newCallable = bind(callable, arg_list) callable:可调用对象 */
    // 例：auto g = bind(f, a, b, _2, c, _1)，调用g(x, y)会映射为f(a, b, y, c, x);
    // 可用bind()重排参数顺序，从而改变实际效果，例：f(a, b) -> bind(f, _2, _1) -> f(b, a)
    sz = 1;
    iter1 = find_if(vs2.begin(), vs2.end(), bind(checkSize, _1, sz));
    print(iter1, vs2.end());
    // ref() & cref()：返回一个对象，该对象包含给定的引用，但是可以拷贝，例：ref(iostream)

    /* inserter iterator */
    vector<int> vi3 = {1, 2, 3, 4, 5};
    // inserter
    auto it = inserter(vi3, vi3.begin() + 1);
    *it = 99;
    *it = 60;
    print(vi3);
    // front_inserter
    list<int> li1 = {1, 2, 3, 4};
    list<int> li2;
    copy(li1.begin(), li1.end(), front_inserter(li2));
    print(li2);

    /* iostream iterator */
    // istream_iterator<T>
    std::istream_iterator<int> iter_in(cin), eof;
    vector<int> vi4(iter_in, eof);
    // 算法操作流迭代器
    // cout << std::accumulate(iter_in, eof, 0) << endl;
    // ostream_iterator<T> name(os, d)，d为可选的C风格字符串
    std::ostream_iterator<int> iter_out(cout, " ");
    for (auto i : vi4) {
        *iter_out++ = i; // 解引用和递增可忽略，等同于 iter_out = i
    }
    cout << endl;
    // unique_copy()
    unique_copy(vi4.begin(), vi4.end(), iter_out);
    cout << endl;

    /* reverse iterator */
    std::sort(vi4.rbegin(), vi4.rend());
    // std::sort(vi4.begin(), vi4.end(), std::greater<int>());
    print(vi4);
    // reverse_iterator.base()返回对应的普通迭代器
    return 0;
}