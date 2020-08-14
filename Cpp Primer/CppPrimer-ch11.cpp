#include<iostream>
#include<vector>
#include<string>
#include<algorithm>
#include<map>
#include<set>
#include<cctype>
#include<utility>
#include<fstream>
#include<sstream>
#include<unordered_map>

using std::cin;
using std::cout;
using std::cerr;
using std::endl;
using std::getline;
using std::vector;
using std::string;
using std::map;
using std::multimap;
using std::set;
using std::ifstream;
using std::unordered_map;

string toNoPunctString(string& str) {
    string t;
    for (auto i : str) {
        if (isalpha(i)) {
            t.push_back(i);
        }
    }
    return t;
}

void print(map<string, size_t>& mssz) {
    for (auto i : mssz) {
        cout << i.first << ' ' << i.second << endl;
    }
}

void print(unordered_map<string, size_t>& unmssz) {
    for (auto i : unmssz) {
        cout << i.first << ' ' << i.second << endl;
    }
}

string map_file("trans_map.txt");
string input_file("input.txt");

unordered_map<string, string> buildMap(ifstream& map_file) {
    unordered_map<string, string> m;
    string key;
    string value;
    while (map_file >> key && getline(map_file, value)) {
        if (!value.empty()) {
            m[key] = value.substr(1);
        } else {
            throw std::runtime_error("not rule for " + key);
        }
    }
    return m;
}

const string& transform(const string& s, const unordered_map<string, string>& m) {
    auto iter = m.find(s);
    return iter != m.cend() ? iter->second : s;
}

void wordTransformAndPrint(ifstream& map_file, ifstream& input) {
    auto trans_map = buildMap(map_file);
    string text;
    while (getline(input, text)) {
        std::istringstream iss(text);
        string word;
        bool first_word = true;
        while (iss >> word) {
            if (first_word) {
                first_word = false;
            } else {
                cout << ' ';
            }
            cout << transform(word, trans_map);
        }
        cout << endl;
    }
}

int main() {
    /* map */
    unordered_map<string, size_t> word_count;
    set<string> word_exclude = {"the", "but", "and", "or", "a", "an"};
    string word;
    while (cin >> word) {
        std::transform(word.begin(), word.end(), word.begin(), ::tolower);
        word = toNoPunctString(word);
        if (word_exclude.find(word) == word_exclude.end()) {
            ++word_count[word];
        }
    }
    print(word_count);

    /* multimap */
    multimap<string, string> mm;
    mm.insert({"zerowong", "a"});
    mm.insert({"zerowong", "b"});
    auto iter = mm.find("zerowong");
    auto iter_pair = mm.equal_range("zerowong");
    if (iter != mm.end()) {
        cout << iter->first << " : ";
        while (iter_pair.first != iter_pair.second) {
            cout << iter_pair.first++->second << ' ';
        }
        cout << endl;
    }

    /* a word transform function */
    ifstream mf(map_file);
    if (!mf) {
        cerr << "can't open " + map_file << endl;
        return 0;
    }
    ifstream in(input_file);
    if (!in) {
        cerr << "can't open " + input_file << endl;
        return 0;
    }
    wordTransformAndPrint(mf, in);
    return 0;
}