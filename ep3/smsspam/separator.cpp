#include <cstdio>
#include <iostream>
#include <string>
#include <cstring>
#include <map>

char kSpam[] = "spam";
char kHam[] = "ham";

std::map<std::string, int> bag_spam;
double spam_max = 1;
std::map<std::string, int> bag_ham;
double ham_max = 1;

int len = 0;
int spec_char = 0;
int is_cap = 0;
int digits = 0;
FILE *arff;
FILE *spam, *ham;
FILE *bag_words;
char *type;
char message[100000];
#define is_digit(c) ((c)>='0' && (c)<='9')
#define is_lower(c) ((c)>='a' && (c)<='z')
#define is_capital(c) ((c)>='A' && (c)<='Z')
#define is_space(c) ((c)==' ' || (c)=='\n' || (c)=='\r' || (c)=='\t' || (c)=='\v' || (c)=='\f')
#define is_spec_char(c) (!is_digit(c) && !is_lower(c) && !is_capital(c) && !is_space(c) && (c)!='\0')

void filter(const char data[], int data_l) {
  int offset = 0;
  if (kSpam[0] != data[0]) {
    type = kHam;
    offset = 4;
    fputs(data, ham);
    fputc('\n', ham);
  } else {
    type = kSpam;
    offset = 5;
    fputs(data, spam);
    fputc('\n', spam);
  }

  spec_char = is_cap = digits = 0;
  int j = 0;
  for (int i=0;i<data_l;++i) {
    char c = data[i+offset];
    if (c != '\"') {
      message[j] = c;
      ++j;
    } else
      continue;
    if (is_spec_char(c))
      ++spec_char;
    if (is_capital(c))
      ++is_cap;
    if (is_digit(c))
      ++digits;

  }
  len = data_l;
  message[data_l] = '\0';

  char str[10000];
  char *token;
  for (int i=offset;i<data_l;++i)
    str[i-offset] = data[i];
  token = strtok(str, " \"");
  while (token != NULL) {
    if (type == kHam)
      ++bag_ham[std::string(token)];
    else
      ++bag_spam[std::string(token)];
    token = strtok(NULL, " \"");
  }
}

void print() {
  fprintf(arff, "%s, %d, %d, %d, %d, \"%s\"\n", type, len, spec_char, is_cap, digits, message);
}

int main() {
  std::string line;

  spam = fopen("spam.txt", "w");
  ham = fopen("ham.txt", "w");
  arff = fopen("sms.arff", "w");
  bag_words = fopen("bag.arff", "w");

  fputs("@RELATION sms\n\n@ATTRIBUTE class {spam, ham}\n@ATTRIBUTE length NUMERIC\n"
      "@ATTRIBUTE spec_char NUMERIC\n@ATTRIBUTE is_cap NUMERIC\n@ATTRIBUTE digits NUMERIC\n"
      "@ATTRIBUTE message STRING\n\n@DATA\n", arff);

  fputs("@RELATION bag\n\n@ATTRIBUTE class {spam, ham}\n"/*"@ATTRIBUTE freq NUMERIC\n"*/
      "@ATTRIBUTE word STRING\n\n@DATA\n", bag_words);

  while (std::cin.good()) {
    std::getline(std::cin, line);
    filter(line.c_str(), line.length());
    print();
  }

  for (auto s_it = bag_spam.begin(); s_it != bag_spam.end(); ++s_it) {
    auto h_it = bag_ham.find((*s_it).first);
    if (h_it != bag_ham.end())
      bag_ham.erase(h_it);
  }

  for (auto it = bag_ham.begin(); it != bag_ham.end(); ++it) {
    std::pair<std::string, int> val = *it;
    fprintf(bag_words, "ham, \"%s\"\n", val.first.c_str());
  }

  for (auto it = bag_spam.begin(); it != bag_spam.end(); ++it) {
    std::pair<std::string, int> val = *it;
    fprintf(bag_words, "spam, \"%s\"\n", val.first.c_str());
  }

  fclose(spam);
  fclose(ham);
  fclose(arff);
  fclose(bag_words);

  return 0;
}
