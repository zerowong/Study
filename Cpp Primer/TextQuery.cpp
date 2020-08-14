#include <algorithm>
#include <fstream>
#include <iostream>
#include <iterator>
#include <map>
#include <memory>
#include <set>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

class QueryResult;
class TextQuery {
 public:
  using line_no = vector<string>::size_type;
  TextQuery(ifstream&);
  QueryResult query(const string&) const;

 private:
  shared_ptr<vector<string>> file;
  map<string, shared_ptr<set<line_no>>> wm;
};

class QueryResult {
  friend ostream& print(ostream&, const QueryResult&);

 public:
  QueryResult(string s, shared_ptr<set<TextQuery::line_no>> p,
              shared_ptr<vector<string>> f)
      : sought(s), lines(p), file(f) {}
  set<TextQuery::line_no>::iterator begin() { return lines->begin(); }
  set<TextQuery::line_no>::iterator end() { return lines->end(); }
  shared_ptr<vector<string>> get_file() { return file; }

 private:
  string sought;
  shared_ptr<set<TextQuery::line_no>> lines;
  shared_ptr<vector<string>> file;
};

TextQuery::TextQuery(ifstream& ifs) : file(new vector<string>) {
  string text;
  while (getline(ifs, text)) {
    file->push_back(text);
    int n = file->size() - 1;
    istringstream line(text);
    string word;
    while (line >> word) {
      auto& lines = wm[word];
      if (!lines) {
        lines.reset(new set<line_no>);
      }
      lines->insert(n);
    }
  }
}

QueryResult TextQuery::query(const string& sought) const {
  static shared_ptr<set<line_no>> nodata(new set<line_no>);
  auto loc = wm.find(sought);
  if (loc == wm.end()) {
    return QueryResult(sought, nodata, file);
  }
  return QueryResult(sought, loc->second, file);
}

ostream& print(ostream& out, const QueryResult& qr) {
  out << qr.sought << " occurs " << qr.lines->size();
  out << (qr.lines->size() > 1 ? " times" : " time") << endl;
  for (auto num : *qr.lines) {
    out << "\t(line " << num + 1 << ") " << *(qr.file->begin() + num) << endl;
  }
  return out;
}

void runQueries(ifstream& ifs) {
  TextQuery tq(ifs);
  while (true) {
    cout << "Enter word to look for, or q to quit: ";
    string s;
    if (!(cin >> s) || s == "q") break;
    print(cout, tq.query(s)) << endl;
  }
}

class Query_base {
  friend class Query;

 protected:
  using line_no = TextQuery::line_no;
  virtual ~Query_base() = default;

 private:
  virtual QueryResult eval(const TextQuery&) const = 0;
  virtual string rep() const = 0;
};

class Query {
  friend Query operator~(const Query&);
  friend Query operator|(const Query&, const Query&);
  friend Query operator&(const Query&, const Query&);

 public:
  Query(const string&);
  QueryResult eval(const TextQuery& t) const { return q->eval(t); }
  string rep() const { return q->rep(); };

 private:
  shared_ptr<Query_base> q;
  Query(shared_ptr<Query_base> query) : q(query) {}
};

ostream& operator<<(ostream& out, const Query& query) {
  return out << query.rep();
}

class WrodQuery : public Query_base {
  friend class Query;

 private:
  string query_word;
  WrodQuery(const string& s) : query_word(s) {}
  QueryResult eval(const TextQuery& tq) const { return tq.query(query_word); }
  string rep() const { return query_word; }
};

inline Query::Query(const string& s) : q(new WrodQuery(s)) {}

class NotQuery : public Query_base {
  friend Query operator~(const Query&);

 private:
  Query query;
  NotQuery(const Query& q) : query(q) {}
  string rep() const { return "~(" + query.rep() + ")"; }
  QueryResult eval(const TextQuery&) const;
};

inline Query operator~(const Query& q) {
  return shared_ptr<Query_base>(new NotQuery(q));
}

QueryResult NotQuery::eval(const TextQuery& text) const {
  auto result = query.eval(text);
  auto ret_lines = make_shared<set<line_no>>();
  auto beg = result.begin();
  auto end = result.end();
  auto sz = result.get_file()->size();
  for (size_t i = 0; i != sz; ++i) {
    if (beg == end || *beg != i) {
      ret_lines->insert(i);
    } else if (beg != end) {
      ++beg;
    }
  }
  return QueryResult(rep(), ret_lines, result.get_file());
}

class BinaryQuery : public Query_base {
 protected:
  Query lhs;
  Query rhs;
  string opSym;
  BinaryQuery(const Query& l, const Query& r, string s)
      : lhs(l), rhs(r), opSym(s) {}
  string rep() const {
    return "(" + lhs.rep() + " " + opSym + " " + rhs.rep() + ")";
  }
};

class AndQuery : public BinaryQuery {
  friend Query operator&(const Query&, const Query&);

 private:
  AndQuery(const Query& l, const Query& r) : BinaryQuery(l, r, "&") {}
  QueryResult eval(const TextQuery&) const;
};

inline Query operator&(const Query& lhs, const Query& rhs) {
  return shared_ptr<Query_base>(new AndQuery(lhs, rhs));
}

QueryResult AndQuery::eval(const TextQuery& text) const {
  auto left = lhs.eval(text);
  auto right = rhs.eval(text);
  auto ret_lines = make_shared<set<line_no>>();
  set_intersection(left.begin(), left.end(), right.begin(), right.end(),
                   inserter(*ret_lines, ret_lines->begin()));
  return QueryResult(rep(), ret_lines, left.get_file());
}

class OrQuery : public BinaryQuery {
  friend Query operator|(const Query&, const Query&);

 private:
  OrQuery(const Query& l, const Query& r) : BinaryQuery(l, r, "|") {}
  QueryResult eval(const TextQuery&) const;
};

inline Query operator|(const Query& lhs, const Query& rhs) {
  return shared_ptr<Query_base>(new OrQuery(lhs, rhs));
}

QueryResult OrQuery::eval(const TextQuery& text) const {
  auto right = rhs.eval(text);
  auto left = lhs.eval(text);
  auto ret_lines = make_shared<set<line_no>>(left.begin(), left.end());
  ret_lines->insert(right.begin(), right.end());
  return QueryResult(rep(), ret_lines, left.get_file());
}

int main() {
  ifstream ifs("input.txt");
  TextQuery tq(ifs);
  Query q = ~Query("web");
  print(cout, q.eval(tq)) << endl;
  return 0;
}