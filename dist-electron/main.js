var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, systemPreferences, ipcMain, desktopCapturer, dialog, nativeImage, Tray } from "electron";
import require$$0, { spawn } from "child_process";
import require$$1 from "crypto";
import fs from "node:fs/promises";
import { tmpdir as tmpdir$1, hostname } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises } from "fs";
import { tmpdir } from "os";
import { join } from "path";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var dist = { exports: {} };
(function(module, exports) {
  !function(t, n) {
    module.exports = n(require$$0, require$$1);
  }(commonjsGlobal, function(t, n) {
    return function(t2) {
      function n2(e) {
        if (r[e]) return r[e].exports;
        var o = r[e] = { exports: {}, id: e, loaded: false };
        return t2[e].call(o.exports, o, o.exports, n2), o.loaded = true, o.exports;
      }
      var r = {};
      return n2.m = t2, n2.c = r, n2.p = "", n2(0);
    }([function(t2, n2, r) {
      t2.exports = r(34);
    }, function(t2, n2, r) {
      var e = r(29)("wks"), o = r(33), i = r(2).Symbol, c = "function" == typeof i, u = t2.exports = function(t3) {
        return e[t3] || (e[t3] = c && i[t3] || (c ? i : o)("Symbol." + t3));
      };
      u.store = e;
    }, function(t2, n2) {
      var r = t2.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
      "number" == typeof __g && (__g = r);
    }, function(t2, n2, r) {
      var e = r(9);
      t2.exports = function(t3) {
        if (!e(t3)) throw TypeError(t3 + " is not an object!");
        return t3;
      };
    }, function(t2, n2, r) {
      t2.exports = !r(24)(function() {
        return 7 != Object.defineProperty({}, "a", { get: function() {
          return 7;
        } }).a;
      });
    }, function(t2, n2, r) {
      var e = r(12), o = r(17);
      t2.exports = r(4) ? function(t3, n3, r2) {
        return e.f(t3, n3, o(1, r2));
      } : function(t3, n3, r2) {
        return t3[n3] = r2, t3;
      };
    }, function(t2, n2) {
      var r = t2.exports = { version: "2.4.0" };
      "number" == typeof __e && (__e = r);
    }, function(t2, n2, r) {
      var e = r(14);
      t2.exports = function(t3, n3, r2) {
        if (e(t3), void 0 === n3) return t3;
        switch (r2) {
          case 1:
            return function(r3) {
              return t3.call(n3, r3);
            };
          case 2:
            return function(r3, e2) {
              return t3.call(n3, r3, e2);
            };
          case 3:
            return function(r3, e2, o) {
              return t3.call(n3, r3, e2, o);
            };
        }
        return function() {
          return t3.apply(n3, arguments);
        };
      };
    }, function(t2, n2) {
      var r = {}.hasOwnProperty;
      t2.exports = function(t3, n3) {
        return r.call(t3, n3);
      };
    }, function(t2, n2) {
      t2.exports = function(t3) {
        return "object" == typeof t3 ? null !== t3 : "function" == typeof t3;
      };
    }, function(t2, n2) {
      t2.exports = {};
    }, function(t2, n2) {
      var r = {}.toString;
      t2.exports = function(t3) {
        return r.call(t3).slice(8, -1);
      };
    }, function(t2, n2, r) {
      var e = r(3), o = r(26), i = r(32), c = Object.defineProperty;
      n2.f = r(4) ? Object.defineProperty : function(t3, n3, r2) {
        if (e(t3), n3 = i(n3, true), e(r2), o) try {
          return c(t3, n3, r2);
        } catch (t4) {
        }
        if ("get" in r2 || "set" in r2) throw TypeError("Accessors not supported!");
        return "value" in r2 && (t3[n3] = r2.value), t3;
      };
    }, function(t2, n2, r) {
      var e = r(42), o = r(15);
      t2.exports = function(t3) {
        return e(o(t3));
      };
    }, function(t2, n2) {
      t2.exports = function(t3) {
        if ("function" != typeof t3) throw TypeError(t3 + " is not a function!");
        return t3;
      };
    }, function(t2, n2) {
      t2.exports = function(t3) {
        if (void 0 == t3) throw TypeError("Can't call method on  " + t3);
        return t3;
      };
    }, function(t2, n2, r) {
      var e = r(9), o = r(2).document, i = e(o) && e(o.createElement);
      t2.exports = function(t3) {
        return i ? o.createElement(t3) : {};
      };
    }, function(t2, n2) {
      t2.exports = function(t3, n3) {
        return { enumerable: !(1 & t3), configurable: !(2 & t3), writable: !(4 & t3), value: n3 };
      };
    }, function(t2, n2, r) {
      var e = r(12).f, o = r(8), i = r(1)("toStringTag");
      t2.exports = function(t3, n3, r2) {
        t3 && !o(t3 = r2 ? t3 : t3.prototype, i) && e(t3, i, { configurable: true, value: n3 });
      };
    }, function(t2, n2, r) {
      var e = r(29)("keys"), o = r(33);
      t2.exports = function(t3) {
        return e[t3] || (e[t3] = o(t3));
      };
    }, function(t2, n2) {
      var r = Math.ceil, e = Math.floor;
      t2.exports = function(t3) {
        return isNaN(t3 = +t3) ? 0 : (t3 > 0 ? e : r)(t3);
      };
    }, function(t2, n2, r) {
      var e = r(11), o = r(1)("toStringTag"), i = "Arguments" == e(/* @__PURE__ */ function() {
        return arguments;
      }()), c = function(t3, n3) {
        try {
          return t3[n3];
        } catch (t4) {
        }
      };
      t2.exports = function(t3) {
        var n3, r2, u;
        return void 0 === t3 ? "Undefined" : null === t3 ? "Null" : "string" == typeof (r2 = c(n3 = Object(t3), o)) ? r2 : i ? e(n3) : "Object" == (u = e(n3)) && "function" == typeof n3.callee ? "Arguments" : u;
      };
    }, function(t2, n2) {
      t2.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
    }, function(t2, n2, r) {
      var e = r(2), o = r(6), i = r(7), c = r(5), u = "prototype", s = function(t3, n3, r2) {
        var f, a, p, l = t3 & s.F, v = t3 & s.G, h = t3 & s.S, d = t3 & s.P, y = t3 & s.B, _ = t3 & s.W, x = v ? o : o[n3] || (o[n3] = {}), m = x[u], w = v ? e : h ? e[n3] : (e[n3] || {})[u];
        v && (r2 = n3);
        for (f in r2) a = !l && w && void 0 !== w[f], a && f in x || (p = a ? w[f] : r2[f], x[f] = v && "function" != typeof w[f] ? r2[f] : y && a ? i(p, e) : _ && w[f] == p ? function(t4) {
          var n4 = function(n5, r3, e2) {
            if (this instanceof t4) {
              switch (arguments.length) {
                case 0:
                  return new t4();
                case 1:
                  return new t4(n5);
                case 2:
                  return new t4(n5, r3);
              }
              return new t4(n5, r3, e2);
            }
            return t4.apply(this, arguments);
          };
          return n4[u] = t4[u], n4;
        }(p) : d && "function" == typeof p ? i(Function.call, p) : p, d && ((x.virtual || (x.virtual = {}))[f] = p, t3 & s.R && m && !m[f] && c(m, f, p)));
      };
      s.F = 1, s.G = 2, s.S = 4, s.P = 8, s.B = 16, s.W = 32, s.U = 64, s.R = 128, t2.exports = s;
    }, function(t2, n2) {
      t2.exports = function(t3) {
        try {
          return !!t3();
        } catch (t4) {
          return true;
        }
      };
    }, function(t2, n2, r) {
      t2.exports = r(2).document && document.documentElement;
    }, function(t2, n2, r) {
      t2.exports = !r(4) && !r(24)(function() {
        return 7 != Object.defineProperty(r(16)("div"), "a", { get: function() {
          return 7;
        } }).a;
      });
    }, function(t2, n2, r) {
      var e = r(28), o = r(23), i = r(57), c = r(5), u = r(8), s = r(10), f = r(45), a = r(18), p = r(52), l = r(1)("iterator"), v = !([].keys && "next" in [].keys()), h = "@@iterator", d = "keys", y = "values", _ = function() {
        return this;
      };
      t2.exports = function(t3, n3, r2, x, m, w, g) {
        f(r2, n3, x);
        var b, O, j, S = function(t4) {
          if (!v && t4 in T) return T[t4];
          switch (t4) {
            case d:
              return function() {
                return new r2(this, t4);
              };
            case y:
              return function() {
                return new r2(this, t4);
              };
          }
          return function() {
            return new r2(this, t4);
          };
        }, E = n3 + " Iterator", P = m == y, M = false, T = t3.prototype, A = T[l] || T[h] || m && T[m], k = A || S(m), C = m ? P ? S("entries") : k : void 0, I = "Array" == n3 ? T.entries || A : A;
        if (I && (j = p(I.call(new t3())), j !== Object.prototype && (a(j, E, true), e || u(j, l) || c(j, l, _))), P && A && A.name !== y && (M = true, k = function() {
          return A.call(this);
        }), e && !g || !v && !M && T[l] || c(T, l, k), s[n3] = k, s[E] = _, m) if (b = { values: P ? k : S(y), keys: w ? k : S(d), entries: C }, g) for (O in b) O in T || i(T, O, b[O]);
        else o(o.P + o.F * (v || M), n3, b);
        return b;
      };
    }, function(t2, n2) {
      t2.exports = true;
    }, function(t2, n2, r) {
      var e = r(2), o = "__core-js_shared__", i = e[o] || (e[o] = {});
      t2.exports = function(t3) {
        return i[t3] || (i[t3] = {});
      };
    }, function(t2, n2, r) {
      var e, o, i, c = r(7), u = r(41), s = r(25), f = r(16), a = r(2), p = a.process, l = a.setImmediate, v = a.clearImmediate, h = a.MessageChannel, d = 0, y = {}, _ = "onreadystatechange", x = function() {
        var t3 = +this;
        if (y.hasOwnProperty(t3)) {
          var n3 = y[t3];
          delete y[t3], n3();
        }
      }, m = function(t3) {
        x.call(t3.data);
      };
      l && v || (l = function(t3) {
        for (var n3 = [], r2 = 1; arguments.length > r2; ) n3.push(arguments[r2++]);
        return y[++d] = function() {
          u("function" == typeof t3 ? t3 : Function(t3), n3);
        }, e(d), d;
      }, v = function(t3) {
        delete y[t3];
      }, "process" == r(11)(p) ? e = function(t3) {
        p.nextTick(c(x, t3, 1));
      } : h ? (o = new h(), i = o.port2, o.port1.onmessage = m, e = c(i.postMessage, i, 1)) : a.addEventListener && "function" == typeof postMessage && !a.importScripts ? (e = function(t3) {
        a.postMessage(t3 + "", "*");
      }, a.addEventListener("message", m, false)) : e = _ in f("script") ? function(t3) {
        s.appendChild(f("script"))[_] = function() {
          s.removeChild(this), x.call(t3);
        };
      } : function(t3) {
        setTimeout(c(x, t3, 1), 0);
      }), t2.exports = { set: l, clear: v };
    }, function(t2, n2, r) {
      var e = r(20), o = Math.min;
      t2.exports = function(t3) {
        return t3 > 0 ? o(e(t3), 9007199254740991) : 0;
      };
    }, function(t2, n2, r) {
      var e = r(9);
      t2.exports = function(t3, n3) {
        if (!e(t3)) return t3;
        var r2, o;
        if (n3 && "function" == typeof (r2 = t3.toString) && !e(o = r2.call(t3))) return o;
        if ("function" == typeof (r2 = t3.valueOf) && !e(o = r2.call(t3))) return o;
        if (!n3 && "function" == typeof (r2 = t3.toString) && !e(o = r2.call(t3))) return o;
        throw TypeError("Can't convert object to primitive value");
      };
    }, function(t2, n2) {
      var r = 0, e = Math.random();
      t2.exports = function(t3) {
        return "Symbol(".concat(void 0 === t3 ? "" : t3, ")_", (++r + e).toString(36));
      };
    }, function(t2, n2, r) {
      function e(t3) {
        return t3 && t3.__esModule ? t3 : { default: t3 };
      }
      function o() {
        return "win32" !== process.platform ? "" : "ia32" === process.arch && process.env.hasOwnProperty("PROCESSOR_ARCHITEW6432") ? "mixed" : "native";
      }
      function i(t3) {
        return (0, l.createHash)("sha256").update(t3).digest("hex");
      }
      function c(t3) {
        switch (h) {
          case "darwin":
            return t3.split("IOPlatformUUID")[1].split("\n")[0].replace(/\=|\s+|\"/gi, "").toLowerCase();
          case "win32":
            return t3.toString().split("REG_SZ")[1].replace(/\r+|\n+|\s+/gi, "").toLowerCase();
          case "linux":
            return t3.toString().replace(/\r+|\n+|\s+/gi, "").toLowerCase();
          case "freebsd":
            return t3.toString().replace(/\r+|\n+|\s+/gi, "").toLowerCase();
          default:
            throw new Error("Unsupported platform: " + process.platform);
        }
      }
      function u(t3) {
        var n3 = c((0, p.execSync)(y[h]).toString());
        return t3 ? n3 : i(n3);
      }
      function s(t3) {
        return new a.default(function(n3, r2) {
          return (0, p.exec)(y[h], {}, function(e2, o2, u2) {
            if (e2) return r2(new Error("Error while obtaining machine id: " + e2.stack));
            var s2 = c(o2.toString());
            return n3(t3 ? s2 : i(s2));
          });
        });
      }
      Object.defineProperty(n2, "__esModule", { value: true });
      var f = r(35), a = e(f);
      n2.machineIdSync = u, n2.machineId = s;
      var p = r(70), l = r(71), v = process, h = v.platform, d = { native: "%windir%\\System32", mixed: "%windir%\\sysnative\\cmd.exe /c %windir%\\System32" }, y = { darwin: "ioreg -rd1 -c IOPlatformExpertDevice", win32: d[o()] + "\\REG.exe QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid", linux: "( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :", freebsd: "kenv -q smbios.system.uuid || sysctl -n kern.hostuuid" };
    }, function(t2, n2, r) {
      t2.exports = { default: r(36), __esModule: true };
    }, function(t2, n2, r) {
      r(66), r(68), r(69), r(67), t2.exports = r(6).Promise;
    }, function(t2, n2) {
      t2.exports = function() {
      };
    }, function(t2, n2) {
      t2.exports = function(t3, n3, r, e) {
        if (!(t3 instanceof n3) || void 0 !== e && e in t3) throw TypeError(r + ": incorrect invocation!");
        return t3;
      };
    }, function(t2, n2, r) {
      var e = r(13), o = r(31), i = r(62);
      t2.exports = function(t3) {
        return function(n3, r2, c) {
          var u, s = e(n3), f = o(s.length), a = i(c, f);
          if (t3 && r2 != r2) {
            for (; f > a; ) if (u = s[a++], u != u) return true;
          } else for (; f > a; a++) if ((t3 || a in s) && s[a] === r2) return t3 || a || 0;
          return !t3 && -1;
        };
      };
    }, function(t2, n2, r) {
      var e = r(7), o = r(44), i = r(43), c = r(3), u = r(31), s = r(64), f = {}, a = {}, n2 = t2.exports = function(t3, n3, r2, p, l) {
        var v, h, d, y, _ = l ? function() {
          return t3;
        } : s(t3), x = e(r2, p, n3 ? 2 : 1), m = 0;
        if ("function" != typeof _) throw TypeError(t3 + " is not iterable!");
        if (i(_)) {
          for (v = u(t3.length); v > m; m++) if (y = n3 ? x(c(h = t3[m])[0], h[1]) : x(t3[m]), y === f || y === a) return y;
        } else for (d = _.call(t3); !(h = d.next()).done; ) if (y = o(d, x, h.value, n3), y === f || y === a) return y;
      };
      n2.BREAK = f, n2.RETURN = a;
    }, function(t2, n2) {
      t2.exports = function(t3, n3, r) {
        var e = void 0 === r;
        switch (n3.length) {
          case 0:
            return e ? t3() : t3.call(r);
          case 1:
            return e ? t3(n3[0]) : t3.call(r, n3[0]);
          case 2:
            return e ? t3(n3[0], n3[1]) : t3.call(r, n3[0], n3[1]);
          case 3:
            return e ? t3(n3[0], n3[1], n3[2]) : t3.call(r, n3[0], n3[1], n3[2]);
          case 4:
            return e ? t3(n3[0], n3[1], n3[2], n3[3]) : t3.call(r, n3[0], n3[1], n3[2], n3[3]);
        }
        return t3.apply(r, n3);
      };
    }, function(t2, n2, r) {
      var e = r(11);
      t2.exports = Object("z").propertyIsEnumerable(0) ? Object : function(t3) {
        return "String" == e(t3) ? t3.split("") : Object(t3);
      };
    }, function(t2, n2, r) {
      var e = r(10), o = r(1)("iterator"), i = Array.prototype;
      t2.exports = function(t3) {
        return void 0 !== t3 && (e.Array === t3 || i[o] === t3);
      };
    }, function(t2, n2, r) {
      var e = r(3);
      t2.exports = function(t3, n3, r2, o) {
        try {
          return o ? n3(e(r2)[0], r2[1]) : n3(r2);
        } catch (n4) {
          var i = t3.return;
          throw void 0 !== i && e(i.call(t3)), n4;
        }
      };
    }, function(t2, n2, r) {
      var e = r(49), o = r(17), i = r(18), c = {};
      r(5)(c, r(1)("iterator"), function() {
        return this;
      }), t2.exports = function(t3, n3, r2) {
        t3.prototype = e(c, { next: o(1, r2) }), i(t3, n3 + " Iterator");
      };
    }, function(t2, n2, r) {
      var e = r(1)("iterator"), o = false;
      try {
        var i = [7][e]();
        i.return = function() {
          o = true;
        }, Array.from(i, function() {
          throw 2;
        });
      } catch (t3) {
      }
      t2.exports = function(t3, n3) {
        if (!n3 && !o) return false;
        var r2 = false;
        try {
          var i2 = [7], c = i2[e]();
          c.next = function() {
            return { done: r2 = true };
          }, i2[e] = function() {
            return c;
          }, t3(i2);
        } catch (t4) {
        }
        return r2;
      };
    }, function(t2, n2) {
      t2.exports = function(t3, n3) {
        return { value: n3, done: !!t3 };
      };
    }, function(t2, n2, r) {
      var e = r(2), o = r(30).set, i = e.MutationObserver || e.WebKitMutationObserver, c = e.process, u = e.Promise, s = "process" == r(11)(c);
      t2.exports = function() {
        var t3, n3, r2, f = function() {
          var e2, o2;
          for (s && (e2 = c.domain) && e2.exit(); t3; ) {
            o2 = t3.fn, t3 = t3.next;
            try {
              o2();
            } catch (e3) {
              throw t3 ? r2() : n3 = void 0, e3;
            }
          }
          n3 = void 0, e2 && e2.enter();
        };
        if (s) r2 = function() {
          c.nextTick(f);
        };
        else if (i) {
          var a = true, p = document.createTextNode("");
          new i(f).observe(p, { characterData: true }), r2 = function() {
            p.data = a = !a;
          };
        } else if (u && u.resolve) {
          var l = u.resolve();
          r2 = function() {
            l.then(f);
          };
        } else r2 = function() {
          o.call(e, f);
        };
        return function(e2) {
          var o2 = { fn: e2, next: void 0 };
          n3 && (n3.next = o2), t3 || (t3 = o2, r2()), n3 = o2;
        };
      };
    }, function(t2, n2, r) {
      var e = r(3), o = r(50), i = r(22), c = r(19)("IE_PROTO"), u = function() {
      }, s = "prototype", f = function() {
        var t3, n3 = r(16)("iframe"), e2 = i.length, o2 = ">";
        for (n3.style.display = "none", r(25).appendChild(n3), n3.src = "javascript:", t3 = n3.contentWindow.document, t3.open(), t3.write("<script>document.F=Object<\/script" + o2), t3.close(), f = t3.F; e2--; ) delete f[s][i[e2]];
        return f();
      };
      t2.exports = Object.create || function(t3, n3) {
        var r2;
        return null !== t3 ? (u[s] = e(t3), r2 = new u(), u[s] = null, r2[c] = t3) : r2 = f(), void 0 === n3 ? r2 : o(r2, n3);
      };
    }, function(t2, n2, r) {
      var e = r(12), o = r(3), i = r(54);
      t2.exports = r(4) ? Object.defineProperties : function(t3, n3) {
        o(t3);
        for (var r2, c = i(n3), u = c.length, s = 0; u > s; ) e.f(t3, r2 = c[s++], n3[r2]);
        return t3;
      };
    }, function(t2, n2, r) {
      var e = r(55), o = r(17), i = r(13), c = r(32), u = r(8), s = r(26), f = Object.getOwnPropertyDescriptor;
      n2.f = r(4) ? f : function(t3, n3) {
        if (t3 = i(t3), n3 = c(n3, true), s) try {
          return f(t3, n3);
        } catch (t4) {
        }
        if (u(t3, n3)) return o(!e.f.call(t3, n3), t3[n3]);
      };
    }, function(t2, n2, r) {
      var e = r(8), o = r(63), i = r(19)("IE_PROTO"), c = Object.prototype;
      t2.exports = Object.getPrototypeOf || function(t3) {
        return t3 = o(t3), e(t3, i) ? t3[i] : "function" == typeof t3.constructor && t3 instanceof t3.constructor ? t3.constructor.prototype : t3 instanceof Object ? c : null;
      };
    }, function(t2, n2, r) {
      var e = r(8), o = r(13), i = r(39)(false), c = r(19)("IE_PROTO");
      t2.exports = function(t3, n3) {
        var r2, u = o(t3), s = 0, f = [];
        for (r2 in u) r2 != c && e(u, r2) && f.push(r2);
        for (; n3.length > s; ) e(u, r2 = n3[s++]) && (~i(f, r2) || f.push(r2));
        return f;
      };
    }, function(t2, n2, r) {
      var e = r(53), o = r(22);
      t2.exports = Object.keys || function(t3) {
        return e(t3, o);
      };
    }, function(t2, n2) {
      n2.f = {}.propertyIsEnumerable;
    }, function(t2, n2, r) {
      var e = r(5);
      t2.exports = function(t3, n3, r2) {
        for (var o in n3) r2 && t3[o] ? t3[o] = n3[o] : e(t3, o, n3[o]);
        return t3;
      };
    }, function(t2, n2, r) {
      t2.exports = r(5);
    }, function(t2, n2, r) {
      var e = r(9), o = r(3), i = function(t3, n3) {
        if (o(t3), !e(n3) && null !== n3) throw TypeError(n3 + ": can't set as prototype!");
      };
      t2.exports = { set: Object.setPrototypeOf || ("__proto__" in {} ? function(t3, n3, e2) {
        try {
          e2 = r(7)(Function.call, r(51).f(Object.prototype, "__proto__").set, 2), e2(t3, []), n3 = !(t3 instanceof Array);
        } catch (t4) {
          n3 = true;
        }
        return function(t4, r2) {
          return i(t4, r2), n3 ? t4.__proto__ = r2 : e2(t4, r2), t4;
        };
      }({}, false) : void 0), check: i };
    }, function(t2, n2, r) {
      var e = r(2), o = r(6), i = r(12), c = r(4), u = r(1)("species");
      t2.exports = function(t3) {
        var n3 = "function" == typeof o[t3] ? o[t3] : e[t3];
        c && n3 && !n3[u] && i.f(n3, u, { configurable: true, get: function() {
          return this;
        } });
      };
    }, function(t2, n2, r) {
      var e = r(3), o = r(14), i = r(1)("species");
      t2.exports = function(t3, n3) {
        var r2, c = e(t3).constructor;
        return void 0 === c || void 0 == (r2 = e(c)[i]) ? n3 : o(r2);
      };
    }, function(t2, n2, r) {
      var e = r(20), o = r(15);
      t2.exports = function(t3) {
        return function(n3, r2) {
          var i, c, u = String(o(n3)), s = e(r2), f = u.length;
          return s < 0 || s >= f ? t3 ? "" : void 0 : (i = u.charCodeAt(s), i < 55296 || i > 56319 || s + 1 === f || (c = u.charCodeAt(s + 1)) < 56320 || c > 57343 ? t3 ? u.charAt(s) : i : t3 ? u.slice(s, s + 2) : (i - 55296 << 10) + (c - 56320) + 65536);
        };
      };
    }, function(t2, n2, r) {
      var e = r(20), o = Math.max, i = Math.min;
      t2.exports = function(t3, n3) {
        return t3 = e(t3), t3 < 0 ? o(t3 + n3, 0) : i(t3, n3);
      };
    }, function(t2, n2, r) {
      var e = r(15);
      t2.exports = function(t3) {
        return Object(e(t3));
      };
    }, function(t2, n2, r) {
      var e = r(21), o = r(1)("iterator"), i = r(10);
      t2.exports = r(6).getIteratorMethod = function(t3) {
        if (void 0 != t3) return t3[o] || t3["@@iterator"] || i[e(t3)];
      };
    }, function(t2, n2, r) {
      var e = r(37), o = r(47), i = r(10), c = r(13);
      t2.exports = r(27)(Array, "Array", function(t3, n3) {
        this._t = c(t3), this._i = 0, this._k = n3;
      }, function() {
        var t3 = this._t, n3 = this._k, r2 = this._i++;
        return !t3 || r2 >= t3.length ? (this._t = void 0, o(1)) : "keys" == n3 ? o(0, r2) : "values" == n3 ? o(0, t3[r2]) : o(0, [r2, t3[r2]]);
      }, "values"), i.Arguments = i.Array, e("keys"), e("values"), e("entries");
    }, function(t2, n2) {
    }, function(t2, n2, r) {
      var e, o, i, c = r(28), u = r(2), s = r(7), f = r(21), a = r(23), p = r(9), l = (r(3), r(14)), v = r(38), h = r(40), d = (r(58).set, r(60)), y = r(30).set, _ = r(48)(), x = "Promise", m = u.TypeError, w = u.process, g = u[x], w = u.process, b = "process" == f(w), O = function() {
      }, j = !!function() {
        try {
          var t3 = g.resolve(1), n3 = (t3.constructor = {})[r(1)("species")] = function(t4) {
            t4(O, O);
          };
          return (b || "function" == typeof PromiseRejectionEvent) && t3.then(O) instanceof n3;
        } catch (t4) {
        }
      }(), S = function(t3, n3) {
        return t3 === n3 || t3 === g && n3 === i;
      }, E = function(t3) {
        var n3;
        return !(!p(t3) || "function" != typeof (n3 = t3.then)) && n3;
      }, P = function(t3) {
        return S(g, t3) ? new M(t3) : new o(t3);
      }, M = o = function(t3) {
        var n3, r2;
        this.promise = new t3(function(t4, e2) {
          if (void 0 !== n3 || void 0 !== r2) throw m("Bad Promise constructor");
          n3 = t4, r2 = e2;
        }), this.resolve = l(n3), this.reject = l(r2);
      }, T = function(t3) {
        try {
          t3();
        } catch (t4) {
          return { error: t4 };
        }
      }, A = function(t3, n3) {
        if (!t3._n) {
          t3._n = true;
          var r2 = t3._c;
          _(function() {
            for (var e2 = t3._v, o2 = 1 == t3._s, i2 = 0, c2 = function(n4) {
              var r3, i3, c3 = o2 ? n4.ok : n4.fail, u2 = n4.resolve, s2 = n4.reject, f2 = n4.domain;
              try {
                c3 ? (o2 || (2 == t3._h && I(t3), t3._h = 1), c3 === true ? r3 = e2 : (f2 && f2.enter(), r3 = c3(e2), f2 && f2.exit()), r3 === n4.promise ? s2(m("Promise-chain cycle")) : (i3 = E(r3)) ? i3.call(r3, u2, s2) : u2(r3)) : s2(e2);
              } catch (t4) {
                s2(t4);
              }
            }; r2.length > i2; ) c2(r2[i2++]);
            t3._c = [], t3._n = false, n3 && !t3._h && k(t3);
          });
        }
      }, k = function(t3) {
        y.call(u, function() {
          var n3, r2, e2, o2 = t3._v;
          if (C(t3) && (n3 = T(function() {
            b ? w.emit("unhandledRejection", o2, t3) : (r2 = u.onunhandledrejection) ? r2({ promise: t3, reason: o2 }) : (e2 = u.console) && e2.error && e2.error("Unhandled promise rejection", o2);
          }), t3._h = b || C(t3) ? 2 : 1), t3._a = void 0, n3) throw n3.error;
        });
      }, C = function(t3) {
        if (1 == t3._h) return false;
        for (var n3, r2 = t3._a || t3._c, e2 = 0; r2.length > e2; ) if (n3 = r2[e2++], n3.fail || !C(n3.promise)) return false;
        return true;
      }, I = function(t3) {
        y.call(u, function() {
          var n3;
          b ? w.emit("rejectionHandled", t3) : (n3 = u.onrejectionhandled) && n3({ promise: t3, reason: t3._v });
        });
      }, R = function(t3) {
        var n3 = this;
        n3._d || (n3._d = true, n3 = n3._w || n3, n3._v = t3, n3._s = 2, n3._a || (n3._a = n3._c.slice()), A(n3, true));
      }, F = function(t3) {
        var n3, r2 = this;
        if (!r2._d) {
          r2._d = true, r2 = r2._w || r2;
          try {
            if (r2 === t3) throw m("Promise can't be resolved itself");
            (n3 = E(t3)) ? _(function() {
              var e2 = { _w: r2, _d: false };
              try {
                n3.call(t3, s(F, e2, 1), s(R, e2, 1));
              } catch (t4) {
                R.call(e2, t4);
              }
            }) : (r2._v = t3, r2._s = 1, A(r2, false));
          } catch (t4) {
            R.call({ _w: r2, _d: false }, t4);
          }
        }
      };
      j || (g = function(t3) {
        v(this, g, x, "_h"), l(t3), e.call(this);
        try {
          t3(s(F, this, 1), s(R, this, 1));
        } catch (t4) {
          R.call(this, t4);
        }
      }, e = function(t3) {
        this._c = [], this._a = void 0, this._s = 0, this._d = false, this._v = void 0, this._h = 0, this._n = false;
      }, e.prototype = r(56)(g.prototype, { then: function(t3, n3) {
        var r2 = P(d(this, g));
        return r2.ok = "function" != typeof t3 || t3, r2.fail = "function" == typeof n3 && n3, r2.domain = b ? w.domain : void 0, this._c.push(r2), this._a && this._a.push(r2), this._s && A(this, false), r2.promise;
      }, catch: function(t3) {
        return this.then(void 0, t3);
      } }), M = function() {
        var t3 = new e();
        this.promise = t3, this.resolve = s(F, t3, 1), this.reject = s(R, t3, 1);
      }), a(a.G + a.W + a.F * !j, { Promise: g }), r(18)(g, x), r(59)(x), i = r(6)[x], a(a.S + a.F * !j, x, { reject: function(t3) {
        var n3 = P(this), r2 = n3.reject;
        return r2(t3), n3.promise;
      } }), a(a.S + a.F * (c || !j), x, { resolve: function(t3) {
        if (t3 instanceof g && S(t3.constructor, this)) return t3;
        var n3 = P(this), r2 = n3.resolve;
        return r2(t3), n3.promise;
      } }), a(a.S + a.F * !(j && r(46)(function(t3) {
        g.all(t3).catch(O);
      })), x, { all: function(t3) {
        var n3 = this, r2 = P(n3), e2 = r2.resolve, o2 = r2.reject, i2 = T(function() {
          var r3 = [], i3 = 0, c2 = 1;
          h(t3, false, function(t4) {
            var u2 = i3++, s2 = false;
            r3.push(void 0), c2++, n3.resolve(t4).then(function(t5) {
              s2 || (s2 = true, r3[u2] = t5, --c2 || e2(r3));
            }, o2);
          }), --c2 || e2(r3);
        });
        return i2 && o2(i2.error), r2.promise;
      }, race: function(t3) {
        var n3 = this, r2 = P(n3), e2 = r2.reject, o2 = T(function() {
          h(t3, false, function(t4) {
            n3.resolve(t4).then(r2.resolve, e2);
          });
        });
        return o2 && e2(o2.error), r2.promise;
      } });
    }, function(t2, n2, r) {
      var e = r(61)(true);
      r(27)(String, "String", function(t3) {
        this._t = String(t3), this._i = 0;
      }, function() {
        var t3, n3 = this._t, r2 = this._i;
        return r2 >= n3.length ? { value: void 0, done: true } : (t3 = e(n3, r2), this._i += t3.length, { value: t3, done: false });
      });
    }, function(t2, n2, r) {
      r(65);
      for (var e = r(2), o = r(5), i = r(10), c = r(1)("toStringTag"), u = ["NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList"], s = 0; s < 5; s++) {
        var f = u[s], a = e[f], p = a && a.prototype;
        p && !p[c] && o(p, c, f), i[f] = i.Array;
      }
    }, function(t2, n2) {
      t2.exports = require$$0;
    }, function(t2, n2) {
      t2.exports = require$$1;
    }]);
  });
})(dist);
var distExports = dist.exports;
async function detectHardwareAcceleration() {
  return new Promise((resolve) => {
    const ffmpeg = spawn("ffmpeg", ["-encoders"]);
    let output = "";
    ffmpeg.stdout.on("data", (data) => {
      output += data.toString();
    });
    ffmpeg.stderr.on("data", (data) => {
      output += data.toString();
    });
    ffmpeg.on("close", () => {
      if (process.platform === "darwin" && output.includes("h264_videotoolbox")) {
        resolve({
          type: "videotoolbox",
          available: true,
          name: "Apple VideoToolbox"
        });
      } else if (output.includes("h264_nvenc")) {
        resolve({
          type: "nvenc",
          available: true,
          name: "NVIDIA NVENC"
        });
      } else if (output.includes("h264_qsv")) {
        resolve({
          type: "qsv",
          available: true,
          name: "Intel Quick Sync"
        });
      } else if (output.includes("h264_amf")) {
        resolve({
          type: "amf",
          available: true,
          name: "AMD AMF"
        });
      } else {
        resolve({
          type: "none",
          available: false,
          name: "Software Encoding"
        });
      }
    });
    ffmpeg.on("error", () => {
      resolve({
        type: "none",
        available: false,
        name: "Software Encoding"
      });
    });
  });
}
function getEncoderSettings(hwAccel) {
  switch (hwAccel.type) {
    case "videotoolbox":
      return ["-c:v", "h264_videotoolbox"];
    case "nvenc":
      return ["-c:v", "h264_nvenc", "-preset", "p7", "-tune", "hq"];
    case "qsv":
      return ["-c:v", "h264_qsv", "-preset", "veryslow"];
    case "amf":
      return ["-c:v", "h264_amf", "-quality", "quality"];
    default:
      return ["-c:v", "libx264"];
  }
}
const VIDEO_QUALITY_PRESETS = {
  "2160p": {
    width: 3840,
    height: 2160,
    videoBitrate: "45M",
    audioBitrate: "384k",
    crf: 18
  },
  "1440p": {
    width: 2560,
    height: 1440,
    videoBitrate: "16M",
    audioBitrate: "256k",
    crf: 20
  },
  "1080p": {
    width: 1920,
    height: 1080,
    videoBitrate: "8M",
    audioBitrate: "192k",
    crf: 22
  },
  "720p": {
    width: 1280,
    height: 720,
    videoBitrate: "5M",
    audioBitrate: "128k",
    crf: 23
  },
  "480p": {
    width: 854,
    height: 480,
    videoBitrate: "2.5M",
    audioBitrate: "96k",
    crf: 25
  }
};
class FFmpegService {
  constructor() {
    __publicField(this, "hwAccel", null);
    __publicField(this, "defaultSettings", {
      useHardwareAcceleration: true,
      preset: "medium",
      crf: 23,
      audioQuality: 3,
      maxBitrate: "5M",
      quality: "1080p",
      // Default to 1080p
      maintainAspectRatio: true
    });
    this.initializeHardwareAcceleration();
  }
  async initializeHardwareAcceleration() {
    this.hwAccel = await detectHardwareAcceleration();
    console.log("Hardware acceleration:", this.hwAccel);
  }
  getFFmpegArgs(inputPath, outputPath, settings) {
    var _a;
    const args = [
      "-y",
      // Overwrite output file
      "-i",
      inputPath
      // Input file
    ];
    if (settings.useHardwareAcceleration && ((_a = this.hwAccel) == null ? void 0 : _a.available)) {
      args.push(...getEncoderSettings(this.hwAccel));
    } else {
      args.push("-c:v", "libx264");
    }
    if (settings.quality && VIDEO_QUALITY_PRESETS[settings.quality]) {
      const preset = VIDEO_QUALITY_PRESETS[settings.quality];
      args.push(
        "-vf",
        `scale=${preset.width}:${preset.height}${settings.maintainAspectRatio ? ":force_original_aspect_ratio=decrease" : ""}`,
        "-b:v",
        preset.videoBitrate,
        "-b:a",
        preset.audioBitrate,
        "-crf",
        preset.crf.toString()
      );
    } else if (settings.width && settings.height) {
      args.push(
        "-vf",
        `scale=${settings.width}:${settings.height}${settings.maintainAspectRatio ? ":force_original_aspect_ratio=decrease" : ""}`
      );
    }
    args.push(
      "-preset",
      settings.preset,
      // Audio settings
      "-c:a",
      "aac",
      "-q:a",
      settings.audioQuality.toString(),
      "-ar",
      "48000",
      // Audio sample rate
      "-ac",
      "2",
      // Stereo audio
      // Additional optimizations
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p"
    );
    if (settings.maxBitrate && !settings.quality) {
      args.push(
        "-maxrate",
        settings.maxBitrate,
        "-bufsize",
        settings.maxBitrate
      );
    }
    if (!settings.quality) {
      if (settings.videoBitrate) {
        args.push("-b:v", settings.videoBitrate);
      }
      if (settings.audioBitrate) {
        args.push("-b:a", settings.audioBitrate);
      }
    }
    args.push(outputPath);
    return args;
  }
  async convertVideo(inputBuffer, outputPath, settings = {}, onProgress) {
    try {
      const tempInput = join(tmpdir(), `temp-${Date.now()}.webm`);
      await promises.writeFile(tempInput, Buffer.from(inputBuffer));
      const finalSettings = {
        ...this.defaultSettings,
        ...settings
      };
      return new Promise((resolve, reject) => {
        const args = this.getFFmpegArgs(tempInput, outputPath, finalSettings);
        console.log("FFmpeg arguments:", args);
        const ffmpeg = spawn("ffmpeg", args);
        let duration = 0;
        let errorLog = "";
        ffmpeg.stderr.on("data", (data) => {
          const message = data.toString();
          if (!duration) {
            const match = message.match(/Duration: (\d{2}):(\d{2}):(\d{2})/);
            if (match) {
              duration = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
            }
          }
          const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2})/);
          if (timeMatch && duration && onProgress) {
            const time = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]);
            const progress = {
              percent: time / duration * 100,
              frame: 0,
              // TODO: Parse frame info
              fps: 0,
              // TODO: Parse FPS
              time: `${timeMatch[1]}:${timeMatch[2]}:${timeMatch[3]}`,
              bitrate: "0",
              // TODO: Parse bitrate
              size: "0"
              // TODO: Parse size
            };
            onProgress(progress);
          }
          errorLog += message;
        });
        ffmpeg.on("close", async (code) => {
          try {
            await promises.unlink(tempInput);
            if (code === 0) {
              const fileInfo = await promises.stat(outputPath);
              resolve({
                success: true,
                outputPath,
                duration,
                size: fileInfo.size
              });
            } else {
              reject(new Error(`FFmpeg conversion failed: ${errorLog}`));
            }
          } catch (error) {
            reject(error);
          }
        });
        ffmpeg.on("error", (error) => {
          promises.unlink(tempInput).catch(console.error);
          reject(error);
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to convert video: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
  getHardwareAcceleration() {
    return this.hwAccel;
  }
  async updateSettings(settings) {
    this.defaultSettings = {
      ...this.defaultSettings,
      ...settings
    };
  }
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const applicationName = "Stash Cast";
const ffmpegService = new FFmpegService();
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let tray = null;
let mainAppWindow = null;
let cameraWindow = null;
async function checkAndRequestPermissions() {
  if (process.platform === "darwin") {
    if (!systemPreferences.getMediaAccessStatus("camera")) {
      await systemPreferences.askForMediaAccess("camera");
    }
    if (!systemPreferences.getMediaAccessStatus("microphone")) {
      await systemPreferences.askForMediaAccess("microphone");
    }
  }
}
function createMainAppWindow() {
  mainAppWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 320,
    minHeight: 650,
    titleBarStyle: "default",
    frame: false,
    resizable: true,
    movable: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    mainAppWindow.loadURL(`${VITE_DEV_SERVER_URL}`);
  } else {
    mainAppWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
function createCameraWindow() {
  console.log("Creating camera window...");
  cameraWindow = new BrowserWindow({
    width: 320,
    height: 320,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    hasShadow: false,
    resizable: false,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      backgroundThrottling: false
    },
    vibrancy: "under-window",
    visualEffectState: "active"
  });
  cameraWindow.setIgnoreMouseEvents(false);
  if (VITE_DEV_SERVER_URL) {
    cameraWindow.loadURL(`${VITE_DEV_SERVER_URL}src/camera.html`);
  } else {
    const filePath = path.join(RENDERER_DIST, "camera.html");
    cameraWindow.loadFile(filePath);
  }
}
function setupTray() {
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,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"
  );
  tray = new Tray(icon);
  tray.setToolTip(applicationName);
  tray.on("click", () => {
    if (!(mainAppWindow == null ? void 0 : mainAppWindow.isVisible())) {
      mainAppWindow == null ? void 0 : mainAppWindow.show();
    }
  });
}
function setupIPC() {
  ipcMain.handle("get-screens", async (_event) => {
    const screens = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 150, height: 150 }
    });
    return screens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      type: "screen",
      thumbnail: screen.thumbnail.toDataURL(),
      display_id: screen.display_id,
      appIcon: screen.appIcon
    }));
  });
  ipcMain.handle("getSources", async (_event) => {
    const screens = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 150, height: 150 }
    });
    const windows = await desktopCapturer.getSources({
      types: ["window"],
      thumbnailSize: { width: 150, height: 150 }
    });
    const screenThumbnails = screens.map((screen) => {
      return {
        id: screen.id,
        name: screen.name,
        thumbnail: screen.thumbnail.toDataURL(),
        display_id: screen.display_id,
        appIcon: screen.appIcon
      };
    });
    const windowThumbnails = windows.map((window2) => {
      return {
        id: window2.id,
        name: window2.name,
        thumbnail: window2.thumbnail.toDataURL(),
        display_id: window2.display_id,
        appIcon: window2.appIcon
      };
    });
    const sources = [...screenThumbnails, ...windowThumbnails];
    return sources;
  });
  ipcMain.handle(
    "save-recording",
    async (_event, { buffer, mimeType, options }) => {
      try {
        const tempWebM = path.join(tmpdir$1(), `temp-${Date.now()}.webm`);
        console.log("Creating temporary WebM file:", tempWebM);
        await fs.writeFile(tempWebM, Buffer.from(buffer));
        const stats = await fs.stat(tempWebM);
        console.log("Temporary WebM file created:", {
          size: stats.size,
          mimeType
        });
        const { filePath, canceled } = await dialog.showSaveDialog({
          defaultPath: path.join(
            app.getPath("desktop"),
            `recording-${Date.now()}.mov`
          ),
          filters: [{ name: "QuickTime Movie", extensions: ["mov"] }]
        });
        if (canceled || !filePath) {
          console.log("Save dialog was canceled");
          await fs.unlink(tempWebM).catch(console.error);
          return { success: false, error: "Save dialog was canceled" };
        }
        try {
          const result = await ffmpegService.convertVideo(
            buffer,
            filePath,
            {
              useHardwareAcceleration: (options == null ? void 0 : options.useHardwareAcceleration) ?? true,
              preset: "medium",
              crf: 23,
              audioQuality: 3,
              maxBitrate: "5M"
            },
            (progress) => {
              mainAppWindow == null ? void 0 : mainAppWindow.webContents.send("conversion-progress", progress);
            }
          );
          await fs.unlink(tempWebM).catch(console.error);
          return { success: true, filePath: result.outputPath };
        } catch (error) {
          await fs.unlink(tempWebM).catch(console.error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Conversion failed"
          };
        }
      } catch (error) {
        console.error("Failed to save recording:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred"
        };
      }
    }
  );
  ipcMain.on("start-recording", () => {
    console.log("Recording started");
  });
  ipcMain.on("stop-recording", () => {
    console.log("Recording stopped");
  });
  ipcMain.on("close-app", () => {
    app.quit();
  });
  ipcMain.on("show-camera-window", () => {
    console.log("Received show-camera-window event");
    if (!cameraWindow) {
      console.log("No camera window exists, creating new one");
      createCameraWindow();
    } else {
      console.log("Camera window exists, showing it");
      if (cameraWindow.isDestroyed()) {
        console.log("Camera window was destroyed, creating new one");
        createCameraWindow();
      } else {
        cameraWindow.showInactive();
      }
    }
  });
  ipcMain.on("camera-stream-ready", (event, streamInfo) => {
    console.log("Received camera-stream-ready event:", streamInfo);
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      console.log("Forwarding stream info to camera window");
      cameraWindow.webContents.send("camera-stream-ready", streamInfo);
    } else {
      console.log("Camera window not available to receive stream");
    }
  });
  ipcMain.on("hide-camera-window", () => {
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      cameraWindow.hide();
    }
  });
  ipcMain.on("set-camera-window-position", (_event, { x, y }) => {
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      cameraWindow.setPosition(x, y);
    }
  });
  ipcMain.handle("get-display-info", (_event, displayId) => {
    const display = require("electron").screen.getDisplayMatching({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      displayId
    });
    return display;
  });
  ipcMain.handle("get-hardware-acceleration", async () => {
    return {
      type: "none",
      available: false,
      name: "Software Encoding"
    };
  });
  ipcMain.handle("update-ffmpeg-settings", async (_event, settings) => {
    return false;
  });
  ipcMain.handle("get-hostname", () => {
    return hostname();
  });
  ipcMain.handle("get-machine-id", async () => {
    try {
      const id = await distExports.machineId();
      return id;
    } catch (error) {
      console.error("Error getting machine ID:", error);
      return null;
    }
  });
}
app.whenReady().then(async () => {
  await checkAndRequestPermissions();
  setupIPC();
  setupTray();
  createMainAppWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainAppWindow();
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
//# sourceMappingURL=main.js.map
