#include "../src/source/shellui/include/zt_title_names.hpp"
#include <assert.h>
#include <stdio.h>

int main() {
  const std::string param = R"({"localizedParameters":{
    "defaultLanguage":"en-US",
    "en-US":{"titleName":"PRAGMATA"},
    "ru-RU":{"titleName":"\u041f\u0440\u0430\u0433\u043c\u0430\u0442\u0430"},
    "ja-JP":{"titleName":"プラグマタ"},
    "en-GB":{"titleName":"PRAGMATA"},
    "empty":{"titleName":""},"wrong":{"titleName":23},
    "not-a-title":{"description":"Another game"}
  },"titleName":"Unrelated root value"})";
  const auto names = zt_localized_title_names(param);
  assert(names.size() == 3);
  assert(names[0] == "PRAGMATA" && names[1] == "Прагмата" && names[2] == "プラグマタ");
  assert(zt_localized_title_names("{}").empty());
  assert(zt_localized_title_names("{broken").empty());
  assert(zt_localized_title_names(param + "garbage").empty());
  assert(zt_localized_title_names("{\"localizedParameters\":[{\"titleName\":\"bad\"}]}").empty());
  assert(zt_localized_title_names("{\"localizedParameters\":{\"en\":{\"titleName\":\"A \\\"quoted\\\" title\"}}}")[0] == "A \"quoted\" title");
  const std::string longName(513, 'x');
  assert(zt_localized_title_names("{\"localizedParameters\":{\"en\":{\"titleName\":\"" + longName + "\"}}}").empty());
  std::string many = "{\"localizedParameters\":{";
  for (int i = 0; i < 100; ++i) {
    if (i) many += ',';
    many += "\"lang" + std::to_string(i) + "\":{\"titleName\":\"Game " + std::to_string(i) + "\"}";
  }
  many += "}}";
  assert(zt_localized_title_names(many).size() == 64);
  puts("Localized title tests passed: all languages, Unicode/escapes, exact names, malformed data and bounds.");
}
