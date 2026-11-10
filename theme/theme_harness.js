// Simulates the HomeUI 9.60 start-up to test theme.js (node theme_harness.js <theme.js>)
const fs = require('fs');
const logs = [];
console.log = (m) => logs.push(String(m));
globalThis.setTimeout = (fn) => fn();
globalThis.setInterval = () => 0;               // the name request (THEME-ASK) does not run here; the 8 s report runs at once

globalThis.__themeApp = process.env.THEME_APP || '?'; // ZhiThemes sets "home"/"hub"
eval(fs.readFileSync(process.argv[2], 'utf8')); // like EvalScript

// HARNESS_ANIM=1: Animated nodes that can be evaluated (__get), for the row window / edge fade
const AN = (() => {
  const val = (x) => (typeof x === 'number' ? x : x.__get());
  const lin = (x, c) => {
    const i = c.inputRange, o = c.outputRange, n = i.length;
    const el = c.extrapolateLeft || c.extrapolate || 'extend', er = c.extrapolateRight || c.extrapolate || 'extend';
    if (x < i[0] && el === 'clamp') return o[0];
    if (x > i[n - 1] && er === 'clamp') return o[n - 1];
    let k = 1;
    while (k < n - 1 && x > i[k]) k++;
    const a = i[k - 1], b = i[k];
    return b === a ? o[k] : o[k - 1] + (o[k] - o[k - 1]) * (x - a) / (b - a);
  };
  const node = (get) => ({ __get: get, interpolate: (c) => node(() => lin(get(), c)) });
  return {
    Value: function (v) { let x = v; const n = node(() => x); n.setValue = (y) => { x = y; }; return n; },
    add: (a, b) => node(() => val(a) + val(b)),
    multiply: (a, b) => node(() => val(a) * val(b)),
    get: val
  };
})();
globalThis.__harnessAnim = AN;

// ---- "bundle": minimal webpack runtime, calling the factories with .call(...) ----
const modules = {
  // module 1: React Native (comes from rnps-ppr)
  1: function (module, exports) {
    module.exports = { AppRegistry: {}, StyleSheet: { create: (s) => s, flatten: (s) => Array.isArray(s) ? Object.assign({}, ...s.filter(Boolean)) : (s || {}) },
      View: 'View', Text: 'Text', ScrollView: 'RCTScrollView', IconPS: 'IconPS',
      Animated: process.env.HARNESS_ANIM ? { spring: (v, c) => c, View: 'Animated.View', Value: AN.Value, add: AN.add, multiply: AN.multiply }
                                         : { spring: (v, c) => c },
      FontSizePS: { SizeSmall: 24, SizeNormal: 28, SizeLarge: 32, Size2X: 44, Size5X: 96 } };
  },
  // React (comes from rnps-ppr)
  3: function (module) {
    module.exports = {
      Fragment: 'Fragment',
      createElement: (type, props, ...children) => ({ type, props: Object.assign({}, props, { children }) }),
      memo: (fn) => ({ $$typeof: 'memo', type: fn }),
      cloneElement: (el, p) => ({ type: el.type, key: el.key, props: Object.assign({}, el.props, p) }),
      createElementKeyed: true
    };
    // HARNESS_HOOKS=1 gives it hooks (own clock, particles render tests)
    if (process.env.HARNESS_HOOKS)
      Object.assign(module.exports, { useState: (v) => [typeof v === 'function' ? v() : v, () => {}],
                                      useEffect: () => {}, useRef: (v) => ({ current: v }) });
  },
  // top bar icons (React.memo; Settings defined later, as in the bundle)
  202: function (module, exports, req) {
    const React = req(3);
    const icon = (id) => React.memo(() => React.createElement('Button', { testID: id }));
    exports.Search = icon('system-search');
    exports.ApplicationErrorEventTrigger = icon('onionhen');
    exports.Profile = icon('system-profile');
    exports.Settings = icon('system-settings');
  },
  // game-hub, module 1944: game name / logo
  1944: function (module, exports, req) {
    exports.default = req(1).StyleSheet.create({
      logoImage: { maxHeight: 200, maxWidth: 600, marginBottom: 24 },
      conceptName: { fontSize: 44 },
      textTitle: { marginTop: 20, marginBottom: 24 } });
  },
  // game-hub: cover buttons (Play, ...)
  2241: function (module, exports, req) {
    exports.default = req(1).StyleSheet.create({
      ctaContainer: { height: 73 }, ctaPlaceholder: { width: 520 },
      ctaOpaque: { opacity: 1 }, ctaTransparent: { opacity: 0 } });
  },
  // jotai (shared state): the row reads the game list with useAtomValue
  4: function (module, exports) {
    // like the bundled jotai/utils (module 6): atomFamily + useAtomValue, no atom
    const LIST = [{ id: 'NPXS40047' }, { id: 'PPSA18026' }, { id: 'PPSA01467' }];
    exports.atomFamily = () => () => ({});
    exports.useAtomValue = () => LIST;
  },
  // name next to the focused tile
  2302: function (module, exports, req) {
    exports.default = req(1).StyleSheet.create({
      experienceTitleContainer: { position: 'absolute', left: 300, top: 100 },
      itemContainer: { position: 'absolute', alignItems: 'center', flexDirection: 'row' },
      tagText: { marginLeft: 26 } });
  },
  // game-hub: switch of the "Friends who play" card (module 271)
  271: function (module, exports) {
    exports.isFriendsWhoPlayEnabledForUser = () => true;
    exports.useIsFriendsWhoPlayEnabled = () => true;
  },
  // game-hub: button hints (module 160)
  160: function (module, exports) {
    exports.useSystemVoice = () => [() => 'set R3', () => 'set L3/△'];
  },
  // game-hub, module 1904: buttons below the title
  1904: function (module, exports, req) {
    exports.default = req(1).StyleSheet.create({ preCtaContainer: { marginTop: 16 } });
  },
  // jsx runtime
  2: function (module, exports) {
    exports.Fragment = 'F';
    exports.jsx = (type, props) => ({ type, props });
    exports.jsxs = (type, props) => ({ type, props });
  },
  // module 24 (real stock values)
  24: function (module, exports, req) {
    const rn = req(1);
    Object.assign(exports, {
      EXPERIENCE_SIZE: 106, SCALED_EXP_SIZE: 168, EXPERIENCE_SCALE: 1.5849056603773586,
      SCALED_EXP_MARGIN_LEFT: 172, MINIMIZED_EXP_MARGIN_TOP: 48, MINIMIZED_EXP_MARGIN_LEFT: 48,
      MINIMIZED_EXP_SIZE: 80, MINIMIZED_EXP_SCALE: 0.47619047619047616,
      VERTICAL_HEIGHT_CHANGE: 40, BORDER_RADIUS: 16 });
    exports.default = rn.StyleSheet.create({
      container: { flexDirection: 'row', width: 1920, height: 168 },
      experienceTitle: { fontSize: 1, textAlign: 'center' },
      focusContainer: { borderRadius: 25.358490566037737 },
      optionsMenuStyle: { height: 106, width: 106 },
      strandStyle: {}, strandContainer: { width: 1500, height: 168 } });
  },
  // module 100: bar height + clock styles
  100: function (module, exports, req) {
    exports.SYSTEM_HEIGHT = 126;
    exports.SYSTEM_ICON_SIZE = 56;
    exports.SYSTEM_ICON_SIZE_NO_GLANCE = 48;
    exports.default = req(1).StyleSheet.create({
      container: { alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
      clockWrapper: { marginLeft: 88 },
      clock: { fontSize: 32, textAlign: 'right' } });
  },
  // module 994: Games / Media tabs
  994: function (module, exports, req) {
    exports.default = req(1).StyleSheet.create({
      spaceSwitcher: { alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'flex-start' },
      spaceSwitcherItem: { marginRight: 64, padding: 8 },
      spaceSwitcherItemBlur: { fontWeight: 'normal', opacity: 0.6 },
      spaceSwitcherItemText: { fontWeight: 'bold', fontSize: 32 } });
  },
  // modules that export text / a number (in the real bundle: 114, 439, 964)
  300: function (module) { module.exports = 'text'; },
  301: function (module) { module.exports = 42; },
  // module 261: header styles (reads SCALED_EXP_SIZE from 24 at start-up)
  261: function (module, exports, req) {
    const rn = req(1), c = req(24), sys = req(100);
    exports.default = rn.StyleSheet.create({
      container: { flexDirection: 'column-reverse' },
      spaceSwitcherWrapper: { height: sys.SYSTEM_HEIGHT, marginLeft: 84 },
      systemWrapper: { alignContent: 'flex-end', flex: 1, height: sys.SYSTEM_HEIGHT, marginRight: 84 },
      experienceSwitcherWrapper: { height: c.SCALED_EXP_SIZE, width: '100%' } });
  },
  // module 146: value captured at start-up (SYSTEM_HEIGHT + VERTICAL_HEIGHT_CHANGE)
  146: function (module, exports, req) {
    exports.headerShift = req(100).SYSTEM_HEIGHT + req(24).VERTICAL_HEIGHT_CHANGE;
  },
  // entry: hub render (marginTop = SCALED - VERTICAL_HEIGHT_CHANGE)
  0: function (module, exports, req) {
    const j = req(2), c = req(24);
    exports.hub = j.jsx('Hub', { HubCache: {}, hubStyles: {},
                                 marginTop: c.SCALED_EXP_SIZE - c.VERTICAL_HEIGHT_CHANGE });
    exports.other = j.jsx('View', { marginTop: 5 });
    exports.header = req(261).default;
    exports.shift = req(146).headerShift;
    req(300); req(301);
    exports.tabs = req(994).default;
    exports.hubTitle = req(1944).default;
    exports.hubCta = req(2241).default;
    exports.hubPreCta = req(1904).default;
    const fwp = req(271), voice = req(160);
    exports.friends = [fwp.useIsFriendsWhoPlayEnabled(), fwp.isFriendsWhoPlayEnabledForUser()];
    exports.hints = voice.useSystemVoice().map((f) => f() === undefined ? 'nothing' : f());
    // cover buttons: Play and "..." (model with isOverflowButton)
    const model = (ui) => ({ uiType: ui, isOverflowButton() { return this.uiType === 'OVERFLOW'; } });
    exports.friendsCard = req(2).jsx('Card', { title: 'Friends who play', emptyHeaderIconId: 'friend' }) ? 'drawn' : 'hidden';
    exports.ctaRow = [req(2).jsx('Cta', { button: model('PLAY') }), req(2).jsx('Cta', { button: model('OVERFLOW') })]
      .map((e) => (e ? e.props.button.uiType : null));
    req(3); // in the real bundle React loads long before the Home container
    const jotai = req(4);
    const a = jotai.useAtomValue({}), b = jotai.useAtomValue({});
    exports.rowIds = a.map((e) => e.id);
    exports.sameRef = a === b;
    exports.nameTile = req(2302).default.experienceTitleContainer;
    const root = req(2).jsxs('View', { style: req(261).default.container,
                                       children: [{ key: 'a' }, { key: 'b' }] });
    exports.rootChildren = root.props.children.map((c) => c && (c.key || (c.props && c.props.key) || c.type));
    exports.footer = root.props.children[2] || null;
    exports.root = root; // render tests
    // like module 691: Text with no style or testID
    exports.tileTitle = req(2).jsx('Text', { ellipsizeMode: 'marquee', numberOfLines: 1,
                                             children: 'Planet Zoo' }).props.style || null;
    // name copy (with nameCopy on): the tree that comes back, as text
    const tree = (e) => (e && typeof e === 'object' && e.props !== undefined)
      ? { t: typeof e.type === 'string' ? e.type : (e.type && e.type.name) || String(e.type), k: e.key || null,
          s: e.props.style ? JSON.stringify(e.props.style) : undefined,
          c: Array.isArray(e.props.children) ? e.props.children.map(tree) : tree(e.props.children) }
      : e;
    exports.nameCopy = tree(req(2).jsx('Text', { ellipsizeMode: 'marquee', numberOfLines: 1, children: 'Copy Game' }));
    const icons = req(202);
    exports.icons = {};
    for (const n of ['Search', 'ApplicationErrorEventTrigger', 'Settings', 'Profile'])
      exports.icons[n] = icons[n].type({});
    exports.clock = req(100).default;
    // visual editor: a View with the bar style is measured in onLayout
    const bar = req(2).jsx('View', { style: [req(261).default.systemWrapper] });
    if (bar.props.onLayout)
      bar.props.onLayout({ nativeEvent: { layout: { x: 10, y: 20, width: 300, height: 56 } },
                           currentTarget: { measureInWindow: (cb) => cb(1500, 36, 300, 56) } });
    exports.measured = typeof bar.props.onLayout === 'function';
    // tabs layer (module ~255160): FocusLayerPS 'space-switcher' with one View per space
    const tabsLayer = req(2).jsxs('FocusLayerPS', { name: 'space-switcher', style: { flex: 1 },
      focusCustomSettings: { canMoveLeft: false, rightCandidate: 'home-system', downCandidate: '' },
      children: ['game', 'media'].map((id) => ({ type: 'View', key: id, props: { name: 'space-switcher-' + id, style: { marginRight: 64 } } })) });
    // the FocusLayerPS hands the same props to the view inside it: a second pass
    req(2).jsxs('FocusLayerPS', tabsLayer.props);
    exports.tabsGroup = { style: tabsLayer.props.style,
      children: tabsLayer.props.children.map((c) => (c.key || (c.props && c.props.key) || c.type) + ' ' + JSON.stringify(c.props.style)) };
    // row carousel: selectedN gets the offset of the focused tile
    exports.carousel = req(1).StyleSheet.create({ position0: { transform: [{ translateX: 0 }] },
      selected0: { transform: [{ scale: { interpolate: (c) => ({ interp: c }) } }, { translateY: 4 }, { translateX: 0 }] } }).selected0;
    // row carousel with the strand's scroll (tileEdgeFade: opacity of each positionN)
    if (!process.env.HARNESS_ANIM) {
      const fade = { scroll: { transform: [{ translateX: { interpolate: (c) => ({ interp: c }) } }] } };
      for (let i = 0; i < 16; i++) {
        fade['position' + i] = { transform: [{ translateX: i * 114 }] };
        fade['selected' + i] = { transform: [{ scale: { interpolate: (c) => ({ interp: c }) } }, { translateY: 53 }, { translateX: 0 }] };
      }
      req(1).StyleSheet.create(fade);
      if (fade.position0.opacity) exports.edgeFade = [0, 1, 2, 5, 10, 14, 15].map((i) =>
        'item ' + i + ': ' + fade['position' + i].opacity.interp.outputRange.slice().reverse().join(' '));
    } else {
      // the strand with evaluable nodes: selectedValue -> scroll, positions = index·P
      const src0 = fs.readFileSync(process.argv[2], 'utf8'), num0 = (k) => { const m = src0.match(new RegExp('\n    ' + k + ': (-?[0-9.]+)')); return m ? Number(m[1]) : undefined; };
      const T0 = { tileSize: num0('tileSize'), rowTileGap: num0('rowTileGap') }, P = (T0.tileSize || 106) + (T0.rowTileGap == null ? 8 : T0.rowTileGap);
      const M = 16, n = Number(process.env.HARNESS_ITEMS || 14), sel = new AN.Value(1);
      const ins = [-1], outs = [-(T0.tileSize || 106) / 2];
      for (let i = 0; i < M; i++) { ins.push(i); outs.push(-i * P); }
      const st = { scroll: { transform: [{ translateX: sel.interpolate({ inputRange: ins, outputRange: outs }) }] } };
      for (let i = 0; i < M; i++) {
        st['position' + i] = { transform: [{ translateX: new AN.Value(i * P) }] };
        st['selected' + i] = { transform: [{ scale: { interpolate: (c) => ({ interp: c }) } }, { translateY: 53 }, { translateX: 0 }] };
      }
      req(1).StyleSheet.create(st);
      // the scroll View renders one child per item
      req(2).jsx('Animated.View', { style: st.scroll, children: Array.from({ length: n }, (_, i) => ({ key: 'i' + i })) });
      // a pool slot that changed place: slot 3 holds the item at index 6
      st.position3.transform[0].translateX.setValue(6 * P); st.position6.transform[0].translateX.setValue(3 * P);
      const rows = [];
      const sels = process.env.HARNESS_FRAC ? [2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4] : Array.from({ length: n }, (_, i) => i);
      for (const s of sels) {
        sel.setValue(s);
        const scroll = AN.get(st.scroll.transform[0].translateX);
        const focusX = 172 + s * P + scroll; // where the focused item stands
        const op = [];
        for (let k = 0; k < n; k++) {
          const slot = k === 3 ? 6 : k === 6 ? 3 : k;
          const ps = st['position' + slot], tr = ps.transform[1] && ps.transform[1].translateX;
          op.push((ps.opacity ? AN.get(ps.opacity).toFixed(2) : '-') + (tr ? '/' + Math.round(AN.get(tr)) : ''));
        }
        if (process.env.HARNESS_FRAC) {
          const p2 = st['position' + 2], x2 = 172 + AN.get(p2.transform[0].translateX) + scroll + (p2.transform[1] ? AN.get(p2.transform[1].translateX) : 0);
          rows.push('sel ' + s + ': item 2 left x ' + Math.round(x2) + ' opacity ' + AN.get(p2.opacity).toFixed(2));
          continue;
        }
        rows.push('sel ' + String(s).padStart(2) + ': focus x ' + Math.round(focusX) + ' slot ' + Math.round((focusX - 172) / P) + (op[0] !== '-' ? ' | op ' + op.join(' ') : ''));
      }
      exports.edgeFade = rows;
    }
    // fake title: the name comes from the row's selectedItem in its data
    const rowRef = {};
    const strand = req(2).jsx('Strand', { ref: rowRef, selectedItem: 'B2', keyExtractor: (e) => e.id,
      data: [{ id: 'A1', experienceName: 'Game A' }, { id: 'B2', experienceName: 'Game B' }],
      onFocusMove: () => {}, onChange: () => {}, onFocus: () => {} });
    exports.gameName = globalThis.__theme.gameName;
    // the row component reports the focused tile with onFocus({item}); the
    // strand drawn again with its old selectedItem does not take it back
    const row = req(2).jsx('Row', { loadComponents: {}, selected: true, spaceId: 'game', onFocus: () => {} });
    row.props.onFocus({ item: { id: 'C3', experienceName: 'Game C' }, index: 2 });
    req(2).jsx('Strand', { ref: rowRef, selectedItem: 'B2', keyExtractor: (e) => e.id,
      data: [{ id: 'A1', experienceName: 'Game A' }, { id: 'B2', experienceName: 'Game B' }] });
    exports.gameNameAfterFocus = globalThis.__theme.gameName;
    // the Home's game hub page says when the focus is in the hub
    [false, true, true, false].forEach((f) => req(2).jsx('HubPage', { hubUrl: 'pshome:gamehub?titleId=A1', focusLayerName: 'hub', isHubFocused: f }));
    exports.hubFocus = logs.filter((l) => /^THEME-HUBFOCUS/.test(l));
    exports.hubSections = ['uam-card', 'post-news-section', 'my-thing'].map((id) => req(2).jsx('View', { testID: id }) ? 'drawn' : 'hidden');
    // new: row spring, icon size, trophies, no clip
    exports.spring = req(1).Animated.spring(null, { stiffness: 256, damping: 21, mass: 0.1, overshootClamping: true });
    exports.iconSize = [req(100).SYSTEM_ICON_SIZE, req(100).SYSTEM_ICON_SIZE_NO_GLANCE];
    exports.trophy = req(2).jsx('View', { testID: 'wrapper-trophy-tile' }) ? 'drawn' : 'hidden';
    exports.scroll = req(2).jsx('RCTScrollView', { style: { flex: 1 } }).props;
    // tiles: several measures are joined into one line
    [50, 172, 357].forEach((x, i) => {
      const t = req(2).jsx('View', { style: req(24).default.focusContainer });
      if (t.props.onLayout)
        t.props.onLayout({ nativeEvent: {}, currentTarget: { id: i, measureInWindow: (cb) => cb(x, 126, 106, 106) } });
    });
  }
};
const cache = {};
function req(id) {
  if (cache[id]) return cache[id].exports;
  const module = cache[id] = { i: id, exports: {} };
  req.m[id].call(module.exports, module, module.exports, req);
  return module.exports;
}
req.m = modules; req.c = cache;

const entry = req(0);
globalThis.__harnessEntry = entry; // for scratchpad render tests
const c24 = req(24);
const out = {
  logs,
  constants: { tile: c24.EXPERIENCE_SIZE, focus: c24.SCALED_EXP_SIZE, scale: c24.EXPERIENCE_SCALE,
               radius: c24.BORDER_RADIUS, minTop: c24.MINIMIZED_EXP_MARGIN_TOP,
               minScale: c24.MINIMIZED_EXP_SCALE,
               minLeft: c24.MINIMIZED_EXP_MARGIN_LEFT, vhc: c24.VERTICAL_HEIGHT_CHANGE },
  styles24: c24.default,
  wrapper: entry.header.experienceSwitcherWrapper,
  topBar: { tabs: entry.header.spaceSwitcherWrapper, icons: entry.header.systemWrapper },
  tabs: entry.tabs,
  icons: entry.icons,
  hubTitle: entry.hubTitle,
  hubCta: entry.hubCta,
  hubPreCta: entry.hubPreCta,
  friends: entry.friends,
  hints: entry.hints,
  ctaRow: entry.ctaRow,
  friendsCard: entry.friendsCard,
  rowIds: entry.rowIds,
  sameRef: entry.sameRef,
  nameTile: entry.nameTile,
  rootChildren: entry.rootChildren,
  footer: entry.footer,
  tileTitle: entry.tileTitle,
  nameCopy: entry.nameCopy,
  clock: entry.clock,
  measured: entry.measured,
  tabsGroup: entry.tabsGroup,
  carousel: entry.carousel,
  edgeFade: entry.edgeFade,
  gameName: entry.gameName, gameNameAfterFocus: entry.gameNameAfterFocus, hubFocus: entry.hubFocus, hubSections: entry.hubSections,
  spring: entry.spring, iconSize: entry.iconSize, trophy: entry.trophy, scroll: entry.scroll,
  hubMarginTop: entry.hub.props.marginTop,
  headerShift: entry.shift,
  callRestored: Function.prototype.call.toString().includes('native code'),
  errors: globalThis.__theme && globalThis.__theme.errors
};
process.stdout.write(JSON.stringify(out, null, 1) + '\n');
