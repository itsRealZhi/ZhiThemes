#pragma once

#include <algorithm>
#include <string>
#include <vector>
#include "onion_cjson.hpp"

/* The Home displays only one language of param.json. Trophy definitions
   can use another installed language, so retain the publisher's exact
   localized title names for identity matching (never translate/fuzz them). */
inline std::vector<std::string> zt_localized_title_names(const std::string &param) {
  std::vector<std::string> names;
  if (param.empty() || param.size() > (1u << 20)) return names;
  onion_cjson::Root root(param);
  if (!root || !cJSON_IsObject(root.get())) return names;
  const cJSON *localized = cJSON_GetObjectItemCaseSensitive(root.get(), "localizedParameters");
  if (!cJSON_IsObject(localized)) return names;
  for (const cJSON *locale = localized->child; locale && names.size() < 64; locale = locale->next) {
    if (!cJSON_IsObject(locale)) continue;
    const cJSON *value = cJSON_GetObjectItemCaseSensitive(locale, "titleName");
    if (!cJSON_IsString(value) || !value->valuestring) continue;
    const std::string name(value->valuestring);
    if (!name.empty() && name.size() <= 512 && std::find(names.begin(), names.end(), name) == names.end())
      names.push_back(name);
  }
  return names;
}
