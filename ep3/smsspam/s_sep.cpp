#include <string>
#include <iostream>
#include <regex>
#include <algorithm>

int main() {
  std::string line;
  std::string spam, ham;
  int s_n, h_n;

  while (std::cin.good()) {
    std::getline(std::cin, line);

    if (line.empty())
      continue;

    std::string res;
    std::remove_copy(line.begin(), line.end(), std::back_inserter(res), char('\"'));
    res = std::regex_replace(res, std::regex("^spam,|ham,"), "");
    if (line.at(0) == char('s'))
      spam.append(" " + res);
    else
      ham.append(" " + res);
  }

  std::cout << "@RELATION sms\n\n@ATTRIBUTE class {spam, ham}\n@ATTRIBUTE message STRING\n\n@DATA"
    << std::endl;
  std::cout << "spam,\"" + spam + "\"" << std::endl;
  std::cout << "ham,\"" + ham + "\"" << std::endl;

  return 0;
}
