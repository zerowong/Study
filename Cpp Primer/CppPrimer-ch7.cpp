#include<iostream>
#include<string>
#include<vector>

using std::string;
using std::ostream;
using std::vector;

class Screen {
    friend class window_mgr;
    // friend void window_mgr::clear(screen_index);
public:
    typedef std::string::size_type pos;
    Screen() = default;
    Screen(pos wd, pos ht, char c) : width(wd), height(ht), contents(wd * ht, c) {}
    char get() const {
        return contents[cursor];
    }
    inline char get(pos wd, pos ht) const;
    Screen& move(pos r, pos c);
    void someMember() const;
    Screen& set(char);
    Screen& set(pos, pos, char);
    Screen& display(ostream& out) {
        doDisplay(out);
        return *this;
    }
    const Screen& display(ostream& out) const {
        doDisplay(out);
        return *this;
    }
private:
    pos cursor = 0;
    pos width = 0;
    pos height = 0;
    string contents;
    mutable size_t access_ctr;
    void doDisplay(ostream& out) const {
        out << contents;
    }
};

inline Screen& Screen::move(pos r, pos c) {
    pos row = r * width;
    cursor = row + c;
    return *this;
}

char Screen::get(pos r, pos c) const {
    pos row = r * width;
    return contents[row + c];
}

void Screen::someMember() const {
    ++access_ctr;
}

inline Screen& Screen::set(char ch) {
    contents[cursor] = ch;
    return *this;
}

inline Screen& Screen::set(pos r, pos col, char ch) {
    contents[r * width + col] = ch;
    return *this;
}

class window_mgr {
public:
    using screen_index = vector<Screen>::size_type;
    void clear(screen_index);
    screen_index addScreen(const Screen&);
private:
    vector<Screen> screens{Screen(24, 80, ' ')};
};

void window_mgr::clear(screen_index i) {
    Screen& s = screens[i];
    s.contents = string(s.width * s.height, ' ');
}

window_mgr::screen_index window_mgr::addScreen(const Screen& s) {
    screens.push_back(s);
    return screens.size() - 1;
}

class foo {
public:
    foo(int a, int b) : a(a), b(b) {}
    // 委托构造函数
    foo() : foo(0, 0) {}
    foo& display(ostream& out) {
        doDisplay(out);
        return *this;
    }
    const foo& display(ostream& out) const {
        doDisplay(out);
        return *this;
    }
private:
    int a = 0;
    int b = 0;
    void doDisplay(ostream& out) const {
        out << "a = " << a << ' ' << "b = " << b << std::endl;
    }
};

class debug {
public:
    constexpr debug(bool b = true) : hw(b), io(b), other(b) {}
    constexpr debug(bool h, bool i, bool o) : hw(h), io(i), other(o) {}
    constexpr bool any() {
        return hw || io || other;
    }
    void setIo(bool b) {
        io = b;
    }
    void setHw(bool b) {
        hw = b;
    }
    void setOther(bool b) {
        other = b;
    }
private:
    bool hw;
    bool io;
    bool other;
};

class account {
public:
    void calculate() {
        amount += amount * interest_rate;
    }
    static double rate() {
        return interest_rate;
    }
    static void rate(double);
private:
    string owner;
    double amount;
    static double interest_rate;
    static double initRate();
    static constexpr int period = 30;
    double daliy_tbl[period];
};

void account::rate(double new_rate) {
    interest_rate = new_rate;
}

int main() {
    // ...
    return 0;
}