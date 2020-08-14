#include<iostream>
#include<fstream>
#include<sstream>
#include<string>
#include<vector>

using std::cin;
using std::cout;
using std::cerr;
using std::getline;
using std::ifstream;
using std::ofstream;
using std::string;
using std::istringstream;
using std::vector;

string in_file_name("in.txt");
string out_file_name("out.txt");

struct person_info {
    string name;
    vector<string> phones;
};

void input(ifstream& in, vector<string>& vs) {
    string temp;
    while (in >> temp) {
        vs.push_back(temp);
    }
}

void output(ofstream& out, vector<string>& vs) {
    for (auto i : vs) {
        out << i << '\n';
    }
}

void readPhoneBook(ifstream& in, vector<person_info> & v) {
    string line, word;
    while (getline(in, line)) {
        person_info temp;
        istringstream record(line);
        record >> temp.name;
        while (record >> word) {
            temp.phones.push_back(word);
        }
        v.push_back(temp);
    }
}

int main() {
    vector<person_info> phone_book;
    ifstream in(in_file_name);
    if (in) {
        readPhoneBook(in, phone_book);
    } else {
        cerr << "can't open " + in_file_name << '\n';
    }
    for (auto i : phone_book) {
        cout << i.name << ' ';
        for (auto j : i.phones) {
            cout << j << ' ';
        }
        cout << '\n';
    }
    return 0;
}